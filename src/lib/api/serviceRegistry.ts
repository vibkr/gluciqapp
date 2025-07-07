import Constants from 'expo-constants';
import { supabase } from '../database/supabase';
import { ApiConfigBuilder, UnifiedApiClient } from './client';
import { ApiProvider } from './types';

/**
 * Service Registry - Manages all API clients and service configurations
 * Provides easy switching between Supabase and microservices
 */
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private provider: ApiProvider;
  private clients: Map<string, UnifiedApiClient> = new Map();
  
  private constructor() {
    // Default to Supabase for now, can be changed via environment variable
    this.provider = (Constants.expoConfig?.extra?.API_PROVIDER as ApiProvider) || 'supabase';
    this.initializeClients();
  }

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Switch API provider at runtime
   */
  switchProvider(provider: ApiProvider): void {
    this.provider = provider;
    this.clients.clear();
    this.initializeClients();
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): ApiProvider {
    return this.provider;
  }

  /**
   * Get API client for a specific service
   */
  getClient(serviceName: string): UnifiedApiClient {
    const client = this.clients.get(serviceName);
    if (!client) {
      throw new Error(`Service client not found: ${serviceName}`);
    }
    return client;
  }

  /**
   * Initialize all service clients based on current provider
   */
  private initializeClients(): void {
    if (this.provider === 'supabase') {
      this.initializeSupabaseClients();
    } else {
      this.initializeMicroserviceClients();
    }
  }

  /**
   * Initialize Supabase-based clients
   */
  private initializeSupabaseClients(): void {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Missing Supabase configuration. Required environment variables:');
      console.warn('- EXPO_PUBLIC_SUPABASE_URL');
      console.warn('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
      
      // Use placeholder config to prevent crashes
      const placeholderConfig = new ApiConfigBuilder()
        .baseUrl('https://placeholder.supabase.co')
        .apiKey('placeholder-key')
        .build();

      const serviceNames = ['user', 'food', 'logging', 'calculation', 'planning'];
      serviceNames.forEach(serviceName => {
        this.clients.set(serviceName, new UnifiedApiClient('supabase', placeholderConfig, null));
      });
      return;
    }

    const config = new ApiConfigBuilder()
      .baseUrl(supabaseUrl)
      .apiKey(supabaseKey)
      .build();

    // All services use the same Supabase client but with different table mappings
    const serviceNames = ['user', 'food', 'logging', 'calculation', 'planning'];
    
    serviceNames.forEach(serviceName => {
      this.clients.set(serviceName, new UnifiedApiClient('supabase', config, supabase));
    });
  }

  /**
   * Initialize microservice-based clients
   */
  private initializeMicroserviceClients(): void {
    const baseUrl = process.env.EXPO_PUBLIC_MICROSERVICES_BASE_URL || 'http://localhost:3000';
    const apiKey = process.env.EXPO_PUBLIC_MICROSERVICES_API_KEY || '';

    if (!baseUrl) {
      console.warn('Missing microservices configuration. Using default localhost URL.');
    }
    if (!apiKey) {
      console.warn('EXPO_PUBLIC_MICROSERVICES_API_KEY not set. API calls may fail.');
    }

    // User Service
    const userServiceConfig = new ApiConfigBuilder()
      .baseUrl(`${baseUrl}/user-service`)
      .apiKey(apiKey)
      .build();
    this.clients.set('user', new UnifiedApiClient('microservice', userServiceConfig));

    // Food Service
    const foodServiceConfig = new ApiConfigBuilder()
      .baseUrl(`${baseUrl}/food-service`)
      .apiKey(apiKey)
      .build();
    this.clients.set('food', new UnifiedApiClient('microservice', foodServiceConfig));

    // Logging Service
    const loggingServiceConfig = new ApiConfigBuilder()
      .baseUrl(`${baseUrl}/logging-service`)
      .apiKey(apiKey)
      .build();
    this.clients.set('logging', new UnifiedApiClient('microservice', loggingServiceConfig));

    // Calculation Service
    const calculationServiceConfig = new ApiConfigBuilder()
      .baseUrl(`${baseUrl}/calculation-service`)
      .apiKey(apiKey)
      .build();
    this.clients.set('calculation', new UnifiedApiClient('microservice', calculationServiceConfig));

    // Planning Service
    const planningServiceConfig = new ApiConfigBuilder()
      .baseUrl(`${baseUrl}/planning-service`)
      .apiKey(apiKey)
      .build();
    this.clients.set('planning', new UnifiedApiClient('microservice', planningServiceConfig));
  }
}

// Export singleton instance
export const serviceRegistry = ServiceRegistry.getInstance();

// Convenience functions for accessing service clients
export const getUserServiceClient = () => serviceRegistry.getClient('user');
export const getFoodServiceClient = () => serviceRegistry.getClient('food');
export const getLoggingServiceClient = () => serviceRegistry.getClient('logging');
export const getCalculationServiceClient = () => serviceRegistry.getClient('calculation');
export const getPlanningServiceClient = () => serviceRegistry.getClient('planning');

// Environment configuration checker
export const validateServiceConfiguration = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const provider = serviceRegistry.getCurrentProvider();

  if (provider === 'supabase') {
    if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
      errors.push('EXPO_PUBLIC_SUPABASE_URL is required');
    }
    if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
      errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is required');
    }
  } else {
    if (!process.env.EXPO_PUBLIC_MICROSERVICES_BASE_URL) {
      errors.push('EXPO_PUBLIC_MICROSERVICES_BASE_URL is required');
    }
    if (!process.env.EXPO_PUBLIC_MICROSERVICES_API_KEY) {
      errors.push('EXPO_PUBLIC_MICROSERVICES_API_KEY is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Health check function
export const checkServiceHealth = async (): Promise<{ [serviceName: string]: boolean }> => {
  const serviceNames = ['user', 'food', 'logging', 'calculation', 'planning'];
  const healthStatus: { [serviceName: string]: boolean } = {};

  for (const serviceName of serviceNames) {
    try {
      const client = serviceRegistry.getClient(serviceName);
      // Try a simple health check endpoint
      const response = await client.get('/health');
      healthStatus[serviceName] = response.success;
    } catch (error) {
      healthStatus[serviceName] = false;
    }
  }

  return healthStatus;
};