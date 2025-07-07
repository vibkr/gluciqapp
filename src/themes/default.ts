import { Theme } from '../types';

export const lightTheme: Theme = {
  id: 'light',
  name: 'Light',
  mode: 'light',
  colors: {
    primary: '#3B82F6',      // Blue-500
    secondary: '#6366F1',    // Indigo-500
    background: '#FFFFFF',   // White
    surface: '#F8FAFC',      // Slate-50
    text: '#1E293B',         // Slate-800
    textSecondary: '#64748B', // Slate-500
    border: '#E2E8F0',       // Slate-200
    success: '#10B981',      // Emerald-500
    warning: '#F59E0B',      // Amber-500
    error: '#EF4444',        // Red-500
  },
};

export const darkTheme: Theme = {
  id: 'dark',
  name: 'Dark',
  mode: 'dark',
  colors: {
    primary: '#60A5FA',      // Blue-400
    secondary: '#818CF8',    // Indigo-400
    background: '#0F172A',   // Slate-900
    surface: '#1E293B',      // Slate-800
    text: '#F1F5F9',         // Slate-100
    textSecondary: '#94A3B8', // Slate-400
    border: '#334155',       // Slate-700
    success: '#34D399',      // Emerald-400
    warning: '#FBBF24',      // Amber-400
    error: '#F87171',        // Red-400
  },
};

export const diabetesTheme: Theme = {
  id: 'diabetes',
  name: 'Diabetes Care',
  mode: 'light',
  colors: {
    primary: '#059669',      // Emerald-600 (health-focused)
    secondary: '#0D9488',    // Teal-600
    background: '#FFFFFF',
    surface: '#F0FDF4',      // Green-50
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#D1FAE5',       // Green-100
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

export const availableThemes = [lightTheme, darkTheme, diabetesTheme];

export const getThemeById = (id: string): Theme => {
  return availableThemes.find(theme => theme.id === id) || lightTheme;
};