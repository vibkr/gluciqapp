import { geminiVisionService } from '../ai/GeminiVisionService';
import { SupabaseImageService } from '../storage/SupabaseImageService';
import { InsulinCalculator } from '../insulin/InsulinCalculator';
import { userStore } from '../../stores/userStore';
import { insulinStore } from '../../stores/insulinStore';
import { supabaseClientManager } from '../database';

export interface FoodAnalysisPipelineResult {
  imageRecord: any;
  analysisResult: any;
  insulinCalculation: any;
  success: boolean;
  error?: string;
}

export class FoodAnalysisPipeline {
  private imageService: SupabaseImageService;

  constructor() {
    this.imageService = new SupabaseImageService();
  }

  /**
   * Complete food analysis pipeline: Image → AI Analysis → Insulin Calculation
   */
  async analyzeFoodImage(
    imageUri: string,
    userId: string,
    metadata: any = {}
  ): Promise<FoodAnalysisPipelineResult> {
    let imageRecord: any = null;
    
    try {
      console.log('Starting food analysis pipeline for user:', userId);
      
      // Step 1: Upload image to Supabase
      console.log('Step 1: Uploading image to Supabase...');
      const uploadResult = await this.imageService.uploadFoodImage(
        imageUri,
        userId,
        {
          original_filename: `food-${Date.now()}.jpg`,
          capture_timestamp: new Date().toISOString(),
          ...metadata
        }
      );
      imageRecord = uploadResult.imageRecord;

      // Step 2: Analyze image with Gemini Vision
      console.log('Step 2: Analyzing image with Gemini Vision...');
      const visionAnalysis = await geminiVisionService.analyzeFood(imageUri);
      
      if (!visionAnalysis) {
        throw new Error('Failed to analyze image with Gemini Vision');
      }

      // Step 3: Store analysis results in database
      console.log('Step 3: Storing analysis results...');
      const analysisRecord = await this.storeAnalysisResult(
        userId,
        imageRecord.id,
        visionAnalysis
      );

      // Step 4: Calculate insulin recommendation
      console.log('Step 4: Calculating insulin recommendation...');
      const insulinCalculation = await this.calculateInsulinRecommendation(
        userId,
        visionAnalysis
      );

      // Step 5: Update image processing status
      await this.imageService.updateProcessingStatus(imageRecord.id, {
        processing_status: 'completed'
      });

      console.log('Food analysis pipeline completed successfully');
      
      return {
        imageRecord,
        analysisResult: analysisRecord,
        insulinCalculation,
        success: true
      };

    } catch (error) {
      console.error('Food analysis pipeline failed:', error);
      
      // Try to update image status to failed if we have an image record
      if (imageRecord?.id) {
        try {
          await this.imageService.updateProcessingStatus(imageRecord.id, {
            processing_status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
        } catch (updateError) {
          console.error('Failed to update image status to failed:', updateError);
        }
      }
      
      return {
        imageRecord: imageRecord || null,
        analysisResult: null,
        insulinCalculation: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Store analysis results in database
   */
  private async storeAnalysisResult(
    userId: string,
    imageId: string,
    visionAnalysis: any
  ): Promise<any> {
    const analysisData = {
      user_id: userId,
      image_id: imageId,
      analysis_source: 'vision',
      analysis_model: 'gemini-2.5-flash-preview',
      confidence_score: visionAnalysis.analysis.confidence / 100,
      total_foods_detected: visionAnalysis.foods.length,
      processing_time_ms: visionAnalysis.analysis.processing_time,
      raw_response: visionAnalysis,
      verification_status: 'pending'
    };

    const { data, error } = await supabaseClientManager.foodAnalysis
      .from('food_analysis_results')
      .insert(analysisData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to store analysis result: ${error.message}`);
    }

    // Store individual analyzed foods
    for (const food of visionAnalysis.foods) {
      await this.storeAnalyzedFood(data.id, food);
    }

    return data;
  }

  /**
   * Store individual analyzed food
   */
  private async storeAnalyzedFood(analysisResultId: string, food: any): Promise<void> {
    const foodData = {
      analysis_result_id: analysisResultId,
      detected_name: food.name,
      category: food.category,
      confidence_score: (food.nutrition?.confidence || 90) / 100, // Overall confidence for the food detection
      estimated_portion: food.portion.amount,
      portion_unit: food.portion.unit,
      portion_confidence: food.portion.confidence / 100,
      estimated_calories: food.nutrition.calories,
      estimated_carbs_g: food.nutrition.carbohydrates,
      estimated_protein_g: food.nutrition.protein,
      estimated_fat_g: food.nutrition.fat,
      // Note: fiber and sugar are not in the analyzed_foods schema
      // glycemic_index and glycemic_load are not in the analyzed_foods schema
      // estimated_bg_impact is not in the analyzed_foods schema
      // preparation_notes is not in the analyzed_foods schema
      // uncertainty_flags is not in the analyzed_foods schema
    };

    const { error } = await supabaseClientManager.foodAnalysis
      .from('analyzed_foods')
      .insert(foodData);

    if (error) {
      console.error('Failed to store analyzed food:', error);
    }
  }

  /**
   * Calculate insulin recommendation based on analysis
   */
  private async calculateInsulinRecommendation(
    userId: string,
    visionAnalysis: any
  ): Promise<any> {
    // Get user's diabetes settings
    const currentProfile = userStore.profile.get();
    const diabetesSettings = userStore.diabetesSettings.get();
    
    if (!currentProfile || !diabetesSettings) {
      throw new Error('User profile or diabetes settings not found');
    }

    // Convert diabetes settings to insulin profile format
    const insulinProfile = {
      carb_ratios: diabetesSettings.carb_ratios.map((ratio: any) => ({
        time_start: ratio.time_start,
        time_end: ratio.time_end,
        ratio: ratio.ratio
      })),
      sensitivity_factor: diabetesSettings.correction_factors.map((factor: any) => ({
        time_start: factor.time_start,
        time_end: factor.time_end,
        factor: factor.factor
      })),
      action_profile: {
        onset: diabetesSettings.insulin_onset_minutes,
        peak: 90, // Default peak time
        duration: diabetesSettings.insulin_duration_hours * 60
      },
      safety_limits: {
        max_single_dose: diabetesSettings.max_bolus_units,
        max_daily_dose: diabetesSettings.max_bolus_units * 6, // Conservative estimate
        min_carbs_for_dose: 5
      }
    };

    // Calculate total carbohydrates
    const totalCarbs = visionAnalysis.recommendations.total_carbs;
    
    // Get current time for ratio selection
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Calculate insulin dose
    const calculationInput = {
      carbohydrates: totalCarbs,
      target_glucose: (diabetesSettings.target_glucose_min + diabetesSettings.target_glucose_max) / 2,
      current_time: currentTime,
      user_profile: insulinProfile
    };

    const insulinCalculation = InsulinCalculator.calculateInsulinDose(calculationInput);
    
    // Store calculation in insulin store
    insulinStore.currentCalculation.set(insulinCalculation);
    
    return insulinCalculation;
  }
} 