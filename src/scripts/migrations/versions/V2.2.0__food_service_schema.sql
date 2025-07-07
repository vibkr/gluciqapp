-- Migration: Food Service Schema
-- Version: 2.2.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: Complete food service schema with foods, nutrition facts, glycemic info, and user favorites

-- ============================================================================
-- FOOD SERVICE SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS food_service;

-- Foods table (comprehensive food database)
CREATE TABLE food_service.foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic food information
    name TEXT NOT NULL,
    brand TEXT,
    description TEXT,
    category food_category_enum NOT NULL,
    
    -- Identifiers
    barcode TEXT UNIQUE,
    fdc_id TEXT, -- USDA FoodData Central ID
    
    -- Serving information
    serving_size DECIMAL(8,2) NOT NULL DEFAULT 100.0,
    serving_unit portion_unit_enum NOT NULL DEFAULT 'grams',
    
    -- Verification and quality
    is_verified BOOLEAN DEFAULT false,
    verification_source TEXT,
    data_source TEXT DEFAULT 'user_input',
    
    -- Search and matching
    search_terms TEXT[], -- Additional search terms
    aliases TEXT[], -- Alternative names
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Indexes for full-text search
    CONSTRAINT foods_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT foods_serving_size_positive CHECK (serving_size > 0)
);

-- Nutrition facts table
CREATE TABLE food_service.nutrition_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_id UUID NOT NULL REFERENCES food_service.foods(id) ON DELETE CASCADE,
    
    -- Macronutrients (per serving)
    calories DECIMAL(8,2) DEFAULT 0,
    protein_g DECIMAL(8,2) DEFAULT 0,
    carbohydrates_g DECIMAL(8,2) DEFAULT 0,
    fiber_g DECIMAL(8,2) DEFAULT 0,
    sugars_g DECIMAL(8,2) DEFAULT 0,
    fat_g DECIMAL(8,2) DEFAULT 0,
    saturated_fat_g DECIMAL(8,2) DEFAULT 0,
    
    -- Micronutrients
    sodium_mg DECIMAL(8,2) DEFAULT 0,
    potassium_mg DECIMAL(8,2) DEFAULT 0,
    cholesterol_mg DECIMAL(8,2) DEFAULT 0,
    
    -- Vitamins (optional)
    vitamin_a_iu DECIMAL(8,2),
    vitamin_c_mg DECIMAL(8,2),
    calcium_mg DECIMAL(8,2),
    iron_mg DECIMAL(8,2),
    
    -- Data quality
    data_source TEXT DEFAULT 'user_input',
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_nutrition_facts UNIQUE (food_id),
    CONSTRAINT nutrition_values_non_negative CHECK (
        calories >= 0 AND protein_g >= 0 AND carbohydrates_g >= 0 AND
        fiber_g >= 0 AND sugars_g >= 0 AND fat_g >= 0 AND
        saturated_fat_g >= 0 AND sodium_mg >= 0 AND potassium_mg >= 0 AND
        cholesterol_mg >= 0
    )
);

-- Glycemic information table
CREATE TABLE food_service.glycemic_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_id UUID NOT NULL REFERENCES food_service.foods(id) ON DELETE CASCADE,
    
    -- Glycemic data
    glycemic_index INTEGER CHECK (glycemic_index BETWEEN 0 AND 100),
    glycemic_load DECIMAL(5,2) CHECK (glycemic_load >= 0),
    
    -- Digestibility and absorption
    digestible_carbs_g DECIMAL(8,2),
    absorption_rate TEXT CHECK (absorption_rate IN ('slow', 'medium', 'fast')),
    
    -- Impact ratings
    blood_sugar_impact intensity_enum DEFAULT 'moderate',
    insulin_demand intensity_enum DEFAULT 'moderate',
    
    -- Data source and confidence
    data_source TEXT DEFAULT 'estimated',
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_glycemic_info UNIQUE (food_id)
);

-- User favorite foods
CREATE TABLE food_service.user_favorite_foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    food_id UUID NOT NULL REFERENCES food_service.foods(id) ON DELETE CASCADE,
    
    -- Favorite details
    notes TEXT,
    custom_serving_size DECIMAL(8,2),
    custom_serving_unit portion_unit_enum,
    
    -- Frequency tracking
    times_logged INTEGER DEFAULT 0,
    last_logged_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_favorite_food UNIQUE (user_id, food_id),
    CONSTRAINT custom_serving_size_positive CHECK (custom_serving_size IS NULL OR custom_serving_size > 0)
);

-- Food preparation methods
CREATE TABLE food_service.food_preparation_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_id UUID NOT NULL REFERENCES food_service.foods(id) ON DELETE CASCADE,
    
    -- Preparation details
    method_name TEXT NOT NULL,
    description TEXT,
    
    -- Nutritional impact
    calories_multiplier DECIMAL(4,2) DEFAULT 1.0,
    carbs_multiplier DECIMAL(4,2) DEFAULT 1.0,
    fat_multiplier DECIMAL(4,2) DEFAULT 1.0,
    protein_multiplier DECIMAL(4,2) DEFAULT 1.0,
    
    -- Glycemic impact
    gi_modifier INTEGER DEFAULT 0, -- +/- adjustment to glycemic index
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT preparation_method_name_not_empty CHECK (length(trim(method_name)) > 0),
    CONSTRAINT multipliers_positive CHECK (
        calories_multiplier > 0 AND carbs_multiplier >= 0 AND 
        fat_multiplier >= 0 AND protein_multiplier >= 0
    )
);

-- ============================================================================
-- INDEXES FOR FOOD SERVICE
-- ============================================================================

-- Foods table indexes
CREATE INDEX idx_foods_name ON food_service.foods(name);
CREATE INDEX idx_foods_name_trgm ON food_service.foods USING gin(name gin_trgm_ops);
CREATE INDEX idx_foods_category ON food_service.foods(category);
CREATE INDEX idx_foods_barcode ON food_service.foods(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_foods_verification_status ON food_service.foods(is_verified);
CREATE INDEX idx_foods_brand ON food_service.foods(brand) WHERE brand IS NOT NULL;
CREATE INDEX idx_foods_fdc_id ON food_service.foods(fdc_id) WHERE fdc_id IS NOT NULL;

-- Nutrition facts indexes
CREATE INDEX idx_nutrition_facts_food_id ON food_service.nutrition_facts(food_id);
CREATE INDEX idx_nutrition_facts_calories ON food_service.nutrition_facts(calories DESC);
CREATE INDEX idx_nutrition_facts_carbs ON food_service.nutrition_facts(carbohydrates_g DESC);
CREATE INDEX idx_nutrition_facts_protein ON food_service.nutrition_facts(protein_g DESC);

-- Glycemic info indexes
CREATE INDEX idx_glycemic_info_food_id ON food_service.glycemic_info(food_id);
CREATE INDEX idx_glycemic_info_gi ON food_service.glycemic_info(glycemic_index);
CREATE INDEX idx_glycemic_info_gl ON food_service.glycemic_info(glycemic_load);
CREATE INDEX idx_glycemic_info_impact ON food_service.glycemic_info(blood_sugar_impact);

-- User favorite foods indexes
CREATE INDEX idx_user_favorite_foods_user_id ON food_service.user_favorite_foods(user_id);
CREATE INDEX idx_user_favorite_foods_food_id ON food_service.user_favorite_foods(food_id);
CREATE INDEX idx_user_favorite_foods_times_logged ON food_service.user_favorite_foods(times_logged DESC);
CREATE INDEX idx_user_favorite_foods_last_logged ON food_service.user_favorite_foods(last_logged_at DESC);

-- Food preparation methods indexes
CREATE INDEX idx_food_preparation_methods_food_id ON food_service.food_preparation_methods(food_id);
CREATE INDEX idx_food_preparation_methods_method ON food_service.food_preparation_methods(method_name);

-- ============================================================================
-- TRIGGERS FOR FOOD SERVICE
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER foods_updated_at BEFORE UPDATE ON food_service.foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER nutrition_facts_updated_at BEFORE UPDATE ON food_service.nutrition_facts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER glycemic_info_updated_at BEFORE UPDATE ON food_service.glycemic_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_favorite_foods_updated_at BEFORE UPDATE ON food_service.user_favorite_foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER food_preparation_methods_updated_at BEFORE UPDATE ON food_service.food_preparation_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 