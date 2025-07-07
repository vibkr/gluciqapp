import { enhancedFoodAnalysisService } from '../ai/EnhancedFoodAnalysisService';
import { getFoodServiceClient } from '../api/serviceRegistry';
import {
    ApiResponse,
    FoodAnalysisResult,
    FoodItem,
    LegacyMealEntry,
    LegacyNutritionFacts,
    MealEntry,
    PaginatedResponse
} from '../api/types';

/**
 * Food Service - Handles all food-related operations
 * Integrates with food analysis, nutrition database, and meal logging
 */
export class FoodService {
  private apiClient = getFoodServiceClient();

  /**
   * Search for foods in the database
   */
  async searchFoods(query: string, limit: number = 20): Promise<PaginatedResponse<FoodItem>> {
    try {
      const response = await this.apiClient.get<FoodItem[]>('/food_service/foods', {
        filters: { name: { ilike: `%${query}%` } },
        select: '*',
        limit
      });

      return {
        data: response.data || [],
        pagination: {
          page: 1,
          limit,
          total: response.data?.length || 0,
          totalPages: 1
        },
        error: response.error,
        success: response.success
      };
    } catch (error) {
      console.error('Error searching foods:', error);
      return {
        data: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        error: 'Failed to search foods',
        success: false
      };
    }
  }

  /**
   * Get food by ID
   */
  async getFoodById(id: string): Promise<ApiResponse<FoodItem>> {
    return await this.apiClient.get<FoodItem>(`/food_service/foods/${id}`);
  }

  /**
   * Create a new food item
   */
  async createFood(food: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FoodItem>> {
    const foodData = {
      ...food,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await this.apiClient.post<FoodItem>('/food_service/foods', foodData);
  }

  /**
   * Analyze food from image and store results
   */
  async analyzeFood(imagePath: string, userId: string): Promise<ApiResponse<FoodAnalysisResult>> {
    try {
      console.log('Starting food analysis for user:', userId);
      
      // Use the enhanced food analysis service
      const analysisResult = await enhancedFoodAnalysisService.analyzeImageWithVision(imagePath);
      
      // Store the analysis result
      const storedResult = await this.storeFoodAnalysisResult(analysisResult, userId, imagePath);
      
      return {
        data: storedResult,
        error: null,
        success: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing food:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to analyze food',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Store food analysis result in database
   */
  private async storeFoodAnalysisResult(
    analysisResult: any, 
    userId: string, 
    imagePath: string
  ): Promise<FoodAnalysisResult> {
    const analysisData = {
      user_id: userId,
      source: analysisResult.source,
      confidence: analysisResult.confidence,
      image_url: imagePath,
      analysis_data: analysisResult,
      created_at: new Date().toISOString()
    };

    // Store in database using correct schema.table format
    const response = await this.apiClient.post<FoodAnalysisResult>('/food_analysis/food_analysis_results', analysisData);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to store analysis result');
    }

    // Store individual foods from analysis
    const foods: FoodItem[] = [];
    for (const food of analysisResult.foods) {
      try {
        const foodData = {
          name: food.name,
          category: food.category,
          nutrition: food.nutrition,
          glycemic_info: food.glycemic_info,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const foodResponse = await this.apiClient.post<FoodItem>('/food_service/foods', foodData);
        if (foodResponse.success && foodResponse.data) {
          foods.push(foodResponse.data);
        }
      } catch (error) {
        console.error('Error storing food item:', error);
      }
    }

    return {
      ...response.data,
      foods
    };
  }

  /**
   * Log a meal entry
   */
  async logMeal(mealEntry: Omit<MealEntry, 'id' | 'logged_at'>): Promise<ApiResponse<MealEntry>> {
    try {
      const mealData = {
        ...mealEntry,
        logged_at: new Date().toISOString()
      };

      const response = await this.apiClient.post<MealEntry>('/logging_service/meal_entries', mealData);
      
      if (response.success && response.data) {
        // Emit event for other services to process
        this.emitMealLoggedEvent(response.data);
      }

      return response;
    } catch (error) {
      console.error('Error logging meal:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to log meal',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get user's meal history
   */
  async getMealHistory(userId: string, limit: number = 50): Promise<PaginatedResponse<MealEntry>> {
    try {
      const response = await this.apiClient.get<MealEntry[]>('/logging_service/meal_entries', {
        filters: { user_id: userId },
        select: '*',
        limit
      });

      return {
        data: response.data || [],
        pagination: {
          page: 1,
          limit,
          total: response.data?.length || 0,
          totalPages: 1
        },
        error: response.error,
        success: response.success
      };
    } catch (error) {
      console.error('Error getting meal history:', error);
      return {
        data: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        error: 'Failed to get meal history',
        success: false
      };
    }
  }

  /**
   * Get meals for a specific date
   */
  async getMealsForDate(userId: string, date: Date): Promise<ApiResponse<MealEntry[]>> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await this.apiClient.get<MealEntry[]>('/logging_service/meal_entries', {
        filters: { 
          user_id: userId,
          logged_at: {
            gte: startOfDay.toISOString(),
            lte: endOfDay.toISOString()
          }
        },
        select: '*'
      });

      return response;
    } catch (error) {
      console.error('Error getting meals for date:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get meals for date',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get nutrition summary for a date
   */
  async getNutritionSummaryForDate(userId: string, date: Date): Promise<ApiResponse<LegacyNutritionFacts>> {
    try {
      const mealsResponse = await this.getMealsForDate(userId, date);
      
      if (!mealsResponse.success || !mealsResponse.data) {
        return {
          data: null,
          error: mealsResponse.error,
          success: false,
          timestamp: new Date()
        };
      }

      const totalNutrition = mealsResponse.data.reduce((total, meal) => {
        return {
          calories: total.calories + meal.total_calories,
          carbohydrates: total.carbohydrates + meal.total_carbs_g,
          fat: total.fat + meal.total_fat_g,
          protein: total.protein + meal.total_protein_g,
          fiber: total.fiber + meal.total_fiber_g,
          sugar: total.sugar + 0, // Not tracked in new schema
          sodium: total.sodium + 0, // Not tracked in new schema
          serving_size: 0,
          serving_unit: 'grams'
        };
      }, {
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        protein: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        serving_size: 0,
        serving_unit: 'grams'
      });

      return {
        data: totalNutrition,
        error: null,
        success: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting nutrition summary:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get nutrition summary',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get user's recent food analysis results
   */
  async getRecentAnalysis(userId: string, limit: number = 10): Promise<PaginatedResponse<FoodAnalysisResult>> {
    try {
      const response = await this.apiClient.get<FoodAnalysisResult[]>('/food_analysis/food_analysis_results', {
        filters: { user_id: userId },
        select: '*',
        limit
      });

      return {
        data: response.data || [],
        pagination: {
          page: 1,
          limit,
          total: response.data?.length || 0,
          totalPages: 1
        },
        error: response.error,
        success: response.success
      };
    } catch (error) {
      console.error('Error getting recent analysis:', error);
      return {
        data: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        error: 'Failed to get recent analysis',
        success: false
      };
    }
  }

  /**
   * Create meal from analysis result
   */
  async createMealFromAnalysis(analysisId: string, mealType: LegacyMealEntry['meal_type'], userId: string): Promise<ApiResponse<LegacyMealEntry>> {
    try {
      // Get the analysis result
      const analysisResponse = await this.apiClient.get<FoodAnalysisResult>(`/food_analysis/food_analysis_results/${analysisId}`);
      
      if (!analysisResponse.success || !analysisResponse.data) {
        throw new Error('Analysis result not found');
      }

      const analysis = analysisResponse.data;
      
      // Create meal entry from analysis - using the analysis result structure directly
      const mealEntry: Omit<LegacyMealEntry, 'id' | 'logged_at'> = {
        user_id: userId,
        meal_type: mealType,
        foods: analysis.detected_foods.map((food: any) => ({
          food_id: food.id || `temp-${Date.now()}`,
          food_name: food.name,
          portion_size: food.portion?.amount || 0,
          portion_unit: food.portion?.unit || 'grams',
          nutrition: {
            calories: food.nutrition?.calories || 0,
            carbohydrates: food.nutrition?.carbohydrates || 0,
            fat: food.nutrition?.fat || 0,
            protein: food.nutrition?.protein || 0,
            fiber: food.nutrition?.fiber || 0,
            sugar: food.nutrition?.sugar || 0,
            sodium: food.nutrition?.sodium || 0,
            serving_size: food.portion?.amount || 0,
            serving_unit: food.portion?.unit || 'grams'
          }
        })),
        total_nutrition: this.calculateLegacyTotalNutrition(analysis.detected_foods),
        analysis_id: analysisId,
        notes: `Created from ${analysis.source} analysis`
      };

      return await this.logLegacyMeal(mealEntry);
    } catch (error) {
      console.error('Error creating meal from analysis:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create meal from analysis',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Log a legacy meal entry
   */
  async logLegacyMeal(mealEntry: Omit<LegacyMealEntry, 'id' | 'logged_at'>): Promise<ApiResponse<LegacyMealEntry>> {
    try {
      const mealData = {
        ...mealEntry,
        logged_at: new Date()
      };

      // Convert to new format for storage
      const newMealEntry: Omit<MealEntry, 'id' | 'created_at' | 'updated_at'> = {
        user_id: mealData.user_id,
        meal_type: mealData.meal_type === 'snack' ? 'afternoon_snack' : mealData.meal_type,
        logged_at: mealData.logged_at.toISOString(),
        total_calories: mealData.total_nutrition.calories,
        total_carbs_g: mealData.total_nutrition.carbohydrates,
        total_protein_g: mealData.total_nutrition.protein,
        total_fat_g: mealData.total_nutrition.fat,
        total_fiber_g: mealData.total_nutrition.fiber,
        notes: mealData.notes,
        analysis_id: mealData.analysis_id
      };

      const response = await this.apiClient.post<MealEntry>('/logging_service/meal_entries', newMealEntry);
      
      if (response.success && response.data) {
        // Convert back to legacy format for return
        const legacyMeal: LegacyMealEntry = {
          id: response.data.id,
          user_id: response.data.user_id,
          meal_type: mealData.meal_type,
          foods: mealData.foods,
          total_nutrition: mealData.total_nutrition,
          logged_at: mealData.logged_at,
          notes: mealData.notes,
          analysis_id: mealData.analysis_id
        };
        
        // Emit event for other services to process
        this.emitMealLoggedEvent(response.data);
        
        return {
          data: legacyMeal,
          error: null,
          success: true,
          timestamp: new Date()
        };
      }

      return {
        data: null,
        error: response.error || 'Failed to log meal',
        success: false,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error logging legacy meal:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to log meal',
        success: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate total nutrition from multiple food items (legacy format)
   */
  private calculateLegacyTotalNutrition(foods: any[]): LegacyNutritionFacts {
    return foods.reduce((total, food) => {
      const nutrition = food.nutrition || {};
      return {
        calories: total.calories + (nutrition.calories || 0),
        carbohydrates: total.carbohydrates + (nutrition.carbohydrates || 0),
        fat: total.fat + (nutrition.fat || 0),
        protein: total.protein + (nutrition.protein || 0),
        fiber: total.fiber + (nutrition.fiber || 0),
        sugar: total.sugar + (nutrition.sugar || 0),
        sodium: total.sodium + (nutrition.sodium || 0),
        serving_size: 0,
        serving_unit: 'grams'
      };
    }, {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      serving_size: 0,
      serving_unit: 'grams'
    });
  }

  /**
   * Calculate total nutrition from multiple food items
   */
  private calculateTotalNutrition(foods: FoodItem[]): LegacyNutritionFacts {
    return foods.reduce((total, food) => {
      // Since FoodItem doesn't have nutrition directly, we'll use defaults
      return {
        calories: total.calories + 0,
        carbohydrates: total.carbohydrates + 0,
        fat: total.fat + 0,
        protein: total.protein + 0,
        fiber: total.fiber + 0,
        sugar: total.sugar + 0,
        sodium: total.sodium + 0,
        serving_size: 0,
        serving_unit: 'grams'
      };
    }, {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      serving_size: 0,
      serving_unit: 'grams'
    });
  }

  /**
   * Emit meal logged event for other services to process
   */
  private emitMealLoggedEvent(meal: MealEntry): void {
    // This would typically go to an event bus or message queue
    // For now, we'll just log it
    console.log('Meal logged event:', {
      eventType: 'meal.logged',
      userId: meal.user_id,
      mealId: meal.id,
      totalCalories: meal.total_calories,
      totalCarbs: meal.total_carbs_g,
      timestamp: meal.logged_at
    });
  }
}

// Export singleton instance
export const foodService = new FoodService();
export default foodService;