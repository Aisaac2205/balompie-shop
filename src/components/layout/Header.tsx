import { Search, Menu, X } from "lucide-react";
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
  const { products = [] } = useProducts();

  // Detectar scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.team.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-md transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 supports-[backdrop-filter]:bg-gray-900/60"
          : "bg-black"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-3 text-xl md:text-2xl font-bold text-white hover:scale-105 transition-transform group">
            <img src="/logo.png" alt="COLECCIONES DE TEMPORADA" className="h-10 w-10 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">LA CASA DEL</span>
              <span className="text-xl font-bold text-yellow-400">BALOMPIÉ</span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-white hover:text-yellow-300 transition-colors font-medium">
            Inicio
          </a>
          <a href="/shop" className="text-white hover:text-yellow-300 transition-colors font-medium">
            Camisolas
          </a>
          <a href="/teams" className="text-white hover:text-yellow-300 transition-colors font-medium">
            Equipos
          </a>
          <a href="#ofertas" className="text-white hover:text-yellow-300 transition-colors font-medium">
            Ofertas
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex hover:bg-white/10"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5 text-white" />
          </Button>

          <CartSidebar />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-white/20 bg-gray-900/70 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
              <Input
                type="text"
                placeholder="Buscar camisolas, equipos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg bg-white/20 border border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                autoFocus
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
              >
                Buscar
              </Button>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-w-2xl mx-auto mt-2">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl">
                  {searchResults.map((product) => (
                    <a
                      key={product.id}
                      href={`/shop?product=${product.id}`}
                      className="flex items-center space-x-3 p-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
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
                        <p className="text-gray-300 text-sm truncate">{product.team}</p>
                      </div>
                      <span className="text-yellow-400 font-semibold">{product.price}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute right-0 top-0 h-screen w-80 max-w-[85vw] bg-black/90 text-white border-l border-white/20 shadow-2xl">
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

            <div className="p-4 border-t border-white/20">
              <form onSubmit={handleSearchSubmit} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <Input
                    type="text"
                    placeholder="Buscar camisolas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/20 border border-white/30 text-white placeholder:text-gray-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
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