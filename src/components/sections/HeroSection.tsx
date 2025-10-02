import { Button } from "@/components/ui/button";
import { Shirt } from "lucide-react";
import { useHeroImages } from "@/hooks/use-hero-images";
import { useState, useEffect } from "react";
import backgroundImageDesktop from "@/assets/image.png";
import backgroundImageMobile from "@/assets/camisolas-background.jpg";

export function HeroSection() {
  const { activeHeroImages, isLoading } = useHeroImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Usar imágenes de la base de datos si existen, sino usar las por defecto
  const images = activeHeroImages.length > 0 
    ? activeHeroImages 
    : [
        { 
          imageUrl: backgroundImageDesktop, 
          title: "COLECCIONES DE TEMPORADA",
          description: "Descubre las mejores camisolas oficiales de los equipos más importantes del mundo"
        }
      ];

  // Cambiar imagen automáticamente cada 5 segundos si hay múltiples imágenes
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Duración de la transición
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const currentImage = images[currentImageIndex];
  const currentImageUrl = currentImage.imageUrl || backgroundImageDesktop;
  const currentTitle = currentImage.title || "COLECCIONES DE TEMPORADA";
  const currentDescription = currentImage.description || "Descubre las mejores camisolas oficiales de los equipos más importantes del mundo";

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Images - Con transición suave */}
      <div className="absolute inset-0 z-0">
        {/* Imagen actual con transición */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Imagen única con object-cover optimizado para móvil y PC */}
          <img 
            src={currentImageUrl} 
            alt={currentTitle}
            className="w-full h-full object-cover object-[center_35%] md:object-center"
          />
          {/* Degradado más pronunciado en móvil para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 md:from-black/30 md:via-black/20 md:to-black/50"></div>
        </div>
      </div>

      {/* Indicadores de imágenes */}
      {images.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentImageIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`h-2 sm:h-3 rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-yellow-500 w-6 sm:w-8' 
                  : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content con transición */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div 
          className={`transition-opacity duration-500 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 leading-tight text-white">
            {currentTitle.includes("TEMPORADA") ? (
              <>
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl">COLECCIONES DE</span>
                <span className="block text-yellow-500 mt-1">
                  TEMPORADA
                </span>
              </>
            ) : (
              <span className="block text-yellow-500">
                {currentTitle}
              </span>
            )}
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-7 max-w-2xl mx-auto text-white/90 px-4">
            {currentDescription}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <a href="/shop" className="w-full sm:w-auto">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 w-full sm:w-auto font-semibold shadow-lg">
                <Shirt className="h-4 w-4 mr-2" />
                Ver Catálogo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}