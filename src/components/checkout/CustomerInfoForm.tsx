import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

interface CustomerInfoFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerInfoForm({ onSubmit, onCancel, isLoading }: CustomerInfoFormProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[\d\s\-\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Teléfono no válido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "❌ Error en el formulario",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Card className="w-full border-white/20 bg-black/40 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl text-white">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          Información de Entrega
        </CardTitle>
        <p className="text-gray-300 mt-2">
          Completa tus datos para procesar tu pedido por WhatsApp
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-white font-medium">
              <User className="h-4 w-4 text-yellow-400" />
              Nombre completo *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-white font-medium">
              <Mail className="h-4 w-4 text-yellow-400" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.email}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-white font-medium">
              <Phone className="h-4 w-4 text-yellow-400" />
              Teléfono *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+502 1234 5678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-white font-medium">
              <MapPin className="h-4 w-4 text-yellow-400" />
              Dirección de entrega *
            </Label>
            <Textarea
              id="address"
              placeholder="Calle, número, colonia, ciudad, código postal..."
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`resize-none bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.address}
              </p>
            )}
          </div>

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white font-medium">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Instrucciones especiales para la entrega, referencias del lugar..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="resize-none bg-white/10 border-white/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
              rows={2}
            />
          </div>

          {/* Botón de Envío */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Enviar por WhatsApp</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}