import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { configureSynced, syncObservable } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';
import { supabaseClientManager } from '../lib/database';
import type { 
  User, 
  UserPreferences, 
  UserDiabetesSettings, 
  NewUser, 
  NewUserPreferences,
  NewUserDiabetesSettings,
  DiabetesType,
  ProgramType,
  UserRole
} from '../lib/database/types';

// Onboarding step enum
export enum OnboardingStep {
  WELCOME = 0,
  BASIC_PROFILE = 1,
  DIABETES_TYPE = 2,
  MEDICAL_SETTINGS = 3,
  PREFERENCES = 4,
  COMPLETION = 5
}

// User store state interface
interface UserStoreState {
  // Core user data
  profile: User | null;
  preferences: UserPreferences | null;
  diabetesSettings: UserDiabetesSettings | null;
  
  // Onboarding state
  onboardingStep: number;
  onboardingCompleted: boolean;
  
  // Sync state
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncError: string | null;
  
  // UI state
  isOnboardingActive: boolean;
  profileCompletionPercentage: number;
}

// Create the main user store
export const userStore = observable<UserStoreState>({
  profile: null,
  preferences: null,
  diabetesSettings: null,
  onboardingStep: OnboardingStep.WELCOME,
  onboardingCompleted: false,
  isLoading: true,
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,
  isOnboardingActive: false,
  profileCompletionPercentage: 0,
});

// Computed values
export const userComputed = {
  get isProfileComplete() {
    const profile = userStore.profile.get();
    if (!profile) return false;
    
    // Check required fields for profile completion
    const requiredFields = [
      'first_name',
      'last_name',
      'date_of_birth',
      'diabetes_type',
      'preferred_units',
      'glucose_unit',
      'timezone',
      'language'
    ];
    
    return requiredFields.every(field => 
      profile[field as keyof User] !== null && 
      profile[field as keyof User] !== undefined &&
      profile[field as keyof User] !== ''
    );
  },
  
  get needsOnboarding() {
    const profile = userStore.profile.get();
    return !profile || !profile.onboarding_completed || !this.isProfileComplete;
  },
  
  get profileCompletionPercentage() {
    const profile = userStore.profile.get();
    if (!profile) return 0;
    
    const allFields = [
      'first_name', 'last_name', 'date_of_birth', 'phone',
      'diabetes_type', 'diagnosis_date', 'height_cm', 'current_weight_kg',
      'preferred_units', 'glucose_unit', 'timezone', 'language',
      'has_cgm', 'has_insulin_pump', 'goal_a1c',
      'emergency_contact_name', 'emergency_contact_phone'
    ];
    
    const completedFields = allFields.filter(field => {
      const value = profile[field as keyof User];
      return value !== null && value !== undefined && value !== '';
    });
    
    return Math.round((completedFields.length / allFields.length) * 100);
  }
};

// Configure Supabase sync for user data
let userProfileSync: any = null;
let userPreferencesSync: any = null;
let userDiabetesSettingsSync: any = null;

if (supabaseClientManager.isAvailable) {
  const customSynced = configureSynced(syncedSupabase, {
    persist: {
      plugin: observablePersistAsyncStorage({
        AsyncStorage,
      }),
    },
    generateId: () => crypto.randomUUID(),
    supabase: supabaseClientManager.userService,
    fieldCreatedAt: 'created_at',
    fieldUpdatedAt: 'updated_at',
  });

  // User profile sync
  userProfileSync = observable(
    customSynced({
      supabase: supabaseClientManager.userService,
      collection: 'users',
      select: (from) => from.select(`
        id, auth_user_id, email, email_verified, display_name, first_name, last_name,
        phone, date_of_birth, user_role, program_type, diabetes_type, diagnosis_date,
        height_cm, current_weight_kg, target_weight_kg, preferred_units, glucose_unit,
        timezone, language, has_cgm, cgm_brand, has_insulin_pump, insulin_pump_brand,
        goal_a1c, daily_step_goal, weekly_exercise_sessions, emergency_contact_name,
        emergency_contact_phone, emergency_contact_relationship, is_active,
        onboarding_completed, onboarding_step, created_at, updated_at, last_active_at
      `),
      actions: ['read', 'create', 'update'],
      realtime: true,
      persist: {
        name: 'userProfile',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );

  // User preferences sync
  userPreferencesSync = observable(
    customSynced({
      supabase: supabaseClientManager.userService,
      collection: 'user_preferences',
      select: (from) => from.select(`
        id, user_id, notifications_enabled, email_notifications, push_notifications,
        glucose_reminders, insulin_reminders, meal_reminders, data_sharing_enabled,
        analytics_enabled, theme, font_size, high_contrast, reduce_motion,
        created_at, updated_at
      `),
      actions: ['read', 'create', 'update'],
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

  // User diabetes settings sync
  userDiabetesSettingsSync = observable(
    customSynced({
      supabase: supabaseClientManager.userService,
      collection: 'user_diabetes_settings',
      select: (from) => from.select(`
        id, user_id, carb_ratios, correction_factors, target_glucose_min,
        target_glucose_max, insulin_duration_hours, insulin_onset_minutes,
        max_bolus_units, created_at, updated_at
      `),
      actions: ['read', 'create', 'update'],
      realtime: true,
      persist: {
        name: 'userDiabetesSettings',
        retrySync: true,
      },
      retry: {
        infinite: true,
      },
    })
  );
} else {
  // Offline mode - configure local persistence only
  syncObservable(userStore, {
    persist: {
      name: 'userStore',
      plugin: observablePersistAsyncStorage({ AsyncStorage }),
    },
  });
}

// User actions
export const userActions = {
  // Initialize user data from Clerk
  async initializeUser(clerkUser: any) {
    try {
      userStore.isLoading.set(true);
      userStore.syncError.set(null);
      
      const userId = clerkUser.id;
      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      
      // Check if user exists in Supabase
      let existingUser = null;
      if (supabaseClientManager.isAvailable) {
        const { data, error } = await supabaseClientManager.userService
          .from('users')
          .select('*')
          .eq('auth_user_id', userId)
          .single();
        
        if (!error && data) {
          existingUser = data;
        }
      }
      
      if (existingUser) {
        // Load existing user data
        userStore.profile.set(existingUser);
        await userActions.loadUserPreferences(existingUser.id);
        await userActions.loadUserDiabetesSettings(existingUser.id);
        
        // Update profile completion percentage
        userStore.profileCompletionPercentage.set(userComputed.profileCompletionPercentage);
      } else {
        // Create new user record
        const newUser: NewUser = {
          auth_user_id: userId,
          email,
          email_verified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          display_name: clerkUser.fullName || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          user_role: 'patient' as UserRole,
          diabetes_type: 'type1' as DiabetesType, // Default, will be updated in onboarding
          preferred_units: 'metric',
          glucose_unit: 'mg/dL',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: 'en',
          has_cgm: false,
          has_insulin_pump: false,
          daily_step_goal: 10000,
          weekly_exercise_sessions: 3,
          is_active: true,
          onboarding_completed: false,
          onboarding_step: OnboardingStep.WELCOME,
        };
        
        const createdUser = await userActions.createUser(newUser);
        if (createdUser) {
          userStore.profile.set(createdUser);
          userStore.onboardingStep.set(OnboardingStep.WELCOME);
          userStore.onboardingCompleted.set(false);
          userStore.isOnboardingActive.set(true);
        }
      }
      
      userStore.isLoading.set(false);
      userStore.lastSyncTime.set(new Date().toISOString());
      
    } catch (error) {
      console.error('Error initializing user:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
      userStore.isLoading.set(false);
    }
  },
  
  // Create new user
  async createUser(userData: NewUser): Promise<User | null> {
    try {
      userStore.isSyncing.set(true);
      
      if (supabaseClientManager.isAvailable) {
        const { data, error } = await supabaseClientManager.userService
          .from('users')
          .insert(userData)
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to create user: ${error.message}`);
        }
        
        return data;
      } else {
        // Offline mode - create local user with generated ID
        const localUser: User = {
          id: crypto.randomUUID(),
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_active_at: new Date().toISOString(),
        };
        
        return localUser;
      }
    } catch (error) {
      console.error('Error creating user:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
      return null;
    } finally {
      userStore.isSyncing.set(false);
    }
  },
  
  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<boolean> {
    try {
      userStore.isSyncing.set(true);
      const currentProfile = userStore.profile.get();
      
      if (!currentProfile) {
        throw new Error('No user profile to update');
      }
      
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      };
      
      if (supabaseClientManager.isAvailable) {
        const { data, error } = await supabaseClientManager.userService
          .from('users')
          .update(updatedData)
          .eq('id', currentProfile.id)
          .select()
          .single();
        
        if (error) {
          throw new Error(`Failed to update profile: ${error.message}`);
        }
        
        userStore.profile.set(data);
      } else {
        // Offline mode - update local profile
        const updatedProfile = { ...currentProfile, ...updatedData };
        userStore.profile.set(updatedProfile);
      }
      
      // Update completion percentage
      userStore.profileCompletionPercentage.set(userComputed.profileCompletionPercentage);
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      userStore.isSyncing.set(false);
    }
  },
  
  // Load user preferences
  async loadUserPreferences(userId: string): Promise<void> {
    if (!supabaseClientManager.isAvailable) return;
    
    try {
      const { data, error } = await supabaseClientManager.userService
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        userStore.preferences.set(data);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  },
  
  // Load user diabetes settings
  async loadUserDiabetesSettings(userId: string): Promise<void> {
    if (!supabaseClientManager.isAvailable) return;
    
    try {
      const { data, error } = await supabaseClientManager.userService
        .from('user_diabetes_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        userStore.diabetesSettings.set(data);
      }
    } catch (error) {
      console.error('Error loading diabetes settings:', error);
    }
  },
  
  // Create or update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      userStore.isSyncing.set(true);
      const currentProfile = userStore.profile.get();
      const currentPreferences = userStore.preferences.get();
      
      if (!currentProfile) {
        throw new Error('No user profile found');
      }
      
      const updatedData = {
        ...preferences,
        user_id: currentProfile.id,
        updated_at: new Date().toISOString(),
      };
      
      if (supabaseClientManager.isAvailable) {
        if (currentPreferences) {
          // Update existing preferences
          const { data, error } = await supabaseClientManager.userService
            .from('user_preferences')
            .update(updatedData)
            .eq('id', currentPreferences.id)
            .select()
            .single();
          
          if (error) {
            throw new Error(`Failed to update preferences: ${error.message}`);
          }
          
          userStore.preferences.set(data);
        } else {
          // Create new preferences
          const newPreferences: NewUserPreferences = {
            user_id: currentProfile.id,
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: true,
            glucose_reminders: true,
            insulin_reminders: true,
            meal_reminders: true,
            data_sharing_enabled: false,
            analytics_enabled: true,
            theme: 'system',
            font_size: 'medium',
            high_contrast: false,
            reduce_motion: false,
            ...preferences,
          };
          
          const { data, error } = await supabaseClientManager.userService
            .from('user_preferences')
            .insert(newPreferences)
            .select()
            .single();
          
          if (error) {
            throw new Error(`Failed to create preferences: ${error.message}`);
          }
          
          userStore.preferences.set(data);
        }
      } else {
        // Offline mode
        const updatedPreferences = currentPreferences 
          ? { ...currentPreferences, ...updatedData }
          : { 
              id: crypto.randomUUID(),
              ...updatedData,
              created_at: new Date().toISOString(),
            } as UserPreferences;
        
        userStore.preferences.set(updatedPreferences);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      userStore.isSyncing.set(false);
    }
  },
  
  // Create or update diabetes settings
  async updateDiabetesSettings(settings: Partial<UserDiabetesSettings>): Promise<boolean> {
    try {
      userStore.isSyncing.set(true);
      const currentProfile = userStore.profile.get();
      const currentSettings = userStore.diabetesSettings.get();
      
      if (!currentProfile) {
        throw new Error('No user profile found');
      }
      
      const updatedData = {
        ...settings,
        user_id: currentProfile.id,
        updated_at: new Date().toISOString(),
      };
      
      if (supabaseClientManager.isAvailable) {
        if (currentSettings) {
          // Update existing settings
          const { data, error } = await supabaseClientManager.userService
            .from('user_diabetes_settings')
            .update(updatedData)
            .eq('id', currentSettings.id)
            .select()
            .single();
          
          if (error) {
            throw new Error(`Failed to update diabetes settings: ${error.message}`);
          }
          
          userStore.diabetesSettings.set(data);
        } else {
          // Create new settings with defaults
          const newSettings: NewUserDiabetesSettings = {
            user_id: currentProfile.id,
            carb_ratios: [
              { meal: 'breakfast', ratio: 15 },
              { meal: 'lunch', ratio: 15 },
              { meal: 'dinner', ratio: 15 },
              { meal: 'snack', ratio: 20 }
            ],
            correction_factors: [
              { time: 'morning', factor: 50 },
              { time: 'afternoon', factor: 50 },
              { time: 'evening', factor: 50 }
            ],
            target_glucose_min: 80,
            target_glucose_max: 180,
            insulin_duration_hours: 4,
            insulin_onset_minutes: 15,
            max_bolus_units: 20,
            ...settings,
          };
          
          const { data, error } = await supabaseClientManager.userService
            .from('user_diabetes_settings')
            .insert(newSettings)
            .select()
            .single();
          
          if (error) {
            throw new Error(`Failed to create diabetes settings: ${error.message}`);
          }
          
          userStore.diabetesSettings.set(data);
        }
      } else {
        // Offline mode
        const updatedSettings = currentSettings 
          ? { ...currentSettings, ...updatedData }
          : { 
              id: crypto.randomUUID(),
              ...updatedData,
              created_at: new Date().toISOString(),
            } as UserDiabetesSettings;
        
        userStore.diabetesSettings.set(updatedSettings);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating diabetes settings:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      userStore.isSyncing.set(false);
    }
  },
  
  // Onboarding actions
  async updateOnboardingStep(step: OnboardingStep): Promise<void> {
    userStore.onboardingStep.set(step);
    await userActions.updateProfile({ onboarding_step: step });
  },
  
  async completeOnboarding(): Promise<boolean> {
    const success = await userActions.updateProfile({ 
      onboarding_completed: true,
      onboarding_step: OnboardingStep.COMPLETION
    });
    
    if (success) {
      userStore.onboardingCompleted.set(true);
      userStore.isOnboardingActive.set(false);
    }
    
    return success;
  },
  
  // Utility actions
  async syncData(): Promise<void> {
    if (!supabaseClientManager.isAvailable) return;
    
    try {
      userStore.isSyncing.set(true);
      userStore.syncError.set(null);
      
      const currentProfile = userStore.profile.get();
      if (currentProfile) {
        await userActions.loadUserPreferences(currentProfile.id);
        await userActions.loadUserDiabetesSettings(currentProfile.id);
      }
      
      userStore.lastSyncTime.set(new Date().toISOString());
    } catch (error) {
      console.error('Error syncing data:', error);
      userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      userStore.isSyncing.set(false);
    }
  },
  
  async clearUserData(): Promise<void> {
    userStore.profile.set(null);
    userStore.preferences.set(null);
    userStore.diabetesSettings.set(null);
    userStore.onboardingStep.set(OnboardingStep.WELCOME);
    userStore.onboardingCompleted.set(false);
    userStore.isOnboardingActive.set(false);
    userStore.profileCompletionPercentage.set(0);
    userStore.syncError.set(null);
    userStore.lastSyncTime.set(null);
  },
};

// Export for React components
export const useUserStore = () => {
  return {
    store: userStore,
    computed: userComputed,
    actions: userActions,
  };
};

// Initialize store on app start
export const initializeUserStore = async () => {
  try {
    userStore.isLoading.set(true);
    
    // The store will be initialized when user logs in via Clerk
    // This is just for setting up the persistence layer
    
    userStore.isLoading.set(false);
  } catch (error) {
    console.error('Error initializing user store:', error);
    userStore.syncError.set(error instanceof Error ? error.message : 'Unknown error');
    userStore.isLoading.set(false);
  }
}; 