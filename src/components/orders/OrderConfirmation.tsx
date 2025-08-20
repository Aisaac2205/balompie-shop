// ============= Order Confirmation Component =============
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, MessageCircle, ArrowLeft, Copy } from "lucide-react";
import { CartItem } from "@/types/product";
import { formatPriceSimple } from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  total: number;
  onStartNewOrder: () => void;
}

export function OrderConfirmation({
  orderId,
  customerName,
  phone,
  items,
  total,
  onStartNewOrder
}: OrderConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast({
      title: "ID copiado",
      description: "El ID del pedido ha sido copiado al portapapeles",
    });
  };

  const handleContactSupport = () => {
    const message = `Hola, tengo una consulta sobre mi pedido #${orderId}`;
    const whatsappUrl = `https://wa.me/50246907489?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-foreground">
            ¡Pedido Confirmado!
          </CardTitle>
          <p className="text-muted-foreground">
            Tu pedido ha sido enviado exitosamente por WhatsApp
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">ID del Pedido:</span>
              <div className="flex items-center space-x-2">
                <code className="bg-background px-2 py-1 rounded text-sm">
                  {orderId}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyOrderId}
                  className="h-6 w-6"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Cliente:</span>
              <span>{customerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Teléfono:</span>
              <span>{phone}</span>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Productos ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {item.version === 'player' ? 'Versión Jugador' : 'Versión Fan'}
                      </Badge>
                      <span>Talla {item.size}</span>
                      <span>x{item.quantity}</span>
                    </div>
                    {item.customization && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.customization.playerName && (
                          <span>Nombre: {item.customization.playerName} </span>
                        )}
                        {item.customization.playerNumber && (
                          <span>#{item.customization.playerNumber} </span>
                        )}
                        {item.customization.selectedPatch && (
                          <span>Parche: {item.customization.selectedPatch.name}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatPriceSimple(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-primary">{formatPriceSimple(total)}</span>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              Próximos pasos:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Te contactaremos por WhatsApp para confirmar los detalles</li>
              <li>• Coordinaremos el método de pago y entrega</li>
              <li>• Recibirás actualizaciones del estado de tu pedido</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contactar Soporte
            </Button>
            <Button
              onClick={onStartNewOrder}
              className="flex-1 btn-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Realizar Nuevo Pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}