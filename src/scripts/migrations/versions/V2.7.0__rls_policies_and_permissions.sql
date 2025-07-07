-- ============================================================================
-- V2.7.0: RLS Policies and Permissions for Multi-Schema Access
-- Created: 2025-01-06
-- Description: Set up Row Level Security policies and permissions to allow
--              anonymous users to access custom schemas for development and testing
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

-- Enable RLS on users table
ALTER TABLE user_service.users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous access to test users (phone = '99999')
CREATE POLICY "Allow anonymous access to test users" ON user_service.users
    FOR ALL TO anon
    USING (phone = '99999');

-- Policy: Allow authenticated users to access their own data
CREATE POLICY "Users can access own data" ON user_service.users
    FOR ALL TO authenticated
    USING (auth.uid()::text = auth_user_id OR phone = '99999');

-- Enable RLS on user_preferences table
ALTER TABLE user_service.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to preferences for test users
CREATE POLICY "Allow access to test user preferences" ON user_service.user_preferences
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own preferences
CREATE POLICY "Users can access own preferences" ON user_service.user_preferences
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

-- Enable RLS on user_diabetes_settings table
ALTER TABLE user_service.user_diabetes_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to diabetes settings for test users
CREATE POLICY "Allow access to test user diabetes settings" ON user_service.user_diabetes_settings
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own diabetes settings
CREATE POLICY "Users can access own diabetes settings" ON user_service.user_diabetes_settings
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

-- ============================================================================
-- FOOD_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_service TO authenticated;

-- Enable RLS on foods table (allow read access to all, write to authenticated)
ALTER TABLE food_service.foods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all foods" ON food_service.foods
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage foods" ON food_service.foods
    FOR ALL TO authenticated
    USING (true);

-- Enable RLS on nutrition_facts table
ALTER TABLE food_service.nutrition_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all nutrition facts" ON food_service.nutrition_facts
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to manage nutrition facts" ON food_service.nutrition_facts
    FOR ALL TO authenticated
    USING (true);

-- ============================================================================
-- FOOD_ANALYSIS SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_analysis TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA food_analysis TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_analysis TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_analysis TO authenticated;

-- Enable RLS on food_images table
ALTER TABLE food_analysis.food_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to access their own images or test user images
CREATE POLICY "Users can access own food images" ON food_analysis.food_images
    FOR ALL TO anon, authenticated
    USING (
        user_id IN (SELECT id FROM user_service.users WHERE phone = '99999') OR
        (auth.uid() IS NOT NULL AND user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id))
    );

-- ============================================================================
-- LOGGING_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA logging_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA logging_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA logging_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA logging_service TO authenticated;

-- Enable RLS on glucose_readings table
ALTER TABLE logging_service.glucose_readings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to test user glucose readings
CREATE POLICY "Allow access to test user glucose readings" ON logging_service.glucose_readings
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own glucose readings
CREATE POLICY "Users can access own glucose readings" ON logging_service.glucose_readings
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

-- Enable RLS on insulin_doses table
ALTER TABLE logging_service.insulin_doses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to test user insulin doses
CREATE POLICY "Allow access to test user insulin doses" ON logging_service.insulin_doses
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own insulin doses
CREATE POLICY "Users can access own insulin doses" ON logging_service.insulin_doses
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

-- Enable RLS on food_logs table
ALTER TABLE logging_service.food_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to test user food logs
CREATE POLICY "Allow access to test user food logs" ON logging_service.food_logs
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own food logs
CREATE POLICY "Users can access own food logs" ON logging_service.food_logs
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

-- ============================================================================
-- FORMULA_SERVICE SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA formula_service TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA formula_service TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA formula_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA formula_service TO authenticated;

-- Most formula service tables can be read by all, written by authenticated
-- (These are generally calculation formulas and reference data)

-- ============================================================================
-- MEAL_PLANNING SCHEMA PERMISSIONS
-- ============================================================================

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA meal_planning TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA meal_planning TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meal_planning TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meal_planning TO authenticated;

-- Enable RLS on meal_plans table
ALTER TABLE meal_planning.meal_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Allow access to test user meal plans
CREATE POLICY "Allow access to test user meal plans" ON meal_planning.meal_plans
    FOR ALL TO anon
    USING (user_id IN (SELECT id FROM user_service.users WHERE phone = '99999'));

-- Policy: Allow authenticated users to access their own meal plans
CREATE POLICY "Users can access own meal plans" ON meal_planning.meal_plans
    FOR ALL TO authenticated
    USING (user_id IN (SELECT id FROM user_service.users WHERE auth.uid()::text = auth_user_id OR phone = '99999'));

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
-- 3. Row Level Security policies for user data protection
-- 4. Special access for test users (phone = '99999') for development
-- 5. Default privileges for future objects

SELECT 'RLS policies and permissions setup completed successfully!' AS status; 