import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  X, 
  Upload,
  Image as ImageIcon,
  Palette,
  Package,
  Tag
} from 'lucide-react';
import { Product } from '@/types/product';

interface ProductFormProps {
  product?: Partial<Product>;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  teams: string[];
  equipmentTypes: { value: string; label: string }[];
  productTypes: { value: string; label: string }[];
  sizes: string[];
  colors: string[];
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
  teams,
  equipmentTypes,
  productTypes,
  sizes,
  colors
}: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    team: product?.team || '',
    equipmentType: product?.equipmentType || 'local',
    productType: product?.productType || 'fan',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    playerPrice: product?.playerPrice || 0,
    images: product?.images || [],
    sizes: product?.sizes || [],
    primaryColor: product?.primaryColor || '',
    isActive: product?.isActive ?? true
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size as any)
        ? prev.sizes?.filter(s => s !== size)
        : [...(prev.sizes || []), size as any]
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim() && formData.images && formData.images.length < 3) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.team || !formData.name || !formData.price || formData.sizes?.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    onSubmit(formData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const generateProductName = () => {
    if (formData.team && formData.equipmentType && formData.productType) {
      const equipmentLabel = equipmentTypes.find(e => e.value === formData.equipmentType)?.label;
      const productLabel = productTypes.find(p => p.value === formData.productType)?.label;
      const name = `${formData.team} 2024/25 - ${equipmentLabel} - ${productLabel}`;
      setFormData(prev => ({ ...prev, name }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-yellow-600" />
            {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Completa la información del producto. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team" className="text-sm font-medium text-gray-700">
                  Equipo *
                </Label>
                <Select value={formData.team} onValueChange={(value) => handleInputChange('team', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {teams.map(team => (
                      <SelectItem key={team} value={team} className="text-gray-900 hover:bg-yellow-50">
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentType" className="text-sm font-medium text-gray-700">
                  Tipo de Equipación *
                </Label>
                <Select value={formData.equipmentType} onValueChange={(value) => handleInputChange('equipmentType', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Seleccionar equipación" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {equipmentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-yellow-50">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType" className="text-sm font-medium text-gray-700">
                  Tipo de Producto *
                </Label>
                <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {productTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-yellow-50">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700">
                  Color Principal *
                </Label>
                <Select value={formData.primaryColor} onValueChange={(value) => handleInputChange('primaryColor', value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Seleccionar color" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {colors.map(color => (
                      <SelectItem key={color} value={color} className="text-gray-900 hover:bg-yellow-50">
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nombre del Producto */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nombre del Producto *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateProductName}
                  className="text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  Generar Automáticamente
                </Button>
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Barcelona 2024/25 - Local - Fan"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el producto..."
                rows={3}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>

            {/* Precios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Precio Fan (Q) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playerPrice" className="text-sm font-medium text-gray-700">
                  Precio Jugador (Q) *
                </Label>
                <Input
                  id="playerPrice"
                  type="number"
                  value={formData.playerPrice}
                  onChange={(e) => handleInputChange('playerPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>

            {/* Tallas Disponibles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Tallas Disponibles *
              </Label>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes?.includes(size as any)}
                      onCheckedChange={() => handleSizeToggle(size)}
                      className="border-gray-300 text-yellow-600"
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm text-gray-700">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.sizes && formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map(size => (
                    <Badge key={size} variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      {size}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Imágenes (máximo 3)
              </Label>
              
              {/* Agregar nueva imagen */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="URL de la imagen (Google Drive o imagen pública)"
                    className="flex-1 bg-white border-gray-300 text-gray-900"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    disabled={!newImageUrl.trim() || (formData.images?.length || 0) >= 3}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Botones de ejemplo */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewImageUrl('https://via.placeholder.com/400x300/1e40af/ffffff?text=Camiseta+Ejemplo')}
                    className="text-xs"
                  >
                    URL Ejemplo
                  </Button>
                  <Button
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => setNewImageUrl('https://picsum.photos/400/300')}
                    className="text-xs"
                  >
                    Imagen Aleatoria
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  💡 Para Google Drive: Comparte con "Cualquier persona con el enlace" y pega la URL aquí
                </p>
              </div>

              {/* Lista de imágenes */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Estado del Producto
                </Label>
                <p className="text-xs text-gray-500">
                  Los productos inactivos no se mostrarán en la tienda
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                className="data-[state=checked]:bg-yellow-600"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isLoading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
