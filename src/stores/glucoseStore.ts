import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database, glucoseReadings$ } from '../lib/database';
import { GlucoseReading, NewGlucoseReading } from '../lib/database/types';

interface GlucoseData {
  isLoading: boolean;
  error: string | null;
  lastSyncAt: number;
}

// Create the observable glucose store for UI state
export const glucoseStore = observable<GlucoseData>({
  isLoading: false,
  error: null,
  lastSyncAt: 0,
});

// Configure persistence for UI state only
syncObservable(glucoseStore, {
  persist: {
    name: 'glucoseStore',
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

// Actions that work with the main database observables
export const glucoseActions = {
  setLoading: (loading: boolean) => {
    glucoseStore.isLoading.set(loading);
  },

  setError: (error: string | null) => {
    glucoseStore.error.set(error);
    glucoseStore.isLoading.set(false);
  },

  clearError: () => {
    glucoseStore.error.set(null);
  },

  addReading: async (reading: Omit<NewGlucoseReading, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      glucoseActions.setLoading(true);
      glucoseActions.clearError();

      // Use the database utility which handles Legend State + Supabase sync
      const newReading = await database.createGlucoseReading(reading);
      console.log('Added reading:', newReading);
      
      glucoseActions.setLoading(false);
      return newReading;
    } catch (error) {
      console.error('Error adding glucose reading:', error);
      glucoseActions.setError('Failed to add glucose reading');
      throw error;
    }
  },

  updateReading: async (id: string, updatedData: Partial<GlucoseReading>) => {
    try {
      glucoseActions.setLoading(true);
      glucoseActions.clearError();

      // Use the database utility
      await database.updateGlucoseReading(id, updatedData);
      console.log('Updated reading:', id, updatedData);
      
      glucoseActions.setLoading(false);
    } catch (error) {
      console.error('Error updating glucose reading:', error);
      glucoseActions.setError('Failed to update glucose reading');
      throw error;
    }
  },

  deleteReading: async (id: string) => {
    try {
      glucoseActions.setLoading(true);
      glucoseActions.clearError();

      // Use the database utility
      await database.deleteGlucoseReading(id);
      console.log('Deleted reading:', id);
      
      glucoseActions.setLoading(false);
    } catch (error) {
      console.error('Error deleting glucose reading:', error);
      glucoseActions.setError('Failed to delete glucose reading');
      throw error;
    }
  },

  // Helper functions that work with the reactive data
  getTodaysReadings: (userId: string): GlucoseReading[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allReadings = glucoseReadings$.get();
    return Object.values(allReadings || {}).filter(reading => 
      reading.userId === userId && 
      new Date(reading.timestamp) >= today
    );
  },

  getAverageToday: (userId: string): number => {
    const todaysReadings = glucoseActions.getTodaysReadings(userId);
    if (todaysReadings.length === 0) return 0;
    
    const sum = todaysReadings.reduce((acc, reading) => acc + reading.value, 0);
    return sum / todaysReadings.length;
  },

  getLastReading: (userId: string): GlucoseReading | null => {
    const allReadings = glucoseReadings$.get();
    const userReadings = Object.values(allReadings || {})
      .filter(reading => reading.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return userReadings[0] || null;
  },

  getUserReadings: (userId: string, limit = 50): GlucoseReading[] => {
    const allReadings = glucoseReadings$.get();
    return Object.values(allReadings || {})
      .filter(reading => reading.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },

  // Force sync from server (the observables handle this automatically, but this is for manual refresh)
  forceSync: async () => {
    try {
      glucoseActions.setLoading(true);
      glucoseActions.clearError();
      
      // The observable will automatically sync when accessed, but we can trigger it manually
      glucoseReadings$.get();
      
      glucoseStore.lastSyncAt.set(Date.now());
      glucoseActions.setLoading(false);
    } catch (error) {
      console.error('Error syncing glucose readings:', error);
      glucoseActions.setError('Failed to sync glucose readings');
    }
  },
};

// Export for React components
export const useGlucoseStore = () => {
  return {
    store: glucoseStore,
    actions: glucoseActions,
    // Direct access to the reactive data
    readings$: glucoseReadings$,
  };
};

// For backward compatibility, export individual observables
export const useGlucoseStoreCompat = () => {
  const allReadings = glucoseReadings$.get();
  
  return {
    readings: Object.values(allReadings || {}),
    isLoading: glucoseStore.isLoading.get(),
    error: glucoseStore.error.get(),
    lastReading: Object.values(allReadings || {})[0] || null,
    addReading: glucoseActions.addReading,
    updateReading: glucoseActions.updateReading,
    deleteReading: glucoseActions.deleteReading,
    getTodaysReadings: glucoseActions.getTodaysReadings,
    getAverageToday: glucoseActions.getAverageToday,
    forceSync: glucoseActions.forceSync,
    setLoading: glucoseActions.setLoading,
    setError: glucoseActions.setError,
    clearError: glucoseActions.clearError,
  };
};