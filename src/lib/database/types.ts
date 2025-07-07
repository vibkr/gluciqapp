// =============================================================================
// GLOBAL ENUMS (V2.0.0) - matching database schema exactly
// =============================================================================

export type FoodCategory = 
  | 'grains' 
  | 'vegetables' 
  | 'fruits' 
  | 'proteins' 
  | 'dairy' 
  | 'packaged_food' 
  | 'beverages' 
  | 'sweets' 
  | 'snacks' 
  | 'mixed_meal' 
  | 'unknown';

export type PortionUnit = 
  | 'grams' 
  | 'ml' 
  | 'pieces' 
  | 'cups' 
  | 'oz' 
  | 'slices' 
  | 'tablespoons' 
  | 'teaspoons';

export type DiabetesType = 
  | 'type1' 
  | 'type2' 
  | 'metabolic' 
  | 'gestational' 
  | 'other';

export type ProgramType = 
  | 'type1' 
  | 'type2' 
  | 'metabolic';

export type UserRole = 
  | 'patient' 
  | 'healthcare_provider' 
  | 'caregiver' 
  | 'admin' 
  | 'support' 
  | 'researcher';

export type RelationshipStatus = 
  | 'pending' 
  | 'active' 
  | 'paused' 
  | 'declined' 
  | 'terminated';

export type ProviderAccessLevel = 
  | 'read_only' 
  | 'read_write' 
  | 'full_access';

export type CaregiverAccessLevel = 
  | 'basic' 
  | 'extended' 
  | 'full';

export type MealType = 
  | 'breakfast' 
  | 'morning_snack' 
  | 'lunch' 
  | 'afternoon_snack' 
  | 'dinner' 
  | 'evening_snack' 
  | 'pre_workout' 
  | 'post_workout';

export type AnalysisSource = 
  | 'vision' 
  | 'barcode' 
  | 'hybrid' 
  | 'manual';

export type VerificationStatus = 
  | 'pending' 
  | 'verified' 
  | 'rejected' 
  | 'needs_review';

export type FormulaType = 
  | 'insulin_bolus' 
  | 'correction_bolus' 
  | 'glucobalance_score' 
  | 'carb_ratio' 
  | 'insulin_sensitivity' 
  | 'personalized_score';

export type CalculationStatus = 
  | 'pending' 
  | 'calculating' 
  | 'completed' 
  | 'failed' 
  | 'cancelled';

export type SubscriptionStatus = 
  | 'active' 
  | 'inactive' 
  | 'expired' 
  | 'cancelled' 
  | 'trial';

export type SubscriptionTier = 
  | 'free' 
  | 'basic' 
  | 'premium' 
  | 'premium_plus' 
  | 'family';

export type Intensity = 
  | 'low' 
  | 'moderate' 
  | 'high' 
  | 'very_high';

export type Difficulty = 
  | 'very_easy' 
  | 'easy' 
  | 'medium' 
  | 'hard' 
  | 'very_hard';

export type ProcessingStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed';

// =============================================================================
// USER SERVICE SCHEMA (V2.1.0)
// =============================================================================

export interface User {
  id: string;
  auth_user_id?: string;
  email: string;
  email_verified: boolean;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  user_role: UserRole;
  program_type?: ProgramType;
  diabetes_type: DiabetesType;
  diagnosis_date?: string;
  height_cm?: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  preferred_units: string;
  glucose_unit: string;
  timezone: string;
  language: string;
  has_cgm: boolean;
  cgm_brand?: string;
  has_insulin_pump: boolean;
  insulin_pump_brand?: string;
  goal_a1c?: number;
  daily_step_goal: number;
  weekly_exercise_sessions: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  is_active: boolean;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

export interface UserDiabetesSettings {
  id: string;
  user_id: string;
  carb_ratios: any[];
  correction_factors: any[];
  target_glucose_min: number;
  target_glucose_max: number;
  insulin_duration_hours: number;
  insulin_onset_minutes: number;
  max_bolus_units: number;
  created_at: string;
  updated_at: string;
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
  theme: string;
  font_size: string;
  high_contrast: boolean;
  reduce_motion: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRelationship {
  id: string;
  patient_id: string;
  related_user_id: string;
  relationship_type: string;
  status: RelationshipStatus;
  provider_access_level?: ProviderAccessLevel;
  caregiver_access_level?: CaregiverAccessLevel;
  notes?: string;
  invited_by?: string;
  invited_at: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_start_date?: string;
  trial_end_date?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// FOOD SERVICE SCHEMA (V2.2.0)
// =============================================================================

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  category: FoodCategory;
  barcode?: string;
  fdc_id?: string;
  serving_size: number;
  serving_unit: PortionUnit;
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
  absorption_rate?: string;
  blood_sugar_impact: Intensity;
  insulin_demand: Intensity;
  data_source: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface UserFavoriteFood {
  id: string;
  user_id: string;
  food_id: string;
  notes?: string;
  custom_serving_size?: number;
  custom_serving_unit?: PortionUnit;
  times_logged: number;
  last_logged_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodPreparationMethod {
  id: string;
  food_id: string;
  method_name: string;
  description?: string;
  calories_multiplier: number;
  carbs_multiplier: number;
  fat_multiplier: number;
  protein_multiplier: number;
  gi_modifier: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// FOOD ANALYSIS SCHEMA (V2.3.0)
// =============================================================================

export interface FoodImage {
  id: string;
  user_id: string;
  original_filename?: string;
  file_size_bytes?: number;
  mime_type?: string;
  width?: number;
  height?: number;
  storage_url: string;
  storage_provider: string;
  storage_path?: string;
  taken_at?: string;
  location_data?: any;
  device_info?: any;
  processing_status: ProcessingStatus;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodAnalysisResult {
  id: string;
  user_id: string;
  image_id?: string;
  analysis_source: AnalysisSource;
  analysis_model?: string;
  analysis_version?: string;
  confidence_score?: number;
  total_foods_detected: number;
  processing_time_ms?: number;
  raw_response?: any;
  analysis_notes?: string;
  verification_status: VerificationStatus;
  user_feedback?: any;
  created_at: string;
  updated_at: string;
}

export interface AnalyzedFood {
  id: string;
  analysis_result_id: string;
  detected_name: string;
  category?: FoodCategory;
  confidence_score?: number;
  estimated_portion?: number;
  portion_unit: PortionUnit;
  portion_confidence?: number;
  estimated_calories?: number;
  estimated_carbs_g?: number;
  estimated_protein_g?: number;
  estimated_fat_g?: number;
  bounding_box?: any;
  visual_features?: any;
  matched_food_id?: string;
  match_confidence?: number;
  user_corrected_name?: string;
  user_corrected_portion?: number;
  user_corrected_unit?: PortionUnit;
  created_at: string;
  updated_at: string;
}

export interface AnalysisFeedback {
  id: string;
  user_id: string;
  analysis_result_id: string;
  overall_accuracy_rating?: number;
  food_identification_rating?: number;
  portion_estimation_rating?: number;
  missing_foods?: string[];
  incorrect_foods?: string[];
  comments?: string;
  feedback_type: string;
  created_at: string;
  updated_at: string;
}

export interface BarcodeScan {
  id: string;
  user_id: string;
  barcode_value: string;
  barcode_type?: string;
  scanned_at: string;
  device_info?: any;
  app_version?: string;
  product_found: boolean;
  matched_food_id?: string;
  external_api_response?: any;
  external_product_name?: string;
  external_brand?: string;
  user_added_to_log: boolean;
  user_created_food: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// LOGGING SERVICE SCHEMA (V2.4.0)
// =============================================================================

export interface FoodLog {
  id: string;
  user_id: string;
  meal_type: MealType;
  meal_time: string;
  meal_name?: string;
  total_calories: number;
  total_carbs_g: number;
  total_protein_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  location?: string;
  notes?: string;
  mood_before_meal?: string;
  mood_after_meal?: string;
  analysis_result_id?: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodLogEntry {
  id: string;
  food_log_id: string;
  food_id?: string;
  food_name: string;
  brand?: string;
  category?: FoodCategory;
  portion_size: number;
  portion_unit: PortionUnit;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  fiber_g: number;
  estimated_gi?: number;
  estimated_gl?: number;
  preparation_method?: string;
  cooking_method?: string;
  entry_source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GlucoseReading {
  id: string;
  user_id: string;
  glucose_value: number;
  glucose_unit: string;
  reading_time: string;
  reading_type: string;
  meal_relation?: string;
  minutes_after_meal?: number;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  reading_quality: string;
  notes?: string;
  symptoms?: string[];
  activity_level?: string;
  stress_level?: number;
  related_food_log_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InsulinDose {
  id: string;
  user_id: string;
  insulin_type: string;
  insulin_name?: string;
  dose_units: number;
  dose_time: string;
  dose_purpose: string;
  carbs_covered_g?: number;
  correction_target_glucose?: number;
  injection_site?: string;
  injection_method: string;
  carb_ratio?: number;
  correction_factor?: number;
  calculated_dose?: number;
  user_adjustment: number;
  notes?: string;
  pre_dose_glucose?: number;
  activity_planned?: string;
  related_food_log_id?: string;
  formula_calculation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_name?: string;
  duration_minutes: number;
  start_time: string;
  end_time?: string;
  intensity: Intensity;
  perceived_exertion?: number;
  calories_burned?: number;
  pre_activity_glucose?: number;
  post_activity_glucose?: number;
  glucose_trend?: string;
  heart_rate_avg?: number;
  heart_rate_max?: number;
  steps?: number;
  distance_km?: number;
  notes?: string;
  weather?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// FORMULA SERVICE SCHEMA (V2.5.0)
// =============================================================================

export interface Formula {
  id: string;
  name: string;
  formula_type: FormulaType;
  version: string;
  description?: string;
  formula_expression: string;
  input_parameters: any;
  output_parameters: any;
  is_active: boolean;
  is_default: boolean;
  complexity_level: Difficulty;
  clinical_basis?: string;
  recommended_for?: string[];
  contraindications?: string[];
  usage_count: number;
  accuracy_rating: number;
  created_at: string;
  updated_at: string;
}

export interface UserFormulaParameter {
  id: string;
  user_id: string;
  formula_id: string;
  parameter_values: any;
  total_uses: number;
  successful_uses: number;
  average_accuracy?: number;
  last_calibration_date?: string;
  auto_adjustment_enabled: boolean;
  learning_rate: number;
  is_preferred: boolean;
  confidence_level: number;
  notes?: string;
  custom_adjustments: any;
  created_at: string;
  updated_at: string;
}

export interface InsulinCalculation {
  id: string;
  user_id: string;
  formula_id: string;
  calculation_time: string;
  calculation_trigger: string;
  input_data: any;
  carbs_g?: number;
  current_glucose?: number;
  target_glucose?: number;
  recommended_dose: number;
  dose_breakdown: any;
  confidence_score?: number;
  user_accepted_dose?: boolean;
  actual_dose_given?: number;
  user_adjustment: number;
  adjustment_reason?: string;
  calculation_status: CalculationStatus;
  effectiveness_score?: number;
  glucose_1h_after?: number;
  glucose_2h_after?: number;
  glucose_3h_after?: number;
  calculation_time_ms?: number;
  error_message?: string;
  related_food_log_id?: string;
  related_insulin_dose_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FormulaEffectiveness {
  id: string;
  user_id: string;
  formula_id: string;
  analysis_period_start: string;
  analysis_period_end: string;
  total_calculations: number;
  successful_calculations: number;
  average_accuracy?: number;
  average_effectiveness?: number;
  target_range_hits: number;
  hypoglycemia_events: number;
  hyperglycemia_events: number;
  average_dose_difference?: number;
  dose_adjustment_frequency?: number;
  improvement_trend?: number;
  recommended_adjustments: any;
  confidence_interval?: number;
  sample_size_adequate: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormulaLearningData {
  id: string;
  user_id: string;
  formula_id: string;
  calculation_id: string;
  user_characteristics: any;
  contextual_factors: any;
  historical_patterns: any;
  actual_outcome: any;
  optimal_dose?: number;
  learning_weight: number;
  data_quality_score: number;
  outlier_score: number;
  anonymized: boolean;
  consent_for_research: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// MEAL PLANNING SCHEMA (V2.6.0)
// =============================================================================

export interface NutritionalGoal {
  id: string;
  user_id: string;
  goal_name: string;
  goal_type: string;
  is_active: boolean;
  target_calories?: number;
  target_carbs_g?: number;
  target_protein_g?: number;
  target_fat_g?: number;
  target_fiber_g?: number;
  breakfast_calories_pct: number;
  lunch_calories_pct: number;
  dinner_calories_pct: number;
  snack_calories_pct: number;
  dietary_restrictions?: string[];
  preferred_foods?: string[];
  disliked_foods?: string[];
  target_glycemic_load?: number;
  max_meal_carbs_g?: number;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  recipe_name: string;
  description?: string;
  cuisine_type?: string;
  meal_type?: MealType;
  servings: number;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  difficulty_level: Difficulty;
  user_rating?: number;
  instructions?: string[];
  notes?: string;
  calories_per_serving?: number;
  carbs_per_serving_g?: number;
  protein_per_serving_g?: number;
  fat_per_serving_g?: number;
  fiber_per_serving_g?: number;
  estimated_gi?: number;
  estimated_gl?: number;
  recipe_source?: string;
  source_url?: string;
  is_public: boolean;
  is_favorite: boolean;
  times_cooked: number;
  last_cooked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  food_id?: string;
  ingredient_name: string;
  quantity: number;
  unit: PortionUnit;
  preparation_note?: string;
  is_optional: boolean;
  ingredient_order: number;
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_template: boolean;
  nutritional_goal_id?: string;
  description?: string;
  notes?: string;
  auto_generate_shopping_list: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlannedMeal {
  id: string;
  meal_plan_id: string;
  meal_date: string;
  meal_type: MealType;
  meal_time?: string;
  recipe_id?: string;
  meal_name?: string;
  servings: number;
  planned_calories?: number;
  planned_carbs_g?: number;
  planned_protein_g?: number;
  planned_fat_g?: number;
  is_completed: boolean;
  completed_at?: string;
  notes?: string;
  modifications?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingList {
  id: string;
  user_id: string;
  meal_plan_id?: string;
  list_name: string;
  shopping_date?: string;
  store_name?: string;
  is_completed: boolean;
  completed_at?: string;
  total_estimated_cost?: number;
  total_items: number;
  completed_items: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingListItem {
  id: string;
  shopping_list_id: string;
  food_id?: string;
  item_name: string;
  quantity: number;
  unit: PortionUnit;
  brand_preference?: string;
  store_section?: string;
  estimated_cost?: number;
  is_completed: boolean;
  completed_at?: string;
  actual_cost?: number;
  notes?: string;
  item_order: number;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// =============================================================================
// COMPOSITE TYPES FOR API USAGE
// =============================================================================

export interface FoodAnalysisWithDetails extends FoodAnalysisResult {
  image?: FoodImage;
  analyzed_foods?: AnalyzedFood[];
}

export interface FoodLogWithAnalysis extends FoodLog {
  analysis?: FoodAnalysisResult;
}

export interface MealPlanWithMeals extends MealPlan {
  planned_meals?: (PlannedMeal & {
    planned_foods?: ShoppingListItem[];
  })[];
}

export interface FoodItemWithNutrition extends FoodItem {
  nutrition_facts?: NutritionFacts;
  glycemic_info?: GlycemicInfo;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients?: RecipeIngredient[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_active_at'>;
export type NewFoodItem = Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>;
export type NewFoodLog = Omit<FoodLog, 'id' | 'created_at' | 'updated_at'>;
export type NewGlucoseReading = Omit<GlucoseReading, 'id' | 'created_at' | 'updated_at'>;
export type NewInsulinDose = Omit<InsulinDose, 'id' | 'created_at' | 'updated_at'>;
export type NewUserPreferences = Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
export type NewUserDiabetesSettings = Omit<UserDiabetesSettings, 'id' | 'created_at' | 'updated_at'>;

// =============================================================================
// APP STATE TYPE
// =============================================================================

export interface AppState {
  user: User | null;
  glucoseReadings: Record<string, GlucoseReading>;
  insulinDoses: Record<string, InsulinDose>;
  userPreferences: UserPreferences | null;
  userDiabetesSettings: UserDiabetesSettings | null;
  foodLogs: Record<string, FoodLog>;
  foodItems: Record<string, FoodItem>;
  isLoading: boolean;
  error: string | null;
}