// ============= Extended Mock Product Database =============
// Enhanced with 9 European teams + Retros section

import { Product, Patch } from '@/types/product';

// Generate team jersey images (using placeholder for now, will be replaced with real images)
const generateJerseyImage = (team: string, type: string = 'home') => 
  `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&crop=center`;

// Enhanced patches data
export const extendedPatches: Patch[] = [
  {
    id: 'liga-patch',
    name: 'Liga Española',
    image: '/patches/liga.png',
    price: 20,
  },
  {
    id: 'champions-patch',
    name: 'Champions League',
    image: '/patches/champions.png',
    price: 25,
  },
  {
    id: 'europa-patch',
    name: 'Europa League',
    image: '/patches/europa.png',
    price: 22,
  },
  {
    id: 'premier-patch',
    name: 'Premier League',
    image: '/patches/premier.png',
    price: 20,
  },
  {
    id: 'bundesliga-patch',
    name: 'Bundesliga',
    image: '/patches/bundesliga.png',
    price: 20,
  },
  {
    id: 'serie-a-patch',
    name: 'Serie A',
    image: '/patches/serie-a.png',
    price: 20,
  },
  {
    id: 'ligue1-patch',
    name: 'Ligue 1',
    image: '/patches/ligue1.png',
    price: 20,
  },
  {
    id: 'mundial-patch',
    name: 'Mundial de Clubes',
    image: '/patches/mundial.png',
    price: 30,
  },
  {
    id: 'copa-rey-patch',
    name: 'Copa del Rey',
    image: '/patches/copa-rey.png',
    price: 18,
  },
  {
    id: 'fa-cup-patch',
    name: 'FA Cup',
    image: '/patches/fa-cup.png',
    price: 18,
  },
];

// Extended products with 9 top European teams
export const extendedMockProducts: Product[] = [
  // FC Barcelona
  {
    id: '1',
    name: 'Camisola Local Barcelona 2024/25',
    team: 'FC Barcelona',
    price: 385,
    playerPrice: 400,
    originalPrice: 450,
    image: generateJerseyImage('barcelona'),
    playerImage: generateJerseyImage('barcelona', 'player'),
    images: [generateJerseyImage('barcelona')],
    playerImages: [generateJerseyImage('barcelona', 'player')],
    rating: 4.8,
    reviews: 124,
    badge: 'Más Vendida',
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 15, 'M': 20, 'L': 18, 'XL': 12, 'XXL': 8 },
    patches: [extendedPatches[0], extendedPatches[1], extendedPatches[8]], // Liga, Champions, Copa del Rey
    players: ['Lewandowski', 'Pedri', 'Gavi', 'Ter Stegen', 'Raphinha', 'Frenkie de Jong'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  
  // Real Madrid
  {
    id: '2',
    name: 'Camisola Local Real Madrid 2024/25',
    team: 'Real Madrid',
    price: 385,
    playerPrice: 400,
    originalPrice: 450,
    image: generateJerseyImage('real-madrid'),
    playerImage: generateJerseyImage('real-madrid', 'player'),
    images: [generateJerseyImage('real-madrid')],
    playerImages: [generateJerseyImage('real-madrid', 'player')],
    rating: 4.9,
    reviews: 98,
    badge: 'Nueva',
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 12, 'M': 25, 'L': 22, 'XL': 16, 'XXL': 10 },
    patches: [extendedPatches[0], extendedPatches[1], extendedPatches[7]], // Liga, Champions, Mundial
    players: ['Bellingham', 'Vinicius Jr', 'Benzema', 'Modric', 'Courtois', 'Camavinga'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },

  // Manchester City
  {
    id: '3',
    name: 'Camisola Local Manchester City 2024/25',
    team: 'Manchester City',
    price: 385,
    playerPrice: 400,
    originalPrice: 430,
    image: generateJerseyImage('manchester-city'),
    playerImage: generateJerseyImage('manchester-city', 'player'),
    images: [generateJerseyImage('manchester-city')],
    playerImages: [generateJerseyImage('manchester-city', 'player')],
    rating: 4.7,
    reviews: 76,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 8, 'M': 14, 'L': 16, 'XL': 11, 'XXL': 5 },
    patches: [extendedPatches[3], extendedPatches[1]], // Premier, Champions
    players: ['Haaland', 'De Bruyne', 'Rodri', 'Grealish', 'Foden', 'Walker'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },

  // Liverpool
  {
    id: '4',
    name: 'Camisola Local Liverpool 2024/25',
    team: 'Liverpool',
    price: 385,
    playerPrice: 400,
    image: generateJerseyImage('liverpool'),
    playerImage: generateJerseyImage('liverpool', 'player'),
    images: [generateJerseyImage('liverpool')],
    playerImages: [generateJerseyImage('liverpool', 'player')],
    rating: 4.6,
    reviews: 89,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 10, 'M': 18, 'L': 15, 'XL': 12, 'XXL': 6 },
    patches: [extendedPatches[3], extendedPatches[1]], // Premier, Champions
    players: ['Salah', 'Van Dijk', 'Alisson', 'Mané', 'Alexander-Arnold', 'Henderson'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
  },

  // Bayern Munich
  {
    id: '5',
    name: 'Camisola Local Bayern Munich 2024/25',
    team: 'Bayern Munich',
    price: 385,
    playerPrice: 400,
    image: generateJerseyImage('bayern-munich'),
    playerImage: generateJerseyImage('bayern-munich', 'player'),
    images: [generateJerseyImage('bayern-munich')],
    playerImages: [generateJerseyImage('bayern-munich', 'player')],
    rating: 4.8,
    reviews: 112,
    badge: 'Champions',
    season: '2024/25',
    competition: 'Bundesliga',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 9, 'M': 16, 'L': 14, 'XL': 11, 'XXL': 7 },
    patches: [extendedPatches[4], extendedPatches[1]], // Bundesliga, Champions
    players: ['Müller', 'Neuer', 'Kimmich', 'Sané', 'Gnabry', 'Davies'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },

  // Paris Saint-Germain
  {
    id: '6',
    name: 'Camisola Local PSG 2024/25',
    team: 'Paris Saint-Germain',
    price: 385,
    playerPrice: 400,
    image: generateJerseyImage('psg'),
    playerImage: generateJerseyImage('psg', 'player'),
    images: [generateJerseyImage('psg')],
    playerImages: [generateJerseyImage('psg', 'player')],
    rating: 4.7,
    reviews: 95,
    season: '2024/25',
    competition: 'Ligue 1',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 7, 'M': 13, 'L': 12, 'XL': 9, 'XXL': 4 },
    patches: [extendedPatches[6], extendedPatches[1]], // Ligue 1, Champions
    players: ['Mbappé', 'Neymar', 'Messi', 'Marquinhos', 'Verratti', 'Hakimi'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-14'),
  },

  // Juventus
  {
    id: '7',
    name: 'Camisola Local Juventus 2024/25',
    team: 'Juventus',
    price: 385,
    playerPrice: 400,
    image: generateJerseyImage('juventus'),
    playerImage: generateJerseyImage('juventus', 'player'),
    images: [generateJerseyImage('juventus')],
    playerImages: [generateJerseyImage('juventus', 'player')],
    rating: 4.5,
    reviews: 67,
    season: '2024/25',
    competition: 'Serie A',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 11, 'M': 15, 'L': 13, 'XL': 8, 'XXL': 5 },
    patches: [extendedPatches[5], extendedPatches[2]], // Serie A, Europa League
    players: ['Vlahović', 'Chiesa', 'Pogba', 'Di María', 'Szczesny', 'Cuadrado'],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-19'),
  },

  // Chelsea
  {
    id: '8',
    name: 'Camisola Local Chelsea 2024/25',
    team: 'Chelsea',
    price: 385,
    playerPrice: 400,
    originalPrice: 420,
    image: generateJerseyImage('chelsea'),
    playerImage: generateJerseyImage('chelsea', 'player'),
    images: [generateJerseyImage('chelsea')],
    playerImages: [generateJerseyImage('chelsea', 'player')],
    rating: 4.4,
    reviews: 73,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 6, 'M': 12, 'L': 10, 'XL': 7, 'XXL': 3 },
    patches: [extendedPatches[3], extendedPatches[1]], // Premier, Champions
    players: ['Mount', 'Havertz', 'Kanté', 'Silva', 'Mendy', 'Pulisic'],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-16'),
  },

  // Arsenal
  {
    id: '9',
    name: 'Camisola Local Arsenal 2024/25',
    team: 'Arsenal',
    price: 385,
    playerPrice: 400,
    image: generateJerseyImage('arsenal'),
    playerImage: generateJerseyImage('arsenal', 'player'),
    images: [generateJerseyImage('arsenal')],
    playerImages: [generateJerseyImage('arsenal', 'player')],
    rating: 4.6,
    reviews: 84,
    season: '2024/25',
    competition: 'Premier League',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 13, 'M': 17, 'L': 14, 'XL': 10, 'XXL': 6 },
    patches: [extendedPatches[3], extendedPatches[9]], // Premier, FA Cup
    players: ['Saka', 'Ødegaard', 'Partey', 'Gabriel', 'Ramsdale', 'Martinelli'],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-21'),
  },
];

// Retro jerseys collection
export const retroJerseys: Product[] = [
  {
    id: 'retro-1',
    name: 'Barcelona Retro 1992/93',
    team: 'FC Barcelona',
    price: 320,
    playerPrice: 350,
    originalPrice: 380,
    image: generateJerseyImage('barcelona-retro'),
    playerImage: generateJerseyImage('barcelona-retro', 'player'),
    images: [generateJerseyImage('barcelona-retro')],
    playerImages: [generateJerseyImage('barcelona-retro', 'player')],
    rating: 4.9,
    reviews: 156,
    badge: 'Retro',
    season: '1992/93',
    competition: 'Retro Collection',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 5, 'M': 8, 'L': 7, 'XL': 4, 'XXL': 2 },
    patches: [],
    players: ['Romário', 'Stoichkov', 'Guardiola', 'Koeman'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'retro-2',
    name: 'Real Madrid Retro 2000/01',
    team: 'Real Madrid',
    price: 325,
    playerPrice: 355,
    originalPrice: 385,
    image: generateJerseyImage('real-madrid-retro'),
    playerImage: generateJerseyImage('real-madrid-retro', 'player'),
    images: [generateJerseyImage('real-madrid-retro')],
    playerImages: [generateJerseyImage('real-madrid-retro', 'player')],
    rating: 4.8,
    reviews: 142,
    badge: 'Retro',
    season: '2000/01',
    competition: 'Retro Collection',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 6, 'M': 9, 'L': 8, 'XL': 5, 'XXL': 3 },
    patches: [],
    players: ['Zidane', 'Figo', 'Raúl', 'Roberto Carlos'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'retro-3',
    name: 'Arsenal Retro 2003/04',
    team: 'Arsenal',
    price: 315,
    playerPrice: 345,
    originalPrice: 375,
    image: generateJerseyImage('arsenal-retro'),
    playerImage: generateJerseyImage('arsenal-retro', 'player'),
    images: [generateJerseyImage('arsenal-retro')],
    playerImages: [generateJerseyImage('arsenal-retro', 'player')],
    rating: 4.9,
    reviews: 178,
    badge: 'Retro',
    season: '2003/04',
    competition: 'Retro Collection',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: { 'S': 4, 'M': 7, 'L': 6, 'XL': 3, 'XXL': 2 },
    patches: [],
    players: ['Henry', 'Bergkamp', 'Vieira', 'Pires'],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
  },
];

// Combined products for easy access
export const allProducts = [...extendedMockProducts, ...retroJerseys];

// Mock API functions with enhanced filtering
export async function getProducts(filters?: any): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredProducts = filters?.category === 'retro' ? retroJerseys : extendedMockProducts;
  
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
  return allProducts.find(p => p.id === id) || null;
}

export async function checkStock(productId: string, size: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const product = allProducts.find(p => p.id === productId);
  return product?.stock[size] || 0;
}