// Servicio para estadísticas y análisis del negocio
export interface SalesMetrics {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  returningCustomers: number;
  customerSatisfaction: number;
  growthMetrics: {
    revenue: { value: number; isPositive: boolean };
    orders: { value: number; isPositive: boolean };
    customers: { value: number; isPositive: boolean };
    satisfaction: { value: number; isPositive: boolean };
  };
}

export interface SalesData {
  month: string;
  ventas: number;
  pedidos: number;
  ganancias: number;
}

export interface TeamSalesData {
  name: string;
  ventas: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  action: string;
  customer: string;
  product: string;
  amount: number;
  time: string;
  type: 'purchase' | 'product_added' | 'customer_signup' | 'refund';
}

export interface ProductAnalytics {
  productId: string;
  name: string;
  team: string;
  views: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  rating: number;
  trending: boolean;
}

class AnalyticsService {
  // Simular datos de ventas mensuales
  generateSalesData(months: number = 6): SalesData[] {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    
    return Array.from({ length: months }, (_, i) => {
      const monthIndex = (currentMonth - months + i + 1 + 12) % 12;
      const baseVentas = 50 + Math.random() * 60;
      const basePedidos = Math.floor(baseVentas * 0.7);
      const baseGanancias = Math.floor(baseVentas * 25 + Math.random() * 1000);
      
      return {
        month: monthNames[monthIndex],
        ventas: Math.floor(baseVentas),
        pedidos: basePedidos,
        ganancias: baseGanancias
      };
    });
  }

  // Generar datos de ventas por equipos
  generateTeamSalesData(): TeamSalesData[] {
    const teams = [
      { name: 'Barcelona', color: '#1f77b4' },
      { name: 'Real Madrid', color: '#ff7f0e' },
      { name: 'Man City', color: '#2ca02c' },
      { name: 'PSG', color: '#d62728' },
      { name: 'Liverpool', color: '#9467bd' },
      { name: 'Bayern', color: '#8c564b' },
      { name: 'Juventus', color: '#e377c2' },
    ];

    return teams.map(team => ({
      ...team,
      ventas: Math.floor(15 + Math.random() * 35)
    })).sort((a, b) => b.ventas - a.ventas).slice(0, 5);
  }

  // Generar actividad reciente
  generateRecentActivity(): RecentActivity[] {
    const actions = [
      { action: 'Nueva compra', type: 'purchase' as const },
      { action: 'Producto agregado', type: 'product_added' as const },
      { action: 'Cliente registrado', type: 'customer_signup' as const },
      { action: 'Reembolso procesado', type: 'refund' as const },
    ];

    const customers = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodriguez',
      'Sofia Hernández', 'Miguel Torres', 'Carmen Ruiz', 'Diego Morales', 'Lucia Vargas'
    ];

    const products = [
      // Products will be loaded from database
      'Camiseta Liverpool Visitante', 'Camiseta Man City Local', 'Camiseta Bayern Visitante'
    ];

    const times = ['1 min', '5 min', '15 min', '32 min', '1 hora', '2 horas', '5 horas'];

    return Array.from({ length: 8 }, (_, i) => {
      const actionData = actions[Math.floor(Math.random() * actions.length)];
      const customer = actionData.type === 'product_added' ? 'Admin' : 
                      customers[Math.floor(Math.random() * customers.length)];
      const amount = actionData.type === 'purchase' ? Math.floor(60 + Math.random() * 80) :
                     actionData.type === 'refund' ? Math.floor(40 + Math.random() * 60) : 0;

      return {
        id: i + 1,
        action: actionData.action,
        customer,
        product: products[Math.floor(Math.random() * products.length)],
        amount,
        time: times[Math.floor(Math.random() * times.length)],
        type: actionData.type
      };
    });
  }

  // Calcular métricas de negocio
  calculateMetrics(productsCount: number, activeProductsCount: number): SalesMetrics {
    const baseRevenue = 2500 + Math.random() * 1000;
    const baseOrders = Math.floor(100 + Math.random() * 100);
    
    return {
      totalProducts: productsCount,
      activeProducts: activeProductsCount,
      totalRevenue: Math.floor(baseRevenue),
      totalOrders: baseOrders,
      avgOrderValue: Math.floor(baseRevenue / baseOrders * 100) / 100,
      conversionRate: Math.floor((2 + Math.random() * 4) * 100) / 100,
      returningCustomers: Math.floor(45 + Math.random() * 40),
      customerSatisfaction: Math.floor((7.5 + Math.random() * 2) * 10) / 10,
      growthMetrics: {
        revenue: { 
          value: Math.floor((5 + Math.random() * 20) * 10) / 10, 
          isPositive: Math.random() > 0.3 
        },
        orders: { 
          value: Math.floor((2 + Math.random() * 15) * 10) / 10, 
          isPositive: Math.random() > 0.2 
        },
        customers: { 
          value: Math.floor((1 + Math.random() * 18) * 10) / 10, 
          isPositive: Math.random() > 0.25 
        },
        satisfaction: { 
          value: Math.floor((-5 + Math.random() * 10) * 10) / 10, 
          isPositive: Math.random() > 0.4 
        },
      }
    };
  }

  // Analizar productos más populares
  analyzeProducts(products: any[]): ProductAnalytics[] {
    return products.slice(0, 10).map(product => ({
      productId: product.id,
      name: product.name,
      team: product.team,
      views: Math.floor(50 + Math.random() * 200),
      purchases: Math.floor(5 + Math.random() * 50),
      revenue: Math.floor(product.price * (5 + Math.random() * 50)),
      conversionRate: Math.floor((2 + Math.random() * 8) * 100) / 100,
      rating: Math.floor((3.5 + Math.random() * 1.5) * 10) / 10,
      trending: Math.random() > 0.7
    }));
  }

  // Simular datos en tiempo real (para actualizaciones automáticas)
  subscribeToRealTimeUpdates(callback: (data: any) => void) {
    const interval = setInterval(() => {
      const updates = {
        newOrder: Math.random() > 0.85,
        newCustomer: Math.random() > 0.9,
        newProduct: Math.random() > 0.95,
        revenueUpdate: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      };
      
      if (updates.newOrder || updates.newCustomer || updates.newProduct) {
        callback(updates);
      }
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }

  // Exportar datos para reportes
  exportDashboardData(timeRange: string = '30d') {
    const data = {
      timeRange,
      exportDate: new Date().toISOString(),
      salesData: this.generateSalesData(),
      teamSales: this.generateTeamSalesData(),
      recentActivity: this.generateRecentActivity(),
      summary: {
        totalProducts: 0, // Se llenará con datos reales
        totalRevenue: 0,  // Se llenará con datos reales
        totalOrders: 0,   // Se llenará con datos reales
        avgOrderValue: 0, // Se llenará con datos reales
      }
    };

    // En producción, esto generaría un archivo CSV o PDF
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const analyticsService = new AnalyticsService();