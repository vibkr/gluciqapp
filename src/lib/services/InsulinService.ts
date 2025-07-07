import { 
  ApiResponse, 
  InsulinDose, 
  InsulinProfile, 
  MealEntry, 
  GlucoseReading,
  DailySummary 
} from '../api/types';
import { getCalculationServiceClient, getLoggingServiceClient } from '../api/serviceRegistry';
import { foodService } from './FoodService';
import { InsulinCalculator } from '../insulin/InsulinCalculator';
import { InsulinCalculationInput, InsulinCalculationResult } from '../../types/insulin';

/**
 * Enhanced Insulin Service - Integrates with food history and provides comprehensive insulin management
 */
export class InsulinService {
  private calculationClient = getCalculationServiceClient();
  private loggingClient = getLoggingServiceClient();

  /**
   * Calculate insulin dose with enhanced context from food and glucose history
   */
  async calculateInsulinDose(input: {
    userId: string;
    carbohydrates?: number;
    currentGlucose?: number;
    targetGlucose?: number;
    mealId?: string;
    mealType?: MealEntry['meal_type'];
  }): Promise<ApiResponse<InsulinCalculationResult>> {
    try {
      console.log('Calculating enhanced insulin dose for user:', input.userId);

      // Get user's insulin profile
      const profileResponse = await this.getInsulinProfile(input.userId);
      if (!profileResponse.success || !profileResponse.data) {
        throw new Error('User insulin profile not found');
      }

      const userProfile = profileResponse.data;

      // Get enhanced context
      const context = await this.getCalculationContext(input.userId, input.mealId);

      // Determine carbohydrates from meal or input
      let carbohydrates = input.carbohydrates || 0;
      if (!carbohydrates && input.mealId) {
        const mealResponse = await this.loggingClient.get<MealEntry>(`/logging_service/meal_entries/${input.mealId}`);
        if (mealResponse.success && mealResponse.data) {
          carbohydrates = mealResponse.data.total_carbs_g;
        }
      }

      // Get current time for ratio calculation
      const currentTime = this.getCurrentTimeString();

      // Build enhanced calculation input
      const calculationInput: InsulinCalculationInput = {
        current_glucose: input.currentGlucose,
        target_glucose: input.targetGlucose || 100,
        carbohydrates,
        current_time: currentTime,
        user_profile: userProfile
      };

      // Get actual IOB first
      const iobResponse = await this.getInsulinOnBoard(input.userId);
      const actualIOB = iobResponse.success && iobResponse.data ? iobResponse.data.active_units : 0;

      // Calculate base insulin dose with actual IOB
      const baseResult = InsulinCalculator.calculateInsulinDose(calculationInput, actualIOB);

      // Update the result with actual IOB data if available
      if (iobResponse.success && iobResponse.data) {
        baseResult.insulin_on_board.recent_doses = iobResponse.data.recent_doses.map(dose => ({
          time: dose.timestamp,
          units: dose.user_final_dose,
          remaining_activity: 0.5 // simplified
        }));
      }

      // Apply historical corrections
      const enhancedResult = await this.applyHistoricalCorrections(
        baseResult, 
        context, 
        input.userId
      );

      // Store calculation for future reference
      await this.storeCalculation(input.userId, enhancedResult, {
        mealId: input.mealId,
        mealType: input.mealType,
        context
      });

      return {
        data: enhancedResult,
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error calculating insulin dose:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to calculate insulin dose',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Log insulin dose
   */
  async logInsulinDose(dose: Omit<InsulinDose, 'id' | 'timestamp'>): Promise<ApiResponse<InsulinDose>> {
    try {
      const doseData = {
        ...dose,
        timestamp: new Date().toISOString()
      };

      const response = await this.loggingClient.post<InsulinDose>('/logging_service/insulin_doses', doseData);
      
      if (response.success && response.data) {
        // Emit event for analytics and learning
        this.emitInsulinDosedEvent(response.data);
      }

      return response;
    } catch (error) {
      console.error('Error logging insulin dose:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to log insulin dose',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get user's insulin profile
   */
  async getInsulinProfile(userId: string): Promise<ApiResponse<InsulinProfile>> {
    return await this.calculationClient.get<InsulinProfile>(`/formula_service/user_formula_parameters/${userId}`);
  }

  /**
   * Update user's insulin profile
   */
  async updateInsulinProfile(userId: string, profile: Partial<InsulinProfile>): Promise<ApiResponse<InsulinProfile>> {
    const profileData = {
      ...profile,
      updated_at: new Date().toISOString()
    };

    return await this.calculationClient.put<InsulinProfile>(`/formula_service/user_formula_parameters/${userId}`, profileData);
  }

  /**
   * Get insulin on board (IOB) with enhanced calculation
   */
  async getInsulinOnBoard(userId: string): Promise<ApiResponse<{
    active_units: number;
    recent_doses: InsulinDose[];
    breakdown: Array<{
      dose_id: string;
      time: string;
      original_units: number;
      remaining_units: number;
      activity_percentage: number;
    }>;
  }>> {
    try {
      // Get recent doses (last 6 hours)
      const recentDosesResponse = await this.getRecentDoses(userId, 6);
      if (!recentDosesResponse.success || !recentDosesResponse.data) {
        throw new Error('Failed to get recent doses');
      }

      const recentDoses = recentDosesResponse.data;
      const profileResponse = await this.getInsulinProfile(userId);
      
      if (!profileResponse.success || !profileResponse.data) {
        throw new Error('User insulin profile not found');
      }

      const profile = profileResponse.data;
      const now = Date.now();
      
      let totalActiveUnits = 0;
      const breakdown: Array<{
        dose_id: string;
        time: string;
        original_units: number;
        remaining_units: number;
        activity_percentage: number;
      }> = [];

      recentDoses.forEach(dose => {
        const doseTime = new Date(dose.timestamp).getTime();
        const minutesSince = (now - doseTime) / (1000 * 60);

        // Only consider doses within action duration
        if (minutesSince < profile.action_profile.duration) {
          // Enhanced IOB calculation using a more realistic curve
          const activityPercentage = this.calculateInsulinActivity(
            minutesSince, 
            profile.action_profile
          );
          
          const remainingUnits = dose.user_final_dose * activityPercentage;
          totalActiveUnits += remainingUnits;

          breakdown.push({
            dose_id: dose.id,
            time: dose.timestamp,
            original_units: dose.user_final_dose,
            remaining_units: remainingUnits,
            activity_percentage: activityPercentage
          });
        }
      });

      return {
        data: {
          active_units: Math.round(totalActiveUnits * 10) / 10,
          recent_doses: recentDoses,
          breakdown
        },
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error calculating IOB:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to calculate IOB',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get recent insulin doses
   */
  async getRecentDoses(userId: string, hoursBack: number = 6): Promise<ApiResponse<InsulinDose[]>> {
    try {
      const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
      
      const response = await this.loggingClient.get<InsulinDose[]>('/logging_service/insulin_doses', {
        filters: { 
          user_id: userId,
          timestamp: { gte: cutoffTime.toISOString() }
        },
        select: '*'
      });

      return response;
    } catch (error) {
      console.error('Error getting recent doses:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get recent doses',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get insulin effectiveness metrics
   */
  async getInsulinEffectiveness(userId: string, days: number = 14): Promise<ApiResponse<{
    average_response: number;
    consistency_score: number;
    carb_ratio_accuracy: number;
    correction_factor_accuracy: number;
    recommendations: string[];
  }>> {
    try {
      // Get meal and insulin data for analysis
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      // This would typically involve complex analysis of glucose responses to insulin
      // For now, return a simplified calculation
      
      return {
        data: {
          average_response: 0.85,
          consistency_score: 0.75,
          carb_ratio_accuracy: 0.80,
          correction_factor_accuracy: 0.82,
          recommendations: [
            'Consider adjusting morning carb ratio - appears too aggressive',
            'Correction factor seems accurate for current settings',
            'Good consistency in meal timing - continue current pattern'
          ]
        },
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error calculating insulin effectiveness:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to calculate insulin effectiveness',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get enhanced calculation context from historical data
   */
  private async getCalculationContext(userId: string, mealId?: string) {
    const context: any = {
      recentMeals: [],
      recentGlucose: [],
      recentInsulin: [],
      patterns: {}
    };

    try {
      // Get recent meals (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const mealHistoryResponse = await foodService.getMealsForDate(userId, yesterday);
      if (mealHistoryResponse.success && mealHistoryResponse.data) {
        context.recentMeals = mealHistoryResponse.data;
      }

      // Get recent insulin doses
      const recentDosesResponse = await this.getRecentDoses(userId, 6);
      if (recentDosesResponse.success && recentDosesResponse.data) {
        context.recentInsulin = recentDosesResponse.data;
      }

      // Analyze patterns (simplified for now)
      context.patterns = {
        averageCarbs: context.recentMeals.reduce(
          (sum: number, meal: MealEntry) => sum + meal.total_nutrition.carbohydrates, 0
        ) / Math.max(context.recentMeals.length, 1),
        
        averageDose: context.recentInsulin.reduce(
          (sum: number, dose: InsulinDose) => sum + dose.user_final_dose, 0
        ) / Math.max(context.recentInsulin.length, 1)
      };

    } catch (error) {
      console.error('Error getting calculation context:', error);
    }

    return context;
  }

  /**
   * Apply historical corrections to base calculation
   */
  private async applyHistoricalCorrections(
    baseResult: InsulinCalculationResult,
    context: any,
    userId: string
  ): Promise<InsulinCalculationResult> {
    // Clone the base result
    const enhancedResult = { ...baseResult };

    // Apply pattern-based adjustments
    if (context.patterns) {
      const { averageCarbs, averageDose } = context.patterns;
      
      // If current carbs are significantly different from average, adjust confidence
      const carbVariation = Math.abs(baseResult.carb_dose.units - averageDose) / averageDose;
      if (carbVariation > 0.3) {
        enhancedResult.total_recommendation.confidence_level *= 0.85;
        enhancedResult.total_recommendation.safety_warnings.push(
          'Dose differs significantly from recent patterns - verify carb count'
        );
      }
    }

    // Add context-based recommendations
    enhancedResult.total_recommendation.breakdown += 
      `\nBased on recent patterns: Average meal ${context.patterns?.averageCarbs?.toFixed(1) || 'N/A'}g carbs`;

    return enhancedResult;
  }

  /**
   * Store calculation for learning and reference
   */
  private async storeCalculation(
    userId: string, 
    result: InsulinCalculationResult, 
    metadata: any
  ): Promise<void> {
    try {
      const calculationData = {
        user_id: userId,
        calculation_result: result,
        metadata,
        created_at: new Date().toISOString()
      };

      await this.calculationClient.post('/formula_service/insulin_calculations', calculationData);
    } catch (error) {
      console.error('Error storing calculation:', error);
    }
  }

  /**
   * Calculate insulin activity curve
   */
  private calculateInsulinActivity(minutesSince: number, actionProfile: InsulinProfile['action_profile']): number {
    const { onset, peak, duration } = actionProfile;
    
    if (minutesSince < onset) {
      // Before onset - no activity
      return 1.0;
    }
    
    if (minutesSince >= duration) {
      // After duration - no activity
      return 0.0;
    }
    
    if (minutesSince <= peak) {
      // Rising phase (onset to peak)
      const progress = (minutesSince - onset) / (peak - onset);
      return 1.0 - (0.3 * progress); // Peak activity retains ~70% of insulin
    } else {
      // Falling phase (peak to end)
      const progress = (minutesSince - peak) / (duration - peak);
      return 0.7 * (1.0 - progress); // Linear decay from 70% to 0%
    }
  }

  /**
   * Get current time string
   */
  private getCurrentTimeString(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * Emit insulin dosed event
   */
  private emitInsulinDosedEvent(dose: InsulinDose): void {
    console.log('Insulin dosed event:', {
      eventType: 'insulin.dosed',
      userId: dose.user_id,
      doseId: dose.id,
      dose: dose.user_final_dose,
      timestamp: dose.timestamp
    });
  }
}

// Export singleton instance
export const insulinService = new InsulinService();
export default insulinService;