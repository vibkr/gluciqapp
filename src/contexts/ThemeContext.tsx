import React, { createContext, useContext, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { observer, use$ } from '@legendapp/state/react';
import { themeStore, themeActions } from '../stores/themeStore';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
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

  useEffect(() => {
    themeActions.initializeTheme();
  }, []);

  const value: ThemeContextType = {
    theme: currentTheme,
    setTheme: themeActions.setTheme,
    toggleTheme: themeActions.toggleTheme,
    isSystemTheme,
    setSystemTheme: themeActions.setSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={currentTheme.mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
});