// ============= Checkout Form Component =============
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { CartItem } from "@/types/product";
import { openWhatsAppChat, generateOrderSummary, sendOrderToAPI } from "@/utils/whatsapp";
import { validateCustomerName, validatePhone } from "@/utils/validation";
import { useToast } from "@/hooks/use-toast";
import { formatPriceSimple } from "@/utils/currency";

const checkoutSchema = z.object({
  customerName: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  phone: z.string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^\+?[\d\s\-\(\)]{8,15}$/, "Formato de teléfono inválido"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutForm({ items, total, onSuccess, onCancel }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const { toast } = useToast();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate data again on submit
      const nameValidation = validateCustomerName(data.customerName);
      const phoneValidation = validatePhone(data.phone);
      
      if (!nameValidation.isValid || !phoneValidation.isValid) {
        toast({
          title: "Error de validación",
          description: "Por favor revisa los datos ingresados",
          variant: "destructive",
        });
        return;
      }

      const orderData = {
        customerName: data.customerName,
        phone: data.phone,
        items,
        total,
      };

      // Send to API first (for future backend integration)
      const apiResult = await sendOrderToAPI(orderData);
      
      if (apiResult.success) {
        // Open WhatsApp with order details
        openWhatsAppChat(orderData);
        
        toast({
          title: "Pedido enviado",
          description: "Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto.",
        });
        
        onSuccess();
      } else {
        throw new Error(apiResult.error || "Error al procesar el pedido");
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderSummary = generateOrderSummary(items);

  if (showSummary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resumen del Pedido</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSummary(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={orderSummary}
              readOnly
              className="min-h-32 text-sm"
            />
            <div className="text-center">
              <p className="text-sm text-white/80 mb-4">
                Este resumen se enviará por WhatsApp
              </p>
              <Button onClick={() => setShowSummary(false)} className="w-full">
                Continuar con el Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Checkout por WhatsApp</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu nombre completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono WhatsApp *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+1234567890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Adicionales (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Instrucciones especiales, preferencias de entrega, etc."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Order Total */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total del Pedido:</span>
                <span className="text-lg font-bold">{formatPriceSimple(total)}</span>
              </div>
              <Button
                type="button"
                variant="link"
                onClick={() => setShowSummary(true)}
                className="p-0 h-auto text-sm"
              >
                Ver resumen detallado →
              </Button>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Al enviar este pedido, se abrirá WhatsApp con los detalles del pedido 
                para completar la compra directamente con nosotros.
              </AlertDescription>
            </Alert>

            {/* Actions */}
            <div className="space-y-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary"
                size="lg"
              >
                {isSubmitting ? "Procesando..." : "Enviar Pedido por WhatsApp"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full"
              >
                Volver al Carrito
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}