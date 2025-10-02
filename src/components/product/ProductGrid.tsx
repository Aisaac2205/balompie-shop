import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { Shirt } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <ProductDialog 
            product={product} 
            trigger={
              <div className="relative transform group-hover:scale-105 transition-transform duration-300 cursor-pointer">
                <ProductCard product={product} showCustomizeButton={false} />
                {/* Overlay de hover para indicar que es clickeable */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-yellow-500 text-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-xs sm:text-sm">
                    <Shirt className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
                    Personalizar
                  </div>
                </div>
              </div>
            } 
          />
        </div>
      ))}
    </div>
  );
}