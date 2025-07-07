-- Test Users and Data for GluciQ App
-- Created: 2025-01-06
-- Description: Comprehensive test data with realistic personas for development and testing
-- Based on Texas Children's Hospital insulin carb ratio guidelines

-- ============================================================================
-- CLEANUP SECTION - Remove existing test data
-- ============================================================================

-- Clean up existing test data (users with phone '99999')
DELETE FROM logging_service.activity_logs WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM logging_service.insulin_doses WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM logging_service.glucose_readings WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM logging_service.food_log_entries WHERE food_log_id IN (
    SELECT id FROM logging_service.food_logs WHERE user_id IN (
        SELECT id FROM user_service.users WHERE phone = '99999'
    )
);

DELETE FROM logging_service.food_logs WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM user_service.user_preferences WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM user_service.user_diabetes_settings WHERE user_id IN (
    SELECT id FROM user_service.users WHERE phone = '99999'
);

DELETE FROM user_service.users WHERE phone = '99999';

-- Clean up test foods (cast UUID to text for LIKE operator)
DELETE FROM food_service.glycemic_info WHERE food_id::text LIKE 'f0000%';
DELETE FROM food_service.nutrition_facts WHERE food_id::text LIKE 'f0000%';
DELETE FROM food_service.foods WHERE id::text LIKE 'f0000%';

-- ============================================================================
-- TEST USERS (10 Personas with phone '99999' for easy identification)
-- ============================================================================

-- 1. ARJUN SHARMA (8-year-old Indian boy, Type 1, vegetarian)
INSERT INTO user_service.users (
    id, email, display_name, first_name, last_name, phone, date_of_birth,
    user_role, program_type, diabetes_type, diagnosis_date,
    height_cm, current_weight_kg, target_weight_kg,
    preferred_units, glucose_unit, timezone, language,
    has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
    goal_a1c, daily_step_goal, weekly_exercise_sessions,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    is_active, onboarding_completed, onboarding_step,
    created_at, updated_at, last_active_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'arjun.sharma.test@example.com',
    'Arjun Sharma',
    'Arjun', 'Sharma', '99999',
    '2016-03-15'::DATE, -- 8 years old
    'patient'::user_role_enum, 'type1'::program_type_enum, 'type1'::diabetes_type_enum, '2020-01-15'::DATE,
    125, 25.0, 28.0, -- 125cm, 25kg
    'metric', 'mg/dL', 'Asia/Kolkata', 'en',
    true, 'Dexcom G6', false, null,
    7.0, 6000, 5, -- Kid-appropriate goals
    'Priya Sharma', '+91-9876543210', 'Mother',
    true, true, 10,
    now() - interval '30 days', now() - interval '1 day', now() - interval '2 hours'
);

-- 2. MAYA PATEL (12-year-old Indian-American girl, Type 1, vegetarian + eggs)
INSERT INTO user_service.users (
    id, email, display_name, first_name, last_name, phone, date_of_birth,
    user_role, program_type, diabetes_type, diagnosis_date,
    height_cm, current_weight_kg, target_weight_kg,
    preferred_units, glucose_unit, timezone, language,
    has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
    goal_a1c, daily_step_goal, weekly_exercise_sessions,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    is_active, onboarding_completed, onboarding_step,
    created_at, updated_at, last_active_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'maya.patel.test@example.com',
    'Maya Patel',
    'Maya', 'Patel', '99999',
    '2012-08-22'::DATE, -- 12 years old
    'patient'::user_role_enum, 'type1'::program_type_enum, 'type1'::diabetes_type_enum, '2018-05-10'::DATE,
    148, 38.5, 40.0, -- 148cm, 38.5kg
    'imperial', 'mg/dL', 'America/New_York', 'en',
    true, 'FreeStyle Libre 2', true, 'Omnipod',
    6.8, 8000, 4,
    'Ravi Patel', '+1-555-123-4567', 'Father',
    true, true, 10,
    now() - interval '25 days', now() - interval '6 hours', now() - interval '1 hour'
);

-- 3. ETHAN JOHNSON (10-year-old American boy, Type 1, omnivore)
INSERT INTO user_service.users (
    id, email, display_name, first_name, last_name, phone, date_of_birth,
    user_role, program_type, diabetes_type, diagnosis_date,
    height_cm, current_weight_kg, target_weight_kg,
    preferred_units, glucose_unit, timezone, language,
    has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
    goal_a1c, daily_step_goal, weekly_exercise_sessions,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    is_active, onboarding_completed, onboarding_step,
    created_at, updated_at, last_active_at
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'ethan.johnson.test@example.com',
    'Ethan Johnson',
    'Ethan', 'Johnson', '99999',
    '2014-11-03'::DATE, -- 10 years old
    'patient'::user_role_enum, 'type1'::program_type_enum, 'type1'::diabetes_type_enum, '2019-07-20'::DATE,
    135, 32.0, 35.0, -- 135cm, 32kg
    'imperial', 'mg/dL', 'America/Los_Angeles', 'en',
    false, null, false, null,
    7.2, 7000, 3,
    'Sarah Johnson', '+1-555-987-6543', 'Mother',
    true, true, 10,
    now() - interval '20 days', now() - interval '4 hours', now() - interval '30 minutes'
);

-- 4. RAJESH KUMAR (35-year-old Indian man, Type 1, vegetarian + chicken)
INSERT INTO user_service.users (
    id, email, display_name, first_name, last_name, phone, date_of_birth,
    user_role, program_type, diabetes_type, diagnosis_date,
    height_cm, current_weight_kg, target_weight_kg,
    preferred_units, glucose_unit, timezone, language,
    has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
    goal_a1c, daily_step_goal, weekly_exercise_sessions,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    is_active, onboarding_completed, onboarding_step,
    created_at, updated_at, last_active_at
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    'rajesh.kumar.test@example.com',
    'Rajesh Kumar',
    'Rajesh', 'Kumar', '99999',
    '1989-06-12'::DATE, -- 35 years old
    'patient'::user_role_enum, 'type1'::program_type_enum, 'type1'::diabetes_type_enum, '2005-03-18'::DATE,
    172, 68.5, 65.0, -- 172cm, 68.5kg
    'metric', 'mg/dL', 'Asia/Kolkata', 'en',
    true, 'Dexcom G7', true, 'Medtronic 670G',
    6.5, 10000, 5,
    'Sunita Kumar', '+91-9988776655', 'Wife',
    true, true, 10,
    now() - interval '15 days', now() - interval '2 hours', now() - interval '15 minutes'
);

-- 5. AMANDA GARCIA (28-year-old American woman, Type 1, omnivore)
INSERT INTO user_service.users (
    id, email, display_name, first_name, last_name, phone, date_of_birth,
    user_role, program_type, diabetes_type, diagnosis_date,
    height_cm, current_weight_kg, target_weight_kg,
    preferred_units, glucose_unit, timezone, language,
    has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
    goal_a1c, daily_step_goal, weekly_exercise_sessions,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
    is_active, onboarding_completed, onboarding_step,
    created_at, updated_at, last_active_at
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    'amanda.garcia.test@example.com',
    'Amanda Garcia',
    'Amanda', 'Garcia', '99999',
    '1996-09-08'::DATE, -- 28 years old
    'patient'::user_role_enum, 'type1'::program_type_enum, 'type1'::diabetes_type_enum, '2010-11-22'::DATE,
    165, 58.0, 55.0, -- 165cm, 58kg
    'imperial', 'mg/dL', 'America/Chicago', 'en',
    true, 'FreeStyle Libre 3', false, null,
    6.8, 12000, 6,
    'Miguel Garcia', '+1-555-456-7890', 'Brother',
    true, true, 10,
    now() - interval '10 days', now() - interval '1 hour', now() - interval '5 minutes'
);

-- ============================================================================
-- USER DIABETES SETTINGS (Realistic carb ratios based on medical guidelines)
-- ============================================================================

-- Arjun Sharma (8-year-old) - Conservative ratios for child (1:10-15 range)
INSERT INTO user_service.user_diabetes_settings (
    user_id, carb_ratios, correction_factors, target_glucose_min, target_glucose_max,
    insulin_duration_hours, insulin_onset_minutes, max_bolus_units
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '[
        {"time_start": "06:00", "time_end": "11:00", "ratio": 12},
        {"time_start": "11:00", "time_end": "17:00", "ratio": 15},
        {"time_start": "17:00", "time_end": "22:00", "ratio": 10},
        {"time_start": "22:00", "time_end": "06:00", "ratio": 15}
    ]'::jsonb,
    '[
        {"time_start": "06:00", "time_end": "11:00", "factor": 80},
        {"time_start": "11:00", "time_end": "17:00", "factor": 100},
        {"time_start": "17:00", "time_end": "22:00", "factor": 70},
        {"time_start": "22:00", "time_end": "06:00", "factor": 120}
    ]'::jsonb,
    100.0, 200.0, 3.0, 15, 5.0
);

-- Maya Patel (12-year-old) - Moderate ratios (1:8-12 range)
INSERT INTO user_service.user_diabetes_settings (
    user_id, carb_ratios, correction_factors, target_glucose_min, target_glucose_max,
    insulin_duration_hours, insulin_onset_minutes, max_bolus_units
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '[
        {"time_start": "06:00", "time_end": "11:00", "ratio": 8},
        {"time_start": "11:00", "time_end": "17:00", "ratio": 10},
        {"time_start": "17:00", "time_end": "22:00", "ratio": 7},
        {"time_start": "22:00", "time_end": "06:00", "ratio": 12}
    ]'::jsonb,
    '[
        {"time_start": "06:00", "time_end": "11:00", "factor": 60},
        {"time_start": "11:00", "time_end": "17:00", "factor": 75},
        {"time_start": "17:00", "time_end": "22:00", "factor": 50},
        {"time_start": "22:00", "time_end": "06:00", "factor": 90}
    ]'::jsonb,
    80.0, 180.0, 3.5, 10, 8.0
);

-- Ethan Johnson (10-year-old) - Conservative ratios (1:10-15 range)
INSERT INTO user_service.user_diabetes_settings (
    user_id, carb_ratios, correction_factors, target_glucose_min, target_glucose_max,
    insulin_duration_hours, insulin_onset_minutes, max_bolus_units
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '[
        {"time_start": "06:00", "time_end": "11:00", "ratio": 12},
        {"time_start": "11:00", "time_end": "17:00", "ratio": 14},
        {"time_start": "17:00", "time_end": "22:00", "ratio": 10},
        {"time_start": "22:00", "time_end": "06:00", "ratio": 15}
    ]'::jsonb,
    '[
        {"time_start": "06:00", "time_end": "11:00", "factor": 75},
        {"time_start": "11:00", "time_end": "17:00", "factor": 95},
        {"time_start": "17:00", "time_end": "22:00", "factor": 65},
        {"time_start": "22:00", "time_end": "06:00", "factor": 110}
    ]'::jsonb,
    90.0, 190.0, 3.5, 15, 6.0
);

-- Rajesh Kumar (35-year-old adult) - Tighter control (1:6-10 range)
INSERT INTO user_service.user_diabetes_settings (
    user_id, carb_ratios, correction_factors, target_glucose_min, target_glucose_max,
    insulin_duration_hours, insulin_onset_minutes, max_bolus_units
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '[
        {"time_start": "06:00", "time_end": "11:00", "ratio": 6},
        {"time_start": "11:00", "time_end": "17:00", "ratio": 8},
        {"time_start": "17:00", "time_end": "22:00", "ratio": 5},
        {"time_start": "22:00", "time_end": "06:00", "ratio": 10}
    ]'::jsonb,
    '[
        {"time_start": "06:00", "time_end": "11:00", "factor": 30},
        {"time_start": "11:00", "time_end": "17:00", "factor": 40},
        {"time_start": "17:00", "time_end": "22:00", "factor": 25},
        {"time_start": "22:00", "time_end": "06:00", "factor": 50}
    ]'::jsonb,
    70.0, 140.0, 4.0, 10, 15.0
);

-- Amanda Garcia (28-year-old active adult) - Moderate ratios (1:7-12 range)
INSERT INTO user_service.user_diabetes_settings (
    user_id, carb_ratios, correction_factors, target_glucose_min, target_glucose_max,
    insulin_duration_hours, insulin_onset_minutes, max_bolus_units
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    '[
        {"time_start": "06:00", "time_end": "11:00", "ratio": 8},
        {"time_start": "11:00", "time_end": "17:00", "ratio": 10},
        {"time_start": "17:00", "time_end": "22:00", "ratio": 7},
        {"time_start": "22:00", "time_end": "06:00", "ratio": 12}
    ]'::jsonb,
    '[
        {"time_start": "06:00", "time_end": "11:00", "factor": 35},
        {"time_start": "11:00", "time_end": "17:00", "factor": 45},
        {"time_start": "17:00", "time_end": "22:00", "factor": 30},
        {"time_start": "22:00", "time_end": "06:00", "factor": 55}
    ]'::jsonb,
    80.0, 160.0, 4.0, 12, 12.0
);

-- ============================================================================
-- USER PREFERENCES
-- ============================================================================

-- Insert preferences for all test users
INSERT INTO user_service.user_preferences (
    user_id, notifications_enabled, email_notifications, push_notifications,
    glucose_reminders, insulin_reminders, meal_reminders,
    data_sharing_enabled, analytics_enabled, theme, font_size,
    high_contrast, reduce_motion
) 
SELECT 
    id,
    true, true, true,
    true, true, false,
    false, true, 'light', 'medium',
    false, false
FROM user_service.users WHERE phone = '99999';

-- ============================================================================
-- TEST FOODS (Indian and American cuisine)
-- ============================================================================

-- Indian Foods
INSERT INTO food_service.foods (id, name, brand, description, category, serving_size, serving_unit, is_verified, data_source) VALUES
('f0000001-0001-0001-0001-000000000001', 'Basmati Rice (cooked)', null, 'Long grain aromatic rice, cooked', 'grains'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000002-0002-0002-0002-000000000002', 'Whole Wheat Chapati', null, 'Traditional Indian flatbread', 'grains'::food_category_enum, 1, 'pieces'::portion_unit_enum, true, 'nutrition_database'),
('f0000003-0003-0003-0003-000000000003', 'Dal (Moong)', null, 'Yellow lentil curry', 'proteins'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000004-0004-0004-0004-000000000004', 'Paneer', null, 'Indian cottage cheese', 'dairy'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000005-0005-0005-0005-000000000005', 'Idli', null, 'Steamed rice cake', 'grains'::food_category_enum, 1, 'pieces'::portion_unit_enum, true, 'nutrition_database'),
('f0000006-0006-0006-0006-000000000006', 'Masala Chai', null, 'Spiced tea with milk', 'beverages'::food_category_enum, 200, 'ml'::portion_unit_enum, true, 'nutrition_database'),
('f0000007-0007-0007-0007-000000000007', 'Yogurt (plain)', null, 'Plain Indian curd', 'dairy'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database');

-- American Foods
INSERT INTO food_service.foods (id, name, brand, description, category, serving_size, serving_unit, is_verified, data_source) VALUES
('f0000008-0008-0008-0008-000000000008', 'Grilled Chicken Breast', null, 'Boneless skinless chicken breast, grilled', 'proteins'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000009-0009-0009-0009-000000000009', 'Brown Rice (cooked)', null, 'Whole grain brown rice, cooked', 'grains'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000010-0010-0010-0010-000000000010', 'Scrambled Eggs', null, 'Eggs scrambled with butter', 'proteins'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000011-0011-0011-0011-000000000011', 'Whole Wheat Bread', 'Wonder Bread', 'Whole grain sandwich bread', 'grains'::food_category_enum, 1, 'slices'::portion_unit_enum, true, 'nutrition_database'),
('f0000012-0012-0012-0012-000000000012', 'Greek Yogurt', 'Chobani', 'Plain Greek yogurt', 'dairy'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000013-0013-0013-0013-000000000013', 'Apple', null, 'Medium fresh apple with skin', 'fruits'::food_category_enum, 1, 'pieces'::portion_unit_enum, true, 'nutrition_database'),
('f0000014-0014-0014-0014-000000000014', 'Almonds', null, 'Raw unsalted almonds', 'proteins'::food_category_enum, 28, 'grams'::portion_unit_enum, true, 'nutrition_database'),
('f0000015-0015-0015-0015-000000000015', 'Broccoli (steamed)', null, 'Fresh broccoli, steamed', 'vegetables'::food_category_enum, 100, 'grams'::portion_unit_enum, true, 'nutrition_database');

-- ============================================================================
-- NUTRITION FACTS FOR FOODS
-- ============================================================================

-- Indian Foods Nutrition
INSERT INTO food_service.nutrition_facts (food_id, calories, protein_g, carbohydrates_g, fiber_g, sugars_g, fat_g, saturated_fat_g, sodium_mg, confidence_score) VALUES
('f0000001-0001-0001-0001-000000000001', 130, 2.7, 28.2, 0.4, 0.1, 0.3, 0.1, 1, 0.95), -- Basmati Rice
('f0000002-0002-0002-0002-000000000002', 71, 2.6, 14.2, 1.9, 0.4, 0.6, 0.1, 120, 0.90), -- Chapati
('f0000003-0003-0003-0003-000000000003', 118, 8.8, 20.1, 1.8, 1.4, 0.4, 0.1, 5, 0.85), -- Dal
('f0000004-0004-0004-0004-000000000004', 265, 18.3, 3.4, 0, 3.4, 20.8, 13.3, 372, 0.90), -- Paneer
('f0000005-0005-0005-0005-000000000005', 58, 2.0, 12.2, 0.8, 0.1, 0.1, 0, 2, 0.95), -- Idli
('f0000006-0006-0006-0006-000000000006', 42, 1.6, 7.2, 0, 6.8, 1.5, 0.9, 25, 0.90), -- Masala Chai
('f0000007-0007-0007-0007-000000000007', 60, 3.5, 4.7, 0, 4.7, 3.3, 2.1, 46, 0.95); -- Yogurt

-- American Foods Nutrition
INSERT INTO food_service.nutrition_facts (food_id, calories, protein_g, carbohydrates_g, fiber_g, sugars_g, fat_g, saturated_fat_g, sodium_mg, confidence_score) VALUES
('f0000008-0008-0008-0008-000000000008', 165, 31.0, 0, 0, 0, 3.6, 1.0, 74, 0.95), -- Grilled Chicken
('f0000009-0009-0009-0009-000000000009', 111, 2.6, 23.0, 1.8, 0.4, 0.9, 0.2, 5, 0.95), -- Brown Rice
('f0000010-0010-0010-0010-000000000010', 155, 10.6, 0.6, 0, 0.6, 11.5, 3.7, 124, 0.90), -- Scrambled Eggs
('f0000011-0011-0011-0011-000000000011', 69, 3.6, 11.6, 1.9, 1.4, 1.1, 0.2, 144, 0.95), -- Whole Wheat Bread
('f0000012-0012-0012-0012-000000000012', 59, 10.3, 3.6, 0, 3.6, 0.4, 0.3, 36, 0.95), -- Greek Yogurt
('f0000013-0013-0013-0013-000000000013', 52, 0.3, 13.8, 2.4, 10.4, 0.2, 0, 1, 0.95), -- Apple
('f0000014-0014-0014-0014-000000000014', 164, 6.0, 6.1, 3.5, 1.2, 14.2, 1.1, 0, 0.95), -- Almonds
('f0000015-0015-0015-0015-000000000015', 23, 2.6, 4.0, 2.3, 1.2, 0.4, 0.1, 41, 0.95); -- Broccoli

-- ============================================================================
-- GLYCEMIC INFORMATION
-- ============================================================================

INSERT INTO food_service.glycemic_info (food_id, glycemic_index, glycemic_load, digestible_carbs_g, absorption_rate, blood_sugar_impact, insulin_demand, confidence_score) VALUES
('f0000001-0001-0001-0001-000000000001', 58, 16.4, 27.8, 'medium', 'moderate', 'moderate', 0.90), -- Basmati Rice
('f0000002-0002-0002-0002-000000000002', 62, 7.8, 12.3, 'medium', 'moderate', 'moderate', 0.85), -- Chapati
('f0000003-0003-0003-0003-000000000003', 25, 4.6, 18.3, 'slow', 'low', 'low', 0.80), -- Dal
('f0000004-0004-0004-0004-000000000004', 0, 0, 0, 'slow', 'low', 'low', 0.95), -- Paneer
('f0000005-0005-0005-0005-000000000005', 60, 7.3, 11.4, 'medium', 'moderate', 'moderate', 0.90), -- Idli
('f0000006-0006-0006-0006-000000000006', 55, 4.0, 7.2, 'fast', 'moderate', 'moderate', 0.85), -- Masala Chai
('f0000007-0007-0007-0007-000000000007', 35, 1.6, 4.7, 'slow', 'low', 'low', 0.90), -- Yogurt
('f0000008-0008-0008-0008-000000000008', 0, 0, 0, 'slow', 'low', 'low', 0.95), -- Grilled Chicken
('f0000009-0009-0009-0009-000000000009', 50, 11.0, 21.2, 'medium', 'moderate', 'moderate', 0.90), -- Brown Rice
('f0000010-0010-0010-0010-000000000010', 0, 0, 0, 'slow', 'low', 'low', 0.95), -- Scrambled Eggs
('f0000011-0011-0011-0011-000000000011', 51, 4.9, 9.7, 'medium', 'low', 'low', 0.90), -- Whole Wheat Bread
('f0000012-0012-0012-0012-000000000012', 11, 0.4, 3.6, 'slow', 'low', 'low', 0.95), -- Greek Yogurt
('f0000013-0013-0013-0013-000000000013', 38, 5.2, 11.4, 'medium', 'low', 'low', 0.95), -- Apple
('f0000014-0014-0014-0014-000000000014', 0, 0, 2.6, 'slow', 'low', 'low', 0.95), -- Almonds
('f0000015-0015-0015-0015-000000000015', 15, 0.3, 1.7, 'slow', 'low', 'low', 0.95); -- Broccoli

-- ============================================================================
-- SAMPLE FOOD LOGS (Using auto-generated UUIDs)
-- ============================================================================

-- Create food logs and store their IDs for later reference
WITH food_log_arjun_breakfast AS (
    INSERT INTO logging_service.food_logs (
        user_id, meal_type, meal_time, meal_name, 
        total_calories, total_carbs_g, total_protein_g, total_fat_g, total_fiber_g,
        notes, ai_generated
    ) VALUES (
        '11111111-1111-1111-1111-111111111111', 'breakfast'::meal_type_enum, now() - interval '2 hours', 'Morning Breakfast',
        248, 51.6, 7.6, 2.4, 2.4, 'Had breakfast with mom', false
    ) RETURNING id
),
food_log_maya_breakfast AS (
    INSERT INTO logging_service.food_logs (
        user_id, meal_type, meal_time, meal_name, 
        total_calories, total_carbs_g, total_protein_g, total_fat_g, total_fiber_g,
        notes, ai_generated
    ) VALUES (
        '22222222-2222-2222-2222-222222222222', 'breakfast'::meal_type_enum, now() - interval '3 hours', 'Quick Breakfast',
        245, 28.2, 18.5, 8.1, 2.1, 'Before school rush', false
    ) RETURNING id
)
-- Insert food log entries for Arjun's breakfast
INSERT INTO logging_service.food_log_entries (
    food_log_id, food_id, food_name, category, portion_size, portion_unit,
    calories, carbs_g, protein_g, fat_g, fiber_g, estimated_gi, estimated_gl, entry_source
) 
SELECT 
    (SELECT id FROM food_log_arjun_breakfast),
    'f0000005-0005-0005-0005-000000000005'::uuid, 'Idli', 'grains'::food_category_enum, 2, 'pieces'::portion_unit_enum, 
    116, 24.4, 4.0, 0.2, 1.6, 60, 14.6, 'manual'
UNION ALL
SELECT 
    (SELECT id FROM food_log_arjun_breakfast),
    'f0000007-0007-0007-0007-000000000007'::uuid, 'Yogurt (plain)', 'dairy'::food_category_enum, 150, 'grams'::portion_unit_enum, 
    90, 7.1, 5.3, 5.0, 0, 35, 2.4, 'manual'
UNION ALL
SELECT 
    (SELECT id FROM food_log_arjun_breakfast),
    'f0000006-0006-0006-0006-000000000006'::uuid, 'Masala Chai', 'beverages'::food_category_enum, 150, 'ml'::portion_unit_enum, 
    32, 5.4, 1.2, 1.1, 0, 55, 3.0, 'manual'
UNION ALL
-- Insert food log entries for Maya's breakfast
SELECT 
    (SELECT id FROM food_log_maya_breakfast),
    'f0000010-0010-0010-0010-000000000010'::uuid, 'Scrambled Eggs', 'proteins'::food_category_enum, 80, 'grams'::portion_unit_enum, 
    124, 0.5, 8.5, 9.2, 0, 0, 0, 'manual'
UNION ALL
SELECT 
    (SELECT id FROM food_log_maya_breakfast),
    'f0000011-0011-0011-0011-000000000011'::uuid, 'Whole Wheat Bread', 'grains'::food_category_enum, 2, 'slices'::portion_unit_enum, 
    138, 23.2, 7.2, 2.2, 3.8, 51, 9.8, 'manual';

-- ============================================================================
-- SAMPLE GLUCOSE READINGS
-- ============================================================================

-- Recent glucose readings for active users
INSERT INTO logging_service.glucose_readings (
    user_id, glucose_value, glucose_unit, reading_time, reading_type, 
    device_type, device_brand, reading_quality, notes
) VALUES 
-- Arjun (CGM readings)
('11111111-1111-1111-1111-111111111111', 142, 'mg/dL', now() - interval '1 hour', 'post_meal', 'cgm', 'Dexcom G6', 'good', 'After breakfast'),
('11111111-1111-1111-1111-111111111111', 108, 'mg/dL', now() - interval '3 hours', 'pre_meal', 'cgm', 'Dexcom G6', 'good', 'Before breakfast'),
('11111111-1111-1111-1111-111111111111', 98, 'mg/dL', now() - interval '8 hours', 'fasting', 'cgm', 'Dexcom G6', 'good', 'Morning reading'),

-- Maya (CGM readings)
('22222222-2222-2222-2222-222222222222', 156, 'mg/dL', now() - interval '2 hours', 'post_meal', 'cgm', 'FreeStyle Libre 2', 'good', 'After breakfast'),
('22222222-2222-2222-2222-222222222222', 95, 'mg/dL', now() - interval '4 hours', 'pre_meal', 'cgm', 'FreeStyle Libre 2', 'good', 'Before breakfast'),

-- Rajesh (CGM readings - tighter control)
('44444444-4444-4444-4444-444444444444', 125, 'mg/dL', now() - interval '1.5 hours', 'post_meal', 'cgm', 'Dexcom G7', 'good', 'After lunch'),
('44444444-4444-4444-4444-444444444444', 88, 'mg/dL', now() - interval '4 hours', 'pre_meal', 'cgm', 'Dexcom G7', 'good', 'Before lunch'),

-- Ethan (Manual readings)
('33333333-3333-3333-3333-333333333333', 168, 'mg/dL', now() - interval '2 hours', 'post_meal', 'glucometer', 'OneTouch', 'good', 'After lunch'),
('33333333-3333-3333-3333-333333333333', 102, 'mg/dL', now() - interval '6 hours', 'pre_meal', 'glucometer', 'OneTouch', 'good', 'Before lunch');

-- ============================================================================
-- SAMPLE INSULIN DOSES (Using realistic carb ratios)
-- ============================================================================

-- Recent insulin doses with realistic calculations
INSERT INTO logging_service.insulin_doses (
    user_id, insulin_type, insulin_name, dose_units, dose_time, dose_purpose,
    carbs_covered_g, injection_site, injection_method, carb_ratio, calculated_dose, 
    user_adjustment, notes, pre_dose_glucose
) VALUES 
-- Arjun's doses (1:12 ratio for breakfast)
('11111111-1111-1111-1111-111111111111', 'rapid_acting', 'Humalog', 4.3, now() - interval '2 hours', 'meal_bolus', 
 51.6, 'abdomen', 'pen', 12.0, 4.3, 0, 'Breakfast bolus - 51.6g carbs ÷ 12', 108),

-- Maya's doses (1:8 ratio for breakfast)
('22222222-2222-2222-2222-222222222222', 'rapid_acting', 'NovoRapid', 3.5, now() - interval '3 hours', 'meal_bolus', 
 28.2, null, 'pump', 8.0, 3.5, 0, 'Breakfast bolus via pump - 28.2g carbs ÷ 8', 95),

-- Rajesh's doses (1:6 ratio for breakfast)
('44444444-4444-4444-4444-444444444444', 'rapid_acting', 'Apidra', 8.4, now() - interval '1.5 hours', 'meal_bolus', 
 50.4, null, 'pump', 6.0, 8.4, 0, 'Lunch bolus - 50.4g carbs ÷ 6', 88),
('44444444-4444-4444-4444-444444444444', 'rapid_acting', 'Apidra', 1.2, now() - interval '1 hour', 'correction_bolus', 
 null, null, 'pump', null, 1.2, 0, 'Small correction - (142-100) ÷ 35', 142);

-- ============================================================================
-- SAMPLE ACTIVITY LOGS
-- ============================================================================

INSERT INTO logging_service.activity_logs (
    user_id, activity_type, activity_name, duration_minutes, start_time, 
    intensity, perceived_exertion, calories_burned, 
    pre_activity_glucose, post_activity_glucose, notes
) VALUES 
-- Kids activities
('11111111-1111-1111-1111-111111111111', 'outdoor_play', 'Cricket in park', 45, now() - interval '26 hours', 
 'moderate', 6, 150, 118, 95, 'Played cricket with friends'),
('22222222-2222-2222-2222-222222222222', 'sports', 'Soccer practice', 60, now() - interval '27 hours', 
 'high', 7, 280, 125, 89, 'School soccer practice'),
('33333333-3333-3333-3333-333333333333', 'cycling', 'Bike ride', 30, now() - interval '48 hours', 
 'moderate', 5, 120, 135, 102, 'Rode bike around neighborhood'),

-- Adult activities  
('44444444-4444-4444-4444-444444444444', 'running', 'Morning jog', 35, now() - interval '36 hours', 
 'moderate', 6, 320, 92, 78, 'Regular morning run'),
('55555555-5555-5555-5555-555555555555', 'gym', 'Weight training', 50, now() - interval '25 hours', 
 'high', 8, 285, 108, 145, 'Strength training session');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Add a comment to indicate successful completion
SELECT 'Test data creation completed successfully!' AS status,
       COUNT(*) AS total_users_created
FROM user_service.users 
WHERE phone = '99999';

-- Show summary of created data
SELECT 
    'Summary of Test Data Created:' AS summary,
    (SELECT COUNT(*) FROM user_service.users WHERE phone = '99999') AS users_created,
    (SELECT COUNT(*) FROM user_service.user_diabetes_settings WHERE user_id IN (SELECT id FROM user_service.users WHERE phone = '99999')) AS diabetes_settings_created,
    (SELECT COUNT(*) FROM food_service.foods WHERE id::text LIKE 'f0000%') AS test_foods_created,
    (SELECT COUNT(*) FROM logging_service.food_logs WHERE user_id IN (SELECT id FROM user_service.users WHERE phone = '99999')) AS food_logs_created,
    (SELECT COUNT(*) FROM logging_service.glucose_readings WHERE user_id IN (SELECT id FROM user_service.users WHERE phone = '99999')) AS glucose_readings_created,
    (SELECT COUNT(*) FROM logging_service.insulin_doses WHERE user_id IN (SELECT id FROM user_service.users WHERE phone = '99999')) AS insulin_doses_created;