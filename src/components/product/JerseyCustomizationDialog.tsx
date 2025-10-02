import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePlayersByTeamName } from '@/hooks/use-players';
import { Product, JerseyCustomization } from '@/types/product';
import { formatPrice } from '@/utils/currency';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, Shirt, User, Edit, Trophy } from 'lucide-react';

interface JerseyCustomizationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onAddToCart: (customization: JerseyCustomization) => void;
}

export const JerseyCustomizationDialog: React.FC<JerseyCustomizationDialogProps> = ({
  isOpen,
  onOpenChange,
  product,
  onAddToCart
}) => {
  const [customization, setCustomization] = useState<JerseyCustomization>({
    version: 'fan',
    size: 'M',
    personalizationType: 'none'
  });

  // Obtener jugadores del equipo por nombre
  const { players, isLoading: playersLoading } = usePlayersByTeamName(product.team);

  // Resetear cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      setCustomization({
        version: 'fan',
        size: 'M',
        personalizationType: 'none'
      });
    }
  }, [isOpen]);

  // Calcular precio actual (sin costo extra por personalización)
  const getPrice = () => {
    const basePrice = customization.version === 'player' && product.playerPrice 
      ? product.playerPrice 
      : product.price;
    
    return basePrice; // Sin costo extra por dorsal/nombre
  };

  // Manejar selección de jugador
  const handlePlayerSelect = (playerId: string) => {
    const selectedPlayer = players.find(p => p.id === playerId);
    if (selectedPlayer) {
      setCustomization(prev => ({
        ...prev,
        personalizationType: 'player',
        selectedPlayer: {
          id: selectedPlayer.id,
          name: selectedPlayer.name,
          shirtNumber: selectedPlayer.shirtNumber
        },
        customName: undefined,
        customNumber: undefined
      }));
    }
  };

  // Manejar personalización custom
  const handleCustomization = (name: string, number: number) => {
    // Validar que el número no esté ocupado por un jugador
    const isNumberTaken = players.some(p => p.shirtNumber === number && p.isActive);
    
    if (isNumberTaken) {
      toast({
        title: "❌ Número no disponible",
        description: `El dorsal ${number} ya está asignado a un jugador del equipo`,
        variant: "destructive",
      });
      return;
    }

    setCustomization(prev => ({
      ...prev,
      personalizationType: 'custom',
      customName: name,
      customNumber: number,
      selectedPlayer: undefined
    }));
  };

  // Validar formulario
  const isValid = () => {
    if (!customization.size) return false;
    
    if (customization.personalizationType === 'custom') {
      if (!customization.customName?.trim()) return false;
      if (!customization.customNumber || customization.customNumber < 1 || customization.customNumber > 99) return false;
    }
    
    return true;
  };

  // Manejar agregar al carrito
  const handleAddToCart = () => {
    if (!isValid()) {
      toast({
        title: "❌ Formulario incompleto",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    onAddToCart(customization);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Shirt className="h-6 w-6 mr-2 text-blue-600" />
            Personalizar Camiseta - {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-200">
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 bg-white">
                  <Shirt className="h-24 w-24" />
                </div>
              )}
            </div>

            {/* Imágenes adicionales */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-contain bg-white hover:scale-105 transition-transform duration-200 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Opciones de personalización */}
          <div className="space-y-6">
            {/* Selección de versión */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Tipo de Camiseta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={customization.version} 
                  onValueChange={(value: 'fan' | 'player') => 
                    setCustomization(prev => ({ ...prev, version: value }))
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="fan" id="fan" />
                    <Label htmlFor="fan" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Versión Fan</div>
                          <div className="text-sm text-gray-500">Calidad estándar para aficionados</div>
                        </div>
                        <Badge variant="outline">{formatPrice(product.price)}</Badge>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="player" id="player" />
                    <Label htmlFor="player" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Versión Jugador</div>
                          <div className="text-sm text-gray-500">Calidad profesional match</div>
                        </div>
                        <Badge variant="outline">
                          {formatPrice(product.playerPrice || product.price + 20)}
                        </Badge>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Selección de talla */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Talla</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={customization.size === size ? "default" : "outline"}
                      onClick={() => setCustomization(prev => ({ ...prev, size }))}
                      className="h-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personalización */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  Personalización (Gratis)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={customization.personalizationType} 
                  onValueChange={(value: 'none' | 'player' | 'custom') => 
                    setCustomization(prev => ({ 
                      ...prev, 
                      personalizationType: value,
                      selectedPlayer: value !== 'player' ? undefined : prev.selectedPlayer,
                      customName: value !== 'custom' ? undefined : prev.customName,
                      customNumber: value !== 'custom' ? undefined : prev.customNumber
                    }))
                  }
                  className="space-y-4"
                >
                  {/* Sin personalización */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none" className="cursor-pointer">
                      Sin nombre ni dorsal
                    </Label>
                  </div>

                  {/* Jugador del equipo */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="player" id="player-select" />
                      <Label htmlFor="player-select" className="cursor-pointer">
                        Jugador del equipo
                      </Label>
                    </div>
                    
                    {customization.personalizationType === 'player' && (
                      <div className="ml-6">
                        {playersLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-500">Cargando jugadores...</span>
                          </div>
                        ) : (
                          <Select onValueChange={handlePlayerSelect}>
                            <SelectTrigger>
                              <SelectValue placeholder="Elige jugador/a" />
                            </SelectTrigger>
                            <SelectContent>
                              {players
                                .filter(p => p.isActive)
                                .sort((a, b) => a.shirtNumber - b.shirtNumber)
                                .map((player) => (
                                  <SelectItem key={player.id} value={player.id}>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline" className="text-xs">
                                        {player.shirtNumber}
                                      </Badge>
                                      <span>{player.name}</span>
                                      <span className="text-xs text-gray-500">({player.position})</span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Personalización custom */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="cursor-pointer">
                        Nombre y dorsal personalizado
                      </Label>
                    </div>
                    
                    {customization.personalizationType === 'custom' && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <Label htmlFor="customName">Nombre</Label>
                          <Input
                            id="customName"
                            placeholder="Ej: TU NOMBRE"
                            value={customization.customName || ''}
                            onChange={(e) => setCustomization(prev => ({ 
                              ...prev, 
                              customName: e.target.value.toUpperCase() 
                            }))}
                            maxLength={15}
                          />
                        </div>
                        <div>
                          <Label htmlFor="customNumber">Dorsal (1-99)</Label>
                          <Input
                            id="customNumber"
                            type="number"
                            min="1"
                            max="99"
                            placeholder="Ej: 7"
                            value={customization.customNumber || ''}
                            onChange={(e) => {
                              const num = parseInt(e.target.value);
                              if (num >= 1 && num <= 99) {
                                handleCustomization(customization.customName || '', num);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Resumen y precio */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Versión:</span>
                    <span className="font-medium">
                      {customization.version === 'fan' ? 'Fan' : 'Jugador'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Talla:</span>
                    <span className="font-medium">{customization.size}</span>
                  </div>
                  {customization.personalizationType !== 'none' && (
                    <div className="flex justify-between">
                      <span>Personalización:</span>
                      <span className="font-medium">
                        {customization.personalizationType === 'player' && customization.selectedPlayer
                          ? `${customization.selectedPlayer.name} #${customization.selectedPlayer.shirtNumber}`
                          : customization.personalizationType === 'custom' && customization.customName
                          ? `${customization.customName} #${customization.customNumber}`
                          : 'Pendiente'
                        }
                      </span>
                    </div>
                  )}
                  <hr className="border-green-300" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(getPrice())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botón agregar al carrito */}
            <Button 
              onClick={handleAddToCart}
              disabled={!isValid()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Agregar al Carrito - {formatPrice(getPrice())}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};