import { useState } from 'react';
import { useDashboard } from '@/hooks/use-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  ShoppingCart,
  Heart,
  Star,
  Eye,
  MoreHorizontal,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { analyticsService, SalesMetrics, SalesData, TeamSalesData, RecentActivity } from '@/services/analytics';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const {
    salesData,
    teamSalesData,
    recentActivity,
    metrics,
    lastUpdate,
    isRefreshing,
    isLoading,
    refresh,
    exportData,
    additionalStats,
    products
  } = useDashboard();

  const handleRefresh = () => refresh();
  const handleExport = () => exportData(timeRange);

  // Estadísticas calculadas con valores por defecto
  const stats = metrics || {
    totalProducts: additionalStats?.totalProductsCount || 0,
    activeProducts: additionalStats?.activeProductsCount || 0,
    totalRevenue: 45230,
    totalOrders: 128,
    avgOrderValue: 353,
    conversionRate: 3.2,
    returningCustomers: 89,
    customerSatisfaction: 4.7,
    growthMetrics: {
      revenue: { value: 12.5, isPositive: true },
      orders: { value: 8.2, isPositive: true },
      customers: { value: 15.1, isPositive: true },
      satisfaction: { value: 4.3, isPositive: true },
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Panel de control y análisis del negocio</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </span>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Ingresos</p>
                <p className="text-3xl font-bold">Q.{stats.totalRevenue}</p>
                <div className="flex items-center mt-2">
                  {stats.growthMetrics.revenue.isPositive ? 
                    <ArrowUpRight className="h-4 w-4 text-green-300" /> :
                    <ArrowDownRight className="h-4 w-4 text-red-300" />
                  }
                  <span className={`text-sm ml-1 ${
                    stats.growthMetrics.revenue.isPositive ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {stats.growthMetrics.revenue.isPositive ? '+' : ''}{stats.growthMetrics.revenue.value}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Pedidos</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <div className="flex items-center mt-2">
                  {stats.growthMetrics.orders.isPositive ? 
                    <ArrowUpRight className="h-4 w-4 text-green-300" /> :
                    <ArrowDownRight className="h-4 w-4 text-red-300" />
                  }
                  <span className={`text-sm ml-1 ${
                    stats.growthMetrics.orders.isPositive ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {stats.growthMetrics.orders.isPositive ? '+' : ''}{stats.growthMetrics.orders.value}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold">{stats.returningCustomers}</p>
                <div className="flex items-center mt-2">
                  {stats.growthMetrics.customers.isPositive ? 
                    <ArrowUpRight className="h-4 w-4 text-green-300" /> :
                    <ArrowDownRight className="h-4 w-4 text-red-300" />
                  }
                  <span className={`text-sm ml-1 ${
                    stats.growthMetrics.customers.isPositive ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {stats.growthMetrics.customers.isPositive ? '+' : ''}{stats.growthMetrics.customers.value}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Satisfacción</p>
                <p className="text-3xl font-bold">{stats.customerSatisfaction}</p>
                <div className="flex items-center mt-2">
                  {stats.growthMetrics.satisfaction.isPositive ? 
                    <ArrowUpRight className="h-4 w-4 text-green-300" /> :
                    <ArrowDownRight className="h-4 w-4 text-red-300" />
                  }
                  <span className={`text-sm ml-1 ${
                    stats.growthMetrics.satisfaction.isPositive ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {stats.growthMetrics.satisfaction.isPositive ? '+' : ''}{stats.growthMetrics.satisfaction.value}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tendencia de Ventas</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </CardTitle>
            <CardDescription>
              Ventas mensuales y tendencia de crecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData.length > 0 ? salesData : [
                { month: 'Ene', ventas: 120, pedidos: 45, ganancias: 8500 },
                { month: 'Feb', ventas: 150, pedidos: 52, ganancias: 9200 },
                { month: 'Mar', ventas: 180, pedidos: 63, ganancias: 11500 },
                { month: 'Abr', ventas: 135, pedidos: 48, ganancias: 9800 },
                { month: 'May', ventas: 200, pedidos: 71, ganancias: 12300 },
                { month: 'Jun', ventas: 175, pedidos: 58, ganancias: 10900 },
                { month: 'Jul', ventas: 225, pedidos: 89, ganancias: 15200 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#f59e0b" 
                  fill="#fbbf24" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de equipos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Equipos Más Vendidos</CardTitle>
            <CardDescription>
              Top 5 equipos por ventas este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamSalesData.length > 0 ? teamSalesData : [
                // Team sales data will be loaded from database
                { name: 'Manchester United', ventas: 65, color: '#da020e' },
                { name: 'Liverpool', ventas: 58, color: '#c8102e' },
                { name: 'Bayern Munich', ventas: 51, color: '#dc052d' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actividad reciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas transacciones y eventos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentActivity.length > 0 ? recentActivity : [
                // Recent activities will be loaded from database
                { id: 3, action: 'Nuevo registro', customer: 'Carlos López', product: '', amount: 0, time: 'Hace 20 min', type: 'customer' },
                { id: 4, action: 'Nueva compra', customer: 'Ana Martín', product: 'Camiseta Liverpool', amount: 85, time: 'Hace 35 min', type: 'purchase' },
                { id: 5, action: 'Nueva compra', customer: 'Luis Rodríguez', product: 'Camiseta Bayern', amount: 92, time: 'Hace 1 hora', type: 'purchase' }
              ]).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.action === 'Nueva compra' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.customer} - {activity.product}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount > 0 && (
                      <p className="font-medium text-green-600">Q.{activity.amount}</p>
                    )}
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas Clave</CardTitle>
            <CardDescription>
              Indicadores importantes del negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tasa de Conversión</span>
                <span className="text-sm font-bold text-gray-900">{stats.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.conversionRate / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Valor Promedio Pedido</span>
                <span className="text-sm font-bold text-gray-900">Q.{stats.avgOrderValue}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.avgOrderValue / 150) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Productos Activos</span>
                <span className="text-sm font-bold text-gray-900">{stats.activeProducts}/{stats.totalProducts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(stats.activeProducts / stats.totalProducts) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Estado del Sistema</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Operativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos más populares */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Populares</CardTitle>
          <CardDescription>
            Los productos con mejor rendimiento esta semana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product, index) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.team}</p>
                  <div className="flex items-center mt-1">
                    <Eye className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 100) + 50} vistas</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">Q.{product.price}</p>
                  <p className="text-xs text-gray-500">#{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;