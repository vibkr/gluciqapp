import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, GlucoseReading, InsulinDose, User, UserPreferences } from './types';

// Supabase client configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Available schemas in our database
export const SCHEMAS = {
  USER_SERVICE: 'user_service',
  FOOD_SERVICE: 'food_service', 
  FOOD_ANALYSIS: 'food_analysis',
  LOGGING_SERVICE: 'logging_service',
  FORMULA_SERVICE: 'formula_service',
  MEAL_PLANNING: 'meal_planning',
} as const;

export type SchemaName = typeof SCHEMAS[keyof typeof SCHEMAS];

// For Expo Go compatibility, handle missing env vars gracefully
let supabase: any = null;

// Multi-schema client manager
class SupabaseClientManager {
  private clients: Map<SchemaName, any> = new Map();
  private mainClient: any = null;

  constructor() {
    if (supabaseUrl && supabaseKey) {
      // Create main client (without schema restriction for cross-schema queries)
      this.mainClient = createClient(supabaseUrl, supabaseKey);
      
      // Create schema-specific clients for focused operations
      Object.values(SCHEMAS).forEach(schema => {
        const client = createClient(supabaseUrl, supabaseKey, {
          db: { schema },
        });
        this.clients.set(schema, client);
      });
      
      console.log('Supabase clients initialized for all schemas:', Object.values(SCHEMAS));
    } else {
      console.warn('Supabase configuration missing. Running in offline mode for Expo Go compatibility.');
    }
  }

  // Get client for specific schema
  getClient(schema: SchemaName): any {
    const client = this.clients.get(schema);
    if (!client) {
      throw new Error(`No client available for schema: ${schema}`);
    }
    return client;
  }

  // Get main client for cross-schema operations
  getMainClient(): any {
    if (!this.mainClient) {
      throw new Error('Main Supabase client not available');
    }
    return this.mainClient;
  }

  // Convenience methods for each schema
  get userService() { return this.getClient(SCHEMAS.USER_SERVICE); }
  get foodService() { return this.getClient(SCHEMAS.FOOD_SERVICE); }
  get foodAnalysis() { return this.getClient(SCHEMAS.FOOD_ANALYSIS); }
  get loggingService() { return this.getClient(SCHEMAS.LOGGING_SERVICE); }
  get formulaService() { return this.getClient(SCHEMAS.FORMULA_SERVICE); }
  get mealPlanning() { return this.getClient(SCHEMAS.MEAL_PLANNING); }

  // Check if clients are available
  get isAvailable(): boolean {
    return this.mainClient !== null;
  }
}

// Create the client manager instance
const clientManager = new SupabaseClientManager();

// Export the main client for backward compatibility
if (clientManager.isAvailable) {
  supabase = clientManager.getMainClient();
}

// Export both the main client and the manager
export { supabase, clientManager as supabaseClientManager };

// Legacy exports for backward compatibility
export const supabaseFoodAnalysis = clientManager.isAvailable 
  ? clientManager.foodAnalysis 
  : null;

// Generate unique IDs
export const generateId = () => uuidv4();

// Create observables - handle both online and offline modes
let users$: any;
let glucoseReadings$: any;
let insulinDoses$: any;
let userPreferences$: any;
let userDiabetesSettings$: any;
let foodItems$: any;
let mealEntries$: any;
let foodAnalysisResults$: any;

if (supabase) {
  // Online mode with Supabase sync
  const customSynced = configureSynced(syncedSupabase, {
    persist: {
      plugin: observablePersistAsyncStorage({
        AsyncStorage,
      }),
    },
    generateId,
    supabase,
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
  });

  users$ = observable(
    customSynced({
      supabase,
      collection: 'users',
      select: (from) => from.select('id,email,display_name,first_name,last_name,diabetes_type,created_at,updated_at'),
      actions: ['read', 'create', 'update', 'delete'],
      realtime: true,
      persist: {
        name: 'users',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );

  glucoseReadings$ = observable(
    customSynced({
      supabase,
      collection: 'logging_service.glucose_readings',
      select: (from) => from.select('id,user_id,value,timestamp,notes,meal_context,source,created_at,updated_at'),
      actions: ['read', 'create', 'update', 'delete'],
      realtime: true,
      persist: {
        name: 'glucoseReadings',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );

  insulinDoses$ = observable(
    customSynced({
      supabase,
      collection: 'logging_service.insulin_doses',
      select: (from) => from.select('id,user_id,dose_type,units,timestamp,notes,created_at,updated_at'),
      actions: ['read', 'create', 'update', 'delete'],
      realtime: true,
      persist: {
        name: 'insulinDoses',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );

  userPreferences$ = observable(
    customSynced({
      supabase,
      collection: 'user_preferences',
      select: (from) => from.select('id,user_id,theme,language,notifications_enabled,email_notifications,push_notifications,created_at,updated_at'),
      actions: ['read', 'create', 'update', 'delete'],
      realtime: true,
      persist: {
        name: 'userPreferences',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );
} else {
  // Offline mode - local-only observables with persistence
  users$ = observable({});
  glucoseReadings$ = observable({});
  insulinDoses$ = observable({});
  userPreferences$ = observable({});

  // Configure local persistence for offline mode
  syncObservable(users$, {
    persist: {
      name: 'users',
      plugin: observablePersistAsyncStorage({ AsyncStorage }),
    },
  });

  syncObservable(glucoseReadings$, {
    persist: {
      name: 'glucoseReadings',
      plugin: observablePersistAsyncStorage({ AsyncStorage }),
    },
  });

  syncObservable(insulinDoses$, {
    persist: {
      name: 'insulinDoses',
      plugin: observablePersistAsyncStorage({ AsyncStorage }),
    },
  });

  syncObservable(userPreferences$, {
    persist: {
      name: 'userPreferences',
      plugin: observablePersistAsyncStorage({ AsyncStorage }),
    },
  });
}

export { glucoseReadings$, insulinDoses$, userPreferences$, users$ };

// Main app state observable
export const appState$ = observable<AppState>({
  user: null,
  glucoseReadings: {},
  insulinDoses: {},
  userPreferences: null,
  userDiabetesSettings: null,
  mealEntries: {},
  foodItems: {},
  isLoading: false,
  error: null,
});

// Helper functions for CRUD operations
export const database = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_active_at'>) {
    const id = generateId();
    const now = new Date().toISOString();
    const user: User = {
      id,
      ...userData,
      created_at: now,
      updated_at: now,
      last_active_at: now,
    };
    users$[id].set(user);
    return user;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const userRef = users$[id];
    if (userRef && userRef.assign) {
      userRef.assign({
        ...updates,
        updated_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      });
    }
  },

  async deleteUser(id: string) {
    users$[id].delete();
  },

  // Glucose reading operations
  async createGlucoseReading(readingData: Omit<GlucoseReading, 'id' | 'created_at' | 'updated_at'>) {
    const id = generateId();
    const now = new Date().toISOString();
    const reading: GlucoseReading = {
      id,
      ...readingData,
      created_at: now,
      updated_at: now,
    };
    glucoseReadings$[id].set(reading);
    return reading;
  },

  async updateGlucoseReading(id: string, updates: Partial<GlucoseReading>) {
    const readingRef = glucoseReadings$[id];
    if (readingRef && readingRef.assign) {
      readingRef.assign({
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  },

  async deleteGlucoseReading(id: string) {
    glucoseReadings$[id].delete();
  },

  // Insulin dose operations
  async createInsulinDose(doseData: Omit<InsulinDose, 'id' | 'created_at' | 'updated_at'>) {
    const id = generateId();
    const now = new Date().toISOString();
    const dose: InsulinDose = {
      id,
      ...doseData,
      created_at: now,
      updated_at: now,
    };
    insulinDoses$[id].set(dose);
    return dose;
  },

  async updateInsulinDose(id: string, updates: Partial<InsulinDose>) {
    const doseRef = insulinDoses$[id];
    if (doseRef && doseRef.assign) {
      doseRef.assign({
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  },

  async deleteInsulinDose(id: string) {
    insulinDoses$[id].delete();
  },

  // User preferences operations
  async createUserPreferences(prefsData: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>) {
    const id = generateId();
    const now = new Date().toISOString();
    const prefs: UserPreferences = {
      id,
      ...prefsData,
      created_at: now,
      updated_at: now,
    };
    userPreferences$[id].set(prefs);
    return prefs;
  },

  async updateUserPreferences(id: string, updates: Partial<UserPreferences>) {
    const prefsRef = userPreferences$[id];
    if (prefsRef && prefsRef.assign) {
      prefsRef.assign({
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  },

  async deleteUserPreferences(id: string) {
    userPreferences$[id].delete();
  },

  // Utility function to clear all local data
  async clearAllData() {
    users$.set({});
    glucoseReadings$.set({});
    insulinDoses$.set({});
    userPreferences$.set({});
    appState$.assign({
      user: null,
      userPreferences: null,
      glucoseReadings: {},
      insulinDoses: {},
      error: null,
    });
  },

  // Initialize the database (replaces the old SQLite initialization)
  async initialize() {
    try {
      if (supabase) {
        console.log('Database initialized with Legend State + Supabase (online mode)');
      } else {
        console.log('Database initialized with Legend State (offline mode for Expo Go)');
      }
      appState$.isLoading.set(false);
    } catch (error) {
      console.error('Database initialization failed:', error);
      appState$.error.set(error instanceof Error ? error.message : 'Unknown error');
      // Don't throw the error, just continue in offline mode
      appState$.isLoading.set(false);
    }
  },
};

// Export types and observables
export * from './types';
export { appState$ as state };

