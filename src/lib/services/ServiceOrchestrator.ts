import { ApiResponse } from '../api/types';
import { foodService } from './FoodService';
import { insulinService } from './InsulinService';
import { serviceRegistry } from '../api/serviceRegistry';

/**
 * Service Orchestrator - Coordinates all services and provides unified workflows
 * This is the main entry point for complex operations that span multiple services
 */
export class ServiceOrchestrator {
  private userService = serviceRegistry.getClient('user');
  private loggingService = serviceRegistry.getClient('logging');

  /**
   * Complete food analysis to meal logging workflow
   */
  async analyzeFoodAndCreateMeal(params: {
    userId: string;
    imagePath: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    notes?: string;
  }): Promise<ApiResponse<{
    analysisId: string;
    mealId: string;
    insulinRecommendation?: any;
  }>> {
    try {
      console.log('Starting complete food analysis workflow for user:', params.userId);

      // Step 1: Analyze the food
      const analysisResponse = await foodService.analyzeFood(params.imagePath, params.userId);
      if (!analysisResponse.success || !analysisResponse.data) {
        throw new Error(analysisResponse.error || 'Food analysis failed');
      }

      const analysis = analysisResponse.data;

      // Step 2: Create meal from analysis
      const mealResponse = await foodService.createMealFromAnalysis(
        analysis.id,
        params.mealType,
        params.userId
      );

      if (!mealResponse.success || !mealResponse.data) {
        throw new Error(mealResponse.error || 'Failed to create meal');
      }

      const meal = mealResponse.data;

      // Step 3: Calculate insulin recommendation
      let insulinRecommendation = null;
      try {
        const insulinResponse = await insulinService.calculateInsulinDose({
          userId: params.userId,
          mealId: meal.id,
          mealType: params.mealType,
          carbohydrates: meal.total_nutrition.carbohydrates
        });

        if (insulinResponse.success) {
          insulinRecommendation = insulinResponse.data;
        }
      } catch (error) {
        console.warn('Insulin calculation failed, continuing without recommendation:', error);
      }

      // Step 4: Update meal with notes if provided
      if (params.notes) {
        const updatedMeal = { ...meal, notes: params.notes };
        await this.loggingService.put(`/logging_service/meal_entries/${meal.id}`, updatedMeal);
      }

      return {
        data: {
          analysisId: analysis.id,
          mealId: meal.id,
          insulinRecommendation
        },
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error in food analysis workflow:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Workflow failed',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Complete insulin dosing workflow (calculate + log)
   */
  async calculateAndLogInsulin(params: {
    userId: string;
    carbohydrates?: number;
    currentGlucose?: number;
    mealId?: string;
    notes?: string;
  }): Promise<ApiResponse<{
    calculationId: string;
    doseId?: string;
    recommendation: any;
  }>> {
    try {
      console.log('Starting insulin calculation and logging workflow');

      // Step 1: Calculate insulin dose
      const calculationResponse = await insulinService.calculateInsulinDose({
        userId: params.userId,
        carbohydrates: params.carbohydrates,
        currentGlucose: params.currentGlucose,
        mealId: params.mealId
      });

      if (!calculationResponse.success || !calculationResponse.data) {
        throw new Error(calculationResponse.error || 'Insulin calculation failed');
      }

      const calculation = calculationResponse.data;
      const calculationId = `calc_${Date.now()}`;

      // Step 2: Present recommendation to user (they choose whether to log)
      // For now, we'll auto-log if the dose is reasonable and has high confidence
      let doseId = undefined;
      
      if (calculation.total_recommendation.confidence_level > 70 && 
          calculation.total_recommendation.units > 0) {
        
        try {
          const doseResponse = await insulinService.logInsulinDose({
            user_id: params.userId,
            dose_type: params.mealId ? 'meal' : 'correction',
            calculated_dose: calculation.total_recommendation.units,
            user_final_dose: calculation.total_recommendation.units, // User can adjust later
            carbohydrates: params.carbohydrates,
            glucose_reading: params.currentGlucose,
            meal_id: params.mealId,
            notes: params.notes || `Auto-logged from calculation (${calculation.total_recommendation.confidence_level}% confidence)`
          });

          if (doseResponse.success && doseResponse.data) {
            doseId = doseResponse.data.id;
          }
        } catch (error) {
          console.warn('Failed to auto-log insulin dose:', error);
        }
      }

      return {
        data: {
          calculationId,
          doseId,
          recommendation: calculation
        },
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error in insulin workflow:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Insulin workflow failed',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(userId: string): Promise<ApiResponse<{
    glucose: {
      latest?: any;
      todayAverage: number;
      trend: 'rising' | 'stable' | 'falling';
    };
    meals: {
      today: any[];
      totalCarbs: number;
      totalCalories: number;
    };
    insulin: {
      todayTotal: number;
      activeDoses: number;
      iob: number;
    };
    insights: string[];
  }>> {
    try {
      console.log('Getting comprehensive dashboard data for user:', userId);

      const today = new Date();
      const dashboardData: any = {
        glucose: { todayAverage: 0, trend: 'stable' },
        meals: { today: [], totalCarbs: 0, totalCalories: 0 },
        insulin: { todayTotal: 0, activeDoses: 0, iob: 0 },
        insights: []
      };

      // Get today's meals
      try {
        const mealsResponse = await foodService.getMealsForDate(userId, today);
        if (mealsResponse.success && mealsResponse.data) {
          dashboardData.meals.today = mealsResponse.data;
          dashboardData.meals.totalCarbs = mealsResponse.data.reduce(
            (sum, meal) => sum + meal.total_nutrition.carbohydrates, 0
          );
          dashboardData.meals.totalCalories = mealsResponse.data.reduce(
            (sum, meal) => sum + meal.total_nutrition.calories, 0
          );
        }
      } catch (error) {
        console.warn('Failed to get meal data:', error);
      }

      // Get insulin data
      try {
        const iobResponse = await insulinService.getInsulinOnBoard(userId);
        if (iobResponse.success && iobResponse.data) {
          dashboardData.insulin.iob = iobResponse.data.active_units;
          dashboardData.insulin.activeDoses = iobResponse.data.recent_doses.length;
          
          // Calculate today's total insulin
          const todayDoses = iobResponse.data.recent_doses.filter(dose => {
            const doseDate = new Date(dose.timestamp);
            return doseDate.toDateString() === today.toDateString();
          });
          
          dashboardData.insulin.todayTotal = todayDoses.reduce(
            (sum, dose) => sum + dose.user_final_dose, 0
          );
        }
      } catch (error) {
        console.warn('Failed to get insulin data:', error);
      }

      // Generate insights
      dashboardData.insights = this.generateInsights(dashboardData);

      return {
        data: dashboardData,
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get dashboard data',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get user's health trends and analytics
   */
  async getHealthTrends(userId: string, days: number = 14): Promise<ApiResponse<{
    glucoseTrends: any;
    mealPatterns: any;
    insulinEffectiveness: any;
    recommendations: string[];
  }>> {
    try {
      // This would involve complex analytics across all services
      // For now, return placeholder data
      
      return {
        data: {
          glucoseTrends: {
            averageChange: -2.5,
            variability: 0.15,
            timeInRange: 0.78
          },
          mealPatterns: {
            carbConsistency: 0.85,
            timingConsistency: 0.92,
            averageCarbs: 45
          },
          insulinEffectiveness: {
            averageResponse: 0.82,
            dosePrecision: 0.88
          },
          recommendations: [
            'Excellent meal timing consistency - keep it up!',
            'Consider reducing evening carb portions slightly',
            'Insulin responses are well-controlled'
          ]
        },
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error getting health trends:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get health trends',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Initialize user data (set up default profiles, etc.)
   */
  async initializeUserData(userId: string, userPreferences: {
    diabetesType: 'type1' | 'type2' | 'gestational';
    units: 'mg/dl' | 'mmol/l';
    initialInsulinSettings?: any;
  }): Promise<ApiResponse<boolean>> {
    try {
      console.log('Initializing user data for:', userId);

      // Create default insulin profile if needed
      if (userPreferences.diabetesType === 'type1' || userPreferences.initialInsulinSettings) {
        const defaultProfile = {
          user_id: userId,
          carb_ratios: [
            { time_start: "06:00", time_end: "12:00", ratio: 10 },
            { time_start: "12:00", time_end: "18:00", ratio: 12 },
            { time_start: "18:00", time_end: "23:59", ratio: 8 },
            { time_start: "00:00", time_end: "06:00", ratio: 15 }
          ],
          sensitivity_factor: [
            { time_start: "06:00", time_end: "12:00", factor: 40 },
            { time_start: "12:00", time_end: "18:00", factor: 50 },
            { time_start: "18:00", time_end: "23:59", factor: 45 },
            { time_start: "00:00", time_end: "06:00", factor: 60 }
          ],
          action_profile: {
            onset: 15,
            peak: 90,
            duration: 240
          },
          safety_limits: {
            max_single_dose: 20,
            max_daily_dose: 100,
            min_carbs_for_dose: 5
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        await insulinService.updateInsulinProfile(userId, defaultProfile);
      }

      return {
        data: true,
        error: null,
        success: true,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Error initializing user data:', error);
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Failed to initialize user data',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate insights from dashboard data
   */
  private generateInsights(data: any): string[] {
    const insights: string[] = [];

    // Meal insights
    if (data.meals.today.length === 0) {
      insights.push("No meals logged today - remember to track your food!");
    } else if (data.meals.totalCarbs > 200) {
      insights.push("High carb day - ensure you're staying active");
    } else if (data.meals.totalCarbs < 100) {
      insights.push("Lower carb day - great for glucose control!");
    }

    // Insulin insights
    if (data.insulin.iob > 5) {
      insights.push("Significant insulin still active - be mindful of additional doses");
    }

    // General insights
    if (data.meals.today.length > 0 && data.insulin.todayTotal === 0) {
      insights.push("You've logged meals but no insulin - don't forget your doses!");
    }

    return insights;
  }
}

// Export singleton instance
export const serviceOrchestrator = new ServiceOrchestrator();
export default serviceOrchestrator;