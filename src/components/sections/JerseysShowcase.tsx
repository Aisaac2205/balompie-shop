import { ProductCard } from "@/components/product/ProductCard";
import { ProductDialog } from "@/components/product/ProductDialog";
import { useProducts } from "@/hooks/use-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Trophy, Star, Shirt, Package, Filter, Grid, List, X } from "lucide-react";
import { useState, useMemo } from "react";

export function JerseysShowcase() {
  const { data: products = [], isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique teams and versions for filters
  const teams = useMemo(() => {
    const uniqueTeams = [...new Set(products.map(p => p.team))];
    return ['all', ...uniqueTeams];
  }, [products]);

  const versions = useMemo(() => {
    const uniqueVersions = ['all', 'Local', 'Visitante', 'Alternativa', 'Champions League', 'Retro'];
    return uniqueVersions;
  }, []);

  // Filter products based on selected criteria
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const teamMatch = selectedTeam === 'all' || product.team === selectedTeam;
      const versionMatch = selectedVersion === 'all' || product.name.includes(selectedVersion);
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return teamMatch && versionMatch && priceMatch;
    });
  }, [products, selectedTeam, selectedVersion, priceRange]);

  const featuredJerseys = filteredProducts.slice(0, viewMode === 'grid' ? 6 : 8);
  const categories = ['Local', 'Visitante', 'Alternativa', 'Champions League', 'Retro'];

  const clearFilters = () => {
    setSelectedTeam('all');
    setSelectedVersion('all');
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedTeam !== 'all' || selectedVersion !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 500;

  return (
    <section className="py-20 bg-muted/30">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center animate-fade-in">
          {/* Icono principal con fondo decorativo */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/40 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-accent to-yellow-500 p-3 rounded-full shadow-2xl shadow-accent/25">
                <Shirt className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <Badge variant="secondary" className="text-sm bg-gradient-to-r from-accent/90 to-yellow-500/90 text-white border-0 shadow-lg">
              Colección 2024/25
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display">
            Nuestras <span className="accent-gradient bg-gradient-to-r from-accent via-yellow-400 to-yellow-500 bg-clip-text text-transparent">Camisolas</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Descubre la colección más completa de camisolas oficiales de los mejores equipos del mundo
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="group relative overflow-hidden text-white border-white/30 hover:border-accent/60 hover:bg-gradient-to-r hover:from-accent/10 hover:to-yellow-500/10 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
              >
                <span className="relative z-10">{category}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4">
        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white/30 text-white hover:bg-accent/10 hover:border-accent/60"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-accent text-background">
                    {[selectedTeam !== 'all', selectedVersion !== 'all', priceRange[0] !== 0 || priceRange[1] !== 500].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">Equipo</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 border-white/20">
                      {teams.map(team => (
                        <SelectItem key={team} value={team} className="text-white hover:bg-accent/10">
                          {team === 'all' ? 'Todos los equipos' : team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Version Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">Versión</label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Seleccionar versión" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 border-white/20">
                      {versions.map(version => (
                        <SelectItem key={version} value={version} className="text-white hover:bg-accent/10">
                          {version === 'all' ? 'Todas las versiones' : version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Rango de Precio: Q{priceRange[0]} - Q{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-white/80">
              Mostrando {filteredProducts.length} de {products.length} camisolas
              {hasActiveFilters && (
                <span className="text-accent"> (filtradas)</span>
              )}
            </p>
          </div>
        </div>

        {/* Featured Jerseys Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-yellow-500/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-accent border-r-yellow-500 shadow-2xl shadow-accent/25"></div>
            </div>
            <p className="text-white/80 text-lg">Cargando camisolas destacadas...</p>
          </div>
        ) : featuredJerseys.length > 0 ? (
          <div className={`grid gap-6 animate-slide-up mb-12 lg:mb-16 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {featuredJerseys.map((jersey) => (
              <div key={jersey.id} className="group">
                <ProductDialog product={jersey} trigger={
                  <div className="transform group-hover:scale-105 transition-transform duration-300">
                    <ProductCard product={jersey} />
                  </div>
                } />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-full border border-white/20">
                <Package className="h-16 w-16 text-white/80 drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No hay camisolas disponibles</h3>
            <p className="text-white/60 mb-4">Pronto tendremos productos en nuestro catálogo</p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Limpiar filtros
              </Button>
            )}
          </div>
        )}

        {/* Call to Action mejorado */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20 shadow-2xl shadow-black/20 overflow-hidden">
            {/* Efecto de fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-yellow-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-yellow-400 to-yellow-500"></div>
            
            {/* Icono del trofeo mejorado */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-yellow-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-accent to-yellow-500 p-4 rounded-full shadow-2xl shadow-accent/25 mx-auto w-20 h-20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white relative z-10">
              ¿No encuentras tu equipo favorito?
            </h3>
            <p className="text-white/80 mb-8 relative z-10">
              Contáctanos y te ayudaremos a conseguir la camisola que buscas, incluso si no está en nuestro catálogo
            </p>
            
            {/* Botones mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a 
                href="/shop"
                className="group relative overflow-hidden bg-gradient-to-r from-accent/80 to-yellow-500/80 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-accent/25 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                    <Shirt className="h-5 w-5 text-white drop-shadow-sm" />
                  </div>
                  Ver Catálogo Completo
                </div>
              </a>
              
              <button 
                onClick={() => {
                  const message = "Hola, me gustaría solicitar una camisola especial que no está en el catálogo. ¿Podrían ayudarme?";
                  const whatsappUrl = `https://wa.me/50246907489?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="group relative overflow-hidden bg-transparent border-2 border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:border-accent/60 hover:bg-gradient-to-r hover:from-accent/10 hover:to-yellow-500/10 transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <div className="bg-accent/20 p-1.5 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-accent drop-shadow-sm" />
                  </div>
                  Solicitar Camisola Especial
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
