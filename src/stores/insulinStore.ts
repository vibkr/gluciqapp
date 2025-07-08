import { observable } from '@legendapp/state';
import { InsulinProfile, StoredInsulinDose, InsulinCalculationResult } from '../types/insulin';
import { InsulinDose } from '../lib/api/types';
import { insulinService } from '../lib/services/InsulinService';
import { serviceOrchestrator } from '../lib/services/ServiceOrchestrator';

// Enhanced insulin store state
interface InsulinStoreState {
  // Legacy support
  doses: StoredInsulinDose[];
  userProfile: InsulinProfile | null;
  
  // Enhanced state
  currentCalculation: InsulinCalculationResult | null;
  recentDoses: InsulinDose[];
  insulinOnBoard: {
    active_units: number;
    recent_doses: InsulinDose[];
    breakdown: {
      dose_id: string;
      time: string;
      original_units: number;
      remaining_units: number;
      activity_percentage: number;
    }[];
  } | null;
  effectiveness: {
    average_response: number;
    consistency_score: number;
    carb_ratio_accuracy: number;
    correction_factor_accuracy: number;
    recommendations: string[];
  } | null;
  
  // UI state
  isLoading: boolean;
  isCalculating: boolean;
  error: string | null;
  lastSync: string | null;
}

// Default insulin profile for new users
const defaultInsulinProfile: InsulinProfile = {
  carb_ratios: [
    { time_start: "06:00", time_end: "12:00", ratio: 5 }, // Breakfast
    { time_start: "12:00", time_end: "18:00", ratio: 5 }, // Lunch
    { time_start: "18:00", time_end: "23:59", ratio: 5 }, // Dinner
    { time_start: "00:00", time_end: "06:00", ratio: 5 }, // Night
  ],
  sensitivity_factor: [
    { time_start: "06:00", time_end: "12:00", factor: 40 }, // Breakfast
    { time_start: "12:00", time_end: "18:00", factor: 50 }, // Lunch
    { time_start: "18:00", time_end: "23:59", factor: 45 }, // Dinner
    { time_start: "00:00", time_end: "06:00", factor: 60 }, // Night
  ],
  action_profile: {
    onset: 15,      // 15 minutes
    peak: 90,       // 1.5 hours
    duration: 240,  // 4 hours
  },
  safety_limits: {
    max_single_dose: 20,
    max_daily_dose: 100,
    min_carbs_for_dose: 5,
  },
};

// Create store
export const insulinStore = observable<InsulinStoreState>({
  // Legacy
  doses: [],
  userProfile: defaultInsulinProfile,
  
  // Enhanced
  currentCalculation: null,
  recentDoses: [],
  insulinOnBoard: null,
  effectiveness: null,
  
  // UI state
  isLoading: false,
  isCalculating: false,
  error: null,
  lastSync: null,
});

// Enhanced store actions
export const insulinActions = {
  // Enhanced calculation with food integration
  calculateInsulinDose: async (params: {
    userId: string;
    carbohydrates?: number;
    currentGlucose?: number;
    targetGlucose?: number;
    mealId?: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }): Promise<InsulinCalculationResult | null> => {
    try {
      insulinStore.isCalculating.set(true);
      insulinStore.error.set(null);

      const response = await insulinService.calculateInsulinDose(params);
      
      if (response.success && response.data) {
        insulinStore.currentCalculation.set(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Calculation failed');
      }
    } catch (error) {
      console.error('Error calculating insulin dose:', error);
      insulinStore.error.set(error instanceof Error ? error.message : 'Calculation failed');
      return null;
    } finally {
      insulinStore.isCalculating.set(false);
    }
  },

  // Complete workflow: calculate and log insulin
  calculateAndLogInsulin: async (params: {
    userId: string;
    carbohydrates?: number;
    currentGlucose?: number;
    mealId?: string;
    notes?: string;
  }): Promise<{ calculationId: string; doseId?: string; recommendation: any } | null> => {
    try {
      insulinStore.isCalculating.set(true);
      insulinStore.isLoading.set(true);
      insulinStore.error.set(null);

      const response = await serviceOrchestrator.calculateAndLogInsulin(params);
      
      if (response.success && response.data) {
        // Update current calculation
        insulinStore.currentCalculation.set(response.data.recommendation);
        
        // Refresh data
        await insulinActions.refreshRecentDoses(params.userId);
        await insulinActions.refreshInsulinOnBoard(params.userId);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Workflow failed');
      }
    } catch (error) {
      console.error('Error in calculate and log workflow:', error);
      insulinStore.error.set(error instanceof Error ? error.message : 'Workflow failed');
      return null;
    } finally {
      insulinStore.isCalculating.set(false);
      insulinStore.isLoading.set(false);
    }
  },

  // Log insulin dose
  logInsulinDose: async (dose: Omit<InsulinDose, 'id' | 'timestamp'>): Promise<InsulinDose | null> => {
    try {
      insulinStore.isLoading.set(true);
      insulinStore.error.set(null);

      const response = await insulinService.logInsulinDose(dose);
      
      if (response.success && response.data) {
        // Add to recent doses
        const recentDoses = insulinStore.recentDoses.get();
        insulinStore.recentDoses.set([response.data, ...recentDoses.slice(0, 19)]);
        
        // Add to legacy doses for backward compatibility
        const legacyDose: StoredInsulinDose = {
          id: response.data.id,
          user_id: response.data.user_id,
          calculated_dose: response.data.calculated_dose,
          user_final_dose: response.data.user_final_dose,
          carbohydrates: response.data.carbohydrates || 0,
          glucose_reading: response.data.glucose_reading,
          timestamp: response.data.timestamp,
          notes: response.data.notes
        };
        
        const doses = insulinStore.doses.get();
        insulinStore.doses.set([legacyDose, ...doses]);
        
        // Refresh IOB
        await insulinActions.refreshInsulinOnBoard(dose.user_id);
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to log dose');
      }
    } catch (error) {
      console.error('Error logging insulin dose:', error);
      insulinStore.error.set(error instanceof Error ? error.message : 'Failed to log dose');
      return null;
    } finally {
      insulinStore.isLoading.set(false);
    }
  },

  // Refresh insulin on board
  refreshInsulinOnBoard: async (userId: string): Promise<void> => {
    try {
      const response = await insulinService.getInsulinOnBoard(userId);
      
      if (response.success && response.data) {
        insulinStore.insulinOnBoard.set(response.data);
      }
    } catch (error) {
      console.error('Error refreshing IOB:', error);
    }
  },

  // Refresh recent doses
  refreshRecentDoses: async (userId: string): Promise<void> => {
    try {
      const response = await insulinService.getRecentDoses(userId, 24);
      
      if (response.success && response.data) {
        insulinStore.recentDoses.set(response.data);
        
        // Update legacy doses for backward compatibility
        const legacyDoses: StoredInsulinDose[] = response.data.map(dose => ({
          id: dose.id,
          user_id: dose.user_id,
          calculated_dose: dose.calculated_dose,
          user_final_dose: dose.user_final_dose,
          carbohydrates: dose.carbohydrates || 0,
          glucose_reading: dose.glucose_reading,
          timestamp: dose.timestamp,
          notes: dose.notes
        }));
        
        insulinStore.doses.set(legacyDoses);
      }
    } catch (error) {
      console.error('Error refreshing recent doses:', error);
    }
  },

  // Get insulin effectiveness
  refreshInsulinEffectiveness: async (userId: string, days: number = 14): Promise<void> => {
    try {
      const response = await insulinService.getInsulinEffectiveness(userId, days);
      
      if (response.success && response.data) {
        insulinStore.effectiveness.set(response.data);
      }
    } catch (error) {
      console.error('Error refreshing insulin effectiveness:', error);
    }
  },

  // Update insulin profile
  updateInsulinProfile: async (userId: string, profile: Partial<InsulinProfile>): Promise<boolean> => {
    try {
      insulinStore.isLoading.set(true);
      insulinStore.error.set(null);

      const response = await insulinService.updateInsulinProfile(userId, profile);
      
      if (response.success && response.data) {
        // Update local profile (convert API types to legacy types)
        const legacyProfile: InsulinProfile = {
          carb_ratios: response.data.carb_ratios,
          sensitivity_factor: response.data.sensitivity_factor,
          action_profile: response.data.action_profile,
          safety_limits: response.data.safety_limits
        };
        
        insulinStore.userProfile.set(legacyProfile);
        return true;
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating insulin profile:', error);
      insulinStore.error.set(error instanceof Error ? error.message : 'Failed to update profile');
      return false;
    } finally {
      insulinStore.isLoading.set(false);
    }
  },

  // Clear error
  clearError: () => {
    insulinStore.error.set(null);
  },

  // Legacy actions for backward compatibility
  // Legacy: Add a new dose
  addDose: (dose: Omit<StoredInsulinDose, 'id'>) => {
    const newDose: StoredInsulinDose = {
      ...dose,
      id: `dose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    insulinStore.doses.push(newDose);
  },

  // Get recent doses (within last N hours)
  getRecentDoses: (hoursBack: number = 4): StoredInsulinDose[] => {
    const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
    return insulinStore.doses.get().filter(dose => 
      new Date(dose.timestamp) > cutoffTime
    );
  },

  // Calculate insulin on board
  calculateInsulinOnBoard: (): number => {
    const recentDoses = insulinActions.getRecentDoses(4);
    const profile = insulinStore.userProfile.get();
    
    if (!profile || recentDoses.length === 0) return 0;

    let totalIOB = 0;
    const now = Date.now();

    recentDoses.forEach(dose => {
      const doseTime = new Date(dose.timestamp).getTime();
      const minutesSince = (now - doseTime) / (1000 * 60);
      
      // Only count if within action duration
      if (minutesSince < profile.action_profile.duration) {
        // Simple linear decay model for IOB
        const remainingActivity = Math.max(0, 
          1 - (minutesSince / profile.action_profile.duration)
        );
        totalIOB += dose.user_final_dose * remainingActivity;
      }
    });

    return totalIOB;
  },

  // Legacy: Update user profile
  updateProfile: (profile: Partial<InsulinProfile>) => {
    const currentProfile = insulinStore.userProfile.get();
    if (currentProfile) {
      insulinStore.userProfile.set({ ...currentProfile, ...profile });
    }
  },

  // Get doses for a specific date
  getDosesForDate: (date: Date): StoredInsulinDose[] => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return insulinStore.doses.get().filter(dose => {
      const doseDate = new Date(dose.timestamp);
      return doseDate >= startOfDay && doseDate <= endOfDay;
    });
  },

  // Get total daily insulin
  getDailyTotal: (date: Date): number => {
    const dosesForDay = insulinActions.getDosesForDate(date);
    return dosesForDay.reduce((total, dose) => total + dose.user_final_dose, 0);
  },

  // Clear all doses (for testing/reset)
  clearDoses: () => {
    insulinStore.doses.set([]);
  },

  // Enhanced: Load all user data
  loadUserData: async (userId: string) => {
    try {
      insulinStore.isLoading.set(true);
      insulinStore.error.set(null);
      
      // Load all insulin-related data
      await Promise.all([
        insulinActions.refreshRecentDoses(userId),
        insulinActions.refreshInsulinOnBoard(userId),
        insulinActions.refreshInsulinEffectiveness(userId)
      ]);
      
      insulinStore.lastSync.set(new Date().toISOString());
    } catch (error) {
      console.error('Failed to load user insulin data:', error);
      insulinStore.error.set('Failed to load insulin data');
    } finally {
      insulinStore.isLoading.set(false);
    }
  },
};

// Computed values
export const insulinComputed = {
  // Get current insulin on board amount
  getCurrentIOB: () => {
    const iob = insulinStore.insulinOnBoard.get();
    return iob?.active_units || 0;
  },

  // Get today's total insulin
  getTodaysTotalInsulin: (userId: string) => {
    const recentDoses = insulinStore.recentDoses.get();
    const today = new Date().toDateString();
    
    return recentDoses
      .filter(dose => 
        dose.user_id === userId && 
        new Date(dose.timestamp).toDateString() === today
      )
      .reduce((total, dose) => total + dose.user_final_dose, 0);
  },

  // Get current calculation carb dose
  getCurrentCarbDose: () => {
    const calculation = insulinStore.currentCalculation.get();
    return calculation?.carb_dose?.units || 0;
  },

  // Get current calculation total recommendation
  getCurrentRecommendation: () => {
    const calculation = insulinStore.currentCalculation.get();
    return calculation?.total_recommendation?.units || 0;
  },

  // Get current calculation confidence
  getCurrentConfidence: () => {
    const calculation = insulinStore.currentCalculation.get();
    return calculation?.total_recommendation?.confidence_level || 0;
  },

  // Get effectiveness score
  getEffectivenessScore: () => {
    const effectiveness = insulinStore.effectiveness.get();
    if (!effectiveness) return 0;
    
    return Math.round(
      (effectiveness.average_response + 
       effectiveness.consistency_score + 
       effectiveness.carb_ratio_accuracy + 
       effectiveness.correction_factor_accuracy) / 4 * 100
    );
  }
};

// Export hook for React components
export const useInsulinStore = () => {
  return {
    store: insulinStore,
    actions: insulinActions,
    computed: insulinComputed
  };
};