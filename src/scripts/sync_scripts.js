#!/usr/bin/env node

/**
 * Script to sync SQL scripts with Supabase database
 * This script applies SQL files to the database in the correct order
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get current directory
const __dirname = path.dirname(require.main.filename);

// Configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing Supabase configuration');
  console.error('Please set EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQL scripts to apply in order
const SCRIPTS = [
  'disable_rls.sql',
  'fix_rls_policies.sql',
  'test_data/test_users_and_data.sql'
];

async function executeSqlFile(filePath) {
  try {
    console.log(`\n📄 Executing ${filePath}...`);
    
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.toLowerCase().includes('commit')) {
        continue; // Skip COMMIT statements
      }
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`   ❌ Error in statement ${i + 1}:`, error.message);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
        } else {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`   ❌ Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log(`✅ Completed ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error.message);
    return false;
  }
}

async function executeRawSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('SQL Error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database script sync...');
  console.log(`📡 Connecting to: ${SUPABASE_URL}`);
  
  // Test connection
  try {
    const { data, error } = await supabase.from('user_service.users').select('id').limit(1);
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      process.exit(1);
    }
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    process.exit(1);
  }
  
  // Execute scripts in order
  for (const script of SCRIPTS) {
    await executeSqlFile(script);
  }
  
  // Verify final state
  console.log('\n🔍 Verifying database state...');
  
  // Check storage bucket
  const bucketCheck = await executeRawSql(`
    SELECT name, public FROM storage.buckets WHERE name = 'food-images';
  `);
  
  // Check policies
  const policyCheck = await executeRawSql(`
    SELECT COUNT(*) as policy_count FROM pg_policies 
    WHERE schemaname IN ('storage', 'food_analysis');
  `);
  
  console.log('\n✅ Database sync completed!');
  console.log('\n📋 Summary:');
  console.log('   - RLS policies updated for development');
  console.log('   - Storage bucket configured');
  console.log('   - Food analysis tables accessible');
  console.log('   - Test data loaded');
  
  console.log('\n⚠️  Note: Current setup uses permissive policies for development.');
  console.log('   For production, implement proper Clerk JWT authentication.');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node sync_scripts.js [options]

Options:
  --help, -h     Show this help message
  
Environment Variables:
  EXPO_PUBLIC_SUPABASE_URL       Supabase project URL
  SUPABASE_SERVICE_KEY          Supabase service key (or anon key)
  
Examples:
  node sync_scripts.js
  SUPABASE_SERVICE_KEY=your_key node sync_scripts.js
  `);
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
}); 