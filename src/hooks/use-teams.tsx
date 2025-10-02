import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Team, CreateTeamDto } from '@/types/team';
import { apiClient } from '@/services/api';

export function useTeams() {
  const queryClient = useQueryClient();

  // Query para equipos con React Query
  const { 
    data: teams = [], 
    isLoading,
    refetch: refetchTeams 
  } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      try {
        return await apiClient.getTeams();
      } catch (error) {
        console.warn('Error loading teams from API:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para crear equipo - AUTO REFRESH OPTIMIZADO
  const createTeamMutation = useMutation({
    mutationFn: async (teamData: CreateTeamDto) => {
      console.log('Creating team:', teamData);
      const newTeam = await apiClient.createTeam(teamData);
      console.log('Team created:', newTeam);
      return newTeam;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      // También invalidar productos ya que pueden depender de equipos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating team:', error);
    }
  });

  // Mutation para actualizar equipo - AUTO REFRESH OPTIMIZADO
  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreateTeamDto> }) => {
      console.log('Updating team:', id, updates);
      const updatedTeam = await apiClient.updateTeam(id, updates);
      console.log('Team updated:', updatedTeam);
      return updatedTeam;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      // También invalidar productos ya que pueden depender de equipos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error updating team:', error);
    }
  });

  // Mutation para eliminar equipo - AUTO REFRESH OPTIMIZADO
  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting team:', id);
      await apiClient.deleteTeam(id);
      console.log('Team deleted:', id);
      return id;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      // También invalidar productos ya que pueden depender de equipos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting team:', error);
    }
  });

  // Funciones wrapper para mantener compatibilidad
  const createTeam = async (teamData: CreateTeamDto) => {
    return createTeamMutation.mutateAsync(teamData);
  };

  const updateTeam = async (id: string, updates: Partial<CreateTeamDto>) => {
    return updateTeamMutation.mutateAsync({ id, updates });
  };

  const deleteTeam = async (id: string) => {
    return deleteTeamMutation.mutateAsync(id);
  };

  // Función de recarga manual (para compatibilidad)
  const loadTeams = async () => {
    await refetchTeams();
  };

  return {
    teams,
    isLoading,
    createTeam,
    updateTeam,
    deleteTeam,
    loadTeams,
    // Estados de mutación para UI feedback
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
  };
}

// Hook específico para administración - MEJORADO CON AUTO REFRESH
export function useAdminTeams() {
  const { createTeam, updateTeam, deleteTeam, isCreating, isUpdating, isDeleting } = useTeams();

  return {
    createTeam: async (teamData: CreateTeamDto) => {
      try {
        await createTeam(teamData);
        return { success: true, message: 'Equipo creado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al crear el equipo' };
      }
    },
    updateTeam: async (id: string, updates: Partial<CreateTeamDto>) => {
      try {
        await updateTeam(id, updates);
        return { success: true, message: 'Equipo actualizado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al actualizar el equipo' };
      }
    },
    deleteTeam: async (id: string) => {
      try {
        await deleteTeam(id);
        return { success: true, message: 'Equipo eliminado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al eliminar el equipo' };
      }
    },
    // Estados de loading para mejor UX
    isCreating,
    isUpdating,
    isDeleting,
  };
}