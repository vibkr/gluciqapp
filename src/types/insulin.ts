// Insulin calculation types

export interface InsulinProfile {
  carb_ratios: {
    time_start: string; // HH:MM format
    time_end: string;   // HH:MM format
    ratio: number;      // Grams of carbs per unit of insulin
  }[];
  sensitivity_factor: {
    time_start: string; // HH:MM format
    time_end: string;   // HH:MM format
    factor: number;     // mg/dL per unit of insulin
  }[];
  action_profile: {
    onset: number;      // Minutes until insulin starts working
    peak: number;       // Minutes to peak effect
    duration: number;   // Total minutes of action
  };
  safety_limits: {
    max_single_dose: number;    // Maximum units in single dose
    max_daily_dose: number;     // Maximum units per day
    min_carbs_for_dose: number; // Minimum carbs to dose for
  };
}

export interface InsulinCalculationInput {
  current_glucose?: number;     // Current BG reading (optional)
  target_glucose: number;       // Target BG value
  carbohydrates: number;        // Carbs to cover
  current_time: string;         // HH:MM format
  user_profile: InsulinProfile;
}

export interface InsulinCalculationResult {
  carb_dose: {
    units: number;
    ratio_used: number;
    confidence: 'high' | 'medium' | 'low';
  };
  correction_dose: {
    units: number;
    sensitivity_used: number;
    glucose_difference: number;
  };
  insulin_on_board: {
    active_units: number;
    remaining_action_time: number;
    recent_doses: {
      time: string;
      units: number;
      remaining_activity: number;
    }[];
  };
  total_recommendation: {
    units: number;
    breakdown: string;
    safety_warnings: string[];
    confidence_level: number; // 0-100
  };
  adjustment_options: {
    meal_fat_adjustment: number;
    exercise_planned: boolean;
    stress_illness: boolean;
  };
}

export interface StoredInsulinDose {
  id: string;
  user_id: string;
  timestamp: string;
  calculated_dose: number;
  user_final_dose: number;
  carbohydrates: number;
  glucose_reading?: number;
  notes?: string;
  calculation_details: InsulinCalculationResult;
}