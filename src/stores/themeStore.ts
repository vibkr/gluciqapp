import { observable } from '@legendapp/state';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import { use$ } from '@legendapp/state/react';
import { syncObservable } from '@legendapp/state/sync';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { availableThemes, getThemeById, midnightDark, EnhancedTheme } from '../themes/default';
import { Theme } from '../types';

interface ThemeData {
  currentTheme: EnhancedTheme;
  availableThemes: EnhancedTheme[];
  isSystemTheme: boolean;
  selectedThemeBase: string; // 'midnight', 'aurora', etc.
  isDarkMode: boolean;
}

// Create the observable theme store
export const themeStore = observable<ThemeData>({
  currentTheme: midnightDark,
  availableThemes,
  isSystemTheme: false,
  selectedThemeBase: 'midnight',
  isDarkMode: true,
});

// Sync with AsyncStorage
syncObservable(themeStore, {
  persist: {
    name: 'theme',
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

  setThemeBase: (themeBase: string) => {
    const isDark = themeStore.isDarkMode.get();
    const themeId = `${themeBase}-${isDark ? 'dark' : 'light'}`;
    const theme = getThemeById(themeId);
    themeStore.assign({
      currentTheme: theme,
      selectedThemeBase: themeBase,
      isSystemTheme: false,
    });
  },

  toggleDarkMode: () => {
    const currentBase = themeStore.selectedThemeBase.get();
    const isDark = !themeStore.isDarkMode.get();
    const themeId = `${currentBase}-${isDark ? 'dark' : 'light'}`;
    const theme = getThemeById(themeId);
    themeStore.assign({
      currentTheme: theme,
      isDarkMode: isDark,
      isSystemTheme: false,
    });
  },

  toggleTheme: () => {
    // Legacy support - just toggle dark mode
    themeActions.toggleDarkMode();
  },

  setSystemTheme: (useSystem: boolean) => {
    if (useSystem) {
      // In a real app, you'd detect system theme here
      // For now, we'll default to current theme
      const currentBase = themeStore.selectedThemeBase.get();
      const isDark = themeStore.isDarkMode.get();
      const themeId = `${currentBase}-${isDark ? 'dark' : 'light'}`;
      const theme = getThemeById(themeId);
      themeStore.assign({
        currentTheme: theme,
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

  // Get available theme bases (without light/dark suffix)
  getThemeBases: () => {
    const bases = new Set<string>();
    // Add safety check to prevent forEach error
    const themes = availableThemes || [];
    if (Array.isArray(themes)) {
      themes.forEach(theme => {
        const base = theme.id.replace('-light', '').replace('-dark', '');
        bases.add(base);
      });
    }
    return Array.from(bases);
  },

  // Get themes for a specific base
  getThemesForBase: (base: string) => {
    // Add safety check
    const themes = availableThemes || [];
    return Array.isArray(themes) ? themes.filter(theme => 
      theme.id.startsWith(base)
    ) : [];
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
    selectedThemeBase: use$(themeStore.selectedThemeBase),
    isDarkMode: use$(themeStore.isDarkMode),
    setTheme: themeActions.setTheme,
    setThemeBase: themeActions.setThemeBase,
    toggleDarkMode: themeActions.toggleDarkMode,
    toggleTheme: themeActions.toggleTheme,
    setSystemTheme: themeActions.setSystemTheme,
    initializeTheme: themeActions.initializeTheme,
    getThemeBases: themeActions.getThemeBases,
    getThemesForBase: themeActions.getThemesForBase,
  };
};