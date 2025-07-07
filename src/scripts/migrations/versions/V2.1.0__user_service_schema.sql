-- Migration: User Service Schema
-- Version: 2.1.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: Complete user service schema with users, diabetes settings, and preferences

-- ============================================================================
-- USER SERVICE SCHEMA
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS user_service;

-- Basic Users table (clean, no Clerk integration for now)
CREATE TABLE user_service.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic authentication (prepared for future Clerk integration)
    auth_user_id TEXT UNIQUE, -- Future Clerk integration
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT false,
    
    -- Basic profile
    display_name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    
    -- Program and medical information
    user_role user_role_enum NOT NULL DEFAULT 'patient',
    program_type program_type_enum,
    diabetes_type diabetes_type_enum NOT NULL DEFAULT 'type1',
    diagnosis_date DATE,
    
    -- Physical metrics
    height_cm INTEGER CHECK (height_cm BETWEEN 50 AND 300),
    current_weight_kg DECIMAL(5,2) CHECK (current_weight_kg BETWEEN 10 AND 500),
    target_weight_kg DECIMAL(5,2) CHECK (target_weight_kg BETWEEN 10 AND 500),
    
    -- User preferences
    preferred_units TEXT DEFAULT 'metric', -- metric/imperial
    glucose_unit TEXT DEFAULT 'mg/dL' CHECK (glucose_unit IN ('mg/dL', 'mmol/L')),
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    
    -- Device integration
    has_cgm BOOLEAN DEFAULT false,
    cgm_brand TEXT,
    has_insulin_pump BOOLEAN DEFAULT false,
    insulin_pump_brand TEXT,
    
    -- Goals and targets
    goal_a1c DECIMAL(3,1) CHECK (goal_a1c BETWEEN 4.0 AND 15.0),
    daily_step_goal INTEGER DEFAULT 8000,
    weekly_exercise_sessions INTEGER DEFAULT 3,
    
    -- Emergency contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    
    -- Account and onboarding
    is_active BOOLEAN DEFAULT true,
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Constraints
    CONSTRAINT valid_age CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE - INTERVAL '1 year'),
    CONSTRAINT valid_program_type CHECK (
        (user_role = 'patient' AND program_type IS NOT NULL) OR 
        (user_role != 'patient')
    )
);

-- User diabetes settings
CREATE TABLE user_service.user_diabetes_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    
    -- Insulin ratios (time-based)
    carb_ratios JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {time_start, time_end, ratio}
    correction_factors JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {time_start, time_end, factor}
    
    -- Target glucose ranges
    target_glucose_min DECIMAL(5,1) DEFAULT 80.0,
    target_glucose_max DECIMAL(5,1) DEFAULT 180.0,
    
    -- Insulin settings
    insulin_duration_hours DECIMAL(3,1) DEFAULT 4.0, -- Duration of insulin action
    insulin_onset_minutes INTEGER DEFAULT 15,
    
    -- Safety settings
    max_bolus_units DECIMAL(5,1) DEFAULT 10.0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_diabetes_settings UNIQUE (user_id)
);

-- User preferences
CREATE TABLE user_service.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    
    -- Notification preferences
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Reminder settings
    glucose_reminders BOOLEAN DEFAULT true,
    insulin_reminders BOOLEAN DEFAULT true,
    meal_reminders BOOLEAN DEFAULT false,
    
    -- Privacy settings
    data_sharing_enabled BOOLEAN DEFAULT false,
    analytics_enabled BOOLEAN DEFAULT true,
    
    -- App preferences
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    
    -- Accessibility
    high_contrast BOOLEAN DEFAULT false,
    reduce_motion BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- User relationships (healthcare providers, caregivers)
CREATE TABLE user_service.user_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    related_user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    
    -- Relationship details
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('healthcare_provider', 'caregiver')),
    status relationship_status_enum NOT NULL DEFAULT 'pending',
    
    -- Access levels
    provider_access_level provider_access_level_enum,
    caregiver_access_level caregiver_access_level_enum,
    
    -- Metadata
    notes TEXT,
    invited_by UUID REFERENCES user_service.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_relationship UNIQUE (patient_id, related_user_id),
    CONSTRAINT no_self_relationship CHECK (patient_id != related_user_id),
    CONSTRAINT valid_access_level CHECK (
        (relationship_type = 'healthcare_provider' AND provider_access_level IS NOT NULL) OR
        (relationship_type = 'caregiver' AND caregiver_access_level IS NOT NULL)
    )
);

-- User subscriptions
CREATE TABLE user_service.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_service.users(id) ON DELETE CASCADE,
    
    -- Subscription details
    subscription_tier subscription_tier_enum NOT NULL DEFAULT 'free',
    subscription_status subscription_status_enum NOT NULL DEFAULT 'active',
    
    -- Billing information
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Dates
    trial_start_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- ============================================================================
-- INDEXES FOR USER SERVICE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON user_service.users(email) WHERE is_active = true;
CREATE INDEX idx_users_auth_user_id ON user_service.users(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX idx_users_program_type ON user_service.users(program_type);
CREATE INDEX idx_users_diabetes_type ON user_service.users(diabetes_type);
CREATE INDEX idx_users_created_at ON user_service.users(created_at DESC);
CREATE INDEX idx_users_last_active ON user_service.users(last_active_at DESC) WHERE is_active = true;

-- User diabetes settings indexes
CREATE INDEX idx_user_diabetes_settings_user_id ON user_service.user_diabetes_settings(user_id);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_service.user_preferences(user_id);

-- User relationships indexes
CREATE INDEX idx_user_relationships_patient ON user_service.user_relationships(patient_id);
CREATE INDEX idx_user_relationships_related_user ON user_service.user_relationships(related_user_id);
CREATE INDEX idx_user_relationships_type ON user_service.user_relationships(relationship_type);
CREATE INDEX idx_user_relationships_status ON user_service.user_relationships(status);

-- User subscriptions indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_service.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_tier ON user_service.user_subscriptions(subscription_tier);
CREATE INDEX idx_user_subscriptions_status ON user_service.user_subscriptions(subscription_status);

-- ============================================================================
-- TRIGGERS FOR USER SERVICE
-- ============================================================================

-- Updated_at triggers
CREATE TRIGGER users_updated_at BEFORE UPDATE ON user_service.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_diabetes_settings_updated_at BEFORE UPDATE ON user_service.user_diabetes_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_service.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_relationships_updated_at BEFORE UPDATE ON user_service.user_relationships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_subscriptions_updated_at BEFORE UPDATE ON user_service.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 