const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
    }
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Relationships endpoints
  async getRelationships() {
    return this.request('/relationships');
  }

  async getRelationship(id: string) {
    return this.request(`/relationships/${id}`);
  }

  async createRelationship(data: any) {
    return this.request('/relationships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRelationship(id: string, data: any) {
    return this.request(`/relationships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRelationship(id: string) {
    return this.request(`/relationships/${id}`, {
      method: 'DELETE',
    });
  }

  // Interactions endpoints
  async getInteractions() {
    return this.request('/interactions');
  }

  async getRelationshipInteractions(relationshipId: string) {
    return this.request(`/interactions/relationship/${relationshipId}`);
  }

  async createInteraction(data: any) {
    return this.request('/interactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInteraction(id: string, data: any) {
    return this.request(`/interactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInteraction(id: string) {
    return this.request(`/interactions/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
