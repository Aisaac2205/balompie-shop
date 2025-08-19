import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { Button } from "@/components/ui/button";
import { extendedMockProducts } from "@/data/extendedMockProducts";


export function ProductGrid() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Camisolas <span className="accent-gradient bg-gradient-to-r bg-clip-text text-transparent">Destacadas</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre las camisolas más populares de los mejores equipos del mundo. 
            Personaliza con nombre, número y parches oficiales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {extendedMockProducts.slice(0, 6).map((product) => (
            <ProductDialog key={product.id} product={product} trigger={
              <div>
                <ProductCard product={product} />
              </div>
            } />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="btn-hero">
            Ver Todas las Camisolas
          </Button>
        </div>
      </div>
    </section>
  );
}