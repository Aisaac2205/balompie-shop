// ============= Product Types =============
// Types for the La Casa del Balompié store

export interface Product {
  id: string;
  team: string;
  equipmentType: 'local' | 'visitante' | 'tercera' | 'alternativa' | 'champions';
  productType: 'fan' | 'player';
  name: string;
  description?: string;
  price: number;
  playerPrice?: number; // Precio para versión jugador
  images: string[]; // Array de hasta 3 imágenes
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  primaryColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  team: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  version: 'fan' | 'player';
  customization?: {
    playerName?: string;
    playerNumber?: string;
    selectedPatch?: {
      id: string;
      name: string;
      price: number;
    };
  };
}

export interface Patch {
  id: string;
  name: string;
  price: number;
  category: 'league' | 'cup' | 'international' | 'special' | 'custom';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  country: string;
  league: string;
  logo: string;
  achievements: string[];
  isActive: boolean;
}

// Tipos para el formulario de producto
export interface ProductFormData {
  team: string;
  equipmentType: 'local' | 'visitante' | 'tercera' | 'alternativa' | 'champions';
  productType: 'fan' | 'player';
  name: string;
  description: string;
  price: number;
  playerPrice: number;
  images: string[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  primaryColor: string;
  isActive: boolean;
}

// Tipos para filtros
export interface ProductFilters {
  team: string;
  equipmentType: string;
  productType: string;
  status: 'all' | 'active' | 'inactive';
  search: string;
}