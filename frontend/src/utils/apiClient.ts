/**
 * Type-safe API client utilities with comprehensive error handling
 */

import { z } from 'zod';
import { isObject, isString, isNumber, safeJSONParse } from './typeGuards';

// Base API types
export interface ApiResponse<T = unknown> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
  readonly errors?: readonly string[];
}

export interface ApiError {
  readonly message: string;
  readonly code: number;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;
}

export interface ApiRequestConfig {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly headers?: Record<string, string>;
  readonly body?: unknown;
  readonly timeout?: number;
  readonly retries?: number;
  readonly retryDelay?: number;
}

// Type-safe API client class
export class TypeSafeApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;

  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {},
    defaultTimeout: number = 10000
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultHeaders = { 'Content-Type': 'application/json', ...defaultHeaders };
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Make a type-safe API request with validation
   */
  async request<TResponse>(
    endpoint: string,
    config: ApiRequestConfig = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = 3,
      retryDelay = 1000,
    } = config;

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestInit: RequestInit = {
          method,
          headers: requestHeaders,
          signal: controller.signal,
        };

        if (body && method !== 'GET') {
          requestInit.body = isString(body) ? body : JSON.stringify(body);
        }

        const response = await fetch(url, requestInit);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiRequestError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            await this.parseErrorResponse(response)
          );
        }

        const responseText = await response.text();
        const responseData = responseText ? safeJSONParse(responseText) : null;

        if (responseSchema) {
          const validationResult = responseSchema.safeParse(responseData);
          if (!validationResult.success) {
            throw new ApiValidationError(
              'Response validation failed',
              validationResult.error.errors
            );
          }
          return {
            data: validationResult.data,
            success: true,
          };
        }

        return {
          data: responseData as TResponse,
          success: true,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < retries && this.shouldRetry(error)) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
          continue;
        }

        break;
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * GET request with type safety
   */
  async get<TResponse>(
    endpoint: string,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    return this.request(endpoint, { ...config, method: 'GET' }, responseSchema);
  }

  /**
   * POST request with type safety
   */
  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    return this.request(endpoint, { ...config, method: 'POST', body }, responseSchema);
  }

  /**
   * PUT request with type safety
   */
  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    return this.request(endpoint, { ...config, method: 'PUT', body }, responseSchema);
  }

  /**
   * DELETE request with type safety
   */
  async delete<TResponse>(
    endpoint: string,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    return this.request(endpoint, { ...config, method: 'DELETE' }, responseSchema);
  }

  /**
   * PATCH request with type safety
   */
  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    config: Omit<ApiRequestConfig, 'method' | 'body'> = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    return this.request(endpoint, { ...config, method: 'PATCH', body }, responseSchema);
  }

  private async parseErrorResponse(response: Response): Promise<Record<string, unknown>> {
    try {
      const text = await response.text();
      const parsed = safeJSONParse(text);
      return isObject(parsed) ? parsed : { message: text };
    } catch {
      return { message: 'Failed to parse error response' };
    }
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof ApiRequestError) {
      // Retry on server errors (5xx) but not client errors (4xx)
      return error.code >= 500;
    }
    
    if (error instanceof Error) {
      // Retry on network errors
      return error.name === 'AbortError' || error.message.includes('fetch');
    }

    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Custom error classes
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export class ApiValidationError extends Error {
  constructor(
    message: string,
    public readonly validationErrors: readonly z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ApiValidationError';
  }
}

// Type-safe endpoint builder
export class EndpointBuilder {
  private readonly segments: string[] = [];
  private readonly queryParams: Record<string, string> = {};

  constructor(private readonly baseUrl: string = '') {
    this.segments = baseUrl ? [baseUrl] : [];
  }

  segment(segment: string): EndpointBuilder {
    return new EndpointBuilder([...this.segments, segment].join('/'));
  }

  param(key: string, value: string | number | boolean): EndpointBuilder {
    const builder = new EndpointBuilder(this.segments.join('/'));
    builder.queryParams[key] = String(value);
    return builder;
  }

  build(): string {
    const url = this.segments.join('/');
    const params = new URLSearchParams(this.queryParams);
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }
}

// Type-safe query parameter builder
export const endpoint = (baseUrl: string = ''): EndpointBuilder => {
  return new EndpointBuilder(baseUrl);
};

// Response validation schemas
export const createApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) => {
  return z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  });
};

export const createPaginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) => {
  return z.object({
    data: z.object({
      items: z.array(itemSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
      totalPages: z.number(),
    }),
    success: z.boolean(),
    message: z.string().optional(),
  });
};

// Common response schemas
export const stringResponseSchema = createApiResponseSchema(z.string());
export const numberResponseSchema = createApiResponseSchema(z.number());
export const booleanResponseSchema = createApiResponseSchema(z.boolean());

// Utility functions for API client usage
export const createTypedApiClient = (
  baseUrl: string,
  headers?: Record<string, string>
): TypeSafeApiClient => {
  return new TypeSafeApiClient(baseUrl, headers);
};

export const withAuth = (token: string): Record<string, string> => {
  return { Authorization: `Bearer ${token}` };
};

export const withApiKey = (apiKey: string, headerName = 'X-API-Key'): Record<string, string> => {
  return { [headerName]: apiKey };
};

// Type-safe request body builders
export const jsonBody = <T>(data: T): string => {
  return JSON.stringify(data);
};

export const formBody = (data: Record<string, string | number | boolean>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  return formData;
};

// Error handling utilities
export const isApiError = (error: unknown): error is ApiRequestError => {
  return error instanceof ApiRequestError;
};

export const isValidationError = (error: unknown): error is ApiValidationError => {
  return error instanceof ApiValidationError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error) || isValidationError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const getErrorCode = (error: unknown): number | null => {
  if (isApiError(error)) {
    return error.code;
  }
  return null;
};

// Type-safe local storage for API responses
export const cacheApiResponse = <T>(
  key: string,
  response: ApiResponse<T>,
  ttl: number = 300000 // 5 minutes default
): void => {
  const cacheData = {
    response,
    timestamp: Date.now(),
    ttl,
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const getCachedApiResponse = <T>(
  key: string,
  validator?: (data: unknown) => data is T
): ApiResponse<T> | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    if (!isObject(cacheData) || !isNumber(cacheData.timestamp) || !isNumber(cacheData.ttl)) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - cacheData.timestamp > cacheData.ttl) {
      localStorage.removeItem(key);
      return null;
    }

    const response = cacheData.response;
    if (!isObject(response) || !('data' in response) || !('success' in response)) {
      return null;
    }

    // Validate data if validator provided
    if (validator && !validator(response.data)) {
      return null;
    }

    return response as ApiResponse<T>;
  } catch {
    return null;
  }
};

// Mock API client for testing
export class MockApiClient extends TypeSafeApiClient {
  private readonly mockResponses: Map<string, unknown> = new Map();
  private readonly mockErrors: Map<string, Error> = new Map();

  constructor() {
    super('http://mock-api.test');
  }

  mockResponse<T>(endpoint: string, response: T): void {
    this.mockResponses.set(endpoint, response);
  }

  mockError(endpoint: string, error: Error): void {
    this.mockErrors.set(endpoint, error);
  }

  async request<TResponse>(
    endpoint: string,
    config: ApiRequestConfig = {},
    responseSchema?: z.ZodSchema<TResponse>
  ): Promise<ApiResponse<TResponse>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const mockError = this.mockErrors.get(endpoint);
    if (mockError) {
      throw mockError;
    }

    const mockResponse = this.mockResponses.get(endpoint);
    if (mockResponse !== undefined) {
      if (responseSchema) {
        const validationResult = responseSchema.safeParse(mockResponse);
        if (!validationResult.success) {
          throw new ApiValidationError(
            'Mock response validation failed',
            validationResult.error.errors
          );
        }
        return {
          data: validationResult.data,
          success: true,
        };
      }

      return {
        data: mockResponse as TResponse,
        success: true,
      };
    }

    throw new ApiRequestError('No mock response configured', 404);
  }
}