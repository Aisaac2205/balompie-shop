import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { useCart } from "@/hooks/use-cart";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      team: product.team,
      price: product.price,
      image: product.images?.[0] || '/placeholder.svg',
      size: 'M', // Tamaño por defecto
      quantity: 1,
      version: product.productType
    });
  };

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
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}