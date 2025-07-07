-- Migration: Global Enums and Extensions
-- Version: 2.0.0
-- Created: 2024-01-01T00:00:00.000Z
-- Description: PostgreSQL extensions and global enums shared across all services

-- ============================================================================
-- POSTGRESQL EXTENSIONS
-- ============================================================================

-- Enable required extensions for UUID generation and full-text search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- GLOBAL ENUMS (shared across services)
-- ============================================================================

-- Food categories - standardized across all services
CREATE TYPE food_category_enum AS ENUM (
    'grains',         -- rice, bread, pasta, cereals, wheat products, oats, quinoa
    'vegetables',     -- all vegetables, greens, herbs, salads  
    'fruits',         -- fresh fruits, berries, dried fruits, fruit juices
    'proteins',       -- meat, fish, poultry, eggs, beans, nuts, seeds, tofu
    'dairy',          -- milk, cheese, yogurt, butter, cream, ice cream
    'packaged_food',  -- processed/packaged items, canned goods, frozen meals
    'beverages',      -- drinks, juices, sodas, water, tea, coffee, alcohol
    'sweets',         -- desserts, candy, chocolate, sugary items, pastries
    'snacks',         -- chips, crackers, bars, popcorn
    'mixed_meal',     -- combination dishes, recipes with multiple components
    'unknown'         -- if you cannot identify the food clearly
);

-- Portion units
CREATE TYPE portion_unit_enum AS ENUM (
    'grams', 'ml', 'pieces', 'cups', 'oz', 'slices', 'tablespoons', 'teaspoons'
);

-- Diabetes and program types
CREATE TYPE diabetes_type_enum AS ENUM (
    'type1', 'type2', 'metabolic', 'gestational', 'other'
);

CREATE TYPE program_type_enum AS ENUM (
    'type1', 'type2', 'metabolic'
);

-- User roles and relationships
CREATE TYPE user_role_enum AS ENUM (
    'patient', 'healthcare_provider', 'caregiver', 'admin', 'support', 'researcher'
);

CREATE TYPE relationship_status_enum AS ENUM (
    'pending', 'active', 'paused', 'declined', 'terminated'
);

-- Provider and caregiver access levels
CREATE TYPE provider_access_level_enum AS ENUM (
    'read_only', 'read_write', 'full_access'
);

CREATE TYPE caregiver_access_level_enum AS ENUM (
    'basic', 'extended', 'full'
);

-- Meal and timing types
CREATE TYPE meal_type_enum AS ENUM (
    'breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 
    'dinner', 'evening_snack', 'pre_workout', 'post_workout'
);

-- Analysis and processing types
CREATE TYPE analysis_source_enum AS ENUM (
    'vision', 'barcode', 'hybrid', 'manual'
);

CREATE TYPE verification_status_enum AS ENUM (
    'pending', 'verified', 'rejected', 'needs_review'
);

-- Formula and calculation types
CREATE TYPE formula_type_enum AS ENUM (
    'insulin_bolus', 'correction_bolus', 'glucobalance_score', 
    'carb_ratio', 'insulin_sensitivity', 'personalized_score'
);

CREATE TYPE calculation_status_enum AS ENUM (
    'pending', 'calculating', 'completed', 'failed', 'cancelled'
);

-- Subscription and billing
CREATE TYPE subscription_status_enum AS ENUM (
    'active', 'inactive', 'expired', 'cancelled', 'trial'
);

CREATE TYPE subscription_tier_enum AS ENUM (
    'free', 'basic', 'premium', 'premium_plus', 'family'
);

-- Intensity and difficulty levels
CREATE TYPE intensity_enum AS ENUM (
    'low', 'moderate', 'high', 'very_high'
);

CREATE TYPE difficulty_enum AS ENUM (
    'very_easy', 'easy', 'medium', 'hard', 'very_hard'
);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql; 