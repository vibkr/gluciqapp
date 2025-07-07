// App constants and configuration

export const APP_CONFIG = {
  NAME: 'GluciQ',
  VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  API_VERSION: 'v1',
} as const;

export const GLUCOSE_RANGES = {
  VERY_LOW: { min: 0, max: 54, color: '#DC2626' },    // Severe hypoglycemia
  LOW: { min: 55, max: 69, color: '#F59E0B' },        // Hypoglycemia
  NORMAL: { min: 70, max: 180, color: '#10B981' },    // Target range
  HIGH: { min: 181, max: 250, color: '#F59E0B' },     // Hyperglycemia
  VERY_HIGH: { min: 251, max: 600, color: '#DC2626' }, // Severe hyperglycemia
} as const;

export const INSULIN_TYPES = {
  RAPID: { name: 'Rapid Acting', duration: 4, peak: 1 },
  LONG: { name: 'Long Acting', duration: 24, peak: 0 },
  INTERMEDIATE: { name: 'Intermediate', duration: 12, peak: 6 },
} as const;

export const DIABETES_TYPES = {
  TYPE1: 'type1',
  TYPE2: 'type2',
  GESTATIONAL: 'gestational',
  PREDIABETES: 'prediabetes',
} as const;

export const SYNC_INTERVALS = {
  IMMEDIATE: 0,
  EVERY_MINUTE: 60 * 1000,
  EVERY_5_MINUTES: 5 * 60 * 1000,
  EVERY_HOUR: 60 * 60 * 1000,
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME_CONFIG: 'theme_config',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_SYNC: 'last_sync',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  GLUCOSE: '/glucose-readings',
  INSULIN: '/insulin-doses',
  SYNC: '/sync',
} as const;

export const VALIDATION_RULES = {
  GLUCOSE: {
    MIN: 20,
    MAX: 600,
  },
  INSULIN: {
    MIN: 0.1,
    MAX: 100,
  },
} as const;