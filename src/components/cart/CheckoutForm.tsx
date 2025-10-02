// ============= Checkout Form Component =============
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, Shirt, X } from "lucide-react";
import { CartItem } from "@/types/product";
import { CustomerInfoForm } from "@/components/checkout/CustomerInfoForm";
import { openWhatsAppChat, WhatsAppOrderData } from "@/utils/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { formatPriceSimple } from "@/utils/currency";

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
  onRemoveItem?: (id: string) => void; // Nuevo: callback para eliminar ítems
}

export function CheckoutForm({ items, total, onSuccess, onCancel, onRemoveItem }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCustomerInfoSubmit = async (customerInfo: CustomerInfo) => {
    setIsSubmitting(true);

    try {
      const orderData: WhatsAppOrderData = {
        customerName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        notes: customerInfo.notes,
        items,
        total
      };

      openWhatsAppChat(orderData);

      toast({
        title: "✅ Pedido enviado",
        description: "Tu pedido se ha enviado por WhatsApp. Te contactaremos pronto.",
        className: "border-green-200 bg-green-50 text-green-800 shadow-lg",
      });

      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "❌ Error",
        description: "Hubo un problema al procesar tu pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-y-auto bg-gradient-to-b from-black via-zinc-900 to-black">
      <div className="relative w-full max-w-2xl space-y-8 my-8">
        
        {/* Botón X superior para cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-0 right-0 m-3 text-gray-300 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <Card className="border-white/20 bg-black/40 backdrop-blur-xl shadow-xl rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl text-white">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-md">
                <ShoppingBag className="h-8 w-8 text-black" />
              </div>
              Finalizar Pedido
            </CardTitle>
            <p className="text-gray-300 mt-2 text-sm">Revisa tu pedido y completa tu información</p>
          </CardHeader>
        </Card>

        {/* Order Summary con scroll si es muy grande */}
        <Card className="border-white/20 bg-black/40 backdrop-blur-xl shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Shirt className="h-5 w-5 text-yellow-400" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="relative p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Botón X para eliminar item */}
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-14 h-14 rounded-xl border border-white/20 object-cover shadow-md"
                        />
                        <div>
                          <h4 className="font-semibold text-white text-base">{item.name}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-400 font-medium">{item.team}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300">Talla {item.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      {item.customization?.personalizationType === 'player' && item.customization.selectedPlayer && (
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-2 mt-2 shadow-sm">
                          <span className="text-blue-300 text-sm font-medium">
                            👤 {item.customization.selectedPlayer.name} #{item.customization.selectedPlayer.shirtNumber}
                          </span>
                        </div>
                      )}
                      {item.customization?.personalizationType === 'custom' && (
                        <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg px-3 py-2 mt-2 shadow-sm">
                          <span className="text-purple-300 text-sm font-medium">
                            ✏️ {item.customization.customName} #{item.customization.customNumber}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">
                        {formatPriceSimple(item.price * item.quantity)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {item.quantity} x {formatPriceSimple(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-white/20 my-4" />
            
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-400/30 rounded-xl p-5 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-white text-lg font-bold">Total a Pagar:</span>
                <span className="text-yellow-400 text-2xl font-extrabold tracking-wide">{formatPriceSimple(total)}</span>
              </div>
              <p className="text-yellow-200 text-sm mt-1 italic">Personalización incluida • Envío gratis</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info Form */}
        <CustomerInfoForm
          onSubmit={handleCustomerInfoSubmit}
          onCancel={onCancel}
          isLoading={isSubmitting}
        />

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200 rounded-xl shadow-sm"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Carrito
        </Button>
      </div>
    </div>
  );
}
