export interface Patch {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category: 'league' | 'cup' | 'international' | 'special' | 'custom';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatchDto {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category: 'league' | 'cup' | 'international' | 'special' | 'custom';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive?: boolean;
}