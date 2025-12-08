// API configuration and HTTP client for Java backend integration

// Backend URL - променете това с вашия реален Java backend URL
const API_BASE_URL = 'http://localhost:8080/api';

// HTTP error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// HTTP Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Build headers with auth token
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      let errorData: unknown;

      if (isJson) {
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
          errorData = errorBody;
        } catch {
          // If JSON parsing fails, use default error message
        }
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    // Handle empty responses
    if (response.status === 204 || !isJson) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // За session cookies
    });

    return this.handleResponse<T>(response);
  }

  // POST request
  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // За session cookies
    });

    return this.handleResponse<T>(response);
  }

  // PUT request
  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // За session cookies
    });

    return this.handleResponse<T>(response);
  }

  // PATCH request
  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // За session cookies
    });

    return this.handleResponse<T>(response);
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include', // За session cookies
    });

    return this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export base URL for reference
export { API_BASE_URL };