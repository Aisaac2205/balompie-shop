import { Button } from "@/components/ui/button";
import { Shirt } from "lucide-react";
import backgroundImageDesktop from "@/assets/image.png";
import backgroundImageMobile from "@/assets/camisolas-background.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Images - Responsive with Picture Element */}
      <div className="absolute inset-0 z-0">
        {/* Picture element for semantic responsive images */}
        <picture className="absolute inset-0">
          {/* Mobile image */}
          <source 
            media="(max-width: 768px)" 
            srcSet={backgroundImageMobile}
          />
          {/* Desktop image (default) */}
          <img 
            src={backgroundImageDesktop}
            alt="Colección de camisolas de fútbol"
            className="w-full h-full object-cover"
          />
        </picture>
        
        {/* Alternative CSS-based approach for better browser support */}
        <div className="absolute inset-0">
          {/* Mobile background image - visible only on mobile */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{
              backgroundImage: `url(${backgroundImageMobile})`
            }}
          />
          
          {/* Desktop background image - visible only on desktop */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
            style={{
              backgroundImage: `url(${backgroundImageDesktop})`
            }}
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-bounce-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            COLECCIONES DE
            <span className="block text-yellow-500">
              TEMPORADA
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Descubre las mejores camisolas oficiales de los equipos más importantes del mundo
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/shop">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-4 w-full sm:w-auto font-semibold shadow-lg">
                <Shirt className="h-5 w-5 mr-2" />
                Ver Catálogo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}