import { Product, ProductFilters } from '@/types/product';
import { Team, CreateTeamDto } from '@/types/team';
import { Player, CreatePlayerDto } from '@/types/player';
import { Patch, CreatePatchDto } from '@/types/patch';
import { HeroImage, CreateHeroImageDto, UpdateHeroImageDto } from '@/types/hero-image';
import { normalizePrice } from '@/utils/currency';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Clear any offline products on startup
if (typeof window !== 'undefined') {
  localStorage.removeItem('offline_products');
  console.log('🧹 Cleared offline products - all products will come from database');
}

// Generic API client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from localStorage
    const token = localStorage.getItem('admin_token');
    
    // Check authentication state
    const authState = localStorage.getItem('admin-auth-storage');
    let isAuthenticated = false;
    try {
      if (authState) {
        const parsed = JSON.parse(authState);
        isAuthenticated = parsed.state?.isAuthenticated || false;
      }
    } catch (e) {
      console.error('Error parsing auth state:', e);
    }
    
    const method = options.method || 'GET';
    console.log(`🌐 API Request: ${method} ${url}`);
    
    // Lista de endpoints públicos que NO requieren autenticación
    const publicEndpoints = [
      '/auth/login',
      '/products',           // GET productos (público para el catálogo)
      '/teams',             // GET equipos (público para mostrar equipos) 
      '/players',           // GET jugadores (público para mostrar plantillas)
      '/patches',           // GET parches (público para mostrar parches)
      '/hero-images/active' // GET imágenes activas del hero (público)
    ];
    
    // Verificar si es un endpoint público
    const isPublicEndpoint = publicEndpoints.some(publicPath => 
      endpoint === publicPath || 
      endpoint.startsWith(publicPath + '/') || 
      endpoint.startsWith(publicPath + '?')
    );
    
    // Los GET requests a endpoints de lectura son públicos
    const isPublicGET = method === 'GET' && isPublicEndpoint;
    
    // Solo requerir token para operaciones que modifican datos (POST, PUT, PATCH, DELETE)
    const requiresAuth = !isPublicGET && !endpoint.startsWith('/auth/login');
    
    if (!token && requiresAuth) {
      console.error('❌ Authentication required for this operation');
      console.error('❌ Endpoint:', endpoint, '| Method:', method);
      throw new Error('Authentication required. Please login to perform this action.');
    }
    
    if (token) {
      console.log('🔑 Authenticated request - token present');
    } else {
      console.log('🌐 Public request - no authentication needed');
    }
    
    if (options.body) {
      console.log('Request body:', options.body);
    }
    
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      // Solo agregar Authorization header si hay token
      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        headers,
        ...options,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      const hasContent = contentType && contentType.includes('application/json');
      
      if (hasContent) {
        const text = await response.text();
        if (text.trim()) {
          const result = JSON.parse(text);
          console.log('API Response data:', result);
          return result;
        }
      }
      
      // For empty responses (like DELETE operations), return null
      console.log('API Response: Empty/No Content');
      return null;
    } catch (error) {
      console.error(`API Error in ${endpoint}:`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    console.log('🔍 Fetching products from database...');
    
    try {
      const queryParams = new URLSearchParams();
      if (filters?.team) queryParams.append('team', filters.team); // Backend FilterProductsDto uses 'team'
      if (filters?.equipmentType) queryParams.append('equipmentType', filters.equipmentType);
      if (filters?.productType) queryParams.append('productType', filters.productType);
      if (filters?.search) queryParams.append('search', filters.search);
      
      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const backendProducts = await this.request<any[]>(endpoint);
      
      // Normalizar precios para asegurar que son números
      const apiProducts = backendProducts.map(product => ({
        ...product,
        price: normalizePrice(product.price), // Ensure price is number
        playerPrice: normalizePrice(product.playerPrice), // Ensure playerPrice is number
      }));
      
      console.log('✅ Products fetched from database:', apiProducts.length, 'products');
      return apiProducts;
    } catch (error) {
      console.error('❌ Failed to fetch products from database:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await this.request<any>(`/products/${id}`);
      if (!product) return null;
      
      // Normalizar precios para asegurar que son números
      return {
        ...product,
        price: normalizePrice(product.price), // Ensure price is number
        playerPrice: normalizePrice(product.playerPrice), // Ensure playerPrice is number
      };
    } catch (error) {
      console.warn(`Product ${id} API not available, returning null`);
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    console.error('🚀 Attempting to create product in database:', product);
    
    // El backend espera exactamente los mismos campos que la entidad Product
    // No necesitamos mapear 'team' a 'teamName'
    
    console.log('🔄 Sending product to backend:', product);
    
    try {
      const backendResult = await this.request<any>('/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      
      console.log('✅ Product created successfully in database:', backendResult);
      return backendResult;
    } catch (error: any) {
      console.error('❌ Failed to create product in database:', error.message);
      console.error('❌ Full error:', error);
      
      // NO MODO OFFLINE - Siempre fallar si no se puede guardar en DB
      throw new Error(`No se pudo guardar el producto en la base de datos: ${error.message}`);
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    console.log('🔄 Updating product in database:', id, updates);
    
    // El backend espera exactamente los mismos campos que la entidad Product
    // No necesitamos mapear 'team' a 'teamName'
    
    try {
      const backendResult = await this.request<any>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      console.log('✅ Product updated successfully in database:', backendResult);
      return backendResult;
    } catch (error: any) {
      console.error('❌ Failed to update product in database:', error.message);
      throw new Error(`No se pudo actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.request(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn(`Delete product ${id} API not available, operation completed in offline mode`);
      // In offline mode, just log the deletion - the UI will handle removing it from the list
    }
  }

  // Patches API
  // Legacy patches methods removed - using new implementation below

  // Teams API
  async getTeams(): Promise<Team[]> {
    console.log('🔍 Fetching teams from database...');
    try {
      const teams = await this.request<Team[]>('/teams');
      console.log('✅ Teams fetched from database:', teams.length, 'teams');
      return teams;
    } catch (error) {
      console.error('❌ Failed to fetch teams from database:', error);
      return [];
    }
  }

  async createTeam(teamData: CreateTeamDto): Promise<Team> {
    console.log('🚀 Creating team in database:', teamData);
    try {
      const result = await this.request<Team>('/teams', {
        method: 'POST',
        body: JSON.stringify(teamData),
      });
      console.log('✅ Team created successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to create team in database:', error.message);
      throw new Error(`No se pudo guardar el equipo en la base de datos: ${error.message}`);
    }
  }

  async updateTeam(id: string, updates: Partial<CreateTeamDto>): Promise<Team> {
    console.log('🔄 Updating team in database:', id, updates);
    try {
      const result = await this.request<Team>(`/teams/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('✅ Team updated successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to update team in database:', error.message);
      throw new Error(`No se pudo actualizar el equipo: ${error.message}`);
    }
  }

  async deleteTeam(id: string): Promise<void> {
    console.log('🗑️ Deleting team from database:', id);
    try {
      await this.request<void>(`/teams/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Team deleted successfully from database:', id);
    } catch (error: any) {
      console.error('❌ Failed to delete team from database:', error.message);
      throw new Error(`No se pudo eliminar el equipo: ${error.message}`);
    }
  }

  // Players API
  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    console.log('🔍 Fetching players for team:', teamId);
    try {
      // Usar query parameter en lugar de path parameter
      const players = await this.request<Player[]>(`/players?teamId=${encodeURIComponent(teamId)}`);
      
      // Verificar que players sea un array válido
      if (!players || !Array.isArray(players)) {
        console.log('⚠️ No players found or invalid response, returning empty array');
        return [];
      }
      
      console.log('✅ Players fetched from database:', players.length, 'players');
      return players;
    } catch (error: any) {
      console.error('❌ Failed to fetch players from database:', error.message);
      return []; // Return empty array if no players found
    }
  }

  async createPlayer(playerData: CreatePlayerDto): Promise<{ success: boolean; message: string; player: Player }> {
    console.log('🆕 Creating player in database:', playerData);
    try {
      const result = await this.request<{ success: boolean; message: string; player: Player }>('/players', {
        method: 'POST',
        body: JSON.stringify(playerData),
      });
      console.log('✅ Player created successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to create player in database:', error.message);
      throw new Error(`No se pudo crear el jugador: ${error.message}`);
    }
  }

  async updatePlayer(id: string, updates: Partial<CreatePlayerDto>): Promise<{ success: boolean; message: string; player: Player }> {
    console.log('📝 Updating player in database:', id, updates);
    try {
      const result = await this.request<{ success: boolean; message: string; player: Player }>(`/players/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('✅ Player updated successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to update player in database:', error.message);
      throw new Error(`No se pudo actualizar el jugador: ${error.message}`);
    }
  }

  async deletePlayer(id: string): Promise<{ success: boolean; message: string; playerName: string }> {
    console.log('🗑️ Deleting player from database:', id);
    try {
      const result = await this.request<{ success: boolean; message: string; playerName: string }>(`/players/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Player deleted successfully from database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to delete player from database:', error.message);
      throw new Error(`No se pudo eliminar el jugador: ${error.message}`);
    }
  }

  // Patches API
  async getPatches(): Promise<Patch[]> {
    console.log('🔍 Fetching patches from database...');
    try {
      const patches = await this.request<Patch[]>('/patches');
      console.log('✅ Patches fetched from database:', patches.length, 'patches');
      return patches;
    } catch (error) {
      console.error('❌ Failed to fetch patches from database:', error);
      return [];
    }
  }

  async createPatch(patchData: CreatePatchDto): Promise<Patch> {
    console.log('🚀 Creating patch in database:', patchData);
    try {
      const result = await this.request<Patch>('/patches', {
        method: 'POST',
        body: JSON.stringify(patchData),
      });
      console.log('✅ Patch created successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to create patch in database:', error.message);
      throw new Error(`No se pudo guardar el parche en la base de datos: ${error.message}`);
    }
  }

  async updatePatch(id: string, updates: Partial<CreatePatchDto>): Promise<Patch> {
    console.log('🔄 Updating patch in database:', id, updates);
    try {
      const result = await this.request<Patch>(`/patches/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      console.log('✅ Patch updated successfully in database:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Failed to update patch in database:', error.message);
      throw new Error(`No se pudo actualizar el parche: ${error.message}`);
    }
  }

  async deletePatch(id: string): Promise<void> {
    console.log('🗑️ Deleting patch from database:', id);
    try {
      await this.request<void>(`/patches/${id}`, {
        method: 'DELETE',
      });
      console.log('✅ Patch deleted successfully from database:', id);
    } catch (error: any) {
      console.error('❌ Failed to delete patch from database:', error.message);
      throw new Error(`No se pudo eliminar el parche: ${error.message}`);
    }
  }

  // File upload API
  async uploadImage(file: File, type?: 'product' | 'team' | 'patch' | 'hero'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    if (type) {
      formData.append('type', type);
    }

    try {
      const response = await this.request<{ url: string }>('/upload/single', {
        method: 'POST',
        body: formData,
        // No establecer Content-Type para que el navegador lo configure automáticamente con boundary
      });

      // Si la URL es relativa, agregar la URL base del servidor
      const imageUrl = response.url.startsWith('http') 
        ? response.url 
        : `${this.baseUrl.replace('/api', '')}${response.url}`;

      return imageUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }

  // Validate image URL (for testing with public URLs)
  async validateImageUrl(url: string): Promise<{ url: string; originalUrl: string; message: string }> {
    return await this.request<{ url: string; originalUrl: string; message: string }>('/upload/validate-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
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

  // ==================== HERO IMAGES API ====================
  
  // Get all hero images
  async getHeroImages(): Promise<HeroImage[]> {
    try {
      console.log('📸 Fetching all hero images from database...');
      const heroImages = await this.request<HeroImage[]>('/hero-images');
      console.log(`✅ Got ${heroImages?.length || 0} hero images from database`);
      return heroImages || [];
    } catch (error) {
      console.error('❌ Failed to fetch hero images from database:', error);
      return [];
    }
  }

  // Get active hero images only
  async getActiveHeroImages(): Promise<HeroImage[]> {
    try {
      console.log('📸 Fetching active hero images from database...');
      const heroImages = await this.request<HeroImage[]>('/hero-images/active');
      console.log(`✅ Got ${heroImages?.length || 0} active hero images from database`);
      return heroImages || [];
    } catch (error) {
      console.error('❌ Failed to fetch active hero images from database:', error);
      return [];
    }
  }

  // Get hero image by ID
  async getHeroImageById(id: string): Promise<HeroImage> {
    return this.request<HeroImage>(`/hero-images/${id}`);
  }

  // Create hero image
  async createHeroImage(data: CreateHeroImageDto): Promise<HeroImage> {
    return this.request<HeroImage>('/hero-images', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update hero image
  async updateHeroImage(id: string, data: UpdateHeroImageDto): Promise<HeroImage> {
    return this.request<HeroImage>(`/hero-images/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Delete hero image
  async deleteHeroImage(id: string): Promise<void> {
    await this.request<void>(`/hero-images/${id}`, {
      method: 'DELETE',
    });
  }

  // Reorder hero images
  async reorderHeroImages(orderData: { id: string; displayOrder: number }[]): Promise<HeroImage[]> {
    return this.request<HeroImage[]>('/hero-images/reorder', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual functions for backward compatibility
export const getProducts = (...args: Parameters<typeof apiClient.getProducts>) => apiClient.getProducts(...args);
export const getProductById = (...args: Parameters<typeof apiClient.getProductById>) => apiClient.getProductById(...args);
export const createProduct = (...args: Parameters<typeof apiClient.createProduct>) => apiClient.createProduct(...args);
export const updateProduct = (...args: Parameters<typeof apiClient.updateProduct>) => apiClient.updateProduct(...args);
export const deleteProduct = (...args: Parameters<typeof apiClient.deleteProduct>) => apiClient.deleteProduct(...args);
export const getPatches = (...args: Parameters<typeof apiClient.getPatches>) => apiClient.getPatches(...args);
export const createPatch = (...args: Parameters<typeof apiClient.createPatch>) => apiClient.createPatch(...args);
export const updatePatch = (...args: Parameters<typeof apiClient.updatePatch>) => apiClient.updatePatch(...args);
export const deletePatch = (...args: Parameters<typeof apiClient.deletePatch>) => apiClient.deletePatch(...args);
export const getTeams = (...args: Parameters<typeof apiClient.getTeams>) => apiClient.getTeams(...args);
export const createTeam = (...args: Parameters<typeof apiClient.createTeam>) => apiClient.createTeam(...args);
export const updateTeam = (...args: Parameters<typeof apiClient.updateTeam>) => apiClient.updateTeam(...args);
export const deleteTeam = (...args: Parameters<typeof apiClient.deleteTeam>) => apiClient.deleteTeam(...args);
export const uploadImage = (...args: Parameters<typeof apiClient.uploadImage>) => apiClient.uploadImage(...args);
export const validateImageUrl = (...args: Parameters<typeof apiClient.validateImageUrl>) => apiClient.validateImageUrl(...args);
export const checkStock = (...args: Parameters<typeof apiClient.checkStock>) => apiClient.checkStock(...args);
export const getHeroImages = (...args: Parameters<typeof apiClient.getHeroImages>) => apiClient.getHeroImages(...args);
export const getActiveHeroImages = (...args: Parameters<typeof apiClient.getActiveHeroImages>) => apiClient.getActiveHeroImages(...args);
export const getHeroImageById = (...args: Parameters<typeof apiClient.getHeroImageById>) => apiClient.getHeroImageById(...args);
export const createHeroImage = (...args: Parameters<typeof apiClient.createHeroImage>) => apiClient.createHeroImage(...args);
export const updateHeroImage = (...args: Parameters<typeof apiClient.updateHeroImage>) => apiClient.updateHeroImage(...args);
export const deleteHeroImage = (...args: Parameters<typeof apiClient.deleteHeroImage>) => apiClient.deleteHeroImage(...args);
export const reorderHeroImages = (...args: Parameters<typeof apiClient.reorderHeroImages>) => apiClient.reorderHeroImages(...args);
