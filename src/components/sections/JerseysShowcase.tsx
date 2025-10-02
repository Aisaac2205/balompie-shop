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
  const { products = [], isLoading } = useProducts();
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
    const uniqueVersions = [...new Set(products.map(p => p.equipmentType))];
    return ['all', ...uniqueVersions];
  }, [products]);

  // Filter products based on selected criteria
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const teamMatch = selectedTeam === 'all' || product.team === selectedTeam;
      const versionMatch = selectedVersion === 'all' || product.equipmentType === selectedVersion;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const isActive = product.isActive;
      
      return teamMatch && versionMatch && priceMatch && isActive;
    });
  }, [products, selectedTeam, selectedVersion, priceRange]);

  // Mostrar 3 productos aleatorios (o todos si hay menos de 3)
  const featuredJerseys = useMemo(() => {
    if (filteredProducts.length === 0) return [];
    
    // Si hay 3 o menos productos, mostrar todos
    if (filteredProducts.length <= 3) return filteredProducts;
    
    // Algoritmo Fisher-Yates shuffle más eficiente
    const shuffled = [...filteredProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, [filteredProducts]);
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.equipmentType))];
    return uniqueCategories.slice(0, 5); // Máximo 5 categorías
  }, [products]);

  const clearFilters = () => {
    setSelectedTeam('all');
    setSelectedVersion('all');
    setPriceRange([0, 500]);
  };

  const hasActiveFilters = selectedTeam !== 'all' || selectedVersion !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 500;

  return (
    <section className="py-20 bg-gray-50">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center animate-fade-in">
          {/* Icono principal con fondo decorativo */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Nuestras <span className="text-yellow-600">Camisolas</span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Descubre la colección más completa de camisolas oficiales de los mejores equipos del mundo
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="group relative overflow-hidden text-gray-700 border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                onClick={() => setSelectedVersion(category)}
              >
                <span className="relative z-10">
                  {category === 'local' ? 'Local' :
                   category === 'visitante' ? 'Visitante' :
                   category === 'tercera' ? 'Tercera' :
                   category === 'alternativa' ? 'Alternativa' :
                   category === 'champions' ? 'Champions' : category}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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
                className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-500 text-black">
                    {[selectedTeam !== 'all', selectedVersion !== 'all', priceRange[0] !== 0 || priceRange[1] !== 500].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-black hover:bg-gray-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
            
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
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white backdrop-blur-sm rounded-xl p-6 border border-gray-200 mb-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Filter */}
                <div>
                  <label className="block text-black font-medium mb-3">Equipo</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {teams.map(team => (
                        <SelectItem key={team} value={team} className="text-black hover:bg-yellow-50">
                          {team === 'all' ? 'Todos los equipos' : team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Version Filter */}
                <div>
                  <label className="block text-black font-medium mb-3">Versión</label>
                  <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue placeholder="Seleccionar versión" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      {versions.map(version => (
                        <SelectItem key={version} value={version} className="text-black hover:bg-yellow-50">
                          {version === 'all' ? 'Todas las versiones' : 
                           version === 'local' ? 'Local' :
                           version === 'visitante' ? 'Visitante' :
                           version === 'tercera' ? 'Tercera' :
                           version === 'alternativa' ? 'Alternativa' :
                           version === 'champions' ? 'Champions' : version}
                        </SelectItem>
                      ))}
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
            <p className="text-gray-700">
              Mostrando {filteredProducts.length} de {products.length} camisolas
              {hasActiveFilters && (
                <span className="text-yellow-600"> (filtradas)</span>
              )}
            </p>
          </div>
        </div>

        {/* Featured Jerseys Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-xl animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-500 border-r-yellow-600 shadow-2xl shadow-yellow-500/25"></div>
            </div>
            <p className="text-gray-700 text-lg">Cargando camisolas destacadas...</p>
          </div>
        ) : featuredJerseys.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 animate-slide-up mb-12 lg:mb-16">
            {featuredJerseys.map((jersey) => (
              <div key={jersey.id} className="group relative">
                <ProductDialog product={jersey} trigger={
                  <div className="relative transform group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <ProductCard product={jersey} showCustomizeButton={false} />
                    {/* Overlay de hover para indicar que es clickeable */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-yellow-500 text-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-xs sm:text-sm">
                        <Shirt className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                        Personalizar
                      </div>
                    </div>
                  </div>
                } />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="relative mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-full border border-gray-300">
                <Package className="h-16 w-16 text-gray-600 drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-2">No hay camisolas disponibles</h3>
            <p className="text-gray-600 mb-4">Pronto tendremos productos en nuestro catálogo</p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Limpiar filtros
              </Button>
            )}
          </div>
        )}

        {/* Call to Action mejorado */}
        <div className="text-center">
          <div className="relative bg-white backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden">
            {/* Efecto de fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-transparent to-yellow-100/50"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600"></div>
            
            {/* Icono del trofeo mejorado */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-full shadow-2xl shadow-yellow-500/25 mx-auto w-20 h-20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-black drop-shadow-lg" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-black relative z-10">
              ¿No encuentras tu equipo favorito?
            </h3>
            <p className="text-gray-700 mb-8 relative z-10">
              Contáctanos y te ayudaremos a conseguir la camisola que buscas, incluso si no está en nuestro catálogo
            </p>
            
            {/* Botones mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a 
                href="/shop"
                className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-semibold shadow-xl shadow-yellow-500/25 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-white/20 to-yellow-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                    <Shirt className="h-5 w-5 text-black drop-shadow-sm" />
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
                className="group relative overflow-hidden bg-transparent border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-yellow-500 hover:bg-yellow-50 transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <div className="bg-yellow-500/20 p-1.5 rounded-lg mr-3">
                    <Star className="h-5 w-5 text-yellow-600 drop-shadow-sm" />
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
