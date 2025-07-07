import { useAuth } from '@clerk/clerk-expo';
import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function createClerkSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'user_service', // Default schema for user-related queries
    },
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    },
  });
}

// Hook version for React components with proper JWT handling
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();
  
  const supabaseClient = useMemo(() => {
    return createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'user_service', // Default schema for user-related queries
      },
      auth: {
        persistSession: false,
      },
      global: {
        fetch: async (url, options = {}) => {
          // Get the Clerk JWT token
          const clerkToken = await getToken();
          
          // Add the Authorization header with the Clerk JWT
          const headers = {
            ...options.headers,
            Authorization: clerkToken ? `Bearer ${clerkToken}` : `Bearer ${supabaseAnonKey}`,
          };

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    });
  }, [getToken]);

  return supabaseClient;
}