import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { observer, use$ } from '@legendapp/state/react';
import { themeStore, themeActions } from '../stores/themeStore';
import { EnhancedTheme } from '../themes/default';

interface ThemeContextType {
  theme: EnhancedTheme;
  setTheme: (themeId: string) => void;
  setThemeBase: (themeBase: string) => void;
  toggleDarkMode: () => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
  selectedThemeBase: string;
  isDarkMode: boolean;
  getThemeBases: () => string[];
  getThemesForBase: (base: string) => EnhancedTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = observer(({ children }) => {
  const currentTheme = use$(themeStore.currentTheme);
  const isSystemTheme = use$(themeStore.isSystemTheme);
  const selectedThemeBase = use$(themeStore.selectedThemeBase);
  const isDarkMode = use$(themeStore.isDarkMode);

  useEffect(() => {
    themeActions.initializeTheme();
  }, []);

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme: themeActions.setTheme,
    setThemeBase: themeActions.setThemeBase,
    toggleDarkMode: themeActions.toggleDarkMode,
    toggleTheme: themeActions.toggleTheme,
    isSystemTheme,
    setSystemTheme: themeActions.setSystemTheme,
    selectedThemeBase,
    isDarkMode,
    getThemeBases: themeActions.getThemeBases,
    getThemesForBase: themeActions.getThemesForBase,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={currentTheme.mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
});