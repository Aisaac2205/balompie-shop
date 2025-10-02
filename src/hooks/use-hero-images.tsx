import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getHeroImages, 
  getActiveHeroImages,
  createHeroImage, 
  updateHeroImage, 
  deleteHeroImage,
  reorderHeroImages
} from '@/services/api';
import { HeroImage, CreateHeroImageDto, UpdateHeroImageDto } from '@/types/hero-image';
import { useToast } from './use-toast';

export function useHeroImages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to get all hero images (for admin)
  const { data: heroImages = [], isLoading, error, refetch } = useQuery({
    queryKey: ['hero-images'],
    queryFn: getHeroImages,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query to get active hero images only (for public)
  const { data: activeHeroImages = [] } = useQuery({
    queryKey: ['hero-images', 'active'],
    queryFn: getActiveHeroImages,
    staleTime: 1000 * 60 * 5,
  });

  // Create hero image mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateHeroImageDto) => createHeroImage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: '✅ Imagen creada',
        description: 'La imagen del hero se ha agregado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.message || 'No se pudo crear la imagen',
        variant: 'destructive',
      });
    },
  });

  // Update hero image mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroImageDto }) => 
      updateHeroImage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: '✅ Imagen actualizada',
        description: 'Los cambios se guardaron correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar la imagen',
        variant: 'destructive',
      });
    },
  });

  // Delete hero image mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteHeroImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: '✅ Imagen eliminada',
        description: 'La imagen se ha eliminado correctamente',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.message || 'No se pudo eliminar la imagen',
        variant: 'destructive',
      });
    },
  });

  // Reorder hero images mutation
  const reorderMutation = useMutation({
    mutationFn: (orderData: { id: string; displayOrder: number }[]) => 
      reorderHeroImages(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast({
        title: '✅ Orden actualizado',
        description: 'El orden de las imágenes se ha guardado',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Error',
        description: error.message || 'No se pudo actualizar el orden',
        variant: 'destructive',
      });
    },
  });

  return {
    heroImages,
    activeHeroImages,
    isLoading,
    error,
    refetch,
    createHeroImage: createMutation.mutate,
    updateHeroImage: updateMutation.mutate,
    deleteHeroImage: deleteMutation.mutate,
    reorderHeroImages: reorderMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}
