import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/layout/LogoWatermark";
import { useProducts } from '@/hooks/use-products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Package } from 'lucide-react';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  const { data: products = [], isLoading, error } = useProducts();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || product.team === selectedTeam;
    const matchesCompetition = !selectedCompetition || product.competition === selectedCompetition;
    return matchesSearch && matchesTeam && matchesCompetition;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Get unique teams and competitions
  const teams = [...new Set(products.map(p => p.team))];
  const competitions = [...new Set(products.map(p => p.competition))];

  if (error) {
    return (
      <div className="min-h-screen bg-background relative">
        <LogoWatermark />
        <Header />
        <main className="pt-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-red-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar productos</h2>
              <p className="text-gray-600">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>
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
      <main className="pt-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Tienda de <span className="accent-gradient bg-gradient-to-r bg-clip-text text-transparent font-display">Camisolas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre las mejores camisolas de fútbol con personalización completa
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar camisolas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los equipos</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por competencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las competencias</SelectItem>
                    {competitions.map((competition) => (
                      <SelectItem key={competition} value={competition}>{competition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="rating">Mejor Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <ProductGrid products={sortedProducts} />
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm || selectedTeam || selectedCompetition ? 'No se encontraron productos' : 'No hay productos disponibles'}
              </h2>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedTeam || selectedCompetition 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Pronto tendremos productos disponibles en nuestra tienda'
                }
              </p>
              {searchTerm || selectedTeam || selectedCompetition ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTeam('');
                    setSelectedCompetition('');
                  }}
                >
                  Limpiar Filtros
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;