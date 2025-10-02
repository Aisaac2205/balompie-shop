import { Button } from "@/components/ui/button";
import { Shirt } from "lucide-react";
import { useHeroImages } from "@/hooks/use-hero-images";
import { useState, useEffect } from "react";

export function HeroSection() {
  const { activeHeroImages, isLoading } = useHeroImages();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Usar solo imágenes de la base de datos
  const images = activeHeroImages;

  // Cambiar imagen automáticamente cada 6 segundos si hay múltiples imágenes
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Cambiar cada 6 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  // Mostrar solo si hay imágenes en la base de datos
  if (isLoading) {
    return (
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600">
        <div className="text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            <span className="block">COLECCIONES DE</span>
            <span className="block text-yellow-500 mt-1">TEMPORADA</span>
          </h1>
          <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
            Descubre las mejores camisolas oficiales de los equipos más importantes del mundo
          </p>
          <a href="/shop">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-4 font-semibold shadow-lg">
              <Shirt className="h-5 w-5 mr-2" />
              Ver Catálogo
            </Button>
          </a>
        </div>
      </section>
    );
  }

  const currentImage = images[currentImageIndex];
  const currentImageUrl = currentImage.imageUrl;
  const currentTitle = currentImage.title;
  const currentDescription = currentImage.description;

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Images - Con transición suave y crossfade */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.imageUrl} 
              alt={image.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            {/* Degradado optimizado */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>
          </div>
        ))}
      </div>

      {/* Indicadores de imágenes */}
      {images.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-yellow-500 w-6 sm:w-8 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content con transición */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="animate-in fade-in-50 duration-1000">
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