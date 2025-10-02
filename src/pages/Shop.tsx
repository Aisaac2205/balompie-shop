import { useState, useMemo } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/layout/LogoWatermark";
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Package, Grid, List, X, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get filters from URL params
  const searchTerm = searchParams.get('search') || '';
  const selectedTeam = searchParams.get('team') || '';
  const selectedEquipmentType = searchParams.get('equipmentType') || '';
  const selectedProductType = searchParams.get('productType') || '';
  const priceRange = searchParams.get('priceRange') ? 
    searchParams.get('priceRange')!.split(',').map(Number) : [0, 500];
  const sortBy = searchParams.get('sort') || 'name';
  const onSale = searchParams.get('onSale') === 'true';
  
  const { products = [], isLoading } = useProducts();

  // Update URL params when filters change
  const updateFilters = (updates: Record<string, string | number[]>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || (Array.isArray(value) && value[0] === 0 && value[1] === 500)) {
        newParams.delete(key);
      } else {
        newParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
      }
    });
    setSearchParams(newParams);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = !selectedTeam || product.team === selectedTeam;
      const matchesEquipmentType = !selectedEquipmentType || product.equipmentType === selectedEquipmentType;
      const matchesProductType = !selectedProductType || product.productType === selectedProductType;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesActive = product.isActive;
      
      return matchesSearch && matchesTeam && matchesEquipmentType && matchesProductType && matchesPrice && matchesActive;
    });
  }, [products, searchTerm, selectedTeam, selectedEquipmentType, selectedProductType, priceRange]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  // Get unique filter options
  const teams = useMemo(() => ['', ...new Set(products.map(p => p.team))], [products]);
  const equipmentTypes = useMemo(() => ['', ...new Set(products.map(p => p.equipmentType))], [products]);

  const clearAllFilters = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedTeam || selectedEquipmentType || selectedProductType || 
    priceRange[0] !== 0 || priceRange[1] !== 500;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white relative">
        <LogoWatermark />
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-red-400 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-full">
                  <Package className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Error al cargar productos</h2>
              <p className="text-gray-600">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <LogoWatermark />
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/camisolas-background.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Tienda de <span className="text-yellow-500 font-display">Camisolas</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Descubre las mejores camisolas de fútbol con personalización completa. 
            Equipos oficiales, parches auténticos y calidad premium.
          </p>
        </div>
      </section>

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-black">{products.length}</p>
                <p className="text-gray-600 text-sm">Camisolas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-2xl font-bold text-black">{teams.length - 1}</p>
                <p className="text-gray-600 text-sm">Equipos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-black">{products.filter(p => p.playerPrice && p.playerPrice > p.price).length}</p>
                <p className="text-gray-600 text-sm">Ofertas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-black">{products.filter(p => p.productType === 'player').length}</p>
                <p className="text-gray-600 text-sm">Nuevos</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar camisolas, equipos..."
                  value={searchTerm}
                  onChange={(e) => updateFilters({ search: e.target.value })}
                  className="pl-10 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-yellow-500"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 bg-yellow-500 text-black">
                      {[searchTerm, selectedTeam, selectedEquipmentType, selectedProductType, priceRange[0] !== 0 || priceRange[1] !== 500].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-black hover:bg-gray-100"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">Vista:</span>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`rounded-none ${viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`rounded-none ${viewMode === 'list' ? 'bg-yellow-500 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <Card className="bg-white border-gray-200 shadow-lg mb-6">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Team Filter */}
                    <div>
                      <label className="block text-black font-medium mb-3">Equipo</label>
                      <Select value={selectedTeam} onValueChange={(value) => updateFilters({ team: value })}>
                        <SelectTrigger className="bg-white border-gray-300 text-black">
                          <SelectValue placeholder="Todos los equipos" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="" className="text-black hover:bg-yellow-50">
                            Todos los equipos
                          </SelectItem>
                          {teams.filter(Boolean).map((team: string) => (
                            <SelectItem key={team} value={team} className="text-black hover:bg-yellow-50">
                              {team}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Equipment Type Filter */}
                    <div>
                      <label className="block text-black font-medium mb-3">Tipo de Equipación</label>
                      <Select value={selectedEquipmentType} onValueChange={(value) => updateFilters({ equipmentType: value })}>
                        <SelectTrigger className="bg-white border-gray-300 text-black">
                          <SelectValue placeholder="Todas las equipaciones" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="" className="text-black hover:bg-yellow-50">
                            Todas las equipaciones
                          </SelectItem>
                          {equipmentTypes.filter(Boolean).map((equipmentType: string) => (
                            <SelectItem key={equipmentType} value={equipmentType} className="text-black hover:bg-yellow-50">
                              {equipmentType === 'local' ? 'Local' : 
                               equipmentType === 'visitante' ? 'Visitante' :
                               equipmentType === 'tercera' ? 'Tercera' :
                               equipmentType === 'alternativa' ? 'Alternativa' :
                               equipmentType === 'champions' ? 'Champions' : equipmentType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    

                    
                    {/* Product Type Filter */}
                    <div>
                      <label className="block text-black font-medium mb-3">Versión</label>
                      <Select value={selectedProductType} onValueChange={(value) => updateFilters({ productType: value })}>
                        <SelectTrigger className="bg-white border-gray-300 text-black">
                          <SelectValue placeholder="Todas las versiones" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="" className="text-black hover:bg-yellow-50">
                            Todas las versiones
                          </SelectItem>
                          <SelectItem value="fan" className="text-black hover:bg-yellow-50">
                            Fan (Hincha)
                          </SelectItem>
                          <SelectItem value="player" className="text-black hover:bg-yellow-50">
                            Player (Jugador)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-black font-medium mb-3">
                        Rango de Precio: Q{priceRange[0]} - Q{priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => updateFilters({ priceRange: value })}
                        max={500}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Sorting Options */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="block text-black font-medium mb-3">Ordenar por</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={sortBy === 'name' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sort: 'name' })}
                        className={sortBy === 'name' ? 'bg-yellow-500 text-black' : 'border-gray-300 text-gray-700 hover:bg-yellow-50'}
                      >
                        Nombre A-Z
                      </Button>
                      
                      <Button
                        variant={sortBy === 'price-low' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sort: 'price-low' })}
                        className={sortBy === 'price-low' ? 'bg-yellow-500 text-black' : 'border-gray-300 text-gray-700 hover:bg-yellow-50'}
                      >
                        Precio: Menor a Mayor
                      </Button>
                      
                      <Button
                        variant={sortBy === 'price-high' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sort: 'price-high' })}
                        className={sortBy === 'price-high' ? 'bg-yellow-500 text-black' : 'border-gray-300 text-gray-700 hover:bg-yellow-50'}
                      >
                        Precio: Mayor a Menor
                      </Button>
                      
                      <Button
                        variant={sortBy === 'newest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateFilters({ sort: 'newest' })}
                        className={sortBy === 'newest' ? 'bg-yellow-500 text-black' : 'border-gray-300 text-gray-700 hover:bg-yellow-50'}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Más Recientes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-gray-700">
                Mostrando {filteredProducts.length} de {products.length} camisolas
                {hasActiveFilters && (
                  <span className="text-yellow-600"> (filtradas)</span>
                )}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-xl animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-500 border-r-yellow-600 shadow-2xl shadow-yellow-500/25"></div>
              </div>
              <p className="text-gray-700 text-lg">Cargando productos...</p>
            </div>
          ) : (
            <ProductGrid products={sortedProducts} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;