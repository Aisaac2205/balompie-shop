// ============= Product Customizer Component =============
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { validatePlayerName, validatePlayerNumber } from "@/utils/validation";

interface ProductCustomizerProps {
  product: Product;
  onClose?: () => void;
}

export function ProductCustomizer({ product, onClose }: ProductCustomizerProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [version, setVersion] = useState<'fan' | 'player'>('fan');
  const [customization, setCustomization] = useState({
    playerName: "",
    playerNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addItem } = useCart();
  const { toast } = useToast();

  // Calculate price based on version
  const basePrice = version === 'player' ? (product.playerPrice || product.price + 20) : product.price;
  const totalPrice = basePrice * quantity;

  // Get current image
  const currentImage = product.images[0] || '/placeholder.svg';

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedSize) {
      newErrors.size = "Debe seleccionar una talla";
    }

    if (customization.playerName) {
      const nameValidation = validatePlayerName(customization.playerName);
      if (!nameValidation.isValid) {
        newErrors.playerName = nameValidation.errors[0];
      }
    }

    if (customization.playerNumber) {
      const numberValidation = validatePlayerNumber(customization.playerNumber);
      if (!numberValidation.isValid) {
        newErrors.playerNumber = numberValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = async () => {
    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      // Crear la personalización con la estructura correcta
      const jerseyCustomization = (customization.playerName || customization.playerNumber) ? {
        version,
        size: selectedSize as 'S' | 'M' | 'L' | 'XL' | 'XXL',
        personalizationType: 'custom' as const,
        customName: customization.playerName,
        customNumber: customization.playerNumber ? parseInt(customization.playerNumber) : undefined,
      } : undefined;

      addItem({
        productId: product.id,
        name: product.name,
        team: product.team,
        price: basePrice,
        size: selectedSize,
        quantity,
        version,
        customization: jerseyCustomization,
        image: currentImage,
      });

      toast({
        title: "¡Agregado al carrito!",
        description: `${product.name} (${selectedSize})`,
      });

      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Product Image */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.team}</p>
        </div>

        {/* Version Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Versión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={version === 'fan' ? 'default' : 'outline'}
                onClick={() => setVersion('fan')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <span className="font-medium">Fan</span>
                <span className="text-sm">Q.{product.price.toFixed(2)}</span>
              </Button>
              <Button
                variant={version === 'player' ? 'default' : 'outline'}
                onClick={() => setVersion('player')}
                className="flex flex-col items-center p-4 h-auto"
              >
                <span className="font-medium">Jugador</span>
                <span className="text-sm">Q.{(product.playerPrice || product.price + 20).toFixed(2)}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Size Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Talla</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                  size="sm"
                >
                  {size}
                </Button>
              ))}
            </div>
            {errors.size && (
              <p className="text-red-500 text-sm mt-2">{errors.size}</p>
            )}
          </CardContent>
        </Card>

        {/* Player Customization */}
        {version === 'player' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personalización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="playerName">Nombre del jugador</Label>
                <Input
                  id="playerName"
                  value={customization.playerName}
                  onChange={(e) => setCustomization(prev => ({ 
                    ...prev, 
                    playerName: e.target.value.slice(0, 15) 
                  }))}
                  placeholder="Ej: MESSI"
                  maxLength={15}
                />
                {errors.playerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.playerName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="playerNumber">Número</Label>
                <Input
                  id="playerNumber"
                  value={customization.playerNumber}
                  onChange={(e) => setCustomization(prev => ({ 
                    ...prev, 
                    playerNumber: e.target.value.slice(0, 2) 
                  }))}
                  placeholder="10"
                  maxLength={2}
                />
                {errors.playerNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.playerNumber}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <Label>Cantidad</Label>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Total and Add to Cart */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span>Q.{totalPrice.toFixed(2)}</span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isSubmitting || !selectedSize}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Agregando..." : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </div>
  );
}