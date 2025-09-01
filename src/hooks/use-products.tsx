import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData, ProductFilters } from '@/types/product';

const STORAGE_KEY = 'balompie_products';

// Datos de ejemplo para equipos
const TEAMS = [
  'Barcelona',
  'Real Madrid',
  'Manchester City',
  'PSG',
  'Liverpool',
  'Bayern Munich',
  'Chelsea',
  'Arsenal',
  'Manchester United',
  'Juventus',
  'AC Milan',
  'Inter Milan',
  'Atlético Madrid',
  'Sevilla',
  'Valencia'
];

// Datos de ejemplo para equipaciones
const EQUIPMENT_TYPES = [
  { value: 'local', label: 'Local' },
  { value: 'visitante', label: 'Visitante' },
  { value: 'tercera', label: 'Tercera' },
  { value: 'alternativa', label: 'Alternativa' },
  { value: 'champions', label: 'Champions League' }
];

// Datos de ejemplo para tipos de producto
const PRODUCT_TYPES = [
  { value: 'fan', label: 'Fan' },
  { value: 'player', label: 'Jugador' }
];

// Datos de ejemplo para tallas
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Datos de ejemplo para colores
const COLORS = [
  'Rojo',
  'Azul',
  'Amarillo',
  'Verde',
  'Negro',
  'Blanco',
  'Gris',
  'Naranja',
  'Rosa',
  'Morado',
  'Rojo Azul',
  'Azul Amarillo',
  'Negro Dorado',
  'Blanco Azul'
];

// Función para cargar productos desde localStorage
const loadProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

// Función para guardar productos en localStorage
const saveProducts = (products: Product[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products:', error);
  }
};

// Hook principal para productos
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar productos al inicializar
  useEffect(() => {
    const loadInitialProducts = () => {
      setIsLoading(true);
      const storedProducts = loadProducts();
      
      // Si no hay productos, crear algunos de ejemplo
      if (storedProducts.length === 0) {
        const exampleProducts: Product[] = [
          {
            id: '1',
            team: 'Barcelona',
            equipmentType: 'local',
            productType: 'fan',
            name: 'Barcelona 2024/25 - Local - Fan',
            description: 'Camiseta oficial del FC Barcelona temporada 2024/25, versión fan.',
            price: 85,
            playerPrice: 120,
            images: ['/src/assets/equipos/barcelona.png'],
            sizes: ['S', 'M', 'L', 'XL'],
            primaryColor: 'Rojo Azul',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            team: 'Barcelona',
            equipmentType: 'local',
            productType: 'player',
            name: 'Barcelona 2024/25 - Local - Jugador',
            description: 'Camiseta oficial del FC Barcelona temporada 2024/25, versión jugador.',
            price: 120,
            playerPrice: 120,
            images: ['/src/assets/equipos/barcelona.png'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            primaryColor: 'Rojo Azul',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '3',
            team: 'Real Madrid',
            equipmentType: 'local',
            productType: 'fan',
            name: 'Real Madrid 2024/25 - Local - Fan',
            description: 'Camiseta oficial del Real Madrid temporada 2024/25, versión fan.',
            price: 85,
            playerPrice: 120,
            images: ['/src/assets/equipos/realmadrid.png'],
            sizes: ['S', 'M', 'L', 'XL'],
            primaryColor: 'Blanco',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '4',
            team: 'Liverpool',
            equipmentType: 'local',
            productType: 'fan',
            name: 'Liverpool 2024/25 - Local - Fan',
            description: 'Camiseta oficial del Liverpool temporada 2024/25, versión fan.',
            price: 90,
            playerPrice: 130,
            images: ['/src/assets/equipos/liverpool.png'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            primaryColor: 'Rojo',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '5',
            team: 'Manchester City',
            equipmentType: 'visitante',
            productType: 'fan',
            name: 'Manchester City 2024/25 - Visitante - Fan',
            description: 'Camiseta oficial del Manchester City temporada 2024/25, versión fan.',
            price: 88,
            playerPrice: 125,
            images: ['/src/assets/equipos/liverpool.png'],
            sizes: ['S', 'M', 'L', 'XL'],
            primaryColor: 'Azul',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '6',
            team: 'PSG',
            equipmentType: 'local',
            productType: 'player',
            name: 'PSG 2024/25 - Local - Jugador',
            description: 'Camiseta oficial del PSG temporada 2024/25, versión jugador.',
            price: 125,
            playerPrice: 125,
            images: ['/src/assets/equipos/liverpool.png'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            primaryColor: 'Azul',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        saveProducts(exampleProducts);
        setProducts(exampleProducts);
      } else {
        setProducts(storedProducts);
      }
      
      setIsLoading(false);
    };

    loadInitialProducts();
  }, []);

  // Función para crear un nuevo producto
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    return newProduct;
  }, [products]);

  // Función para actualizar un producto
  const updateProduct = useCallback(async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    const updatedProducts = products.map(product =>
      product.id === id
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    return updatedProducts.find(p => p.id === id);
  }, [products]);

  // Función para eliminar un producto
  const deleteProduct = useCallback(async (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
  }, [products]);

  // Función para filtrar productos
  const filterProducts = useCallback((filters: ProductFilters): Product[] => {
    return products.filter(product => {
      const matchesTeam = !filters.team || product.team === filters.team;
      const matchesEquipment = !filters.equipmentType || product.equipmentType === filters.equipmentType;
      const matchesProductType = !filters.productType || product.productType === filters.productType;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'active' && product.isActive) ||
        (filters.status === 'inactive' && !product.isActive);
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.team.toLowerCase().includes(filters.search.toLowerCase());

      return matchesTeam && matchesEquipment && matchesProductType && matchesStatus && matchesSearch;
    });
  }, [products]);

  return {
    data: products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    teams: TEAMS,
    equipmentTypes: EQUIPMENT_TYPES,
    productTypes: PRODUCT_TYPES,
    sizes: SIZES,
    colors: COLORS
  };
}

// Hook para mutaciones de productos
export function useProductMutations() {
  const { createProduct, updateProduct, deleteProduct } = useProducts();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsCreating(true);
    try {
      await createProduct(productData);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProduct = async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    setIsUpdating(true);
    try {
      await updateProduct({ id, updates });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createProduct: handleCreateProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  };
}

// Hook para estado del formulario de producto
export function useProductState() {
  const [product, setProduct] = useState<Partial<Product>>({
    team: '',
    equipmentType: 'local',
    productType: 'fan',
    name: '',
    description: '',
    price: 0,
    playerPrice: 0,
    images: [],
    sizes: [],
    primaryColor: '',
    isActive: true
  });

  const updateProduct = (updates: Partial<Product>) => {
    setProduct(prev => ({ ...prev, ...updates }));
  };

  const resetProduct = () => {
    setProduct({
      team: '',
      equipmentType: 'local',
      productType: 'fan',
      name: '',
      description: '',
      price: 0,
      playerPrice: 0,
      images: [],
      sizes: [],
      primaryColor: '',
      isActive: true
    });
  };

  return {
    product,
    updateProduct,
    resetProduct
  };
}
