-- Migration: Formula Service Schema
-- Version: 2.5.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: Insulin calculation formulas and effectiveness tracking

-- ============================================================================
-- FORMULA SERVICE SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS formula_service;

-- Formula definitions (insulin calculation algorithms)
CREATE TABLE formula_service.formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Formula identification
    name TEXT NOT NULL,
    formula_type formula_type_enum NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    description TEXT,
    
    -- Formula definition
    formula_expression TEXT NOT NULL, -- Mathematical expression or algorithm
    input_parameters JSONB NOT NULL DEFAULT '{}'::jsonb, -- Required input parameters
    output_parameters JSONB NOT NULL DEFAULT '{}'::jsonb, -- Output parameters
    
    -- Formula metadata
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    complexity_level difficulty_enum DEFAULT 'medium',
    
    -- Clinical information
    clinical_basis TEXT, -- Scientific basis for the formula
    recommended_for TEXT[], -- Patient types this formula is recommended for
    contraindications TEXT[], -- When not to use this formula
    
    -- Usage and validation
    usage_count INTEGER DEFAULT 0,
    accuracy_rating DECIMAL(3,2) DEFAULT 0.5 CHECK (accuracy_rating BETWEEN 0 AND 1),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT formula_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT formula_expression_not_empty CHECK (length(trim(formula_expression)) > 0)
);

-- User-specific formula parameters
CREATE TABLE formula_service.user_formula_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    formula_id UUID NOT NULL REFERENCES formula_service.formulas(id) ON DELETE CASCADE,
    
    -- Parameter values
    parameter_values JSONB NOT NULL DEFAULT '{}'::jsonb, -- User's specific parameter values
    
    -- Effectiveness tracking
    total_uses INTEGER DEFAULT 0,
    successful_uses INTEGER DEFAULT 0,
    average_accuracy DECIMAL(3,2),
    
    -- Learning and adaptation
    last_calibration_date TIMESTAMP WITH TIME ZONE,
    auto_adjustment_enabled BOOLEAN DEFAULT false,
    learning_rate DECIMAL(3,2) DEFAULT 0.1 CHECK (learning_rate BETWEEN 0 AND 1),
    
    -- User preferences
    is_preferred BOOLEAN DEFAULT false,
    confidence_level DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_level BETWEEN 0 AND 1),
    
    -- Notes and customizations
    notes TEXT,
    custom_adjustments JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_formula UNIQUE (user_id, formula_id)
);

-- Insulin calculation results
CREATE TABLE formula_service.insulin_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    formula_id UUID NOT NULL REFERENCES formula_service.formulas(id),
    
    -- Calculation context
    calculation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    calculation_trigger TEXT DEFAULT 'manual' CHECK (calculation_trigger IN ('manual', 'automatic', 'scheduled', 'meal_log')),
    
    -- Input values
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- All input parameters used
    carbs_g DECIMAL(8,2), -- Carbohydrates to cover
    current_glucose DECIMAL(5,1), -- Current glucose reading
    target_glucose DECIMAL(5,1), -- Target glucose level
    
    -- Calculation results
    recommended_dose DECIMAL(5,2) NOT NULL,
    dose_breakdown JSONB DEFAULT '{}'::jsonb, -- Breakdown of dose calculation
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
    
    -- User interaction
    user_accepted_dose BOOLEAN,
    actual_dose_given DECIMAL(5,2),
    user_adjustment DECIMAL(5,2) DEFAULT 0,
    adjustment_reason TEXT,
    
    -- Outcome tracking
    calculation_status calculation_status_enum DEFAULT 'completed',
    effectiveness_score DECIMAL(3,2), -- How well the dose worked (0-1)
    
    -- Follow-up glucose readings
    glucose_1h_after DECIMAL(5,1),
    glucose_2h_after DECIMAL(5,1),
    glucose_3h_after DECIMAL(5,1),
    
    -- Performance metrics
    calculation_time_ms INTEGER,
    error_message TEXT,
    
    -- Linked data
    related_food_log_id UUID, -- References logging_service.food_logs(id)
    related_insulin_dose_id UUID, -- References logging_service.insulin_doses(id)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT recommended_dose_positive CHECK (recommended_dose >= 0),
    CONSTRAINT actual_dose_positive CHECK (actual_dose_given IS NULL OR actual_dose_given >= 0),
    CONSTRAINT glucose_values_reasonable CHECK (
        (current_glucose IS NULL OR current_glucose BETWEEN 20 AND 600) AND
        (target_glucose IS NULL OR target_glucose BETWEEN 70 AND 200) AND
        (glucose_1h_after IS NULL OR glucose_1h_after BETWEEN 20 AND 600) AND
        (glucose_2h_after IS NULL OR glucose_2h_after BETWEEN 20 AND 600) AND
        (glucose_3h_after IS NULL OR glucose_3h_after BETWEEN 20 AND 600)
    )
);

-- Formula effectiveness tracking
CREATE TABLE formula_service.formula_effectiveness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    formula_id UUID NOT NULL REFERENCES formula_service.formulas(id),
    
    -- Time period for analysis
    analysis_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    analysis_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Effectiveness metrics
    total_calculations INTEGER DEFAULT 0,
    successful_calculations INTEGER DEFAULT 0,
    average_accuracy DECIMAL(3,2),
    average_effectiveness DECIMAL(3,2),
    
    -- Glucose outcome analysis
    target_range_hits INTEGER DEFAULT 0, -- Times glucose ended up in target range
    hypoglycemia_events INTEGER DEFAULT 0, -- Times glucose went too low
    hyperglycemia_events INTEGER DEFAULT 0, -- Times glucose went too high
    
    -- Dose accuracy analysis
    average_dose_difference DECIMAL(5,2), -- Difference between recommended and needed
    dose_adjustment_frequency DECIMAL(3,2), -- How often user adjusts dose
    
    -- Learning insights
    improvement_trend DECIMAL(3,2), -- Whether accuracy is improving over time
    recommended_adjustments JSONB DEFAULT '{}'::jsonb,
    
    -- Statistical confidence
    confidence_interval DECIMAL(3,2),
    sample_size_adequate BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT analysis_period_valid CHECK (analysis_period_end > analysis_period_start),
    CONSTRAINT effectiveness_metrics_valid CHECK (
        total_calculations >= 0 AND successful_calculations >= 0 AND
        successful_calculations <= total_calculations AND
        target_range_hits >= 0 AND hypoglycemia_events >= 0 AND
        hyperglycemia_events >= 0
    )
);

-- Formula learning data (for ML improvements)
CREATE TABLE formula_service.formula_learning_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References user_service.users(id)
    formula_id UUID NOT NULL REFERENCES formula_service.formulas(id),
    calculation_id UUID NOT NULL REFERENCES formula_service.insulin_calculations(id),
    
    -- Learning features
    user_characteristics JSONB DEFAULT '{}'::jsonb, -- Age, weight, diabetes type, etc.
    contextual_factors JSONB DEFAULT '{}'::jsonb, -- Time of day, activity, stress, etc.
    historical_patterns JSONB DEFAULT '{}'::jsonb, -- Past performance patterns
    
    -- Outcome data
    actual_outcome JSONB DEFAULT '{}'::jsonb, -- What actually happened
    optimal_dose DECIMAL(5,2), -- What dose would have been optimal
    learning_weight DECIMAL(3,2) DEFAULT 1.0, -- How much to weight this data point
    
    -- Data quality
    data_quality_score DECIMAL(3,2) DEFAULT 0.5 CHECK (data_quality_score BETWEEN 0 AND 1),
    outlier_score DECIMAL(3,2) DEFAULT 0.0 CHECK (outlier_score BETWEEN 0 AND 1),
    
    -- Privacy and consent
    anonymized BOOLEAN DEFAULT false,
    consent_for_research BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT optimal_dose_reasonable CHECK (optimal_dose IS NULL OR optimal_dose >= 0)
);

-- ============================================================================
-- INDEXES FOR FORMULA SERVICE
-- ============================================================================

-- Formulas indexes
CREATE INDEX idx_formulas_type ON formula_service.formulas(formula_type);
CREATE INDEX idx_formulas_active ON formula_service.formulas(is_active) WHERE is_active = true;
CREATE INDEX idx_formulas_default ON formula_service.formulas(is_default) WHERE is_default = true;
CREATE INDEX idx_formulas_complexity ON formula_service.formulas(complexity_level);
CREATE INDEX idx_formulas_usage ON formula_service.formulas(usage_count DESC);

-- User formula parameters indexes
CREATE INDEX idx_user_formula_parameters_user ON formula_service.user_formula_parameters(user_id);
CREATE INDEX idx_user_formula_parameters_formula ON formula_service.user_formula_parameters(formula_id);
CREATE INDEX idx_user_formula_parameters_preferred ON formula_service.user_formula_parameters(is_preferred) WHERE is_preferred = true;
CREATE INDEX idx_user_formula_parameters_accuracy ON formula_service.user_formula_parameters(average_accuracy DESC);

-- Insulin calculations indexes
CREATE INDEX idx_insulin_calculations_user_time ON formula_service.insulin_calculations(user_id, calculation_time DESC);
CREATE INDEX idx_insulin_calculations_formula ON formula_service.insulin_calculations(formula_id);
CREATE INDEX idx_insulin_calculations_status ON formula_service.insulin_calculations(calculation_status);
CREATE INDEX idx_insulin_calculations_trigger ON formula_service.insulin_calculations(calculation_trigger);
CREATE INDEX idx_insulin_calculations_food_log ON formula_service.insulin_calculations(related_food_log_id);
CREATE INDEX idx_insulin_calculations_effectiveness ON formula_service.insulin_calculations(effectiveness_score DESC);

-- Formula effectiveness indexes
CREATE INDEX idx_formula_effectiveness_user ON formula_service.formula_effectiveness(user_id);
CREATE INDEX idx_formula_effectiveness_formula ON formula_service.formula_effectiveness(formula_id);
CREATE INDEX idx_formula_effectiveness_period ON formula_service.formula_effectiveness(analysis_period_start, analysis_period_end);
CREATE INDEX idx_formula_effectiveness_accuracy ON formula_service.formula_effectiveness(average_accuracy DESC);

-- Formula learning data indexes
CREATE INDEX idx_formula_learning_data_user ON formula_service.formula_learning_data(user_id);
CREATE INDEX idx_formula_learning_data_formula ON formula_service.formula_learning_data(formula_id);
CREATE INDEX idx_formula_learning_data_calculation ON formula_service.formula_learning_data(calculation_id);
CREATE INDEX idx_formula_learning_data_quality ON formula_service.formula_learning_data(data_quality_score DESC);
CREATE INDEX idx_formula_learning_data_research ON formula_service.formula_learning_data(consent_for_research) WHERE consent_for_research = true;

-- ============================================================================
-- TRIGGERS FOR FORMULA SERVICE
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER formulas_updated_at BEFORE UPDATE ON formula_service.formulas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_formula_parameters_updated_at BEFORE UPDATE ON formula_service.user_formula_parameters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER insulin_calculations_updated_at BEFORE UPDATE ON formula_service.insulin_calculations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER formula_effectiveness_updated_at BEFORE UPDATE ON formula_service.formula_effectiveness
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER formula_learning_data_updated_at BEFORE UPDATE ON formula_service.formula_learning_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 