import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JerseyCustomizationDialog } from '@/components/product/JerseyCustomizationDialog';
import { Product, JerseyCustomization } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { Shirt, TestTube } from 'lucide-react';

// Producto de prueba
const SAMPLE_PRODUCT: Product = {
  id: 'test-barca-1',
  team: 'Barcelona',
  equipmentType: 'local',
  productType: 'fan',
  name: 'FC Barcelona Camiseta Local 2024/25',
  description: 'Camiseta oficial del FC Barcelona para la temporada 2024/25',
  price: 89.99,
  playerPrice: 119.99,
  images: [
    'https://via.placeholder.com/400x400/004d9f/ffffff?text=FC+Barcelona',
    'https://via.placeholder.com/400x400/8b1538/ffffff?text=Barca+2',
    'https://via.placeholder.com/400x400/004d9f/ffff00?text=Barca+3'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  primaryColor: '#004d9f',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const JerseyTestComponent: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddToCart = (customization: JerseyCustomization) => {
    console.log('🛒 Test: Adding to cart with customization:', customization);
    
    toast({
      title: "✅ Prueba Exitosa",
      description: `Personalización configurada: ${customization.version} - Talla ${customization.size}`,
      className: "border-green-200 bg-green-50 text-green-800",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <TestTube className="h-5 w-5 mr-2" />
            Prueba del Sistema de Personalización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Haz clic en el botón para probar el diálogo de personalización de camisetas con un producto de FC Barcelona.
          </p>
          
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-blue-600">
              <strong>Producto de prueba:</strong> {SAMPLE_PRODUCT.name}
            </div>
            <div className="text-sm text-blue-600">
              <strong>Equipo:</strong> {SAMPLE_PRODUCT.team}
            </div>
            <div className="text-sm text-blue-600">
              <strong>Tallas disponibles:</strong> {SAMPLE_PRODUCT.sizes.join(', ')}
            </div>
          </div>

          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Shirt className="h-4 w-4 mr-2" />
            Probar Personalización
          </Button>
        </CardContent>
      </Card>

      <JerseyCustomizationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={SAMPLE_PRODUCT}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};