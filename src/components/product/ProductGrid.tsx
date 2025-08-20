import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductDialog key={product.id} product={product} trigger={
          <div>
            <ProductCard product={product} />
          </div>
        } />
      ))}
    </div>
  );
}