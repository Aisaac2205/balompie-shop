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
  const selectedCompetition = searchParams.get('competition') || '';
  const selectedSeason = searchParams.get('season') || '';
  const priceRange = searchParams.get('priceRange') ? 
    searchParams.get('priceRange')!.split(',').map(Number) : [0, 500];
  const sortBy = searchParams.get('sort') || 'name';
  const onSale = searchParams.get('onSale') === 'true';
  
  const { data: products = [], isLoading, error } = useProducts();

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
      const matchesCompetition = !selectedCompetition || product.competition === selectedCompetition;
      const matchesSeason = !selectedSeason || product.season === selectedSeason;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSale = !onSale || product.originalPrice;
      
      return matchesSearch && matchesTeam && matchesCompetition && matchesSeason && matchesPrice && matchesSale;
    });
  }, [products, searchTerm, selectedTeam, selectedCompetition, selectedSeason, priceRange, onSale]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  // Get unique filter options
  const teams = useMemo(() => ['', ...new Set(products.map(p => p.team))], [products]);
  const competitions = useMemo(() => ['', ...new Set(products.map(p => p.competition))], [products]);
  const seasons = useMemo(() => ['', ...new Set(products.map(p => p.season))], [products]);

  const clearAllFilters = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  const hasActiveFilters = searchTerm || selectedTeam || selectedCompetition || selectedSeason || 
    priceRange[0] !== 0 || priceRange[1] !== 500 || onSale;

  if (error) {
    return (
      <div className="min-h-screen bg-background relative">
        <LogoWatermark />
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/30 to-red-600/30 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-full">
                  <Package className="h-16 w-16 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Error al cargar productos</h2>
              <p className="text-white/70">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
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
            Tienda de <span className="accent-gradient bg-gradient-to-r from-accent via-yellow-400 to-yellow-500 bg-clip-text text-transparent font-display">Camisolas</span>
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
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <p className="text-2xl font-bold text-white">{products.length}</p>
                <p className="text-white/70 text-sm">Camisolas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white">{teams.length - 1}</p>
                <p className="text-white/70 text-sm">Equipos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{products.filter(p => p.originalPrice).length}</p>
                <p className="text-white/70 text-sm">Ofertas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{competitions.length - 1}</p>
                <p className="text-white/70 text-sm">Competiciones</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Controls */}
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              {/* Top Row - Search and View */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-1 max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <Input
                      placeholder="Buscar camisolas, equipos..."
                      value={searchTerm}
                      onChange={(e) => updateFilters({ search: e.target.value })}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-accent"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-white/30 text-white hover:bg-accent/20 hover:border-accent/60"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 bg-accent text-background">
                        {[searchTerm, selectedTeam, selectedCompetition, selectedSeason, 
                          priceRange[0] !== 0 || priceRange[1] !== 500, onSale].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm">Vista:</span>
                  <div className="flex border border-white/20 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={`rounded-none ${viewMode === 'grid' ? 'bg-accent text-background' : 'text-white hover:bg-white/10'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={`rounded-none ${viewMode === 'list' ? 'bg-accent text-background' : 'text-white hover:bg-white/10'}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="border-t border-white/20 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Team Filter */}
                    <div>
                      <label className="block text-white font-medium mb-2">Equipo</label>
                      <Select value={selectedTeam} onValueChange={(value) => updateFilters({ team: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Todos los equipos" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/20">
                          {teams.map(team => (
                            <SelectItem key={team} value={team} className="text-white hover:bg-accent/10">
                              {team || 'Todos los equipos'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Competition Filter */}
                    <div>
                      <label className="block text-white font-medium mb-2">Competición</label>
                      <Select value={selectedCompetition} onValueChange={(value) => updateFilters({ competition: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Todas las competiciones" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/20">
                          {competitions.map(competition => (
                            <SelectItem key={competition} value={competition} className="text-white hover:bg-accent/10">
                              {competition || 'Todas las competiciones'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Season Filter */}
                    <div>
                      <label className="block text-white font-medium mb-2">Temporada</label>
                      <Select value={selectedSeason} onValueChange={(value) => updateFilters({ season: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Todas las temporadas" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/20">
                          {seasons.map(season => (
                            <SelectItem key={season} value={season} className="text-white hover:bg-accent/10">
                              {season || 'Todas las temporadas'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Precio: Q{priceRange[0]} - Q{priceRange[1]}
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

                    {/* Sort By */}
                    <div>
                      <label className="block text-white font-medium mb-2">Ordenar por</label>
                      <Select value={sortBy} onValueChange={(value) => updateFilters({ sort: value })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/20">
                          <SelectItem value="name" className="text-white hover:bg-accent/10">Nombre A-Z</SelectItem>
                          <SelectItem value="price-low" className="text-white hover:bg-accent/10">Precio: Menor a Mayor</SelectItem>
                          <SelectItem value="price-high" className="text-white hover:bg-accent/10">Precio: Mayor a Menor</SelectItem>
                          <SelectItem value="rating" className="text-white hover:bg-accent/10">Mejor Valorados</SelectItem>
                          <SelectItem value="newest" className="text-white hover:bg-accent/10">Más Recientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={onSale}
                          onChange={(e) => updateFilters({ onSale: e.target.checked ? 'true' : 'false' })}
                          className="rounded border-white/30 text-accent focus:ring-accent"
                        />
                        <span className="text-white text-sm">Solo ofertas</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-white/80">
              Mostrando {filteredProducts.length} de {products.length} camisolas
              {hasActiveFilters && (
                <span className="text-accent"> (filtradas)</span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-yellow-500/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-accent border-r-yellow-500 shadow-2xl shadow-accent/25"></div>
              </div>
              <p className="text-white/80 text-lg">Cargando camisolas...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="mb-12">
              <ProductGrid products={sortedProducts} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-white/20 to-white/10 p-6 rounded-full border border-white/20">
                  <Package className="h-16 w-16 text-white/80 drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No se encontraron camisolas</h3>
              <p className="text-white/60 mb-4">Intenta ajustar los filtros de búsqueda</p>
              {hasActiveFilters && (
                <Button onClick={clearAllFilters} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;