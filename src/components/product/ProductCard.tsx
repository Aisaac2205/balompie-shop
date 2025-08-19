import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

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
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card 
      className="product-card cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {product.badge && (
            <Badge 
              className="absolute top-3 left-3 accent-gradient text-balompie-blue font-semibold"
            >
              {product.badge}
            </Badge>
          )}
          
          {discount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute top-3 right-3"
            >
              -{discount}%
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs"> 
              {product.team}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-white/70">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">
                Q.{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-white/60 line-through">
                  Q.{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full btn-primary">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Personalizar
        </Button>
      </CardFooter>
    </Card>
  );
}