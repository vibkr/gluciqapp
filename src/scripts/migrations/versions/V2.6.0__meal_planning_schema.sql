-- Migration: Meal Planning Schema
-- Version: 2.6.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: Meal plans, recipes, shopping lists, and nutritional goals

-- ============================================================================
-- MEAL PLANNING SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS meal_planning;

-- User nutritional goals and preferences
CREATE TABLE meal_planning.nutritional_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Goal period
    goal_name TEXT NOT NULL,
    goal_type TEXT DEFAULT 'daily' CHECK (goal_type IN ('daily', 'weekly', 'monthly')),
    is_active BOOLEAN DEFAULT true,
    
    -- Macronutrient targets
    target_calories DECIMAL(8,2),
    target_carbs_g DECIMAL(8,2),
    target_protein_g DECIMAL(8,2),
    target_fat_g DECIMAL(8,2),
    target_fiber_g DECIMAL(8,2),
    
    -- Meal distribution
    breakfast_calories_pct DECIMAL(5,2) DEFAULT 25.0,
    lunch_calories_pct DECIMAL(5,2) DEFAULT 35.0,
    dinner_calories_pct DECIMAL(5,2) DEFAULT 30.0,
    snack_calories_pct DECIMAL(5,2) DEFAULT 10.0,
    
    -- Dietary preferences
    dietary_restrictions TEXT[],
    preferred_foods TEXT[],
    disliked_foods TEXT[],
    
    -- Glycemic targets
    target_glycemic_load DECIMAL(5,2),
    max_meal_carbs_g DECIMAL(8,2),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT goal_name_not_empty CHECK (length(trim(goal_name)) > 0),
    CONSTRAINT target_values_positive CHECK (
        (target_calories IS NULL OR target_calories > 0) AND
        (target_carbs_g IS NULL OR target_carbs_g >= 0) AND
        (target_protein_g IS NULL OR target_protein_g >= 0) AND
        (target_fat_g IS NULL OR target_fat_g >= 0) AND
        (target_fiber_g IS NULL OR target_fiber_g >= 0)
    ),
    CONSTRAINT meal_percentages_valid CHECK (
        breakfast_calories_pct + lunch_calories_pct + dinner_calories_pct + snack_calories_pct = 100.0
    )
);

-- Recipes created by users or imported
CREATE TABLE meal_planning.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Recipe basic info
    recipe_name TEXT NOT NULL,
    description TEXT,
    cuisine_type TEXT,
    meal_type meal_type_enum,
    
    -- Serving and timing
    servings INTEGER DEFAULT 1,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    total_time_minutes INTEGER,
    
    -- Difficulty and rating
    difficulty_level difficulty_enum DEFAULT 'medium',
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    
    -- Instructions
    instructions TEXT[],
    notes TEXT,
    
    -- Nutritional info (per serving)
    calories_per_serving DECIMAL(8,2),
    carbs_per_serving_g DECIMAL(8,2),
    protein_per_serving_g DECIMAL(8,2),
    fat_per_serving_g DECIMAL(8,2),
    fiber_per_serving_g DECIMAL(8,2),
    
    -- Glycemic information
    estimated_gi INTEGER,
    estimated_gl DECIMAL(5,2),
    
    -- Recipe metadata
    recipe_source TEXT, -- user_created, imported, ai_generated
    source_url TEXT,
    is_public BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    
    -- Usage tracking
    times_cooked INTEGER DEFAULT 0,
    last_cooked_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT recipe_name_not_empty CHECK (length(trim(recipe_name)) > 0),
    CONSTRAINT servings_positive CHECK (servings > 0),
    CONSTRAINT time_values_reasonable CHECK (
        (prep_time_minutes IS NULL OR prep_time_minutes >= 0) AND
        (cook_time_minutes IS NULL OR cook_time_minutes >= 0) AND
        (total_time_minutes IS NULL OR total_time_minutes >= 0)
    )
);

-- Ingredients for recipes
CREATE TABLE meal_planning.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES meal_planning.recipes(id) ON DELETE CASCADE,
    food_id UUID, -- References food_service.foods(id)
    
    -- Ingredient details
    ingredient_name TEXT NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    unit portion_unit_enum NOT NULL DEFAULT 'grams',
    
    -- Preparation details
    preparation_note TEXT, -- "chopped", "diced", "cooked", etc.
    is_optional BOOLEAN DEFAULT false,
    
    -- Ordering
    ingredient_order INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT ingredient_name_not_empty CHECK (length(trim(ingredient_name)) > 0),
    CONSTRAINT quantity_positive CHECK (quantity > 0),
    CONSTRAINT ingredient_order_positive CHECK (ingredient_order > 0)
);

-- Meal plans (weekly/monthly planning)
CREATE TABLE meal_planning.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    
    -- Plan details
    plan_name TEXT NOT NULL,
    plan_type TEXT DEFAULT 'weekly' CHECK (plan_type IN ('daily', 'weekly', 'monthly')),
    
    -- Date range
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Plan status
    is_active BOOLEAN DEFAULT true,
    is_template BOOLEAN DEFAULT false,
    
    -- Nutritional goals reference
    nutritional_goal_id UUID REFERENCES meal_planning.nutritional_goals(id),
    
    -- Plan metadata
    description TEXT,
    notes TEXT,
    
    -- Auto-generation settings
    auto_generate_shopping_list BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT plan_name_not_empty CHECK (length(trim(plan_name)) > 0),
    CONSTRAINT date_range_valid CHECK (end_date >= start_date)
);

-- Individual meal entries in meal plans
CREATE TABLE meal_planning.planned_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID NOT NULL REFERENCES meal_planning.meal_plans(id) ON DELETE CASCADE,
    
    -- Meal timing
    meal_date DATE NOT NULL,
    meal_type meal_type_enum NOT NULL,
    meal_time TIME,
    
    -- Meal content
    recipe_id UUID REFERENCES meal_planning.recipes(id),
    meal_name TEXT, -- For non-recipe meals
    servings DECIMAL(5,2) DEFAULT 1,
    
    -- Nutritional planning
    planned_calories DECIMAL(8,2),
    planned_carbs_g DECIMAL(8,2),
    planned_protein_g DECIMAL(8,2),
    planned_fat_g DECIMAL(8,2),
    
    -- Meal status
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes and modifications
    notes TEXT,
    modifications TEXT, -- User modifications to the recipe
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT servings_positive CHECK (servings > 0),
    CONSTRAINT meal_name_or_recipe CHECK (
        (recipe_id IS NOT NULL) OR (meal_name IS NOT NULL AND length(trim(meal_name)) > 0)
    )
);

-- Shopping lists generated from meal plans
CREATE TABLE meal_planning.shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    meal_plan_id UUID REFERENCES meal_planning.meal_plans(id),
    
    -- List details
    list_name TEXT NOT NULL,
    shopping_date DATE,
    store_name TEXT,
    
    -- List status
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Totals
    total_estimated_cost DECIMAL(8,2),
    total_items INTEGER DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT list_name_not_empty CHECK (length(trim(list_name)) > 0),
    CONSTRAINT cost_non_negative CHECK (total_estimated_cost IS NULL OR total_estimated_cost >= 0),
    CONSTRAINT item_counts_valid CHECK (
        total_items >= 0 AND completed_items >= 0 AND completed_items <= total_items
    )
);

-- Individual items in shopping lists
CREATE TABLE meal_planning.shopping_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_list_id UUID NOT NULL REFERENCES meal_planning.shopping_lists(id) ON DELETE CASCADE,
    food_id UUID, -- References food_service.foods(id)
    
    -- Item details
    item_name TEXT NOT NULL,
    quantity DECIMAL(8,2) NOT NULL,
    unit portion_unit_enum NOT NULL DEFAULT 'grams',
    
    -- Shopping details
    brand_preference TEXT,
    store_section TEXT, -- produce, dairy, meat, etc.
    estimated_cost DECIMAL(8,2),
    
    -- Status
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_cost DECIMAL(8,2),
    
    -- Notes
    notes TEXT,
    
    -- Ordering
    item_order INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT item_name_not_empty CHECK (length(trim(item_name)) > 0),
    CONSTRAINT quantity_positive CHECK (quantity > 0),
    CONSTRAINT costs_non_negative CHECK (
        (estimated_cost IS NULL OR estimated_cost >= 0) AND
        (actual_cost IS NULL OR actual_cost >= 0)
    )
);

-- ============================================================================
-- INDEXES FOR MEAL PLANNING
-- ============================================================================

-- Nutritional goals indexes
CREATE INDEX idx_nutritional_goals_user ON meal_planning.nutritional_goals(user_id);
CREATE INDEX idx_nutritional_goals_active ON meal_planning.nutritional_goals(is_active) WHERE is_active = true;
CREATE INDEX idx_nutritional_goals_type ON meal_planning.nutritional_goals(goal_type);

-- Recipes indexes
CREATE INDEX idx_recipes_user ON meal_planning.recipes(user_id);
CREATE INDEX idx_recipes_meal_type ON meal_planning.recipes(meal_type);
CREATE INDEX idx_recipes_cuisine ON meal_planning.recipes(cuisine_type);
CREATE INDEX idx_recipes_difficulty ON meal_planning.recipes(difficulty_level);
CREATE INDEX idx_recipes_rating ON meal_planning.recipes(user_rating DESC);
CREATE INDEX idx_recipes_public ON meal_planning.recipes(is_public) WHERE is_public = true;
CREATE INDEX idx_recipes_favorite ON meal_planning.recipes(is_favorite) WHERE is_favorite = true;
CREATE INDEX idx_recipes_times_cooked ON meal_planning.recipes(times_cooked DESC);

-- Recipe ingredients indexes
CREATE INDEX idx_recipe_ingredients_recipe ON meal_planning.recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_food ON meal_planning.recipe_ingredients(food_id);
CREATE INDEX idx_recipe_ingredients_order ON meal_planning.recipe_ingredients(recipe_id, ingredient_order);

-- Meal plans indexes
CREATE INDEX idx_meal_plans_user ON meal_planning.meal_plans(user_id);
CREATE INDEX idx_meal_plans_active ON meal_planning.meal_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_meal_plans_date_range ON meal_planning.meal_plans(start_date, end_date);
CREATE INDEX idx_meal_plans_type ON meal_planning.meal_plans(plan_type);
CREATE INDEX idx_meal_plans_template ON meal_planning.meal_plans(is_template) WHERE is_template = true;

-- Planned meals indexes
CREATE INDEX idx_planned_meals_meal_plan ON meal_planning.planned_meals(meal_plan_id);
CREATE INDEX idx_planned_meals_date_type ON meal_planning.planned_meals(meal_date, meal_type);
CREATE INDEX idx_planned_meals_recipe ON meal_planning.planned_meals(recipe_id);
CREATE INDEX idx_planned_meals_completed ON meal_planning.planned_meals(is_completed);

-- Shopping lists indexes
CREATE INDEX idx_shopping_lists_user ON meal_planning.shopping_lists(user_id);
CREATE INDEX idx_shopping_lists_meal_plan ON meal_planning.shopping_lists(meal_plan_id);
CREATE INDEX idx_shopping_lists_date ON meal_planning.shopping_lists(shopping_date);
CREATE INDEX idx_shopping_lists_completed ON meal_planning.shopping_lists(is_completed);

-- Shopping list items indexes
CREATE INDEX idx_shopping_list_items_list ON meal_planning.shopping_list_items(shopping_list_id);
CREATE INDEX idx_shopping_list_items_food ON meal_planning.shopping_list_items(food_id);
CREATE INDEX idx_shopping_list_items_section ON meal_planning.shopping_list_items(store_section);
CREATE INDEX idx_shopping_list_items_completed ON meal_planning.shopping_list_items(is_completed);
CREATE INDEX idx_shopping_list_items_order ON meal_planning.shopping_list_items(shopping_list_id, item_order);

-- ============================================================================
-- TRIGGERS FOR MEAL PLANNING
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER nutritional_goals_updated_at BEFORE UPDATE ON meal_planning.nutritional_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER recipes_updated_at BEFORE UPDATE ON meal_planning.recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER recipe_ingredients_updated_at BEFORE UPDATE ON meal_planning.recipe_ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER meal_plans_updated_at BEFORE UPDATE ON meal_planning.meal_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER planned_meals_updated_at BEFORE UPDATE ON meal_planning.planned_meals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER shopping_lists_updated_at BEFORE UPDATE ON meal_planning.shopping_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER shopping_list_items_updated_at BEFORE UPDATE ON meal_planning.shopping_list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 