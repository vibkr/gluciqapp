import { observable } from '@legendapp/state';
import { FoodItem, MealEntry, FoodAnalysisResult, NutritionFacts } from '../lib/api/types';
import { foodService } from '../lib/services/FoodService';
import { serviceOrchestrator } from '../lib/services/ServiceOrchestrator';

// Food store state
interface FoodStoreState {
  // Current analysis
  currentAnalysis: FoodAnalysisResult | null;
  isAnalyzing: boolean;
  
  // Meal logging
  currentMeal: Partial<MealEntry> | null;
  isLoggingMeal: boolean;
  
  // History
  mealHistory: MealEntry[];
  recentAnalysis: FoodAnalysisResult[];
  
  // Search and database
  searchResults: FoodItem[];
  isSearching: boolean;
  
  // UI state
  error: string | null;
  lastSync: string | null;
}

// Create store
export const foodStore = observable<FoodStoreState>({
  currentAnalysis: null,
  isAnalyzing: false,
  currentMeal: null,
  isLoggingMeal: false,
  mealHistory: [],
  recentAnalysis: [],
  searchResults: [],
  isSearching: false,
  error: null,
  lastSync: null,
});

// Store actions
export const foodActions = {
  // Food analysis actions
  analyzeFood: async (imagePath: string, userId: string): Promise<FoodAnalysisResult | null> => {
    try {
      foodStore.isAnalyzing.set(true);
      foodStore.error.set(null);

      const response = await foodService.analyzeFood(imagePath, userId);
      
      if (response.success && response.data) {
        foodStore.currentAnalysis.set(response.data);
        
        // Add to recent analysis
        const recentAnalysis = foodStore.recentAnalysis.get();
        foodStore.recentAnalysis.set([response.data, ...recentAnalysis.slice(0, 9)]);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing food:', error);
      foodStore.error.set(error instanceof Error ? error.message : 'Analysis failed');
      return null;
    } finally {
      foodStore.isAnalyzing.set(false);
    }
  },

  // Complete workflow: analyze food and create meal
  analyzeFoodAndCreateMeal: async (params: {
    imagePath: string;
    userId: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    notes?: string;
  }): Promise<{ analysisId: string; mealId: string; insulinRecommendation?: any } | null> => {
    try {
      foodStore.isAnalyzing.set(true);
      foodStore.isLoggingMeal.set(true);
      foodStore.error.set(null);

      const response = await serviceOrchestrator.analyzeFoodAndCreateMeal(params);
      
      if (response.success && response.data) {
        // Update stores with new data
        await foodActions.refreshMealHistory(params.userId);
        await foodActions.refreshRecentAnalysis(params.userId);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Workflow failed');
      }
    } catch (error) {
      console.error('Error in analyze and create meal workflow:', error);
      foodStore.error.set(error instanceof Error ? error.message : 'Workflow failed');
      return null;
    } finally {
      foodStore.isAnalyzing.set(false);
      foodStore.isLoggingMeal.set(false);
    }
  },

  // Meal logging actions
  logMeal: async (mealEntry: Omit<MealEntry, 'id' | 'logged_at'>): Promise<MealEntry | null> => {
    try {
      foodStore.isLoggingMeal.set(true);
      foodStore.error.set(null);

      const response = await foodService.logMeal(mealEntry);
      
      if (response.success && response.data) {
        // Add to meal history
        const mealHistory = foodStore.mealHistory.get();
        foodStore.mealHistory.set([response.data, ...mealHistory]);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to log meal');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
      foodStore.error.set(error instanceof Error ? error.message : 'Failed to log meal');
      return null;
    } finally {
      foodStore.isLoggingMeal.set(false);
    }
  },

  createMealFromAnalysis: async (analysisId: string, mealType: MealEntry['meal_type'], userId: string): Promise<MealEntry | null> => {
    try {
      foodStore.isLoggingMeal.set(true);
      foodStore.error.set(null);

      const response = await foodService.createMealFromAnalysis(analysisId, mealType, userId);
      
      if (response.success && response.data) {
        // Add to meal history
        const mealHistory = foodStore.mealHistory.get();
        foodStore.mealHistory.set([response.data, ...mealHistory]);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create meal');
      }
    } catch (error) {
      console.error('Error creating meal from analysis:', error);
      foodStore.error.set(error instanceof Error ? error.message : 'Failed to create meal');
      return null;
    } finally {
      foodStore.isLoggingMeal.set(false);
    }
  },

  // Search actions
  searchFoods: async (query: string): Promise<FoodItem[]> => {
    try {
      foodStore.isSearching.set(true);
      foodStore.error.set(null);

      const response = await foodService.searchFoods(query);
      
      if (response.success) {
        foodStore.searchResults.set(response.data || []);
        return response.data || [];
      } else {
        throw new Error(response.error || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching foods:', error);
      foodStore.error.set(error instanceof Error ? error.message : 'Search failed');
      return [];
    } finally {
      foodStore.isSearching.set(false);
    }
  },

  // History actions
  refreshMealHistory: async (userId: string): Promise<void> => {
    try {
      const response = await foodService.getMealHistory(userId, 50);
      
      if (response.success) {
        foodStore.mealHistory.set(response.data || []);
      }
    } catch (error) {
      console.error('Error refreshing meal history:', error);
    }
  },

  refreshRecentAnalysis: async (userId: string): Promise<void> => {
    try {
      const response = await foodService.getRecentAnalysis(userId, 10);
      
      if (response.success) {
        foodStore.recentAnalysis.set(response.data || []);
      }
    } catch (error) {
      console.error('Error refreshing recent analysis:', error);
    }
  },

  getMealsForDate: async (userId: string, date: Date): Promise<MealEntry[]> => {
    try {
      const response = await foodService.getMealsForDate(userId, date);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting meals for date:', error);
      return [];
    }
  },

  getNutritionSummaryForDate: async (userId: string, date: Date): Promise<NutritionFacts | null> => {
    try {
      const response = await foodService.getNutritionSummaryForDate(userId, date);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting nutrition summary:', error);
      return null;
    }
  },

  // Current meal management
  startNewMeal: (mealType: MealEntry['meal_type'], userId: string) => {
    foodStore.currentMeal.set({
      user_id: userId,
      meal_type: mealType,
      foods: [],
      total_nutrition: {
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        protein: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        serving_size: 0,
        serving_unit: ''
      }
    });
  },

  addFoodToCurrentMeal: (food: {
    food_id: string;
    food_name: string;
    portion_size: number;
    portion_unit: string;
    nutrition: NutritionFacts;
  }) => {
    const currentMeal = foodStore.currentMeal.get();
    if (!currentMeal) return;

    const updatedFoods = [...(currentMeal.foods || []), food];
    const updatedNutrition = updatedFoods.reduce((total, f) => ({
      calories: total.calories + f.nutrition.calories,
      carbohydrates: total.carbohydrates + f.nutrition.carbohydrates,
      fat: total.fat + f.nutrition.fat,
      protein: total.protein + f.nutrition.protein,
      fiber: total.fiber + f.nutrition.fiber,
      sugar: total.sugar + f.nutrition.sugar,
      sodium: total.sodium + (f.nutrition.sodium || 0),
      serving_size: 0,
      serving_unit: ''
    }), {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      serving_size: 0,
      serving_unit: ''
    });

    foodStore.currentMeal.set({
      ...currentMeal,
      foods: updatedFoods,
      total_nutrition: updatedNutrition
    });
  },

  finishCurrentMeal: async (notes?: string): Promise<MealEntry | null> => {
    const currentMeal = foodStore.currentMeal.get();
    if (!currentMeal || !currentMeal.foods || currentMeal.foods.length === 0) {
      return null;
    }

    const mealEntry: Omit<MealEntry, 'id' | 'logged_at'> = {
      ...currentMeal as Omit<MealEntry, 'id' | 'logged_at'>,
      notes
    };

    const loggedMeal = await foodActions.logMeal(mealEntry);
    
    if (loggedMeal) {
      foodStore.currentMeal.set(null);
    }
    
    return loggedMeal;
  },

  clearCurrentMeal: () => {
    foodStore.currentMeal.set(null);
  },

  // Utility actions
  clearError: () => {
    foodStore.error.set(null);
  },

  clearSearchResults: () => {
    foodStore.searchResults.set([]);
  },

  setLastSync: () => {
    foodStore.lastSync.set(new Date().toISOString());
  }
};

// Computed values
export const foodComputed = {
  // Get today's meals
  getTodaysMeals: (userId: string) => {
    const mealHistory = foodStore.mealHistory.get();
    const today = new Date().toDateString();
    
    return mealHistory.filter(meal => 
      meal.user_id === userId && 
      new Date(meal.logged_at).toDateString() === today
    );
  },

  // Get today's nutrition totals
  getTodaysNutrition: (userId: string) => {
    const todaysMeals = foodComputed.getTodaysMeals(userId);
    
    return todaysMeals.reduce((total, meal) => ({
      calories: total.calories + meal.total_nutrition.calories,
      carbohydrates: total.carbohydrates + meal.total_nutrition.carbohydrates,
      fat: total.fat + meal.total_nutrition.fat,
      protein: total.protein + meal.total_nutrition.protein,
      fiber: total.fiber + meal.total_nutrition.fiber,
      sugar: total.sugar + meal.total_nutrition.sugar,
      sodium: total.sodium + (meal.total_nutrition.sodium || 0),
      serving_size: 0,
      serving_unit: ''
    }), {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      serving_size: 0,
      serving_unit: ''
    });
  },

  // Get current meal carbs (for insulin calculation)
  getCurrentMealCarbs: () => {
    const currentMeal = foodStore.currentMeal.get();
    return currentMeal?.total_nutrition.carbohydrates || 0;
  }
};

// Export hook for React components
export const useFoodStore = () => {
  return {
    store: foodStore,
    actions: foodActions,
    computed: foodComputed
  };
};