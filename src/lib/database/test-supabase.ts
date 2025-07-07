// Simple test for Supabase database connection
import { supabase } from './supabase';

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('user_service.users') 
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
    
  } catch (error) {
    console.error('Supabase test failed:', error);
    return false;
  }
}

export async function testSupabaseAuth(): Promise<boolean> {
  try {
    console.log('Testing Supabase auth...');
    
    // Test auth session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth error:', error.message);
      return false;
    }
    
    console.log('Supabase auth check completed:', session ? 'Authenticated' : 'Not authenticated');
    return true;
    
  } catch (error) {
    console.error('Supabase auth test failed:', error);
    return false;
  }
}

export async function testLoadTestUser(): Promise<boolean> {
  try {
    console.log('Testing test user data loading...');
    
    const TEST_USER_ID = '11111111-1111-1111-1111-111111111111';
    
    // Try to load the test user
    const { data, error } = await supabase
      .from('user_service.users')
      .select('*')
      .eq('id', TEST_USER_ID)
      .single();
    
    if (error) {
      console.error('Test user loading error:', error.message);
      return false;
    }
    
    if (data) {
      console.log('Test user loaded successfully:', data.first_name, data.last_name);
      return true;
    } else {
      console.error('Test user not found');
      return false;
    }
    
  } catch (error) {
    console.error('Test user loading failed:', error);
    return false;
  }
}