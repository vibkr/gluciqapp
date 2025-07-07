-- Migration: Logging Service Schema
-- Version: 2.4.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: Food logs, glucose readings, insulin doses, and health tracking

-- ============================================================================
-- LOGGING SERVICE SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS logging_service;

-- Food logs (meal entries)
CREATE TABLE logging_service.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Meal information
    meal_type meal_type_enum NOT NULL,
    meal_time TIMESTAMP WITH TIME ZONE NOT NULL,
    meal_name TEXT, -- Optional custom meal name
    
    -- Totals (calculated from food_log_entries)
    total_calories DECIMAL(8,2) DEFAULT 0,
    total_carbs_g DECIMAL(8,2) DEFAULT 0,
    total_protein_g DECIMAL(8,2) DEFAULT 0,
    total_fat_g DECIMAL(8,2) DEFAULT 0,
    total_fiber_g DECIMAL(8,2) DEFAULT 0,
    
    -- Meal context
    location TEXT,
    notes TEXT,
    mood_before_meal TEXT,
    mood_after_meal TEXT,
    
    -- Analysis and AI insights
    analysis_result_id UUID, -- References food_analysis.food_analysis_results(id)
    ai_generated BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT meal_time_reasonable CHECK (meal_time <= now() + INTERVAL '1 day'),
    CONSTRAINT total_values_non_negative CHECK (
        total_calories >= 0 AND total_carbs_g >= 0 AND total_protein_g >= 0 AND
        total_fat_g >= 0 AND total_fiber_g >= 0
    )
);

-- Individual food items within a meal
CREATE TABLE logging_service.food_log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_log_id UUID NOT NULL REFERENCES logging_service.food_logs(id) ON DELETE CASCADE,
    food_id UUID, -- References food_service.foods(id)
    
    -- Food details
    food_name TEXT NOT NULL, -- Stored name (in case food is deleted)
    brand TEXT,
    category food_category_enum,
    
    -- Portion information
    portion_size DECIMAL(8,2) NOT NULL,
    portion_unit portion_unit_enum NOT NULL DEFAULT 'grams',
    
    -- Nutritional values (per this portion)
    calories DECIMAL(8,2) DEFAULT 0,
    carbs_g DECIMAL(8,2) DEFAULT 0,
    protein_g DECIMAL(8,2) DEFAULT 0,
    fat_g DECIMAL(8,2) DEFAULT 0,
    fiber_g DECIMAL(8,2) DEFAULT 0,
    
    -- Glycemic information
    estimated_gi INTEGER,
    estimated_gl DECIMAL(5,2),
    
    -- Entry metadata
    preparation_method TEXT,
    cooking_method TEXT,
    entry_source TEXT DEFAULT 'manual' CHECK (entry_source IN ('manual', 'barcode', 'ai_analysis', 'recipe')),
    
    -- User notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT food_name_not_empty CHECK (length(trim(food_name)) > 0),
    CONSTRAINT portion_size_positive CHECK (portion_size > 0),
    CONSTRAINT nutritional_values_non_negative CHECK (
        calories >= 0 AND carbs_g >= 0 AND protein_g >= 0 AND
        fat_g >= 0 AND fiber_g >= 0
    )
);

-- Glucose readings
CREATE TABLE logging_service.glucose_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Reading details
    glucose_value DECIMAL(5,1) NOT NULL,
    glucose_unit TEXT NOT NULL DEFAULT 'mg/dL' CHECK (glucose_unit IN ('mg/dL', 'mmol/L')),
    reading_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Reading context
    reading_type TEXT NOT NULL CHECK (reading_type IN (
        'fasting', 'pre_meal', 'post_meal', 'bedtime', 'random', 
        'pre_exercise', 'post_exercise', 'sick_day', 'stress'
    )),
    meal_relation TEXT CHECK (meal_relation IN ('before_meal', 'after_meal', 'unrelated')),
    minutes_after_meal INTEGER,
    
    -- Device information
    device_type TEXT DEFAULT 'glucometer' CHECK (device_type IN ('glucometer', 'cgm', 'manual')),
    device_brand TEXT,
    device_model TEXT,
    
    -- Reading quality
    reading_quality TEXT DEFAULT 'good' CHECK (reading_quality IN ('good', 'questionable', 'poor')),
    notes TEXT,
    
    -- Symptoms and context
    symptoms TEXT[],
    activity_level TEXT CHECK (activity_level IN ('resting', 'light', 'moderate', 'vigorous')),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    
    -- Linked data
    related_food_log_id UUID REFERENCES logging_service.food_logs(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT glucose_value_reasonable CHECK (
        (glucose_unit = 'mg/dL' AND glucose_value BETWEEN 20 AND 600) OR
        (glucose_unit = 'mmol/L' AND glucose_value BETWEEN 1.1 AND 33.3)
    ),
    CONSTRAINT reading_time_reasonable CHECK (reading_time <= now() + INTERVAL '1 hour'),
    CONSTRAINT minutes_after_meal_reasonable CHECK (
        minutes_after_meal IS NULL OR minutes_after_meal BETWEEN 0 AND 480
    )
);

-- Insulin doses
CREATE TABLE logging_service.insulin_doses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Dose details
    insulin_type TEXT NOT NULL CHECK (insulin_type IN ('rapid_acting', 'short_acting', 'intermediate', 'long_acting', 'mixed')),
    insulin_name TEXT, -- Brand/product name
    dose_units DECIMAL(5,2) NOT NULL,
    dose_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Dose purpose and context
    dose_purpose TEXT NOT NULL CHECK (dose_purpose IN ('meal_bolus', 'correction_bolus', 'basal', 'mixed')),
    carbs_covered_g DECIMAL(8,2), -- For meal bolus
    correction_target_glucose DECIMAL(5,1), -- For correction bolus
    
    -- Injection details
    injection_site TEXT CHECK (injection_site IN ('abdomen', 'thigh', 'arm', 'buttocks', 'other')),
    injection_method TEXT DEFAULT 'pen' CHECK (injection_method IN ('pen', 'syringe', 'pump', 'inhaled')),
    
    -- Calculation details
    carb_ratio DECIMAL(5,2), -- Units per gram of carbs
    correction_factor DECIMAL(5,2), -- Points per unit
    calculated_dose DECIMAL(5,2), -- What the formula suggested
    user_adjustment DECIMAL(5,2) DEFAULT 0, -- User's adjustment to calculated dose
    
    -- Context and notes
    notes TEXT,
    pre_dose_glucose DECIMAL(5,1),
    activity_planned TEXT,
    
    -- Linked data
    related_food_log_id UUID REFERENCES logging_service.food_logs(id),
    formula_calculation_id UUID, -- References formula_service.insulin_calculations(id)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT dose_units_positive CHECK (dose_units > 0),
    CONSTRAINT dose_time_reasonable CHECK (dose_time <= now() + INTERVAL '1 hour'),
    CONSTRAINT carbs_covered_reasonable CHECK (carbs_covered_g IS NULL OR carbs_covered_g >= 0),
    CONSTRAINT ratios_positive CHECK (
        (carb_ratio IS NULL OR carb_ratio > 0) AND
        (correction_factor IS NULL OR correction_factor > 0)
    )
);

-- Exercise and activity logs
CREATE TABLE logging_service.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Activity details
    activity_type TEXT NOT NULL,
    activity_name TEXT,
    duration_minutes INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Intensity and effort
    intensity intensity_enum DEFAULT 'moderate',
    perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
    calories_burned INTEGER,
    
    -- Glucose impact
    pre_activity_glucose DECIMAL(5,1),
    post_activity_glucose DECIMAL(5,1),
    glucose_trend TEXT CHECK (glucose_trend IN ('rising', 'stable', 'falling')),
    
    -- Additional metrics
    heart_rate_avg INTEGER,
    heart_rate_max INTEGER,
    steps INTEGER,
    distance_km DECIMAL(6,2),
    
    -- Notes and context
    notes TEXT,
    weather TEXT,
    location TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT start_time_reasonable CHECK (start_time <= now() + INTERVAL '1 hour'),
    CONSTRAINT end_time_after_start CHECK (end_time IS NULL OR end_time >= start_time),
    CONSTRAINT calories_reasonable CHECK (calories_burned IS NULL OR calories_burned >= 0)
);

-- ============================================================================
-- INDEXES FOR LOGGING SERVICE
-- ============================================================================

-- Food logs indexes
CREATE INDEX idx_food_logs_user_time ON logging_service.food_logs(user_id, meal_time DESC);
CREATE INDEX idx_food_logs_meal_type ON logging_service.food_logs(meal_type);
CREATE INDEX idx_food_logs_meal_time ON logging_service.food_logs(meal_time DESC);
CREATE INDEX idx_food_logs_analysis_result ON logging_service.food_logs(analysis_result_id);
CREATE INDEX idx_food_logs_ai_generated ON logging_service.food_logs(ai_generated) WHERE ai_generated = true;

-- Food log entries indexes
CREATE INDEX idx_food_log_entries_food_log ON logging_service.food_log_entries(food_log_id);
CREATE INDEX idx_food_log_entries_food_id ON logging_service.food_log_entries(food_id);
CREATE INDEX idx_food_log_entries_category ON logging_service.food_log_entries(category);
CREATE INDEX idx_food_log_entries_source ON logging_service.food_log_entries(entry_source);

-- Glucose readings indexes
CREATE INDEX idx_glucose_readings_user_time ON logging_service.glucose_readings(user_id, reading_time DESC);
CREATE INDEX idx_glucose_readings_type ON logging_service.glucose_readings(reading_type);
CREATE INDEX idx_glucose_readings_value ON logging_service.glucose_readings(glucose_value);
CREATE INDEX idx_glucose_readings_device ON logging_service.glucose_readings(device_type);
CREATE INDEX idx_glucose_readings_food_log ON logging_service.glucose_readings(related_food_log_id);

-- Insulin doses indexes
CREATE INDEX idx_insulin_doses_user_time ON logging_service.insulin_doses(user_id, dose_time DESC);
CREATE INDEX idx_insulin_doses_type ON logging_service.insulin_doses(insulin_type);
CREATE INDEX idx_insulin_doses_purpose ON logging_service.insulin_doses(dose_purpose);
CREATE INDEX idx_insulin_doses_food_log ON logging_service.insulin_doses(related_food_log_id);
CREATE INDEX idx_insulin_doses_calculation ON logging_service.insulin_doses(formula_calculation_id);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_time ON logging_service.activity_logs(user_id, start_time DESC);
CREATE INDEX idx_activity_logs_type ON logging_service.activity_logs(activity_type);
CREATE INDEX idx_activity_logs_intensity ON logging_service.activity_logs(intensity);
CREATE INDEX idx_activity_logs_duration ON logging_service.activity_logs(duration_minutes);

-- ============================================================================
-- TRIGGERS FOR LOGGING SERVICE
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER food_logs_updated_at BEFORE UPDATE ON logging_service.food_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER food_log_entries_updated_at BEFORE UPDATE ON logging_service.food_log_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER glucose_readings_updated_at BEFORE UPDATE ON logging_service.glucose_readings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER insulin_doses_updated_at BEFORE UPDATE ON logging_service.insulin_doses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER activity_logs_updated_at BEFORE UPDATE ON logging_service.activity_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 