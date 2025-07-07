import { ApiClient, ApiResponse, ServiceConfig, ApiProvider } from './types';

/**
 * Unified API client that can work with both Supabase and microservices
 * Allows easy switching between direct database calls and REST API calls
 */
export class UnifiedApiClient implements ApiClient {
  private provider: ApiProvider;
  private config: ServiceConfig;
  private supabaseClient: any;

  constructor(provider: ApiProvider, config: ServiceConfig, supabaseClient?: any) {
    this.provider = provider;
    this.config = config;
    this.supabaseClient = supabaseClient;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      if (this.provider === 'supabase') {
        return await this.supabaseGet<T>(endpoint, params);
      } else {
        return await this.microserviceGet<T>(endpoint, params);
      }
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      if (this.provider === 'supabase') {
        return await this.supabasePost<T>(endpoint, data);
      } else {
        return await this.microservicePost<T>(endpoint, data);
      }
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      if (this.provider === 'supabase') {
        return await this.supabasePut<T>(endpoint, data);
      } else {
        return await this.microservicePut<T>(endpoint, data);
      }
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      if (this.provider === 'supabase') {
        return await this.supabaseDelete<T>(endpoint);
      } else {
        return await this.microserviceDelete<T>(endpoint);
      }
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  // Supabase implementations
  private async supabaseGet<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { tableName, select, filters } = this.parseSupabaseEndpoint(endpoint, params);
    
    let query = this.supabaseClient.from(tableName);
    
    if (select) {
      query = query.select(select);
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;
    
    return {
      data: data as T,
      error: error?.message || null,
      success: !error,
      timestamp: new Date()
    };
  }

  private async supabasePost<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { tableName } = this.parseSupabaseEndpoint(endpoint);
    
    const { data: result, error } = await this.supabaseClient
      .from(tableName)
      .insert(data)
      .select()
      .single();

    return {
      data: result as T,
      error: error?.message || null,
      success: !error,
      timestamp: new Date()
    };
  }

  private async supabasePut<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { tableName, id } = this.parseSupabaseEndpoint(endpoint);
    
    const { data: result, error } = await this.supabaseClient
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    return {
      data: result as T,
      error: error?.message || null,
      success: !error,
      timestamp: new Date()
    };
  }

  private async supabaseDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }

    const { tableName, id } = this.parseSupabaseEndpoint(endpoint);
    
    const { data: result, error } = await this.supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

    return {
      data: result as T,
      error: error?.message || null,
      success: !error,
      timestamp: new Date()
    };
  }

  // Microservice implementations
  private async microserviceGet<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return await this.parseResponse<T>(response);
  }

  private async microservicePost<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await this.parseResponse<T>(response);
  }

  private async microservicePut<T>(endpoint: string, data?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await this.parseResponse<T>(response);
  }

  private async microserviceDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return await this.parseResponse<T>(response);
  }

  // Helper methods
  private parseSupabaseEndpoint(endpoint: string, params?: Record<string, any>) {
    // Parse endpoint like '/food_service/foods' or '/food_service/foods/:id'
    const parts = endpoint.split('/').filter(Boolean);
    const serviceName = parts[0];
    const tableName = parts[1];
    const id = parts[2];

    return {
      serviceName,
      tableName,
      id,
      select: params?.select,
      filters: params?.filters
    };
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.config.baseUrl}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }
    
    return url;
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
      ...this.config.headers
    };
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      return {
        data: data as T,
        error: response.ok ? null : data.message || 'Request failed',
        success: response.ok,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        data: null,
        error: 'Failed to parse response',
        success: false,
        timestamp: new Date()
      };
    }
  }

  private handleError<T>(error: any): ApiResponse<T> {
    console.error('API Error:', error);
    return {
      data: null,
      error: error.message || 'Unknown error occurred',
      success: false,
      timestamp: new Date()
    };
  }
}

// Configuration builder
export class ApiConfigBuilder {
  private config: Partial<ServiceConfig> = {};

  baseUrl(url: string): this {
    this.config.baseUrl = url;
    return this;
  }

  apiKey(key: string): this {
    this.config.apiKey = key;
    return this;
  }

  headers(headers: Record<string, string>): this {
    this.config.headers = headers;
    return this;
  }

  timeout(ms: number): this {
    this.config.timeout = ms;
    return this;
  }

  build(): ServiceConfig {
    if (!this.config.baseUrl) {
      throw new Error('Base URL is required');
    }
    
    return {
      baseUrl: this.config.baseUrl,
      apiKey: this.config.apiKey,
      headers: this.config.headers || {},
      timeout: this.config.timeout || 30000
    };
  }
}