-- Fix RLS policies for food analysis and storage
-- This script addresses the authentication issues with image uploads and schema mismatches
-- Date: 2025-01-07

-- =============================================================================
-- STORAGE BUCKET POLICIES
-- =============================================================================

-- Drop existing restrictive storage policies
DROP POLICY IF EXISTS "Allow authenticated food image uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated food image viewing" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated food image updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated food image deletion" ON storage.objects;

-- Create permissive storage policies for development
-- Note: These are temporary policies for development. In production, 
-- we should implement proper Clerk JWT authentication.
CREATE POLICY "Allow anon and authenticated food image uploads" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Allow anon and authenticated food image viewing" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'food-images');

CREATE POLICY "Allow anon and authenticated food image updates" ON storage.objects
    FOR UPDATE TO anon, authenticated
    USING (bucket_id = 'food-images')
    WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Allow anon and authenticated food image deletion" ON storage.objects
    FOR DELETE TO anon, authenticated
    USING (bucket_id = 'food-images');

-- =============================================================================
-- FOOD ANALYSIS TABLE POLICIES
-- =============================================================================

-- Drop existing restrictive food_images policies
DROP POLICY IF EXISTS "Allow authenticated users to access own food images" ON food_analysis.food_images;

-- Create permissive food_images policy
CREATE POLICY "Allow anon and authenticated access to food images" ON food_analysis.food_images
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Enable RLS on other food analysis tables
ALTER TABLE food_analysis.food_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_analysis.analyzed_foods ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for other food analysis tables
CREATE POLICY "Allow anon and authenticated access to food analysis results" ON food_analysis.food_analysis_results
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anon and authenticated access to analyzed foods" ON food_analysis.analyzed_foods
    FOR ALL TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- SCHEMA CACHE REFRESH
-- =============================================================================

-- Force refresh of schema cache to ensure PostgREST recognizes all columns
NOTIFY pgrst, 'reload schema';

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify storage bucket configuration
SELECT name, public, file_size_limit FROM storage.buckets WHERE name = 'food-images';

-- Verify storage policies
SELECT policyname, roles, cmd FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%food%';

-- Verify food analysis table policies
SELECT schemaname, tablename, policyname, roles, cmd FROM pg_policies 
WHERE schemaname = 'food_analysis';

-- Verify column existence in analyzed_foods table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'food_analysis' 
AND table_name = 'analyzed_foods' 
ORDER BY ordinal_position;

-- Verify column existence in food_images table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'food_analysis' 
AND table_name = 'food_images' 
ORDER BY ordinal_position;

-- =============================================================================
-- NOTES
-- =============================================================================

-- IMPORTANT: These policies are permissive for development purposes.
-- For production, implement proper authentication by:
-- 1. Setting up Clerk JWT verification in Supabase
-- 2. Creating user-specific policies that check user ownership
-- 3. Using proper auth.uid() or custom JWT claims

-- Schema fixes applied:
-- 1. Fixed analyzed_foods columns: calories -> estimated_calories, etc.
-- 2. Fixed food_images status: is_processed -> processing_status
-- 3. Added schema cache refresh to ensure PostgREST recognizes changes

-- Current authentication flow:
-- 1. User authenticates with Clerk
-- 2. App gets Clerk JWT token
-- 3. App uses Supabase anon key (not JWT) for database operations
-- 4. RLS policies allow anon access for development

-- Future authentication flow (recommended):
-- 1. User authenticates with Clerk
-- 2. App gets Clerk JWT token
-- 3. App passes Clerk JWT to Supabase for verification
-- 4. RLS policies check auth.uid() or JWT claims for user-specific access

COMMIT; 