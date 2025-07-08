import { Theme } from '../types';

// Enhanced theme system with 8 premium themes
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
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#F97316', '#EF4444'] : ['#EA580C', '#DC2626'],
        secondary: isDark ? ['#EF4444', '#EC4899'] : ['#DC2626', '#DB2777'],
        accent: isDark ? ['#F59E0B', '#EC4899'] : ['#D97706', '#DB2777'],
        background: isDark ? ['#7C2D12', '#9A3412', '#C2410C'] : ['#FFF7ED', '#FED7AA', '#FDBA74'],
        card: isDark ? ['#C2410C', '#EA580C'] : ['#FFFFFF', '#FFF7ED'],
      },
    },
    ocean: {
      name: 'Ocean Depths',
      colors: {
        background: isDark ? '#1E3A8A' : '#FFFFFF',
        surface: isDark ? '#1E40AF' : '#EFF6FF',
        card: isDark ? '#2563EB' : '#FFFFFF',
        cardElevated: isDark ? '#3B82F6' : '#DBEAFE',
        primary: isDark ? '#3B82F6' : '#2563EB',
        primaryLight: isDark ? '#60A5FA' : '#3B82F6',
        primaryDark: isDark ? '#2563EB' : '#1D4ED8',
        secondary: isDark ? '#06B6D4' : '#0891B2',
        secondaryLight: isDark ? '#22D3EE' : '#06B6D4',
        secondaryDark: isDark ? '#0891B2' : '#0E7490',
        accent: isDark ? '#0EA5E9' : '#0284C7',
        accentLight: isDark ? '#38BDF8' : '#0EA5E9',
        accentDark: isDark ? '#0284C7' : '#0369A1',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#BFDBFE' : '#64748B',
        textMuted: isDark ? '#93C5FD' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#2563EB' : '#E2E8F0',
        divider: isDark ? '#1E40AF' : '#EFF6FF',
        shadow: isDark ? '#000000' : '#64748B',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#3B82F6', '#06B6D4'] : ['#2563EB', '#0891B2'],
        secondary: isDark ? ['#06B6D4', '#10B981'] : ['#0891B2', '#059669'],
        accent: isDark ? ['#0EA5E9', '#3B82F6'] : ['#0284C7', '#2563EB'],
        background: isDark ? ['#1E3A8A', '#1E40AF', '#2563EB'] : ['#EFF6FF', '#DBEAFE', '#BFDBFE'],
        card: isDark ? ['#2563EB', '#3B82F6'] : ['#FFFFFF', '#EFF6FF'],
      },
    },
    neon: {
      name: 'Neon Cyber',
      colors: {
        background: isDark ? '#1F2937' : '#FFFFFF',
        surface: isDark ? '#374151' : '#F9FAFB',
        card: isDark ? '#4B5563' : '#FFFFFF',
        cardElevated: isDark ? '#6B7280' : '#F3F4F6',
        primary: isDark ? '#8B5CF6' : '#7C3AED',
        primaryLight: isDark ? '#A78BFA' : '#8B5CF6',
        primaryDark: isDark ? '#7C3AED' : '#6D28D9',
        secondary: isDark ? '#A855F7' : '#9333EA',
        secondaryLight: isDark ? '#C084FC' : '#A855F7',
        secondaryDark: isDark ? '#9333EA' : '#7E22CE',
        accent: isDark ? '#EC4899' : '#DB2777',
        accentLight: isDark ? '#F472B6' : '#EC4899',
        accentDark: isDark ? '#DB2777' : '#BE185D',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#C4B5FD' : '#64748B',
        textMuted: isDark ? '#A78BFA' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#4B5563' : '#E2E8F0',
        divider: isDark ? '#374151' : '#F9FAFB',
        shadow: isDark ? '#000000' : '#64748B',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#8B5CF6', '#A855F7'] : ['#7C3AED', '#9333EA'],
        secondary: isDark ? ['#A855F7', '#EC4899'] : ['#9333EA', '#DB2777'],
        accent: isDark ? ['#EC4899', '#8B5CF6'] : ['#DB2777', '#7C3AED'],
        background: isDark ? ['#1F2937', '#374151', '#8B5CF6'] : ['#F9FAFB', '#F3F4F6', '#E5E7EB'],
        card: isDark ? ['#4B5563', '#6B7280'] : ['#FFFFFF', '#F9FAFB'],
      },
    },
    forest: {
      name: 'Forest Sage',
      colors: {
        background: isDark ? '#14532D' : '#FFFFFF',
        surface: isDark ? '#166534' : '#F0FDF4',
        card: isDark ? '#15803D' : '#FFFFFF',
        cardElevated: isDark ? '#16A34A' : '#DCFCE7',
        primary: isDark ? '#22C55E' : '#16A34A',
        primaryLight: isDark ? '#4ADE80' : '#22C55E',
        primaryDark: isDark ? '#16A34A' : '#15803D',
        secondary: isDark ? '#84CC16' : '#65A30D',
        secondaryLight: isDark ? '#A3E635' : '#84CC16',
        secondaryDark: isDark ? '#65A30D' : '#4D7C0F',
        accent: isDark ? '#EAB308' : '#CA8A04',
        accentLight: isDark ? '#FACC15' : '#EAB308',
        accentDark: isDark ? '#CA8A04' : '#A16207',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#BBF7D0' : '#64748B',
        textMuted: isDark ? '#86EFAC' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#15803D' : '#E2E8F0',
        divider: isDark ? '#166534' : '#F0FDF4',
        shadow: isDark ? '#000000' : '#64748B',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#22C55E', '#84CC16'] : ['#16A34A', '#65A30D'],
        secondary: isDark ? ['#84CC16', '#10B981'] : ['#65A30D', '#059669'],
        accent: isDark ? ['#EAB308', '#22C55E'] : ['#CA8A04', '#16A34A'],
        background: isDark ? ['#14532D', '#166534', '#15803D'] : ['#F0FDF4', '#DCFCE7', '#BBF7D0'],
        card: isDark ? ['#15803D', '#16A34A'] : ['#FFFFFF', '#F0FDF4'],
      },
    },
    rose: {
      name: 'Rose Gold',
      colors: {
        background: isDark ? '#881337' : '#FFFFFF',
        surface: isDark ? '#9F1239' : '#FDF2F8',
        card: isDark ? '#BE185D' : '#FFFFFF',
        cardElevated: isDark ? '#DB2777' : '#FCE7F3',
        primary: isDark ? '#EC4899' : '#DB2777',
        primaryLight: isDark ? '#F472B6' : '#EC4899',
        primaryDark: isDark ? '#DB2777' : '#BE185D',
        secondary: isDark ? '#EF4444' : '#DC2626',
        secondaryLight: isDark ? '#F87171' : '#EF4444',
        secondaryDark: isDark ? '#DC2626' : '#B91C1C',
        accent: isDark ? '#F59E0B' : '#D97706',
        accentLight: isDark ? '#FBBF24' : '#F59E0B',
        accentDark: isDark ? '#D97706' : '#B45309',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#FBCFE8' : '#64748B',
        textMuted: isDark ? '#F9A8D4' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#BE185D' : '#E2E8F0',
        divider: isDark ? '#9F1239' : '#FDF2F8',
        shadow: isDark ? '#000000' : '#64748B',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#EC4899', '#EF4444'] : ['#DB2777', '#DC2626'],
        secondary: isDark ? ['#EF4444', '#F59E0B'] : ['#DC2626', '#D97706'],
        accent: isDark ? ['#F59E0B', '#EC4899'] : ['#D97706', '#DB2777'],
        background: isDark ? ['#881337', '#9F1239', '#BE185D'] : ['#FDF2F8', '#FCE7F3', '#FBCFE8'],
        card: isDark ? ['#BE185D', '#DB2777'] : ['#FFFFFF', '#FDF2F8'],
      },
    },
    cosmic: {
      name: 'Cosmic Void',
      colors: {
        background: isDark ? '#000000' : '#FFFFFF',
        surface: isDark ? '#1E1B4B' : '#EEF2FF',
        card: isDark ? '#312E81' : '#FFFFFF',
        cardElevated: isDark ? '#3730A3' : '#E0E7FF',
        primary: isDark ? '#6366F1' : '#4F46E5',
        primaryLight: isDark ? '#818CF8' : '#6366F1',
        primaryDark: isDark ? '#4F46E5' : '#3730A3',
        secondary: isDark ? '#8B5CF6' : '#7C3AED',
        secondaryLight: isDark ? '#A78BFA' : '#8B5CF6',
        secondaryDark: isDark ? '#7C3AED' : '#6D28D9',
        accent: isDark ? '#3B82F6' : '#2563EB',
        accentLight: isDark ? '#60A5FA' : '#3B82F6',
        accentDark: isDark ? '#2563EB' : '#1D4ED8',
        text: isDark ? '#FFFFFF' : '#1E293B',
        textSecondary: isDark ? '#C7D2FE' : '#64748B',
        textMuted: isDark ? '#A5B4FC' : '#94A3B8',
        textInverse: isDark ? '#1E293B' : '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        border: isDark ? '#312E81' : '#E2E8F0',
        divider: isDark ? '#1E1B4B' : '#EEF2FF',
        shadow: isDark ? '#000000' : '#64748B',
        overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      },
      gradients: {
        primary: isDark ? ['#6366F1', '#8B5CF6'] : ['#4F46E5', '#7C3AED'],
        secondary: isDark ? ['#8B5CF6', '#A855F7'] : ['#7C3AED', '#9333EA'],
        accent: isDark ? ['#3B82F6', '#6366F1'] : ['#2563EB', '#4F46E5'],
        background: isDark ? ['#000000', '#1E1B4B', '#312E81'] : ['#EEF2FF', '#E0E7FF', '#C7D2FE'],
        card: isDark ? ['#312E81', '#3730A3'] : ['#FFFFFF', '#EEF2FF'],
      },
    },
  };

  const themeConfig = themes[id as keyof typeof themes] || themes.midnight;
  
  return {
    id,
    name: themeConfig.name,
    mode,
    colors: themeConfig.colors,
    gradients: themeConfig.gradients,
  };
};

// Create all theme variations
export const midnightLight = createTheme('midnight', 'Midnight Pro', 'light');
export const midnightDark = createTheme('midnight', 'Midnight Pro', 'dark');
export const auroraLight = createTheme('aurora', 'Aurora Dreams', 'light');
export const auroraDark = createTheme('aurora', 'Aurora Dreams', 'dark');
export const sunsetLight = createTheme('sunset', 'Sunset Blaze', 'light');
export const sunsetDark = createTheme('sunset', 'Sunset Blaze', 'dark');
export const oceanLight = createTheme('ocean', 'Ocean Depths', 'light');
export const oceanDark = createTheme('ocean', 'Ocean Depths', 'dark');
export const neonLight = createTheme('neon', 'Neon Cyber', 'light');
export const neonDark = createTheme('neon', 'Neon Cyber', 'dark');
export const forestLight = createTheme('forest', 'Forest Sage', 'light');
export const forestDark = createTheme('forest', 'Forest Sage', 'dark');
export const roseLight = createTheme('rose', 'Rose Gold', 'light');
export const roseDark = createTheme('rose', 'Rose Gold', 'dark');
export const cosmicLight = createTheme('cosmic', 'Cosmic Void', 'light');
export const cosmicDark = createTheme('cosmic', 'Cosmic Void', 'dark');

// Theme registry
export const themeRegistry = {
  'midnight-light': midnightLight,
  'midnight-dark': midnightDark,
  'aurora-light': auroraLight,
  'aurora-dark': auroraDark,
  'sunset-light': sunsetLight,
  'sunset-dark': sunsetDark,
  'ocean-light': oceanLight,
  'ocean-dark': oceanDark,
  'neon-light': neonLight,
  'neon-dark': neonDark,
  'forest-light': forestLight,
  'forest-dark': forestDark,
  'rose-light': roseLight,
  'rose-dark': roseDark,
  'cosmic-light': cosmicLight,
  'cosmic-dark': cosmicDark,
};

export const getThemeById = (id: string): EnhancedTheme => {
  return themeRegistry[id as keyof typeof themeRegistry] || midnightDark;
};

export const getAllThemes = (): EnhancedTheme[] => {
  return Object.values(themeRegistry);
};

export const getThemesByBase = (baseTheme: string): EnhancedTheme[] => {
  return Object.values(themeRegistry).filter(theme => theme.id === baseTheme);
};

// Export available themes array
export const availableThemes = getAllThemes();

// Default theme
export const defaultTheme = midnightDark;