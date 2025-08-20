// ============= Mobile Navigation Component =============
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Home, ShoppingBag, Users, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Camisolas", href: "/shop", icon: ShoppingBag },
  { name: "Equipos", href: "/teams", icon: Users },
  { name: "Contacto", href: "/contact", icon: Phone },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Navegación</SheetTitle>
        </SheetHeader>
        
        <nav className="mt-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <Badge variant="secondary" className="ml-auto">
                      Actual
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="mt-8 p-4 bg-muted/20 rounded-lg">
          <h4 className="font-semibold mb-2">Horarios</h4>
          <p className="text-sm text-muted-foreground">
            Lun - Vie: 9:00 AM - 6:00 PM<br />
            Sáb: 9:00 AM - 4:00 PM<br />
            Dom: Cerrado
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}