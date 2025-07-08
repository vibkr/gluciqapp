import { Theme } from '../types';

// Enhanced theme system with CalAI-inspired modern themes
export interface EnhancedTheme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: {
    // Background colors
    background: string;
    surface: string;
    card: string;
    cardElevated: string;
    
    // Primary colors
    primary: string;
    primaryLight: string;
    primaryDark: string;
    
    // Secondary colors
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    
    // Accent colors
    accent: string;
    accentLight: string;
    accentDark: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Border and divider
    border: string;
    divider: string;
    
    // Special colors
    shadow: string;
    overlay: string;
    disabled: string;
  };
  gradients: {
    primary: string[];
    secondary: string[];
    accent: string[];
    background: string[];
    card: string[];
  };
}

const createTheme = (id: string, name: string, mode: 'light' | 'dark'): EnhancedTheme => {
  const isDark = mode === 'dark';
  
  const themes = {
    calai: {
      name: 'CalAI Modern',
      colors: {
        background: isDark ? '#0F0F0F' : '#FAFBFC',
        surface: isDark ? '#1A1A1A' : '#FFFFFF',
        card: isDark ? '#2A2A2A' : '#FFFFFF',
        cardElevated: isDark ? '#3A3A3A' : '#F8F9FA',
        primary: isDark ? '#4F83FF' : '#2563EB',
        primaryLight: isDark ? '#7DA0FF' : '#60A5FA',
        primaryDark: isDark ? '#3B6AE8' : '#1D4ED8',
        secondary: isDark ? '#FF6B35' : '#F97316',
        secondaryLight: isDark ? '#FF8B60' : '#FB923C',
        secondaryDark: isDark ? '#E55A2B' : '#EA580C',
        accent: isDark ? '#00D4AA' : '#10B981',
        accentLight: isDark ? '#33E0C2' : '#34D399',
        accentDark: isDark ? '#00B896' : '#059669',
        text: isDark ? '#FFFFFF' : '#111827',
        textSecondary: isDark ? '#A8A8A8' : '#6B7280',
        textMuted: isDark ? '#8A8A8A' : '#9CA3AF',
        textInverse: isDark ? '#111827' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#3A3A3A' : '#E5E7EB',
        divider: isDark ? '#2A2A2A' : '#F3F4F6',
        shadow: isDark ? '#000000' : '#1F2937',
        disabled: isDark ? '#4A4A4A' : '#9CA3AF',
        overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      },
      gradients: {
        primary: isDark ? ['#4F83FF', '#7DA0FF'] : ['#2563EB', '#60A5FA'],
        secondary: isDark ? ['#FF6B35', '#FF8B60'] : ['#F97316', '#FB923C'],
        accent: isDark ? ['#00D4AA', '#33E0C2'] : ['#10B981', '#34D399'],
        background: isDark ? ['#0F0F0F', '#1A1A1A'] : ['#FAFBFC', '#FFFFFF'],
        card: isDark ? ['#2A2A2A', '#3A3A3A'] : ['#FFFFFF', '#F8F9FA'],
      },
    },
    midnight: {
      name: 'Midnight Pro',
      colors: {
        background: isDark ? '#0F172A' : '#FFFFFF',
        surface: isDark ? '#1E293B' : '#F8FAFC',
        card: isDark ? '#334155' : '#FFFFFF',
        cardElevated: isDark ? '#475569' : '#F1F5F9',
        primary: isDark ? '#6366F1' : '#4F46E5',
        primaryLight: isDark ? '#818CF8' : '#6366F1',
        primaryDark: isDark ? '#4F46E5' : '#3730A3',
        secondary: isDark ? '#EC4899' : '#DB2777',
        secondaryLight: isDark ? '#F472B6' : '#EC4899',
        secondaryDark: isDark ? '#DB2777' : '#BE185D',
        accent: isDark ? '#06B6D4' : '#0891B2',
        accentLight: isDark ? '#22D3EE' : '#06B6D4',
        accentDark: isDark ? '#0891B2' : '#0E7490',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#CBD5E1' : '#64748B',
        textMuted: isDark ? '#94A3B8' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#475569' : '#E2E8F0',
        divider: isDark ? '#374151' : '#F1F5F9',
        shadow: isDark ? '#000000' : '#64748B',
        disabled: isDark ? '#64748B' : '#94A3B8',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#6366F1', '#8B5CF6'] : ['#4F46E5', '#7C3AED'],
        secondary: isDark ? ['#EC4899', '#F472B6'] : ['#DB2777', '#EC4899'],
        accent: isDark ? ['#06B6D4', '#3B82F6'] : ['#0891B2', '#2563EB'],
        background: isDark ? ['#0F172A', '#1E293B', '#8B5CF6'] : ['#F8FAFC', '#E0E7FF', '#C7D2FE'],
        card: isDark ? ['#334155', '#475569'] : ['#FFFFFF', '#F1F5F9'],
      },
    },
    aurora: {
      name: 'Aurora Dreams',
      colors: {
        background: isDark ? '#064E3B' : '#FFFFFF',
        surface: isDark ? '#065F46' : '#F0FDF4',
        card: isDark ? '#047857' : '#FFFFFF',
        cardElevated: isDark ? '#059669' : '#ECFDF5',
        primary: isDark ? '#10B981' : '#059669',
        primaryLight: isDark ? '#34D399' : '#10B981',
        primaryDark: isDark ? '#059669' : '#047857',
        secondary: isDark ? '#06B6D4' : '#0891B2',
        secondaryLight: isDark ? '#22D3EE' : '#06B6D4',
        secondaryDark: isDark ? '#0891B2' : '#0E7490',
        accent: isDark ? '#22C55E' : '#16A34A',
        accentLight: isDark ? '#4ADE80' : '#22C55E',
        accentDark: isDark ? '#16A34A' : '#15803D',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#A7F3D0' : '#64748B',
        textMuted: isDark ? '#6EE7B7' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#047857' : '#E2E8F0',
        divider: isDark ? '#065F46' : '#F0FDF4',
        shadow: isDark ? '#000000' : '#64748B',
        disabled: isDark ? '#6EE7B7' : '#94A3B8',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#10B981', '#06B6D4'] : ['#059669', '#0891B2'],
        secondary: isDark ? ['#06B6D4', '#22D3EE'] : ['#0891B2', '#06B6D4'],
        accent: isDark ? ['#22C55E', '#10B981'] : ['#16A34A', '#059669'],
        background: isDark ? ['#064E3B', '#065F46', '#047857'] : ['#F0FDF4', '#ECFDF5', '#D1FAE5'],
        card: isDark ? ['#047857', '#059669'] : ['#FFFFFF', '#F0FDF4'],
      },
    },
    sunset: {
      name: 'Sunset Blaze',
      colors: {
        background: isDark ? '#7C2D12' : '#FFFFFF',
        surface: isDark ? '#9A3412' : '#FFF7ED',
        card: isDark ? '#C2410C' : '#FFFFFF',
        cardElevated: isDark ? '#EA580C' : '#FED7AA',
        primary: isDark ? '#F97316' : '#EA580C',
        primaryLight: isDark ? '#FB923C' : '#F97316',
        primaryDark: isDark ? '#EA580C' : '#C2410C',
        secondary: isDark ? '#EF4444' : '#DC2626',
        secondaryLight: isDark ? '#F87171' : '#EF4444',
        secondaryDark: isDark ? '#DC2626' : '#B91C1C',
        accent: isDark ? '#FBBF24' : '#D97706',
        accentLight: isDark ? '#FCD34D' : '#FBBF24',
        accentDark: isDark ? '#D97706' : '#B45309',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#FED7AA' : '#64748B',
        textMuted: isDark ? '#FDBA74' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#C2410C' : '#E2E8F0',
        divider: isDark ? '#9A3412' : '#FFF7ED',
        shadow: isDark ? '#000000' : '#64748B',
        disabled: isDark ? '#FDBA74' : '#94A3B8',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#F97316', '#FB923C'] : ['#EA580C', '#F97316'],
        secondary: isDark ? ['#EF4444', '#F87171'] : ['#DC2626', '#EF4444'],
        accent: isDark ? ['#FBBF24', '#FCD34D'] : ['#D97706', '#FBBF24'],
        background: isDark ? ['#7C2D12', '#9A3412', '#C2410C'] : ['#FFF7ED', '#FED7AA', '#FDBA74'],
        card: isDark ? ['#C2410C', '#EA580C'] : ['#FFFFFF', '#FFF7ED'],
      },
    },
  };

  const themeConfig = themes[id as keyof typeof themes];
  if (!themeConfig) {
    throw new Error(`Theme '${id}' not found`);
  }

  return {
    id,
    name,
    mode,
    colors: themeConfig.colors,
    gradients: themeConfig.gradients,
  };
};

// Theme registry with proper light/dark variants
const ThemeRegistry: Record<string, EnhancedTheme[]> = {
  calai: [
    createTheme('calai', 'CalAI Light', 'light'),
    createTheme('calai', 'CalAI Dark', 'dark'),
  ],
  midnight: [
    createTheme('midnight', 'Midnight Light', 'light'),
    createTheme('midnight', 'Midnight Dark', 'dark'),
  ],
  aurora: [
    createTheme('aurora', 'Aurora Light', 'light'),
    createTheme('aurora', 'Aurora Dark', 'dark'),
  ],
  sunset: [
    createTheme('sunset', 'Sunset Light', 'light'),
    createTheme('sunset', 'Sunset Dark', 'dark'),
  ],
};

// Theme helper functions
export const getThemeById = (id: string): EnhancedTheme => {
  for (const themes of Object.values(ThemeRegistry)) {
    const found = themes.find(theme => theme.id === id);
    if (found) return found;
  }
  return ThemeRegistry.calai[0]; // fallback
};

export const getAllThemes = (): EnhancedTheme[] => {
  return Object.values(ThemeRegistry).flat();
};

export const getThemesByBase = (baseTheme: string): EnhancedTheme[] => {
  return ThemeRegistry[baseTheme] || [];
};

// Default themes
export const lightTheme = ThemeRegistry.calai[0]; // CalAI Light
export const darkTheme = ThemeRegistry.calai[1]; // CalAI Dark
export const midnightDark = ThemeRegistry.midnight[1]; // Midnight Dark
export const availableThemes = getAllThemes(); // All available themes