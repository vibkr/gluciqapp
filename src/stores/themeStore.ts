import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { use$ } from '@legendapp/state/react';
import { syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { availableThemes, darkTheme, getThemeById, lightTheme } from '../themes/default';
import { Theme } from '../types';

interface ThemeData {
  currentTheme: Theme;
  availableThemes: Theme[];
  isSystemTheme: boolean;
}

// Create the observable theme store
export const themeStore = observable<ThemeData>({
  currentTheme: lightTheme,
  availableThemes,
  isSystemTheme: false,
});

// Configure persistence
syncObservable(themeStore, {
  persist: {
    name: 'themeStore',
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
});

// Actions
export const themeActions = {
  setTheme: (themeId: string) => {
    const theme = getThemeById(themeId);
    themeStore.assign({
      currentTheme: theme,
      isSystemTheme: false,
    });
  },

  toggleTheme: () => {
    const currentTheme = themeStore.currentTheme.get();
    const newTheme = currentTheme.id === 'light' ? darkTheme : lightTheme;
    themeStore.assign({
      currentTheme: newTheme,
      isSystemTheme: false,
    });
  },

  setSystemTheme: (useSystem: boolean) => {
    if (useSystem) {
      // In a real app, you'd detect system theme here
      // For now, we'll default to light theme
      themeStore.assign({
        currentTheme: lightTheme,
        isSystemTheme: true,
      });
    } else {
      themeStore.isSystemTheme.set(false);
    }
  },

  initializeTheme: () => {
    const isSystemTheme = themeStore.isSystemTheme.get();
    if (isSystemTheme) {
      // Re-detect system theme on app start
      themeActions.setSystemTheme(true);
    }
  },
};

// Export for React components
export const useThemeStore = () => {
  return {
    store: themeStore,
    actions: themeActions,
  };
};

// For backward compatibility, export individual observables
export const useThemeStoreCompat = () => {
  return {
    currentTheme: use$(themeStore.currentTheme),
    availableThemes: use$(themeStore.availableThemes),
    isSystemTheme: use$(themeStore.isSystemTheme),
    setTheme: themeActions.setTheme,
    toggleTheme: themeActions.toggleTheme,
    setSystemTheme: themeActions.setSystemTheme,
    initializeTheme: themeActions.initializeTheme,
  };
};