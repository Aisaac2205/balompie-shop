// ============= Mock Product Database =============
// This will be replaced with real database when backend is connected

import { Product, Patch } from '@/types/product';
import jerseyBarcelona from '@/assets/jersey-barcelona.jpg';
import jerseyRealMadrid from '@/assets/jersey-real-madrid.jpg';
import jerseyManCity from '@/assets/jersey-man-city.jpg';

// Mock patches data
export const mockPatches: Patch[] = [
  {
    id: 'liga-patch',
    name: 'Liga Española',
    image: '/patches/liga.png',
    price: 40,
  },
  {
    id: 'champions-patch',
    name: 'Champions League',
    image: '/patches/champions.png',
    price: 55,
  },
  {
    id: 'mundial-patch',
    name: 'Mundial de Clubes',
    image: '/patches/mundial.png',
    price: 50,
  },
  {
    id: 'copa-rey-patch',
    name: 'Copa del Rey',
    image: '/patches/copa-rey.png',
    price: 35,
  },
];

// Mock products database
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camisola Local Barcelona 2024/25',
    team: 'FC Barcelona',
    price: 385,
    originalPrice: 450,
    image: jerseyBarcelona,
    images: [jerseyBarcelona], // Add more images when available
    rating: 4.8,
    reviews: 124,
    badge: 'Más Vendida',
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 15,
      'M': 20,
      'L': 18,
      'XL': 12,
      'XXL': 8,
    },
    patches: [mockPatches[0], mockPatches[1], mockPatches[3]], // Liga, Champions, Copa del Rey
    players: ['Lewandowski', 'Pedri', 'Gavi', 'Ter Stegen', 'Raphinha', 'Frenkie de Jong'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Camisola Local Real Madrid 2024/25',
    team: 'Real Madrid',
    price: 385,
    image: jerseyRealMadrid,
    images: [jerseyRealMadrid],
    rating: 4.9,
    reviews: 98,
    badge: 'Nueva',
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 12,
      'M': 25,
      'L': 22,
      'XL': 16,
      'XXL': 10,
    },
    patches: [mockPatches[0], mockPatches[1], mockPatches[2]], // Liga, Champions, Mundial
    players: ['Bellingham', 'Vinicius Jr', 'Benzema', 'Modric', 'Courtois', 'Camavinga'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Camisola Local Manchester City 2024/25',
    team: 'Manchester City',
    price: 385,
    originalPrice: 450,
    image: jerseyManCity,
    images: [jerseyManCity],
    rating: 4.7,
    reviews: 76,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 8,
      'M': 14,
      'L': 16,
      'XL': 11,
      'XXL': 5,
    },
    patches: [mockPatches[1]], // Champions only
    players: ['Haaland', 'De Bruyne', 'Rodri', 'Grealish', 'Foden', 'Walker'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Camisola Visitante Barcelona 2024/25',
    team: 'FC Barcelona',
    price: 385,
    image: jerseyBarcelona,
    images: [jerseyBarcelona],
    rating: 4.6,
    reviews: 82,
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 10,
      'M': 15,
      'L': 12,
      'XL': 8,
      'XXL': 4,
    },
    patches: [mockPatches[0], mockPatches[1]],
    players: ['Lewandowski', 'Pedri', 'Gavi', 'Ter Stegen', 'Raphinha'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '5',
    name: 'Camisola Champions League Real Madrid',
    team: 'Real Madrid',
    price: 400,
    image: jerseyRealMadrid,
    images: [jerseyRealMadrid],
    rating: 4.9,
    reviews: 156,
    badge: 'Champions',
    season: '2024/25',
    competition: 'Champions League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 6,
      'M': 18,
      'L': 14,
      'XL': 10,
      'XXL': 7,
    },
    patches: [mockPatches[1], mockPatches[2]], // Champions, Mundial
    players: ['Bellingham', 'Vinicius Jr', 'Modric', 'Courtois'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '6',
    name: 'Camisola Alternativa Manchester City',
    team: 'Manchester City',
    price: 385,
    originalPrice: 450,
    image: jerseyManCity,
    images: [jerseyManCity],
    rating: 4.5,
    reviews: 63,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 5,
      'M': 12,
      'L': 9,
      'XL': 7,
      'XXL': 3,
    },
    patches: [mockPatches[1]],
    players: ['Haaland', 'De Bruyne', 'Foden', 'Grealish'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-14'),
  },
];

// Mock API functions (replace with real API calls when backend is ready)
export async function getProducts(filters?: any): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProducts = [...mockProducts];
  
  if (filters?.team) {
    filteredProducts = filteredProducts.filter(p => 
      p.team.toLowerCase().includes(filters.team.toLowerCase())
    );
  }
  
  if (filters?.competition) {
    filteredProducts = filteredProducts.filter(p => 
      p.competition.toLowerCase().includes(filters.competition.toLowerCase())
    );
  }
  
  if (filters?.onSale) {
    filteredProducts = filteredProducts.filter(p => p.originalPrice);
  }
  
  return filteredProducts;
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockProducts.find(p => p.id === id) || null;
}

export async function checkStock(productId: string, size: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const product = mockProducts.find(p => p.id === productId);
  return product?.stock[size] || 0;
}

// For future Supabase integration:
// export async function getProductsFromSupabase() {
//   const { data, error } = await supabase
//     .from('products')
//     .select(`
//       *,
//       patches (*)
//     `);
//   
//   if (error) throw error;
//   return data;
// }