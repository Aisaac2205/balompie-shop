import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPriceSimple } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = product.images?.filter(img => img.trim() !== '') || [];
  const hasMultipleImages = images.length > 1;
  
  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-gray-200">
      <CardContent className="p-0">
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={images[currentImageIndex] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.productType === 'player' && (
              <Badge className="bg-yellow-500 text-black text-xs font-medium">
                Jugador
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
              {product.equipmentType === 'local' ? 'Local' : 
               product.equipmentType === 'visitante' ? 'Visitante' :
               product.equipmentType === 'tercera' ? 'Tercera' :
               product.equipmentType === 'alternativa' ? 'Alternativa' :
               product.equipmentType === 'champions' ? 'Champions' : product.equipmentType}
            </Badge>
          </div>
          
          {/* Indicador de múltiples imágenes */}
          {hasMultipleImages && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
          
          {/* Controles de navegación de imágenes */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          {/* Indicadores de puntos */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir a imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Nombre del producto */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            {/* Equipo */}
            <p className="text-sm text-gray-600">{product.team}</p>
            
            {/* Color */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Color:</span>
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                {product.primaryColor}
              </Badge>
            </div>
            
            {/* Tallas disponibles */}
            <div className="flex flex-wrap gap-1">
              {product.sizes?.slice(0, 4).map(size => (
                <Badge key={size} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  {size}
                </Badge>
              ))}
              {product.sizes && product.sizes.length > 4 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                  +{product.sizes.length - 4}
                </Badge>
              )}
            </div>
            
            {/* Precio */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-yellow-600">
                {formatPriceSimple(product.price)}
              </span>
              {product.playerPrice && product.playerPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPriceSimple(product.playerPrice)}
                </span>
              )}
            </div>
            
            {/* Rating (estático por ahora) */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">4.8 (24)</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer con botón de agregar al carrito */}
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}