import { useState, useEffect, useCallback } from 'react';
import { Patch, CreatePatchDto } from '@/types/patch';
import { apiClient } from '@/services/api';

export function usePatches() {
  const [patches, setPatches] = useState<Patch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar parches
  const loadPatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiPatches = await apiClient.getPatches();
      setPatches(apiPatches);
    } catch (error) {
      console.warn('Error loading patches from API:', error);
      setPatches([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar parches desde la API
  useEffect(() => {
    loadPatches();
  }, [loadPatches]);

  // Crear parche
  const createPatch = useCallback(async (patchData: CreatePatchDto) => {
    console.log('Creating patch:', patchData);
    const newPatch = await apiClient.createPatch(patchData);
    console.log('Patch created:', newPatch);
    
    // Recargar la lista completa desde la API para asegurar consistencia
    await loadPatches();
    return newPatch;
  }, [loadPatches]);

  // Actualizar parche
  const updatePatch = useCallback(async (id: string, updates: Partial<CreatePatchDto>) => {
    console.log('Updating patch:', id, updates);
    const updatedPatch = await apiClient.updatePatch(id, updates);
    console.log('Patch updated:', updatedPatch);
    
    // Recargar la lista completa desde la API para asegurar consistencia
    await loadPatches();
    return updatedPatch;
  }, [loadPatches]);

  // Eliminar parche
  const deletePatch = useCallback(async (id: string) => {
    console.log('Deleting patch:', id);
    await apiClient.deletePatch(id);
    console.log('Patch deleted:', id);
    
    // Recargar la lista completa desde la API para asegurar consistencia
    await loadPatches();
  }, [loadPatches]);

  return {
    patches,
    isLoading,
    createPatch,
    updatePatch,
    deletePatch,
    loadPatches
  };
}

// Hook específico para administración
export function useAdminPatches() {
  const { createPatch, updatePatch, deletePatch } = usePatches();

  return {
    createPatch: async (patchData: CreatePatchDto) => {
      try {
        await createPatch(patchData);
        return { success: true, message: 'Parche creado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al crear el parche' };
      }
    },
    updatePatch: async (id: string, updates: Partial<CreatePatchDto>) => {
      try {
        await updatePatch(id, updates);
        return { success: true, message: 'Parche actualizado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al actualizar el parche' };
      }
    },
    deletePatch: async (id: string) => {
      try {
        await deletePatch(id);
        return { success: true, message: 'Parche eliminado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al eliminar el parche' };
      }
    }
  };
}