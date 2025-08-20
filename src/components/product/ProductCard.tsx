import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { formatPriceSimple, calculateDiscount } from "@/utils/currency";

interface Product {
  id: string;
  name: string;
  team: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
}

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discountInfo = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  return (
    <Card 
      className="product-card cursor-pointer group overflow-hidden hover-scale transition-all duration-300"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {product.badge && (
            <Badge 
              className="absolute top-2 left-2 sm:top-3 sm:left-3 accent-gradient text-background font-semibold text-xs"
            >
              {product.badge}
            </Badge>
          )}
          
          {discountInfo && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-xs"
            >
              -{discountInfo.percentage}%
            </Badge>
          )}
        </div>
        
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs truncate max-w-[120px]"> 
              {product.team}
            </Badge>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white/70">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 text-white leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formatPriceSimple(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base sm:text-lg text-white/60 line-through">
                  {formatPriceSimple(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button className="w-full btn-primary text-sm sm:text-base">
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          Personalizar
        </Button>
      </CardFooter>
    </Card>
  );
}