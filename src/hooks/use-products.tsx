import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductFilters } from '@/types/product';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '@/services/api';

// Query keys for React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook for fetching products with filters
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for product mutations (create, update, delete)
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.id) });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });

  return {
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
  };
};

// Hook for managing product state locally (for forms, etc.)
export const useProductState = (initialProduct?: Partial<Product>) => {
  const [product, setProduct] = useState<Partial<Product>>(initialProduct || {
    name: '',
    team: '',
    price: 0,
    season: '2024/25',
    competition: 'Liga Española',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: {
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
      'XXL': 0,
    },
    patches: [],
    players: [],
    rating: 0,
    reviews: 0,
  });

  const updateProduct = (updates: Partial<Product>) => {
    setProduct(prev => ({ ...prev, ...updates }));
  };

  const resetProduct = () => {
    setProduct(initialProduct || {
      name: '',
      team: '',
      price: 0,
      season: '2024/25',
      competition: 'Liga Española',
      availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
      stock: {
        'S': 0,
        'M': 0,
        'L': 0,
        'XL': 0,
        'XXL': 0,
      },
      patches: [],
      players: [],
      rating: 0,
      reviews: 0,
    });
  };

  return {
    product,
    updateProduct,
    resetProduct,
  };
};
