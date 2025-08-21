import { Search, Menu, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { data: products = [] } = useProducts();

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.team.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop with search query
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-3 text-xl md:text-2xl font-bold primary-gradient bg-gradient-to-r bg-clip-text text-transparent font-display hover:scale-105 transition-transform">
            <img src="/logo.jpg" alt="La Casa del Balompié" className="h-10 w-10 rounded-full object-cover" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-white hover:text-accent transition-colors font-medium">
            Inicio
          </a>
          <a href="/shop" className="text-white hover:text-accent transition-colors font-medium">
            Camisolas
          </a>
          <a href="/teams" className="text-white hover:text-accent transition-colors font-medium">
            Equipos
          </a>
          <a href="#ofertas" className="text-white hover:text-accent transition-colors font-medium">
            Ofertas
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex hover:bg-accent/10"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <CartSidebar />

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-accent/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar camisolas, equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-accent"
                autoFocus
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90"
              >
                Buscar
              </Button>
            </form>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="max-w-2xl mx-auto mt-2">
                <div className="bg-background/95 backdrop-blur rounded-lg border border-white/20 shadow-xl">
                  {searchResults.map((product) => (
                    <a
                      key={product.id}
                      href={`/shop?product=${product.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-accent/10 transition-colors border-b border-white/10 last:border-b-0"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{product.name}</p>
                        <p className="text-white/60 text-sm truncate">{product.team}</p>
                      </div>
                      <span className="text-accent font-semibold">{product.price}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-screen w-80 max-w-[85vw] bg-black border-l border-white/20 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Menú</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              <a 
                href="/" 
                className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="/shop" 
                className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Camisolas
              </a>
              <a 
                href="/teams" 
                className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Equipos
              </a>
              <a 
                href="#ofertas" 
                className="flex items-center p-3 rounded-lg text-white hover:bg-white/10 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ofertas
              </a>
            </nav>
            
            {/* Mobile Search */}
            <div className="p-4 border-t border-white/20">
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="text"
                    placeholder="Buscar camisolas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}