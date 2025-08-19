// ============= Product Customizer Component =============
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Shirt, Star } from "lucide-react";
import { Product, Patch } from "@/types/product";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { validatePlayerName, validatePlayerNumber } from "@/utils/validation";
import { checkStock } from "@/data/extendedMockProducts";

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
    selectedPatch: undefined as Patch | undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addItem } = useCart();
  const { toast } = useToast();

  // Calculate price based on version and patch
  const basePrice = version === 'player' ? (product.playerPrice || product.price + 20) : product.price;
  const patchPrice = customization.selectedPatch?.price || 0;
  const totalPrice = (basePrice + patchPrice) * quantity;

  // Get current image based on version
  const currentImage = version === 'player' ? (product.playerImage || product.image) : product.image;

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
      // Check stock
      const availableStock = await checkStock(product.id, selectedSize);
      if (availableStock < quantity) {
        toast({
          title: "Stock insuficiente",
          description: `Solo quedan ${availableStock} unidades en talla ${selectedSize}`,
          variant: "destructive",
        });
        return;
      }

      addItem({
        productId: product.id,
        name: product.name,
        team: product.team,
        price: basePrice + patchPrice,
        size: selectedSize,
        quantity,
        version,
        customization: customization.playerName || customization.playerNumber || customization.selectedPatch 
          ? customization 
          : undefined,
        image: currentImage,
      });

      toast({
        title: "¡Agregado al carrito!",
        description: `${product.name} (${selectedSize}) ${customization.selectedPatch ? `con parche ${customization.selectedPatch.name}` : ""}`,
      });

      onClose?.();
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

  const handlePatchSelection = (patch: Patch) => {
    setCustomization(prev => ({
      ...prev,
      selectedPatch: prev.selectedPatch?.id === patch.id ? undefined : patch
    }));
  };

  const isPatchSelected = (patchId: string) => {
    return customization.selectedPatch?.id === patchId;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Preview */}
      <div className="space-y-6">
        <div className="relative jersey-preview bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Version Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={version === 'player' ? 'default' : 'secondary'} className="text-xs">
              {version === 'player' ? 'Versión Jugador' : 'Versión Fan'}
            </Badge>
          </div>
          
          {/* Patch Preview */}
          {customization.selectedPatch && (
            <div className="absolute top-4 left-4 z-10">
              <img
                src={customization.selectedPatch.image}
                alt={customization.selectedPatch.name}
                className="w-12 h-12 object-contain bg-white/20 rounded-full p-1"
              />
            </div>
          )}
          
          {/* Player Number */}
          {customization.playerNumber && (
            <div 
              className="jersey-number"
              style={{
                top: '35%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {customization.playerNumber}
            </div>
          )}
          
          {/* Player Name */}
          {customization.playerName && (
            <div 
              className="jersey-name"
              style={{
                top: '65%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              {customization.playerName.toUpperCase()}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground">{product.team} • {product.season}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/70">
              ({product.reviews} reseñas)
            </span>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="space-y-6">
        {/* Version Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shirt className="w-5 h-5" />
              Versión de Camisola
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={version === 'fan' ? 'default' : 'outline'}
                onClick={() => setVersion('fan')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="font-semibold">Fan</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Q.{product.price}</span>
                  <span className="text-xs text-white/70">Versión Fan</span>
                </div>
              </Button>
              <Button
                variant={version === 'player' ? 'default' : 'outline'}
                onClick={() => setVersion('player')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <span className="font-semibold">Jugador</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Q.{product.playerPrice || product.price + 20}</span>
                  <span className="text-xs text-white/70">Versión Jugador</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Size Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Talla</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {product.availableSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="aspect-square"
                >
                  {size}
                </Button>
              ))}
            </div>
            {errors.size && (
              <p className="text-sm text-destructive mt-2">{errors.size}</p>
            )}
          </CardContent>
        </Card>

        {/* Patch Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Parches (Selecciona uno)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {product.patches.filter(patch => 
                patch.name.includes('Champions') || patch.name.includes('Liga')
              ).map((patch) => (
                <Button
                  key={patch.id}
                  variant={isPatchSelected(patch.id) ? "default" : "outline"}
                  onClick={() => handlePatchSelection(patch)}
                  className="h-16 flex flex-col items-center justify-center relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">+Q.{patch.price}</span>
                    <span className="text-xs text-white/70">{patch.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Player Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Personalización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="playerName">Nombre del Jugador</Label>
              <Input
                id="playerName"
                placeholder="Ej: MESSI"
                value={customization.playerName}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    playerName: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={12}
              />
              {errors.playerName && (
                <p className="text-sm text-destructive mt-1">{errors.playerName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="playerNumber">Número</Label>
              <Input
                id="playerNumber"
                placeholder="Ej: 10"
                type="number"
                min="1"
                max="99"
                value={customization.playerNumber}
                onChange={(e) =>
                  setCustomization((prev) => ({
                    ...prev,
                    playerNumber: e.target.value,
                  }))
                }
              />
              {errors.playerNumber && (
                <p className="text-sm text-destructive mt-1">{errors.playerNumber}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quantity and Price */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Label>Cantidad</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>Q.{(basePrice * quantity).toFixed(2)}</span>
              </div>
              {customization.selectedPatch && (
                <div className="flex items-center justify-between">
                  <span>Q.{(patchPrice * quantity).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Q.{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleAddToCart}
            disabled={isSubmitting || !selectedSize}
            className="flex-1"
          >
            {isSubmitting ? "Agregando..." : "Agregar al Carrito"}
          </Button>
        </div>
      </div>
    </div>
  );
}