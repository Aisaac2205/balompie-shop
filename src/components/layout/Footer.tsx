import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold primary-gradient bg-gradient-to-r bg-clip-text text-transparent mb-4">
            La Casa del Balompié
          </h3>
          <p className="text-white/80 max-w-2xl mx-auto">
            La tienda líder en camisolas personalizadas de los mejores equipos del mundo.
            Calidad premium y autenticidad garantizada.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Sobre Nosotros</h4>
            <p className="text-white/80">
              Especialistas en camisolas oficiales con más de 10 años de experiencia en el mercado guatemalteco.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white hover:text-black">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white hover:text-black">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white hover:text-black">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white hover:text-black">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Productos</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">Camisolas Barcelona</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Camisolas Real Madrid</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Camisolas Manchester City</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Camisolas PSG</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Personalización</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Soporte</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">Guía de Tallas</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Política de Devoluciones</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Envíos y Entregas</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white/80">
                <Phone className="h-4 w-4" />
                <span>+502 4690 7489</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Mail className="h-4 w-4" />
                <span>info@lacasadelbalompie.com</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>Guatemala</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-white">Newsletter</h5>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Tu email" 
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/60"
                />
                <Button className="btn-primary">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/80">
          <p>&copy; 2024 La Casa del Balompié. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}