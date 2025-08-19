// ============= Cart Sidebar Component =============
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types/product";
import { CheckoutForm } from "./CheckoutForm";

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  return (
    <div className="flex space-x-3 py-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
        <p className="text-xs text-muted-foreground">{item.team}</p>
        <p className="text-xs text-muted-foreground">Talla: {item.size}</p>
        
        {/* Customization details */}
        {(item.customization?.playerName || item.customization?.playerNumber) && (
          <div className="mt-1">
            {item.customization.playerName && (
              <Badge variant="secondary" className="text-xs mr-1">
                {item.customization.playerName}
              </Badge>
            )}
            {item.customization.playerNumber && (
              <Badge variant="secondary" className="text-xs">
                #{item.customization.playerNumber}
              </Badge>
            )}
          </div>
        )}
        
        {/* Selected Patch */}
        {item.customization?.selectedPatch && (
          <div className="mt-1">
            <Badge variant="outline" className="text-xs mr-1">
              {item.customization.selectedPatch.name}
            </Badge>
          </div>
        )}
        
        {/* Version Badge */}
        <div className="mt-1">
          <Badge variant={item.version === 'player' ? 'default' : 'secondary'} className="text-xs">
            {item.version === 'player' ? 'Jugador' : 'Fan'}
          </Badge>
        </div>
        
        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">
              Q.{(item.price * item.quantity).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartSidebarProps {
  trigger?: React.ReactNode;
}

export function CartSidebar({ trigger }: CartSidebarProps) {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    setIsOpen(false);
    clearCart();
  };

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Carrito de Compras</span>
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 
              ? "Tu carrito está vacío" 
              : `${itemCount} producto${itemCount > 1 ? 's' : ''} en tu carrito`
            }
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-16 w-16 text-white/60 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-white">Tu carrito está vacío</h3>
            <p className="text-white/80 mb-4">
              Añade productos para empezar tu pedido
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 mt-6">
              <div className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <CartItemComponent
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                    {index < items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Cart Footer */}
            <SheetFooter className="flex-col space-y-4 mt-6">
              <div className="space-y-2">
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>Q.{total.toFixed(2)}</span>
                </div>
              </div>

              {showCheckout ? (
                <div className="w-full">
                  <CheckoutForm
                    items={items}
                    total={total}
                    onSuccess={handleCheckoutSuccess}
                    onCancel={() => setShowCheckout(false)}
                  />
                </div>
              ) : (
                <div className="space-y-2 w-full">
                  <Button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full btn-primary"
                    size="lg"
                  >
                    Proceder al Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="w-full"
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}