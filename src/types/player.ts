// ============= Player Types =============
// Types for team players/squad management

export interface Player {
  id: string;
  teamId: string;
  name: string;
  shirtNumber: number; // Dorsal
  position: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerDto {
  teamId: string;
  name: string;
  shirtNumber: number;
  position: 'Portero' | 'Defensa' | 'Centrocampista' | 'Delantero';
  isActive: boolean;
}

// Extend Team type to include players
export interface TeamWithPlayers {
  id: string;
  name: string;
  country: string;
  league: string;
  logoUrl: string;
  primaryColor: string;
  achievements: string[];
  isActive: boolean;
  players?: Player[]; // Optional array of players
}

// Player selection for products
export interface PlayerSelection {
  playerId: string;
  playerName: string;
  shirtNumber: number;
  teamId: string;
  teamName: string;
}