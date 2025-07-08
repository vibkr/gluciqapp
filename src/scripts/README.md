# Database Scripts and Migration Guide

This directory contains SQL scripts and migration utilities for the Modern Chat App database.

## Recent Schema Fixes (2025-01-07)

### Issue Resolution
Fixed critical database schema mismatches that were causing the food analysis pipeline to fail:

1. **Column Name Mismatches**:
   - `analyzed_foods` table: Application was using `calories` but schema has `estimated_calories`
   - `food_images` table: Application was using `is_processed` but schema has `processing_status`

2. **Missing Column Mappings**:
   - Added proper mapping for `portion_amount` → `estimated_portion`
   - Added proper mapping for `carbs_g` → `estimated_carbs_g`
   - Added proper mapping for `protein_g` → `estimated_protein_g`
   - Added proper mapping for `fat_g` → `estimated_fat_g`

### Files Modified
- `src/lib/services/FoodAnalysisPipeline.ts` - Fixed column mappings in `storeAnalyzedFood()`
- `src/lib/storage/SupabaseImageService.ts` - Fixed `updateProcessingStatus()` method
- `src/scripts/fix_rls_policies.sql` - Updated with schema verification queries

### Schema Verification
The `fix_rls_policies.sql` script now includes verification queries to check:
- Column existence in `analyzed_foods` table
- Column existence in `food_images` table  
- RLS policies configuration
- Storage bucket policies

## Migration Files

### Production Migration System
- `production-migration-system.js` - Automated migration runner
- `versions/` - Versioned migration files (V2.0.0 - V2.7.0)

### Migration Versions
- **V2.0.0** - Global enums and extensions
- **V2.1.0** - User service schema
- **V2.2.0** - Food service schema
- **V2.3.0** - Food analysis schema (contains the fixed column definitions)
- **V2.4.0** - Logging service schema
- **V2.5.0** - Formula service schema
- **V2.6.0** - Meal planning schema
- **V2.7.0** - RLS policies and permissions

## Usage

### Apply RLS Policy Fixes
```sql
-- Run this in your Supabase SQL editor
\i src/scripts/fix_rls_policies.sql
```

### Run Migration System
```bash
node src/scripts/production-migration-system.js
```

### Test Data Setup
```sql
-- Load test data
\i src/scripts/test_data/test_users_and_data.sql
```

## Important Notes

1. **Development vs Production**: Current RLS policies are permissive for development. Production should implement proper Clerk JWT authentication.

2. **Schema Cache**: The fix script includes `NOTIFY pgrst, 'reload schema'` to refresh PostgREST's schema cache.

3. **Error Handling**: The application now properly handles schema mismatches and provides better error messages.

4. **Column Mapping**: All nutrition data is now properly mapped to the `estimated_*` columns in the database.

## Troubleshooting

If you encounter "column not found" errors:
1. Run the verification queries in `fix_rls_policies.sql`
2. Check that migrations V2.3.0 has been applied
3. Verify schema cache has been refreshed
4. Ensure RLS policies are properly configured

## Future Improvements

1. Implement proper Clerk JWT authentication
2. Add user-specific RLS policies
3. Add database-level validation for nutrition data
4. Implement proper error tracking and logging 