import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Player, CreatePlayerDto } from '@/types/player';
import { apiClient } from '@/services/api';
import { useTeams } from '@/hooks/use-teams';

export function usePlayers(teamId?: string) {
  const queryClient = useQueryClient();

  // Query para jugadores de un equipo específico
  const { 
    data: players = [], 
    isLoading,
    refetch: refetchPlayers 
  } = useQuery({
    queryKey: ['players', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      try {
        return await apiClient.getPlayersByTeam(teamId);
      } catch (error) {
        console.warn('Error loading players from API:', error);
        return [];
      }
    },
    enabled: !!teamId, // Solo ejecutar si hay teamId
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para crear jugador - AUTO REFRESH OPTIMIZADO
  const createPlayerMutation = useMutation({
    mutationFn: async (playerData: CreatePlayerDto) => {
      console.log('Creating player:', playerData);
      const response = await apiClient.createPlayer(playerData);
      console.log('Player created:', response);
      return response;
    },
    onSuccess: () => {
      // Invalidar y refetch automático
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
    onError: (error) => {
      console.error('Error creating player:', error);
    }
  });

  // Mutation para actualizar jugador - AUTO REFRESH OPTIMIZADO
  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreatePlayerDto> }) => {
      console.log('Updating player:', id, updates);
      const response = await apiClient.updatePlayer(id, updates);
      console.log('Player updated:', response);
      return response;
    },
    onSuccess: () => {
      // Invalidar y refetch automático
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
    onError: (error) => {
      console.error('Error updating player:', error);
    }
  });

  // Mutation para eliminar jugador - AUTO REFRESH OPTIMIZADO
  const deletePlayerMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting player:', id);
      const response = await apiClient.deletePlayer(id);
      console.log('Player deleted:', response);
      return response;
    },
    onSuccess: () => {
      // Invalidar y refetch automático
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
    onError: (error) => {
      console.error('Error deleting player:', error);
    }
  });

  // Funciones wrapper memoizadas para mantener compatibilidad
  const createPlayer = async (playerData: CreatePlayerDto) => {
    return createPlayerMutation.mutateAsync(playerData);
  };

  const updatePlayer = async (id: string, updates: Partial<CreatePlayerDto>) => {
    return updatePlayerMutation.mutateAsync({ id, updates });
  };

  const deletePlayer = async (id: string) => {
    return deletePlayerMutation.mutateAsync(id);
  };

  return {
    players,
    isLoading,
    createPlayer,
    updatePlayer,
    deletePlayer,
    refetchPlayers,
    // Estados de mutación para UI feedback
    isCreating: createPlayerMutation.isPending,
    isUpdating: updatePlayerMutation.isPending,
    isDeleting: deletePlayerMutation.isPending,
  };
}

// Hook específico para administración con mejor manejo de errores
export function useAdminPlayers(teamId?: string) {
  const { createPlayer, updatePlayer, deletePlayer, isCreating, isUpdating, isDeleting } = usePlayers(teamId);

  return {
    createPlayer: async (playerData: CreatePlayerDto) => {
      try {
        console.log('🔄 Admin: Creating player...', playerData);
        const result = await createPlayer(playerData);
        console.log('✅ Admin: Player created successfully', result);
        return result; // Retorna directamente la respuesta del backend
      } catch (error: any) {
        console.error('❌ Admin: Error creating player', error);
        return { success: false, message: error.message || 'Error al crear el jugador' };
      }
    },
    updatePlayer: async (id: string, updates: Partial<CreatePlayerDto>) => {
      try {
        console.log('🔄 Admin: Updating player...', id, updates);
        const result = await updatePlayer(id, updates);
        console.log('✅ Admin: Player updated successfully', result);
        return result; // Retorna directamente la respuesta del backend
      } catch (error: any) {
        console.error('❌ Admin: Error updating player', error);
        return { success: false, message: error.message || 'Error al actualizar el jugador' };
      }
    },
    deletePlayer: async (id: string) => {
      try {
        console.log('🔄 Admin: Deleting player...', id);
        const result = await deletePlayer(id);
        console.log('✅ Admin: Player deleted successfully', result);
        return result; // Retorna directamente la respuesta del backend
      } catch (error: any) {
        console.error('❌ Admin: Error deleting player', error);
        return { success: false, message: error.message || 'Error al eliminar el jugador' };
      }
    },
    // Estados de loading para mejor UX
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Hook para obtener jugadores por nombre de equipo (para la tienda)
export function usePlayersByTeamName(teamName?: string) {
  const { teams } = useTeams();
  
  // Encontrar el ID del equipo por nombre
  const team = teams.find(t => t.name === teamName);
  const teamId = team?.id;

  return usePlayers(teamId);
}