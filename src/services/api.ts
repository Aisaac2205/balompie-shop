import { Product, Patch, ProductFilters } from '@/types/product';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error in ${endpoint}:`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.team) queryParams.append('team', filters.team);
      if (filters?.competition) queryParams.append('competition', filters.competition);
      if (filters?.season) queryParams.append('season', filters.season);
      if (filters?.onSale) queryParams.append('onSale', 'true');
      
      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await this.request<Product[]>(endpoint);
    } catch (error) {
      console.warn('Products API not available, returning empty array');
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.request<Product>(`/products/${id}`);
    } catch (error) {
      console.warn(`Product ${id} API not available, returning null`);
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return await this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return await this.request<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Patches API
  async getPatches(): Promise<Patch[]> {
    try {
      return await this.request<Patch[]>('/patches');
    } catch (error) {
      console.warn('Patches API not available, returning empty array');
      return [];
    }
  }

  async createPatch(patch: Omit<Patch, 'id'>): Promise<Patch> {
    return await this.request<Patch>('/patches', {
      method: 'POST',
      body: JSON.stringify(patch),
    });
  }

  async updatePatch(id: string, updates: Partial<Patch>): Promise<Patch> {
    return await this.request<Patch>(`/patches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePatch(id: string): Promise<void> {
    await this.request(`/patches/${id}`, {
      method: 'DELETE',
    });
  }

  // Teams API
  async getTeams(): Promise<string[]> {
    try {
      return await this.request<string[]>('/teams');
    } catch (error) {
      console.warn('Teams API not available, returning empty array');
      return [];
    }
  }

  async createTeam(team: { name: string; logo?: string }): Promise<{ name: string; logo?: string }> {
    return await this.request('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  // File upload API
  async uploadImage(file: File, type: 'product' | 'team' | 'patch'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return await this.request<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary for FormData
      },
    });
  }

  // Check stock API
  async checkStock(productId: string, size: string): Promise<number> {
    try {
      const response = await this.request<{ stock: number }>(`/products/${productId}/stock?size=${size}`);
      return response.stock;
    } catch (error) {
      console.warn(`Stock check API not available for product ${productId}, returning 0`);
      return 0;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual functions for backward compatibility
export const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPatches,
  createPatch,
  updatePatch,
  deletePatch,
  getTeams,
  createTeam,
  uploadImage,
  checkStock,
} = apiClient;
