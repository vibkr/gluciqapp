-- Disable RLS (Row Level Security) for development/testing
-- This allows the app to work without authentication

-- Disable RLS on storage buckets
UPDATE storage.buckets SET public = true WHERE name = 'food-images';

-- Disable RLS on food analysis tables
ALTER TABLE IF EXISTS food_analysis.food_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS food_analysis.food_analysis_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS food_analysis.analyzed_foods DISABLE ROW LEVEL SECURITY;

-- Disable RLS on logging tables  
ALTER TABLE IF EXISTS logging_service.food_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS logging_service.glucose_readings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS logging_service.insulin_doses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS logging_service.meal_entries DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user tables
ALTER TABLE IF EXISTS user_service.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_service.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_service.user_permissions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on food service tables
ALTER TABLE IF EXISTS food_service.foods DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS food_service.nutrition_facts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS food_service.glycemic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS food_service.user_food_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on formula service tables
ALTER TABLE IF EXISTS formula_service.user_formulas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS formula_service.formula_calculations DISABLE ROW LEVEL SECURITY;

-- Disable RLS on meal planning tables
ALTER TABLE IF EXISTS meal_planning.meal_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meal_planning.planned_meals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS meal_planning.planned_meal_foods DISABLE ROW LEVEL SECURITY;

-- Grant public access to storage
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO anon;

-- Grant public access to all schemas and tables
GRANT USAGE ON SCHEMA food_analysis TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA food_analysis TO anon;

GRANT USAGE ON SCHEMA logging_service TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA logging_service TO anon;

GRANT USAGE ON SCHEMA user_service TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA user_service TO anon;

GRANT USAGE ON SCHEMA food_service TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA food_service TO anon;

GRANT USAGE ON SCHEMA formula_service TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA formula_service TO anon;

GRANT USAGE ON SCHEMA meal_planning TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA meal_planning TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_analysis TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA logging_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA user_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA food_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA formula_service TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA meal_planning TO anon;

-- Note: Test users are already created via test_users_and_data.sql
-- The app will use Arjun Sharma (11111111-1111-1111-1111-111111111111) as default user

COMMIT; 