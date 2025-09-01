import { useState } from 'react';
import { useProducts, useProductMutations } from '@/hooks/use-products';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { formatPriceSimple } from '@/utils/currency';

const Products = () => {
  const { 
    data: products = [], 
    isLoading,
    teams,
    equipmentTypes,
    productTypes,
    sizes,
    colors
  } = useProducts();
  
  const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useProductMutations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    team: '',
    equipmentType: 'local' as 'local' | 'visitante' | 'tercera' | 'alternativa' | 'champions',
    productType: 'fan' as 'fan' | 'player',
    name: '',
    description: '',
    price: 0,
    playerPrice: 0,
    images: [''],
    sizes: [] as ('S' | 'M' | 'L' | 'XL' | 'XXL')[],
    primaryColor: '',
    isActive: true
  });

  // Inicializar formulario cuando se edita un producto
  const initializeForm = (product?: Product) => {
    if (product) {
      setFormData({
        team: product.team,
        equipmentType: product.equipmentType,
        productType: product.productType,
        name: product.name,
        description: product.description || '',
        price: product.price,
        playerPrice: product.playerPrice || product.price,
        images: product.images?.length ? [...product.images] : [''],
        sizes: product.sizes || [],
        primaryColor: product.primaryColor,
        isActive: product.isActive
      });
    } else {
      setFormData({
        team: '',
        equipmentType: 'local',
        productType: 'fan',
        name: '',
        description: '',
        price: 0,
        playerPrice: 0,
        images: [''],
        sizes: [],
        primaryColor: '',
        isActive: true
      });
    }
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        playerPrice: formData.productType === 'player' ? formData.playerPrice : formData.price
      };
      
      await createProduct(productData);
      setShowForm(false);
      initializeForm();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto. Por favor intenta de nuevo.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const productData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        playerPrice: formData.productType === 'player' ? formData.playerPrice : formData.price
      };
      
      await updateProduct({ id: editingProduct.id, updates: productData });
      setShowForm(false);
      setEditingProduct(null);
      initializeForm();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto. Por favor intenta de nuevo.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Por favor intenta de nuevo.');
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    initializeForm(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    initializeForm();
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    initializeForm();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 6) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleSizeToggle = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const generateProductName = () => {
    if (formData.team && formData.equipmentType && formData.productType) {
      const equipmentTypeText = {
        local: 'Local',
        visitante: 'Visitante',
        tercera: 'Tercera',
        alternativa: 'Alternativa',
        champions: 'Champions'
      }[formData.equipmentType] || formData.equipmentType;
      
      const productTypeText = formData.productType === 'player' ? 'Jugador' : 'Fan';
      
      const name = `${formData.team} 2024/25 - ${equipmentTypeText} - ${productTypeText}`;
      setFormData(prev => ({ ...prev, name }));
    }
  };

  // Formulario completo para crear/editar productos
  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team">Equipo *</Label>
                  <Select value={formData.team} onValueChange={(value) => handleInputChange('team', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team} value={team}>{team}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="equipmentType">Tipo de Equipación *</Label>
                  <Select value={formData.equipmentType} onValueChange={(value) => handleInputChange('equipmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipación" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="productType">Tipo de Producto *</Label>
                  <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primaryColor">Color Principal *</Label>
                  <Select value={formData.primaryColor} onValueChange={(value) => handleInputChange('primaryColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nombre del producto */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateProductName}
                    className="text-xs"
                  >
                    Generar Nombre
                  </Button>
                </div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nombre del producto"
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción del producto (opcional)"
                  rows={3}
                />
              </div>

              {/* Precios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio Fan *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="playerPrice">Precio Jugador *</Label>
                  <Input
                    id="playerPrice"
                    type="number"
                    value={formData.playerPrice}
                    onChange={(e) => handleInputChange('playerPrice', Number(e.target.value))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Imágenes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Imágenes (máximo 6)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    disabled={formData.images.length >= 6}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Imagen
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder={`URL de imagen ${index + 1}`}
                        />
                      </div>
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeImageField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {/* Vista previa de imágenes */}
                <div className="mt-4">
                  <Label>Vista Previa de Imágenes:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                    {formData.images.filter(img => img.trim() !== '').map((image, index) => (
                      <div key={index} className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Vista previa ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tallas */}
              <div>
                <Label className="mb-2 block">Tallas Disponibles *</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={formData.sizes.includes(size)}
                        onCheckedChange={() => handleSizeToggle(size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Producto Activo</Label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handleCancelForm}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  disabled={isCreating || isUpdating}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {isCreating || isUpdating ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')} Producto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista principal con lista de productos
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-1">
              Gestiona el catálogo de camisolas ({products.length} productos)
            </p>
          </div>
          <Button onClick={handleAddNew} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>

        {/* Lista de Productos */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
              <p className="text-gray-600 mb-4">
                Comienza agregando el primer producto al catálogo.
              </p>
              <Button onClick={handleAddNew} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Imagen */}
                  <div className="relative mb-4">
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {!product.isActive && (
                        <Badge variant="secondary" className="bg-gray-500 text-white text-xs">
                          Inactivo
                        </Badge>
                      )}
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${product.productType === 'player' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {product.productType === 'player' ? 'Jugador' : 'Fan'}
                      </Badge>
                    </div>
                    {/* Indicador de múltiples imágenes */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {product.images.length} imágenes
                      </div>
                    )}
                  </div>

                  {/* Información del Producto */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">{product.team}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {product.equipmentType === 'local' ? 'Local' : 
                         product.equipmentType === 'visitante' ? 'Visitante' :
                         product.equipmentType === 'tercera' ? 'Tercera' :
                         product.equipmentType === 'alternativa' ? 'Alternativa' :
                         product.equipmentType === 'champions' ? 'Champions' : product.equipmentType}
                      </Badge>
                      <span className="text-lg font-bold text-yellow-600">
                        {formatPriceSimple(product.price)}
                      </span>
                    </div>

                    {/* Tallas */}
                    <div className="flex flex-wrap gap-1">
                      {product.sizes?.map(size => (
                        <Badge key={size} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {size}
                        </Badge>
                      ))}
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Color:</span>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {product.primaryColor}
                      </Badge>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
