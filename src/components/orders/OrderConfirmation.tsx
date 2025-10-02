// ============= Order Confirmation Component =============
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, MessageCircle, ArrowLeft, Copy, Download, Share2, Home, ShoppingBag, Truck } from "lucide-react";
import { CartItem } from "@/types/product";
import { formatPriceSimple } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

interface OrderConfirmationProps {
  onClose: () => void;
}

export function OrderConfirmation({ onClose }: OrderConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate mock order data for demo
  const orderId = `BAL-${Date.now().toString().slice(-8)}`;
  const customerName = "Cliente Satisfecho";
  const phone = "+502 4690 7489";
  const items: CartItem[] = [
    {
      id: "1",
      productId: "barcelona-home-2024",
      name: "Camisola Barcelona Home 2024/25",
      team: "Barcelona",
      price: 400,
      image: "/src/assets/equipos/barcelona.png",
      size: "M",
      quantity: 1,
      version: "player",
      customization: {
        version: "player",
        size: "M",
        personalizationType: "player",
        selectedPlayer: {
          id: "messi-10",
          name: "Messi",
          shirtNumber: 10
        }
      }
    }
  ];
  const total = 425;

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "✅ ID copiado",
      description: "El ID del pedido ha sido copiado al portapapeles",
    });
  };

  const handleContactSupport = () => {
    const message = `Hola, tengo una consulta sobre mi pedido #${orderId}`;
    const whatsappUrl = `https://wa.me/50246907489?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadReceipt = () => {
    // Simulate download
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "📄 Recibo descargado",
        description: "El recibo se ha descargado exitosamente",
      });
    }, 2000);
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi Pedido - La Casa del Balompié',
        text: `¡Acabo de hacer mi pedido #${orderId} en La Casa del Balompié!`,
        url: window.location.origin
      });
    } else {
      copyOrderId();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            {/* Success Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full shadow-2xl shadow-green-500/25">
                  <CheckCircle className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold text-white mb-2">
              ¡Pedido Confirmado!
            </CardTitle>
            <p className="text-white/70 text-lg">
              Tu pedido ha sido enviado exitosamente por WhatsApp
            </p>
            
            {/* Order ID Badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2">
              <span className="text-accent font-mono text-sm">#{orderId}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyOrderId}
                className="h-6 w-6 text-accent hover:bg-accent/20"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {/* Order Details */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-accent" />
                Detalles del Pedido
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Cliente:</span>
                    <span className="text-white font-medium">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Teléfono:</span>
                    <span className="text-white font-medium">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Fecha:</span>
                    <span className="text-white font-medium">{new Date().toLocaleDateString('es-GT')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Subtotal:</span>
                    <span className="text-white font-medium">{formatPriceSimple(total - 25)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Parche:</span>
                    <span className="text-white font-medium">{formatPriceSimple(25)}</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total:</span>
                    <span className="text-accent font-bold text-lg">{formatPriceSimple(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center text-white">
                <Package className="h-5 w-5 mr-2 text-accent" />
                Productos ({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-white/20"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white line-clamp-2">{item.name}</h4>
                      <p className="text-white/70 text-sm">{item.team}</p>
                      <p className="text-white/70 text-sm">Talla: {item.size}</p>
                      
                      {/* Customization details */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.customization?.selectedPlayer?.name && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                            {item.customization.selectedPlayer.name}
                          </Badge>
                        )}
                        {item.customization?.selectedPlayer?.shirtNumber && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                            #{item.customization.selectedPlayer.shirtNumber}
                          </Badge>
                        )}
                        {item.customization?.customName && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                            {item.customization.customName}
                          </Badge>
                        )}
                        {item.customization?.customNumber && (
                          <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                            #{item.customization.customNumber}
                          </Badge>
                        )}
                        <Badge 
                          variant="default" 
                          className="text-xs bg-gradient-to-r from-accent to-yellow-500 text-background"
                        >
                          {item.version === 'player' ? 'Jugador' : 'Fan'}
                        </Badge>
                        {item.customization?.personalizationType !== 'none' && (
                          <Badge variant="outline" className="text-xs border-white/30 text-white/80">
                            Personalizada
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-accent font-bold">{formatPriceSimple(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-accent/10 to-yellow-500/10 rounded-xl p-5 border border-accent/20">
              <h3 className="font-semibold text-white mb-4">Próximos Pasos</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-accent/20 p-2 rounded-full mt-0.5">
                    <MessageCircle className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Confirmación por WhatsApp</p>
                    <p className="text-white/70 text-sm">Recibirás confirmación en los próximos minutos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-accent/20 p-2 rounded-full mt-0.5">
                    <Package className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Preparación del Pedido</p>
                    <p className="text-white/70 text-sm">Tu camisola se personalizará en 2-3 días hábiles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-accent/20 p-2 rounded-full mt-0.5">
                    <Truck className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Envío y Entrega</p>
                    <p className="text-white/70 text-sm">Entrega en 1-2 días hábiles en toda Guatemala</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-12"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contactar Soporte
              </Button>
              
              <Button
                onClick={handleDownloadReceipt}
                disabled={isLoading}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-12"
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? 'Descargando...' : 'Descargar Recibo'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleShareOrder}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 h-12"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Pedido
              </Button>
              
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-accent to-yellow-500 hover:from-accent/90 hover:to-yellow-500/90 text-background font-semibold h-12"
              >
                <Home className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}