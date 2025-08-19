import { ProductCard } from "@/components/product/ProductCard";
import { ProductDialog } from "@/components/product/ProductDialog";
import { extendedMockProducts } from "@/data/extendedMockProducts";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Shirt } from "lucide-react";

export function JerseysShowcase() {
  const featuredJerseys = extendedMockProducts.slice(0, 6);
  const categories = ['Local', 'Visitante', 'Alternativa', 'Champions League', 'Retro'];

  return (
    <section className="py-20 bg-muted/30">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shirt className="h-8 w-8 text-accent" />
            <Badge variant="secondary" className="text-sm">
              Colección 2024/25
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display">
            Nuestras <span className="accent-gradient bg-gradient-to-r bg-clip-text text-transparent">Camisolas</span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Descubre la colección más completa de camisolas oficiales de los mejores equipos del mundo
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="text-white border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4">
        {/* Featured Jerseys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up mb-16">
          {featuredJerseys.map((jersey) => (
            <div key={jersey.id} className="group">
              <ProductDialog product={jersey} trigger={
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <ProductCard product={jersey} />
                </div>
              } />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-white/20">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-accent" />
            <h3 className="text-2xl font-bold mb-4 text-white">
              ¿No encuentras tu equipo favorito?
            </h3>
            <p className="text-white/80 mb-6">
              Contáctanos y te ayudaremos a conseguir la camisola que buscas, incluso si no está en nuestro catálogo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                <Shirt className="h-5 w-5 mr-2" />
                Ver Catálogo Completo
              </button>
              <button className="btn-primary variant-outline border-white/30 text-white hover:bg-white hover:text-black">
                <Star className="h-5 w-5 mr-2" />
                Solicitar Camisola Especial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
