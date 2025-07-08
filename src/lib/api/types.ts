// API layer types - unified interfaces for all services
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error: string | null;
  success: boolean;
}

// Service configuration
export interface ServiceConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// API provider types
export type ApiProvider = 'supabase' | 'microservice';

// Generic API client interface
export interface ApiClient {
  get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

// Food service types - updated to match new schema
export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  category: 'grains' | 'vegetables' | 'fruits' | 'proteins' | 'dairy' | 'packaged_food' | 'beverages' | 'sweets' | 'snacks' | 'mixed_meal' | 'unknown';
  barcode?: string;
  fdc_id?: string;
  serving_size: number;
  serving_unit: 'grams' | 'ml' | 'pieces' | 'cups' | 'oz' | 'slices' | 'tablespoons' | 'teaspoons';
  is_verified: boolean;
  verification_source?: string;
  data_source: string;
  search_terms?: string[];
  aliases?: string[];
  created_at: string;
  updated_at: string;
}

export interface NutritionFacts {
  id: string;
  food_id: string;
  calories: number;
  protein_g: number;
  carbohydrates_g: number;
  fiber_g: number;
  sugars_g: number;
  fat_g: number;
  saturated_fat_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  vitamin_a_iu?: number;
  vitamin_c_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  data_source: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface GlycemicInfo {
  id: string;
  food_id: string;
  glycemic_index?: number;
  glycemic_load?: number;
  digestible_carbs_g?: number;
  absorption_rate?: 'slow' | 'medium' | 'fast';
  blood_sugar_impact: 'low' | 'moderate' | 'high' | 'very_high';
  insulin_demand: 'low' | 'moderate' | 'high' | 'very_high';
  data_source: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface FoodAnalysisResult {
  id: string;
  user_id: string;
  source: 'vision' | 'barcode' | 'hybrid' | 'manual';
  confidence_score: number;
  image_url?: string;
  image_metadata?: any;
  raw_analysis_data?: any;
  detected_foods: any[];
  verification_status: 'pending' | 'verified' | 'rejected' | 'needs_review';
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
  processing_time_ms?: number;
  foods?: FoodItem[]; // For backwards compatibility
  created_at: string;
  updated_at: string;
}

export interface MealEntry {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'evening_snack' | 'pre_workout' | 'post_workout';
  logged_at: string;
  total_calories: number;
  total_carbs_g: number;
  total_protein_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  notes?: string;
  analysis_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MealEntryFood {
  id: string;
  meal_entry_id: string;
  food_id: string;
  food_name: string;
  portion_size: number;
  portion_unit: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  created_at: string;
  updated_at: string;
}

// Insulin service types
export interface InsulinDose {
  id: string;
  user_id: string;
  dose_type: 'meal' | 'correction' | 'basal';
  calculated_dose: number;
  user_final_dose: number;
  carbohydrates?: number;
  glucose_reading?: number;
  meal_id?: string;
  notes?: string;
  timestamp: Date;
}

export interface InsulinProfile {
  id: string;
  user_id: string;
  carb_ratios: {
    time_start: string;
    time_end: string;
    ratio: number;
  }[];
  sensitivity_factor: {
    time_start: string;
    time_end: string;
    factor: number;
  }[];
  action_profile: {
    onset: number;
    peak: number;
    duration: number;
  };
  safety_limits: {
    max_single_dose: number;
    max_daily_dose: number;
    min_carbs_for_dose: number;
  };
  created_at: Date;
  updated_at: Date;
}

// Glucose service types
export interface GlucoseReading {
  id: string;
  user_id: string;
  value: number;
  timestamp: Date;
  notes?: string;
  tags?: string[];
  meal_context?: string;
}

// User service types - updated to match new schema
export interface User {
  id: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  diabetes_type: 'type1' | 'type2' | 'gestational' | 'metabolic' | 'other';
  program_type?: 'type1' | 'type2' | 'metabolic';
  user_role: 'patient' | 'healthcare_provider' | 'caregiver' | 'admin' | 'support' | 'researcher';
  date_of_birth?: string;
  height_cm?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  preferred_units: 'metric' | 'imperial';
  glucose_unit: 'mg/dL' | 'mmol/L';
  timezone: string;
  language: string;
  is_active: boolean;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  glucose_reminders: boolean;
  insulin_reminders: boolean;
  meal_reminders: boolean;
  data_sharing_enabled: boolean;
  analytics_enabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  font_size: 'small' | 'medium' | 'large';
  high_contrast: boolean;
  reduce_motion: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDiabetesSettings {
  id: string;
  user_id: string;
  carb_ratios: any[]; // JSONB array of time-based ratios
  correction_factors: any[]; // JSONB array of time-based factors
  target_glucose_min: number;
  target_glucose_max: number;
  insulin_duration_hours: number;
  insulin_onset_minutes: number;
  max_bolus_units: number;
  created_at: string;
  updated_at: string;
}

// Backward compatibility helpers
export interface LegacyNutritionFacts {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
  fiber: number;
  sugar: number;
  sodium?: number;
  serving_size: number;
  serving_unit: string;
}

export interface LegacyMealEntry {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: {
    food_id: string;
    food_name: string;
    portion_size: number;
    portion_unit: string;
    nutrition: LegacyNutritionFacts;
  }[];
  total_nutrition: LegacyNutritionFacts;
  logged_at: Date;
  notes?: string;
  analysis_id?: string;
}

// Type conversion helpers
export const convertToLegacyNutrition = (nutrition: NutritionFacts): LegacyNutritionFacts => ({
  calories: nutrition.calories,
  carbohydrates: nutrition.carbohydrates_g,
  fat: nutrition.fat_g,
  protein: nutrition.protein_g,
  fiber: nutrition.fiber_g,
  sugar: nutrition.sugars_g,
  sodium: nutrition.sodium_mg,
  serving_size: 100, // Default
  serving_unit: 'grams'
});

export const convertFromLegacyNutrition = (nutrition: LegacyNutritionFacts, foodId: string): Partial<NutritionFacts> => ({
  food_id: foodId,
  calories: nutrition.calories,
  carbohydrates_g: nutrition.carbohydrates,
  fat_g: nutrition.fat,
  protein_g: nutrition.protein,
  fiber_g: nutrition.fiber,
  sugars_g: nutrition.sugar,
  sodium_mg: nutrition.sodium || 0,
  data_source: 'legacy_conversion',
  confidence_score: 0.8
});

// Analytics and insights types
export interface DailySummary {
  id: string;
  user_id: string;
  date: Date;
  glucose_stats: {
    average: number;
    min: number;
    max: number;
    readings_count: number;
    time_in_range: number;
  };
  meal_stats: {
    total_carbs: number;
    total_calories: number;
    meals_count: number;
  };
  insulin_stats: {
    total_dose: number;
    doses_count: number;
    meal_doses: number;
    correction_doses: number;
  };
  created_at: Date;
}

export interface TrendAnalysis {
  period: 'week' | 'month' | 'quarter';
  glucose_trends: {
    average_change: number;
    variability: number;
    time_in_range_trend: number;
  };
  meal_trends: {
    carb_intake_trend: number;
    meal_timing_consistency: number;
  };
  insulin_trends: {
    dose_efficiency: number;
    timing_accuracy: number;
  };
}