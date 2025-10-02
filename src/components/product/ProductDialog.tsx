// ============= Product Dialog Component =============
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Product, JerseyCustomization } from "@/types/product";
import { JerseyCustomizationDialog } from "./JerseyCustomizationDialog";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductDialogProps {
  product: Product;
  trigger: React.ReactNode;
}

export function ProductDialog({ product, trigger }: ProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (customization: JerseyCustomization) => {
    const basePrice = customization.version === 'player' && product.playerPrice 
      ? product.playerPrice 
      : product.price;
    
    // La personalización ahora es gratuita
    const totalPrice = basePrice;

    // Crear nombre descriptivo
    let displayName = product.name;
    if (customization.personalizationType === 'player' && customization.selectedPlayer) {
      displayName += ` - ${customization.selectedPlayer.name} #${customization.selectedPlayer.shirtNumber}`;
    } else if (customization.personalizationType === 'custom' && customization.customName) {
      displayName += ` - ${customization.customName} #${customization.customNumber}`;
    }
    if (customization.version === 'player') {
      displayName += ' (Versión Jugador)';
    }

    addItem({
      productId: product.id,
      name: displayName,
      team: product.team,
      price: totalPrice,
      image: product.images[0] || '/placeholder.svg',
      size: customization.size,
      quantity: 1,
      version: customization.version,
      customization: customization
    });

    toast({
      title: "✅ Agregado al carrito",
      description: `${displayName} en talla ${customization.size}`,
      className: "border-green-200 bg-green-50 text-green-800",
    });

    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="p-0 max-w-none w-auto h-auto">
          {/* El contenido se maneja en JerseyCustomizationDialog */}
        </DialogContent>
      </Dialog>

      <JerseyCustomizationDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        product={product}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}