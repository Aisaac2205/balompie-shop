import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-black mb-4">
            LA CASA DEL
            <span className="text-yellow-500"> BALOMPIÉ</span>
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            La tienda líder en camisolas personalizadas de los mejores equipos del mundo.
            Calidad premium y autenticidad garantizada.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Sobre Nosotros</h4>
            <p className="text-gray-700">
              Especialistas en camisolas oficiales con la experiencia suficiente en el mercado guatemalteco.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-yellow-500">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Productos</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Camisolas Barcelona</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Camisolas Real Madrid</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Camisolas Manchester City</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Camisolas PSG</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Personalización</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Soporte</h4>
            <ul className="space-y-2 text-gray-700">
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Guía de Tallas</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Política de Devoluciones</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Envíos y Entregas</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="h-4 w-4" />
                <span>+502 4690 7489</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Mail className="h-4 w-4" />
                <span>info@lacasadelbalompie.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-4 w-4" />
                <span>Guatemala</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-medium text-black">Newsletter</h5>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Tu email" 
                  className="flex-1 bg-white border-gray-300 text-black placeholder:text-gray-500"
                />
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-700">
          <p>&copy; 2025 COLECCIONES DE TEMPORADA. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}