-- Test script to validate schema fixes for food analysis pipeline
-- Run this after applying fix_rls_policies.sql
-- Date: 2025-01-07

-- =============================================================================
-- SCHEMA VALIDATION TESTS
-- =============================================================================

-- Test 1: Verify analyzed_foods table has correct columns
SELECT 'TEST 1: analyzed_foods columns' as test_name;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'food_analysis' 
AND table_name = 'analyzed_foods' 
AND column_name IN (
    'estimated_calories', 
    'estimated_carbs_g', 
    'estimated_protein_g', 
    'estimated_fat_g',
    'estimated_portion',
    'portion_confidence',
    'confidence_score'
)
ORDER BY column_name;

-- Test 2: Verify food_images table has correct columns
SELECT 'TEST 2: food_images columns' as test_name;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'food_analysis' 
AND table_name = 'food_images' 
AND column_name IN (
    'processing_status',
    'error_message',
    'storage_url',
    'user_id'
)
ORDER BY column_name;

-- Test 3: Test data insertion into analyzed_foods (should work now)
SELECT 'TEST 3: Insert test data into analyzed_foods' as test_name;
INSERT INTO food_analysis.analyzed_foods (
    analysis_result_id,
    detected_name,
    category,
    confidence_score,
    estimated_portion,
    portion_unit,
    portion_confidence,
    estimated_calories,
    estimated_carbs_g,
    estimated_protein_g,
    estimated_fat_g
) VALUES (
    uuid_generate_v4(),  -- Mock analysis_result_id
    'Test Food',
    'grains',
    0.95,
    100.0,
    'grams',
    0.85,
    250.0,
    50.0,
    8.0,
    2.0
) RETURNING id, detected_name, estimated_calories;

-- Test 4: Test processing status update (should work now)
SELECT 'TEST 4: Test processing status update' as test_name;
-- First insert a test food_image
INSERT INTO food_analysis.food_images (
    user_id,
    storage_url,
    processing_status
) VALUES (
    uuid_generate_v4(),  -- Mock user_id
    'https://example.com/test-image.jpg',
    'pending'
) RETURNING id, processing_status;

-- Update the processing status
UPDATE food_analysis.food_images 
SET processing_status = 'completed'
WHERE storage_url = 'https://example.com/test-image.jpg'
RETURNING id, processing_status;

-- Test 5: Verify RLS policies are active
SELECT 'TEST 5: RLS policies verification' as test_name;
SELECT schemaname, tablename, policyname, roles 
FROM pg_policies 
WHERE schemaname = 'food_analysis' 
AND tablename IN ('food_images', 'analyzed_foods', 'food_analysis_results')
ORDER BY tablename, policyname;

-- Test 6: Verify storage policies
SELECT 'TEST 6: Storage policies verification' as test_name;
SELECT policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND policyname LIKE '%food%'
ORDER BY policyname;

-- =============================================================================
-- CLEANUP TEST DATA
-- =============================================================================

-- Remove test data
DELETE FROM food_analysis.analyzed_foods WHERE detected_name = 'Test Food';
DELETE FROM food_analysis.food_images WHERE storage_url = 'https://example.com/test-image.jpg';

-- =============================================================================
-- SUMMARY
-- =============================================================================

SELECT 'SCHEMA VALIDATION COMPLETE' as status, 
       'All tests should pass if fixes are applied correctly' as message;

-- Expected results:
-- TEST 1: Should show 7 columns with correct data types
-- TEST 2: Should show 4 columns including processing_status
-- TEST 3: Should insert successfully and return the test record
-- TEST 4: Should insert and update successfully
-- TEST 5: Should show permissive policies for anon/authenticated roles
-- TEST 6: Should show food-related storage policies 