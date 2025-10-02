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
    <div
      className={`flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg border border-white/20"
        />
        {item.customization?.selectedPlayer?.shirtNumber && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {item.customization.selectedPlayer.shirtNumber}
          </div>
        )}
        {item.customization?.customNumber && (
          <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {item.customization.customNumber}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-white leading-tight line-clamp-2">
            {item.name}
          </h4>

          {/* Badges de personalización */}
          <div className="flex flex-wrap gap-1">
            {item.customization?.personalizationType === "player" &&
              item.customization.selectedPlayer && (
                <Badge className="bg-blue-500/80 text-white border-0 text-xs px-2 py-0.5">
                  {item.customization.selectedPlayer.name} #
                  {item.customization.selectedPlayer.shirtNumber}
                </Badge>
              )}
            {item.customization?.personalizationType === "custom" && (
              <Badge className="bg-purple-500/80 text-white border-0 text-xs px-2 py-0.5">
                {item.customization.customName} #
                {item.customization.customNumber}
              </Badge>
            )}
            <Badge
              className={`text-xs px-2 py-0.5 ${
                item.version === "player"
                  ? "bg-yellow-500/80 text-black"
                  : "bg-gray-600/80 text-white"
              }`}
            >
              {item.version === "player" ? "Jugador" : "Fan"}
            </Badge>
          </div>

          {/* Team y Talla */}
          <div className="flex items-center gap-1 text-xs text-gray-300">
            <span className="text-yellow-400">{item.team}</span>
            <span className="text-gray-400">•</span>
            <span>Talla {item.size}</span>
          </div>
        </div>

        {/* Quantity controls and price */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-white/30 text-white hover:bg-yellow-500/20 hover:border-yellow-400 transition-all duration-200"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium text-white w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6 border-white/30 text-white hover:bg-yellow-500/20 hover:border-yellow-400 transition-all duration-200"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-yellow-400">
              {formatPriceSimple(item.price * item.quantity)}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-400 hover:text-white hover:bg-red-500/80 transition-all duration-200"
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
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
        <OrderConfirmation onClose={handleClose} />
      </div>
    );
  }

  return (
    <>
      {/* Checkout Form as Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-600">
          <CheckoutForm 
            onSuccess={handleOrderComplete}
            onCancel={() => setShowCheckout(false)}
            total={total}
            items={items}
          />
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-white">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-black animate-bounce"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 bg-black/95 backdrop-blur border-l border-white/20">
        <SheetHeader className="border-b border-white/20 pb-4">
          <SheetTitle className="text-white text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-yellow-500" />
            Carrito de Compras
          </SheetTitle>
          <SheetDescription className="text-gray-300">
            {itemCount === 0 ? 'Tu carrito está vacío' : `${itemCount} producto${itemCount !== 1 ? 's' : ''} en el carrito`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-xl"></div>
              <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-500 p-6 rounded-full">
                <ShoppingCart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Carrito Vacío</h3>
            <p className="text-gray-300 mb-6">Agrega algunas camisolas para comenzar</p>
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
            >
              Explorar Camisolas
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 py-3">
              <div className="space-y-2">
                {items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Footer del carrito */}
            <div className="p-4 border-t border-white/10 space-y-4 bg-black/60 backdrop-blur-md">
              {/* Totales */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPriceSimple(total)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Envío:</span>
                  <span className="font-medium">{total >= 300 ? "Gratis" : "€25.00"}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-yellow-400">{formatPriceSimple(total)}</span>
                </div>
              </div>

              {/* Beneficios */}
              <div className="flex items-center justify-around text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4 text-yellow-400" />
                  <span>Envío Gratis</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  <span>Garantía</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-yellow-400" />
                  <span>Pago Seguro</span>
                </div>
              </div>

              {/* Botón principal */}
              <Button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition-all"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Finalizar Pedido por WhatsApp
              </Button>
              
              {/* Botón secundario */}
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="w-full border-red-400/50 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 rounded-xl transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
    </>
  );
}