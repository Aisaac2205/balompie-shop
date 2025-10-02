import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductFilters } from '@/types/product';
import { apiClient } from '@/services/api';

// Datos básicos para formularios
const EQUIPMENT_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'visitante', label: 'Visitante' },
  { value: 'tercera', label: 'Tercera' }
];
const PRODUCT_TYPES = [
  { value: 'fan', label: 'Fan' },
  { value: 'player', label: 'Jugador' }
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco'];

export function useProducts() {
  const queryClient = useQueryClient();

  // Query para productos con React Query
  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    refetch: refetchProducts 
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await apiClient.getProducts();
      } catch (error) {
        console.warn('Error loading products from API:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Query para equipos con React Query
  const { 
    data: teamsData = [], 
    isLoading: isLoadingTeams 
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

  // Convertir equipos a formato anterior (solo nombres) - usar useMemo para evitar recálculos
  const teams = useMemo(() => teamsData.map(team => team.name), [teamsData]);
  const isLoading = isLoadingProducts || isLoadingTeams;

  // Mutation para crear producto - AUTO REFRESH OPTIMIZADO
  const createProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating product:', productData);
      const newProduct = await apiClient.createProduct(productData);
      console.log('Product created:', newProduct);
      return newProduct;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    }
  });

  // Mutation para actualizar producto - AUTO REFRESH OPTIMIZADO
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
      console.log('Updating product:', id, updates);
      const updatedProduct = await apiClient.updateProduct(id, updates);
      console.log('Product updated:', updatedProduct);
      return updatedProduct;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error updating product:', error);
    }
  });

  // Mutation para eliminar producto - AUTO REFRESH OPTIMIZADO
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      await apiClient.deleteProduct(id);
      console.log('Product deleted:', id);
      return id;
    },
    onSuccess: () => {
      // Invalidar y refetch automático - MÁS RÁPIDO QUE RECARGAR MANUAL
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
    }
  });

  // Filtrar productos - memoizado para evitar re-creaciones
  const filterProducts = useCallback((filters: ProductFilters) => {
    let filtered = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.team.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.team && filters.team !== 'all') {
      filtered = filtered.filter(product => product.team === filters.team);
    }

    if (filters.equipmentType && filters.equipmentType !== 'all') {
      filtered = filtered.filter(product => product.equipmentType === filters.equipmentType);
    }

    if (filters.productType && filters.productType !== 'all') {
      filtered = filtered.filter(product => product.productType === filters.productType);
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active') {
        filtered = filtered.filter(product => product.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(product => !product.isActive);
      }
    }

    return filtered;
  }, [products]);

  // Funciones wrapper memoizadas para mantener compatibilidad
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return createProductMutation.mutateAsync(productData);
  }, [createProductMutation]);

  const updateProduct = useCallback(async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    return updateProductMutation.mutateAsync({ id, updates });
  }, [updateProductMutation]);

  const deleteProduct = useCallback(async (id: string) => {
    return deleteProductMutation.mutateAsync(id);
  }, [deleteProductMutation]);

  // Función de recarga manual memoizada (para compatibilidad)
  const loadProducts = useCallback(async () => {
    await refetchProducts();
  }, [refetchProducts]);

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    loadProducts,
    teams,
    equipmentTypes: EQUIPMENT_TYPES,
    productTypes: PRODUCT_TYPES,
    sizes: SIZES,
    colors: COLORS,
    // Estados de mutación para UI feedback
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}

// Hook específico para administración - MEJORADO CON AUTO REFRESH
export function useAdminProducts() {
  const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useProducts();

  return {
    createProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        await createProduct(productData);
        return { success: true, message: 'Producto creado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al crear el producto' };
      }
    },
    updateProduct: async (id: string, updates: Partial<Product>) => {
      try {
        await updateProduct({ id, updates });
        return { success: true, message: 'Producto actualizado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al actualizar el producto' };
      }
    },
    deleteProduct: async (id: string) => {
      try {
        await deleteProduct(id);
        return { success: true, message: 'Producto eliminado exitosamente' };
      } catch (error) {
        return { success: false, message: 'Error al eliminar el producto' };
      }
    },
    // Estados de loading para mejor UX
    isCreating,
    isUpdating,
    isDeleting,
  };
}