import { useState, useEffect, useCallback } from 'react';
import { useProducts } from '@/hooks/use-products';
import { analyticsService, SalesMetrics, SalesData, TeamSalesData, RecentActivity } from '@/services/analytics';
import { toast } from '@/hooks/use-toast';

interface DashboardState {
  salesData: SalesData[];
  teamSalesData: TeamSalesData[];
  recentActivity: RecentActivity[];
  metrics: SalesMetrics | null;
  lastUpdate: Date;
  isRefreshing: boolean;
  isLoading: boolean;
}

export function useDashboard() {
  const { products, isLoading: productsLoading } = useProducts();
  
  const [state, setState] = useState<DashboardState>({
    salesData: [],
    teamSalesData: [],
    recentActivity: [],
    metrics: null,
    lastUpdate: new Date(),
    isRefreshing: false,
    isLoading: true,
  });

  // Timeout para asegurar que isLoading se quite después de un tiempo máximo
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (state.isLoading) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastUpdate: new Date(),
        }));
      }
    }, 5000); // 5 segundos máximo

    return () => clearTimeout(timeout);
  }, [state.isLoading]);

  // Función para cargar todos los datos del dashboard
  const loadDashboardData = useCallback(() => {
    try {
      const salesData = analyticsService.generateSalesData();
      const teamSales = analyticsService.generateTeamSalesData();
      const activity = analyticsService.generateRecentActivity();
      const businessMetrics = analyticsService.calculateMetrics(
        products.length, 
        products.filter(p => p.isActive).length
      );

      setState(prev => ({
        ...prev,
        salesData,
        teamSalesData: teamSales,
        recentActivity: activity,
        metrics: businessMetrics,
        lastUpdate: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Aún así cambiar isLoading a false para no quedarse cargando
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastUpdate: new Date(),
      }));
    }
  }, [products]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!productsLoading) {
      if (products.length > 0) {
        loadDashboardData();
      } else {
        // Si no hay productos, aún así cambiar isLoading a false
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastUpdate: new Date(),
        }));
      }
    }
  }, [products, productsLoading, loadDashboardData]);

  // Función para refrescar datos
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true }));
    
    // Simular un delay para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    loadDashboardData();
    
    setState(prev => ({ ...prev, isRefreshing: false }));
    
    toast({
      title: "Dashboard actualizado",
      description: "Los datos se han actualizado correctamente",
    });
  }, [loadDashboardData]);

  // Función para exportar datos
  const exportData = useCallback((timeRange: string) => {
    analyticsService.exportDashboardData(timeRange);
    toast({
      title: "Reporte exportado",
      description: "El reporte se ha descargado exitosamente",
    });
  }, []);

  // Suscripción a actualizaciones en tiempo real
  useEffect(() => {
    const unsubscribe = analyticsService.subscribeToRealTimeUpdates((updates) => {
      if (updates.newOrder) {
        toast({
          title: "Nueva venta! 🎉",
          description: "Se ha realizado una nueva compra",
        });
        
        // Actualizar actividad reciente
        setState(prev => ({
          ...prev,
          lastUpdate: new Date(),
          recentActivity: [
            {
              id: Date.now(),
              action: 'Nueva compra',
              customer: 'Cliente',
              product: 'Producto',
              amount: Math.floor(60 + Math.random() * 80),
              time: 'Ahora',
              type: 'purchase'
            },
            ...prev.recentActivity.slice(0, 7)
          ]
        }));
      }
      
      if (updates.newCustomer) {
        toast({
          title: "Nuevo cliente registrado",
          description: "Un nuevo cliente se ha unido a tu tienda",
        });
      }
    });

    return unsubscribe;
  }, []);

  // Calcular estadísticas adicionales
  const additionalStats = {
    totalProductsCount: products.length,
    activeProductsCount: products.filter(p => p.isActive).length,
    inactiveProductsCount: products.filter(p => !p.isActive).length,
    productsByTeam: products.reduce((acc, product) => {
      acc[product.team] = (acc[product.team] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    avgPrice: products.length > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
      : 0,
  };

  return {
    ...state,
    isLoading: state.isLoading || productsLoading,
    refresh,
    exportData,
    additionalStats,
    products,
  };
}