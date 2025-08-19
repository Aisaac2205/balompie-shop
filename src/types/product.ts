// ============= Product Types =============
// Types for the La Casa del Balompié store

export interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  playerPrice?: number; // Player version price
  originalPrice?: number;
  image: string;
  playerImage?: string; // Player version image
  images?: string[]; // Additional images for gallery
  playerImages?: string[]; // Player version images
  rating: number;
  reviews: number;
  badge?: string;
  season: string;
  competition: string;
  availableSizes: string[];
  stock: Record<string, number>; // size -> quantity
  patches: Patch[];
  players: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Patch {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  team: string;
  price: number;
  size: string;
  quantity: number;
  version: 'fan' | 'player'; // Jersey version
  customization?: ProductCustomization;
  image: string;
}

export interface ProductCustomization {
  playerName?: string;
  playerNumber?: string;
  selectedPatch?: Patch; // Only one patch selection
}

export interface OrderItem {
  productId: string;
  size: string;
  quantity: number;
  customization?: ProductCustomization;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

// Filter types
export interface ProductFilters {
  team?: string;
  competition?: string;
  season?: string;
  priceRange?: [number, number];
  rating?: number;
  onSale?: boolean;
}