import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <CartSidebar />

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <a 
              href="/" 
              className="block text-white hover:text-accent transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </a>
            <a 
              href="/shop" 
              className="block text-white hover:text-accent transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Camisolas
            </a>
            <a 
              href="/teams" 
              className="block text-white hover:text-accent transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Equipos
            </a>
            <a 
              href="#ofertas" 
              className="block text-white hover:text-accent transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ofertas
            </a>
            <div className="pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}