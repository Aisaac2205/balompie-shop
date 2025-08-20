import { useProducts } from '@/hooks/use-products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const { data: products = [], isLoading } = useProducts();

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.stock && Object.values(p.stock).some(qty => qty > 0)).length,
    lowStockProducts: products.filter(p => 
      p.stock && Object.values(p.stock).some(qty => qty > 0 && qty <= 5)
    ).length,
    outOfStockProducts: products.filter(p => 
      p.stock && Object.values(p.stock).every(qty => qty === 0)
    ).length,
  };

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Badge variant="secondary" className="text-sm bg-gray-800 text-gray-300 border-gray-700">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-[#FFD100]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            <p className="text-xs text-gray-400">
              Productos en el catálogo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Productos Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.activeProducts}</div>
            <p className="text-xs text-gray-400">
              Con stock disponible
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Stock Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-[#FFD100]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FFD100]">{stats.lowStockProducts}</div>
            <p className="text-xs text-gray-400">
              Stock ≤ 5 unidades
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sin Stock</CardTitle>
            <Clock className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.outOfStockProducts}</div>
            <p className="text-xs text-gray-400">
              Requieren reposición
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Productos Recientes</CardTitle>
            <CardDescription className="text-gray-400">
              Últimos productos agregados al catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-700 bg-gray-800">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex-shrink-0">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.team} • {product.season}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs border-[#FFD100] text-[#FFD100]">
                      ${product.price}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <p>No hay productos en el catálogo</p>
                <p className="text-sm">Agrega tu primer producto para comenzar</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Acciones Rápidas</CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona tu tienda rápidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-[#FFD100]/30 bg-[#FFD100]/10">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-[#FFD100]" />
                  <div>
                    <p className="text-sm font-medium text-[#FFD100]">Agregar Producto</p>
                    <p className="text-xs text-gray-400">Crear nueva camiseta</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Ver Estadísticas</p>
                    <p className="text-xs text-gray-400">Análisis de ventas</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-purple-400">Gestionar Equipos</p>
                    <p className="text-xs text-gray-400">Agregar nuevos equipos</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {stats.totalProducts === 0 && (
        <Card className="text-center py-12 bg-gray-900 border-gray-800 shadow-xl">
          <CardContent>
            <Package className="mx-auto h-16 w-16 text-[#FFD100] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              ¡Bienvenido a tu panel de administración!
            </h3>
            <p className="text-gray-400 mb-6">
              Tu tienda está lista para comenzar. Agrega productos, equipos y parches para crear tu catálogo.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="px-4 py-2 border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black">
                <Package className="mr-2 h-4 w-4" />
                Agregar Producto
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black">
                <Users className="mr-2 h-4 w-4" />
                Crear Equipo
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
