// Global type definitions for GluciQ app

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  diabetesType: 'type1' | 'type2' | 'gestational' | 'prediabetes';
  createdAt: Date;
  updatedAt: Date;
}

export interface GlucoseReading {
  id: string;
  userId: string;
  value: number; // mg/dL
  timestamp: Date;
  notes?: string;
  mealContext?: 'before' | 'after' | 'fasting';
  source: 'manual' | 'cgm';
  syncStatus: 'synced' | 'pending' | 'failed';
  createdAt: Date;
}

export interface InsulinDose {
  id: string;
  userId: string;
  type: 'rapid' | 'long' | 'intermediate';
  units: number;
  timestamp: Date;
  notes?: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  createdAt: Date;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  mode: 'light' | 'dark';
}

export interface AppConfig {
  theme: Theme;
  language: string;
  glucoseUnit: 'mg/dL' | 'mmol/L';
  timeFormat: '12h' | '24h';
}

export type SyncStatus = 'synced' | 'pending' | 'failed' | 'offline';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}