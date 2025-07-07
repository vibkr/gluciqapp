-- ============================================================================
-- V2.7.0: Simple Schema Permissions for Development
-- Created: 2025-01-06
-- Description: Grant basic permissions to anonymous users for development
--              without enabling RLS (Row Level Security)
-- ============================================================================

-- Grant usage on schemas to anonymous role
GRANT USAGE ON SCHEMA user_service TO anon;
GRANT USAGE ON SCHEMA food_service TO anon;
GRANT USAGE ON SCHEMA food_analysis TO anon;
GRANT USAGE ON SCHEMA logging_service TO anon;
GRANT USAGE ON SCHEMA formula_service TO anon;
GRANT USAGE ON SCHEMA meal_planning TO anon;

-- Grant usage on schemas to authenticated role
GRANT USAGE ON SCHEMA user_service TO authenticated;
GRANT USAGE ON SCHEMA food_service TO authenticated;
GRANT USAGE ON SCHEMA food_analysis TO authenticated;
GRANT USAGE ON SCHEMA logging_service TO authenticated;
GRANT USAGE ON SCHEMA formula_service TO authenticated;
GRANT USAGE ON SCHEMA meal_planning TO authenticated;

-- ============================================================================
-- USER_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables to anon role (for development)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA user_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA user_service TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA user_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA user_service TO authenticated;

-- ============================================================================
-- FOOD_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_service TO authenticated;

-- ============================================================================
-- FOOD_ANALYSIS SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_analysis TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_analysis TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_analysis TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_analysis TO authenticated;

-- ============================================================================
-- LOGGING_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA logging_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA logging_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA logging_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA logging_service TO authenticated;

-- ============================================================================
-- FORMULA_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA formula_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA formula_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA formula_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA formula_service TO authenticated;

-- ============================================================================
-- MEAL_PLANNING SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA meal_planning TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA meal_planning TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meal_planning TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meal_planning TO authenticated;

-- ============================================================================
-- GRANT DEFAULT PRIVILEGES FOR FUTURE OBJECTS
-- ============================================================================

-- Set default privileges for future tables in each schema
ALTER DEFAULT PRIVILEGES IN SCHEMA user_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA user_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA food_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA food_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA food_analysis GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA food_analysis GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA logging_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA logging_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA formula_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA formula_service GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA meal_planning GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA meal_planning GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA user_service GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA user_service GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA food_service GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA food_service GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA food_analysis GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA food_analysis GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA logging_service GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA logging_service GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA formula_service GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA formula_service GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA meal_planning GRANT USAGE, SELECT ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA meal_planning GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- This migration sets up:
-- 1. Schema usage permissions for anon and authenticated roles
-- 2. Table-level permissions for all schemas
-- 3. Default privileges for future objects
-- 4. NO RLS policies (for development simplicity)

SELECT 'Simple schema permissions setup completed successfully!' AS status; 