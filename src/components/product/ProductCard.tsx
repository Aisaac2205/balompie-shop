import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { formatPriceSimple, calculateDiscount } from "@/utils/currency";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const discountInfo = product.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  return (
    <Card 
      className="product-card cursor-pointer group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 border-white/20 hover:border-accent/40 bg-white/5 hover:bg-white/10"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0 relative">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Overlay with actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-4`}>
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 delay-100"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.badge && (
              <Badge 
                className="accent-gradient text-background font-semibold text-xs px-2 py-1 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                {product.badge}
              </Badge>
            )}
            
            {discountInfo && (
              <Badge 
                variant="destructive" 
                className="text-xs px-2 py-1 shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                -{discountInfo.percentage}%
              </Badge>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Team and Rating */}
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="secondary" 
              className="text-xs px-3 py-1 bg-accent/20 text-accent border-accent/30 hover:bg-accent/30 transition-colors duration-300 truncate max-w-[140px]"
            > 
              {product.team}
            </Badge>
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white/80 font-medium">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="font-bold text-base sm:text-lg mb-3 line-clamp-2 text-white leading-tight group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl sm:text-2xl font-bold text-accent group-hover:text-yellow-400 transition-colors duration-300">
                {formatPriceSimple(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base sm:text-lg text-white/50 line-through">
                  {formatPriceSimple(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Quick view indicator */}
            <div className={`opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}>
              <Eye className="h-4 w-4 text-white/60" />
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Footer with Button */}
      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button 
          className="w-full btn-primary text-sm sm:text-base font-semibold py-3 bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent/25"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Personalizar Ahora
        </Button>
      </CardFooter>
      
      {/* Hover effect border */}
      <div className={`absolute inset-0 border-2 border-accent/0 group-hover:border-accent/40 rounded-lg transition-all duration-500 pointer-events-none`}></div>
    </Card>
  );
}