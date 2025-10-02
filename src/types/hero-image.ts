export interface HeroImage {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHeroImageDto {
  imageUrl: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateHeroImageDto {
  imageUrl?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}
