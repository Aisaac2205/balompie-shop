export interface Team {
  id: string;
  name: string;
  country: string;
  league: string;
  logoUrl: string | null;
  primaryColor: string;
  achievements: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamDto {
  name: string;
  country: string;
  league: string;
  logoUrl: string | null;
  primaryColor: string;
  achievements?: string[];
  isActive?: boolean;
}