import { geminiVisionService, NutritionAnalysis } from './GeminiVisionService';
import { openFoodFactsService, BarcodeNutritionData } from './OpenFoodFactsService';

export interface FoodAnalysisResult {
  source: 'vision' | 'barcode' | 'hybrid';
  confidence: number;
  processingTime: number;
  
  // Vision analysis results
  visionAnalysis?: NutritionAnalysis;
  
  // Barcode analysis results
  barcodeData?: BarcodeNutritionData;
  
  // Combined/enhanced results
  foods: {
    id: string;
    name: string;
    category: string;
    portion: {
      amount: number;
      unit: 'grams' | 'ml' | 'pieces';
      confidence: number;
    };
    nutrition: {
      calories: number;
      carbohydrates: number;
      fat: number;
      protein: number;
      fiber: number;
      sugar: number;
      sodium?: number;
      confidence: number;
    };
    glycemic_info: {
      glycemic_index: number;
      glycemic_load: number;
      estimated_bg_impact: 'low' | 'medium' | 'high';
    };
    allergens?: string[];
    isDiabetesFriendly?: boolean;
    preparation_notes?: string;
    uncertainty_flags?: string[];
  }[];
  
  recommendations: {
    total_carbs: number;
    total_calories: number;
    estimated_portions: string;
    meal_complexity: 'simple' | 'moderate' | 'complex';
    user_verification_needed: boolean;
    diabetes_notes?: string[];
  };
}

class EnhancedFoodAnalysisService {
  // Analyze image using Gemini Vision
  async analyzeImageWithVision(imagePath: string): Promise<FoodAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const visionResult = await geminiVisionService.analyzeFood(imagePath);
      
      if (!visionResult) {
        throw new Error('Failed to analyze image with Gemini Vision');
      }

      return {
        source: 'vision',
        confidence: visionResult.analysis.confidence,
        processingTime: Date.now() - startTime,
        visionAnalysis: visionResult,
        foods: visionResult.foods.map(food => ({
          ...food,
          allergens: [],
          isDiabetesFriendly: this.assessDiabetesFriendliness(food.nutrition),
        })),
        recommendations: {
          ...visionResult.recommendations,
          total_calories: visionResult.foods.reduce((sum, food) => sum + food.nutrition.calories, 0),
          diabetes_notes: this.generateDiabetesNotes(visionResult),
        },
      };
    } catch (error) {
      console.error('Vision analysis failed:', error);
      throw error;
    }
  }

  // Analyze barcode using OpenFoodFacts
  async analyzeBarcodeWithOpenFoodFacts(barcode: string, servingGrams?: number): Promise<FoodAnalysisResult> {
    const startTime = Date.now();
    
    try {
      const barcodeResult = await openFoodFactsService.getProductByBarcode(barcode);
      
      if (!barcodeResult) {
        throw new Error('Product not found in OpenFoodFacts database');
      }

      // Calculate nutrition for specific serving size if provided
      const finalData = servingGrams 
        ? openFoodFactsService.calculateNutritionForServing(barcodeResult, servingGrams)
        : barcodeResult;

      const portionAmount = servingGrams || 100;
      
      return {
        source: 'barcode',
        confidence: 95, // High confidence for barcode data
        processingTime: Date.now() - startTime,
        barcodeData: finalData,
        foods: [{
          id: `barcode-${barcode}`,
          name: finalData.name,
          category: finalData.category || 'packaged-food',
          portion: {
            amount: portionAmount,
            unit: 'grams',
            confidence: 95,
          },
          nutrition: {
            ...finalData.nutrition,
            confidence: 95,
          },
          glycemic_info: this.estimateGlycemicInfo(finalData.nutrition),
          allergens: finalData.allergens,
          isDiabetesFriendly: finalData.isDiabetesFriendly,
          preparation_notes: `Packaged food - ${finalData.brand || 'Various brands'}`,
        }],
        recommendations: {
          total_carbs: finalData.nutrition.carbohydrates,
          total_calories: finalData.nutrition.calories,
          estimated_portions: `${portionAmount}g serving`,
          meal_complexity: 'simple',
          user_verification_needed: false,
          diabetes_notes: this.generateBarcodeBasedDiabetesNotes(finalData),
        },
      };
    } catch (error) {
      console.error('Barcode analysis failed:', error);
      throw error;
    }
  }

  // Hybrid analysis: Try barcode first, fall back to vision
  async analyzeHybrid(imagePath: string, detectedBarcode?: string): Promise<FoodAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // If barcode is detected, try barcode analysis first
      if (detectedBarcode) {
        try {
          const barcodeResult = await this.analyzeBarcodeWithOpenFoodFacts(detectedBarcode);
          barcodeResult.source = 'hybrid';
          barcodeResult.processingTime = Date.now() - startTime;
          return barcodeResult;
        } catch (error) {
          console.log('Barcode analysis failed, falling back to vision analysis');
        }
      }

      // Fall back to vision analysis
      const visionResult = await this.analyzeImageWithVision(imagePath);
      visionResult.source = 'hybrid';
      visionResult.processingTime = Date.now() - startTime;
      return visionResult;
      
    } catch (error) {
      console.error('Hybrid analysis failed:', error);
      throw error;
    }
  }

  // Search for products by name (useful for manual entry)
  async searchProducts(query: string): Promise<BarcodeNutritionData[]> {
    try {
      return await openFoodFactsService.searchProducts(query, 10);
    } catch (error) {
      console.error('Product search failed:', error);
      return [];
    }
  }

  private assessDiabetesFriendliness(nutrition: { carbohydrates: number; fiber: number; sugar: number }): boolean {
    const { carbohydrates, fiber, sugar } = nutrition;
    
    // Diabetes-friendly criteria
    const lowSugar = sugar < 5;
    const reasonableCarbs = carbohydrates < 15;
    const highFiber = fiber > 3;
    
    return lowSugar && (reasonableCarbs || highFiber);
  }

  private estimateGlycemicInfo(nutrition: { carbohydrates: number; fiber: number; sugar: number }) {
    const { carbohydrates, fiber, sugar } = nutrition;
    
    // Simple glycemic index estimation
    let glycemicIndex = 50; // Default medium GI
    
    if (fiber > 5) glycemicIndex -= 15; // High fiber lowers GI
    if (sugar > 10) glycemicIndex += 20; // High sugar raises GI
    if (carbohydrates < 10) glycemicIndex -= 10; // Low carb lowers GI
    
    glycemicIndex = Math.max(25, Math.min(100, glycemicIndex)); // Clamp between 25-100
    
    const glycemicLoad = (glycemicIndex * carbohydrates) / 100;
    
    let bgImpact: 'low' | 'medium' | 'high' = 'medium';
    if (glycemicLoad < 10) bgImpact = 'low';
    else if (glycemicLoad > 20) bgImpact = 'high';
    
    return {
      glycemic_index: Math.round(glycemicIndex),
      glycemic_load: Math.round(glycemicLoad * 10) / 10,
      estimated_bg_impact: bgImpact,
    };
  }

  private generateDiabetesNotes(analysis: NutritionAnalysis): string[] {
    const notes: string[] = [];
    const totalCarbs = analysis.recommendations.total_carbs;
    
    if (totalCarbs > 45) {
      notes.push('High carbohydrate meal - consider portion control or insulin adjustment');
    } else if (totalCarbs < 15) {
      notes.push('Low carbohydrate meal - monitor for hypoglycemia if on insulin');
    }
    
    const highGIFoods = analysis.foods.filter(food => food.glycemic_info.glycemic_index > 70);
    if (highGIFoods.length > 0) {
      notes.push(`Contains high-GI foods: ${highGIFoods.map(f => f.name).join(', ')}`);
    }
    
    if (analysis.recommendations.user_verification_needed) {
      notes.push('Low confidence analysis - please verify portion sizes and food identification');
    }
    
    return notes;
  }

  private generateBarcodeBasedDiabetesNotes(data: BarcodeNutritionData): string[] {
    const notes: string[] = [];
    
    if (data.isDiabetesFriendly) {
      notes.push('This product appears diabetes-friendly based on its nutritional profile');
    }
    
    if (data.nutrition.sugar > 10) {
      notes.push('High sugar content - consider portion control');
    }
    
    if (data.nutrition.carbohydrates > 20) {
      notes.push('Significant carbohydrate content - factor into insulin calculations');
    }
    
    if (data.nutritionGrade && ['D', 'E'].includes(data.nutritionGrade)) {
      notes.push('Product has low nutritional quality rating - consider healthier alternatives');
    }
    
    return notes;
  }
}

export const enhancedFoodAnalysisService = new EnhancedFoodAnalysisService();
export default enhancedFoodAnalysisService;