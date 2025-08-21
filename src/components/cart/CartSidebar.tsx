// ============= Cart Sidebar Component =============
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, X, CreditCard, Truck, Shield } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/types/product";
import { CheckoutForm } from "./CheckoutForm";
import { OrderConfirmation } from "@/components/orders/OrderConfirmation";
import { formatPriceSimple } from "@/utils/currency";

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemComponentProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
      setIsRemoving(false);
    }, 300);
  };

  return (
    <div className={`flex space-x-3 py-4 transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Product Image */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg border border-white/20"
        />
        {item.customization?.playerNumber && (
          <div className="absolute -top-1 -right-1 bg-accent text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {item.customization.playerNumber}
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-2 text-white">{item.name}</h4>
        <p className="text-xs text-white/70">{item.team}</p>
        <p className="text-xs text-white/70">Talla: {item.size}</p>
        
        {/* Customization details */}
        {(item.customization?.playerName || item.customization?.playerNumber) && (
          <div className="mt-2 space-y-1">
            {item.customization.playerName && (
              <Badge variant="secondary" className="text-xs mr-1 bg-accent/20 text-accent border-accent/30">
                {item.customization.playerName}
              </Badge>
            )}
            {item.customization.playerNumber && (
              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                #{item.customization.playerNumber}
              </Badge>
            )}
          </div>
        )}
        
        {/* Selected Patch */}
        {item.customization?.selectedPatch && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs border-white/30 text-white/80">
              {item.customization.selectedPatch.name}
            </Badge>
          </div>
        )}
        
        {/* Version Badge */}
        <div className="mt-2">
          <Badge 
            variant={item.version === 'player' ? 'default' : 'secondary'} 
            className={`text-xs ${item.version === 'player' ? 'bg-gradient-to-r from-accent to-yellow-500 text-background' : 'bg-white/20 text-white border-white/30'}`}
          >
            {item.version === 'player' ? 'Jugador' : 'Fan'}
          </Badge>
        </div>
        
        {/* Quantity controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-white/30 text-white hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm w-8 text-center text-white font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 border-white/30 text-white hover:bg-accent/20 hover:border-accent/60 transition-all duration-200"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-accent">
              {formatPriceSimple(item.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              onClick={handleRemove}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSidebar() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setShowCheckout(false);
    setShowConfirmation(true);
    clearCart();
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowCheckout(false);
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <OrderConfirmation onClose={handleClose} />
    );
  }

  if (showCheckout) {
    return (
      <CheckoutForm 
        onComplete={handleOrderComplete}
        onBack={() => setShowCheckout(false)}
        total={total}
      />
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-accent/10">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-background animate-bounce"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 bg-background/95 backdrop-blur border-l border-white/20">
        <SheetHeader className="border-b border-white/20 pb-4">
          <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-accent" />
            Carrito de Compras
          </SheetTitle>
          <SheetDescription className="text-white/70">
            {itemCount === 0 ? 'Tu carrito está vacío' : `${itemCount} producto${itemCount !== 1 ? 's' : ''} en el carrito`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-yellow-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-accent/30 to-yellow-500/30 p-6 rounded-full">
                <ShoppingCart className="h-16 w-16 text-white/60" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Carrito Vacío</h3>
            <p className="text-white/60 mb-6">Agrega algunas camisolas para comenzar</p>
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90"
            >
              Explorar Camisolas
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-white/10 last:border-b-0">
                    <CartItemComponent
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t border-white/20 pt-4 space-y-4">
              {/* Order Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal:</span>
                  <span className="text-white font-medium">{formatPriceSimple(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Envío:</span>
                  <span className="text-white font-medium">Gratis</span>
                </div>
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-accent">{formatPriceSimple(total)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 text-xs text-white/60">
                <div className="flex flex-col items-center text-center">
                  <Truck className="h-4 w-4 mb-1 text-accent" />
                  <span>Envío Gratis</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-4 w-4 mb-1 text-accent" />
                  <span>Garantía</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <CreditCard className="h-4 w-4 mb-1 text-accent" />
                  <span>Pago Seguro</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90 text-background font-semibold py-3"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceder al Pago
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}