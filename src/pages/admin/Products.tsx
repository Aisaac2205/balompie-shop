import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { formatPriceSimple } from '@/utils/currency';

interface Team {
  id: string;
  name: string;
  primary_color: string;
}

interface ProductFormData {
  team: string;
  equipment_type: 'local' | 'visitante' | 'tercera' | 'alternativa' | 'champions';
  product_type: 'fan' | 'player';
  name: string;
  description: string;
  price: number;
  player_price: number;
  images: string[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  primary_color: string;
  is_active: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState<ProductFormData>({
    team: '',
    equipment_type: 'local',
    product_type: 'fan',
    name: '',
    description: '',
    price: 0,
    player_price: 0,
    images: [''],
    sizes: [],
    primary_color: '',
    is_active: true
  });

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Cargar productos y equipos desde el backend
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar equipos
      const teamsResponse = await fetch(`${API_BASE_URL}/teams`);
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      }

      // Cargar productos
      const productsResponse = await fetch(`${API_BASE_URL}/products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Inicializar formulario cuando se edita un producto
  const initializeForm = (product?: Product) => {
    if (product) {
      setFormData({
        team: product.team,
        equipment_type: product.equipmentType,
        product_type: product.productType,
        name: product.name,
        description: product.description || '',
        price: product.price,
        player_price: product.playerPrice || product.price,
        images: product.images?.length ? [...product.images] : [''],
        sizes: product.sizes || [],
        primary_color: product.primaryColor,
        is_active: product.isActive
      });
    } else {
      setFormData({
        team: '',
        equipment_type: 'local',
        product_type: 'fan',
        name: '',
        description: '',
        price: 0,
        player_price: 0,
        images: [''],
        sizes: [],
        primary_color: '',
        is_active: true
      });
    }
  };

  const handleCreateProduct = async () => {
    try {
      const productData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        player_price: formData.product_type === 'player' ? formData.player_price : formData.price
      };
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al crear producto');
      }

      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });

      setIsAddDialogOpen(false);
      initializeForm();
      loadData();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el producto",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      const productData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        player_price: formData.product_type === 'player' ? formData.player_price : formData.price
      };
      
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar producto');
      }

      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });

      setIsEditDialogOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  };

  // Abrir diálogo de edición
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    initializeForm(product);
    setIsEditDialogOpen(true);
  };

  // Agregar/remover imagen
  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  // Manejar cambios en tamaños
  const handleSizeChange = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL', checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    } else {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
    }
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.equipmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los productos de la tienda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa la información del producto
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team">Equipo</Label>
                <Select value={formData.team} onValueChange={(value) => setFormData({ ...formData, team: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.name}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment_type">Tipo de Equipación</Label>
                <Select value={formData.equipment_type} onValueChange={(value: any) => setFormData({ ...formData, equipment_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="tercera">Tercera</SelectItem>
                    <SelectItem value="alternativa">Alternativa</SelectItem>
                    <SelectItem value="champions">Champions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_type">Tipo de Producto</Label>
                <Select value={formData.product_type} onValueChange={(value: any) => setFormData({ ...formData, product_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fan">Fan</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Barcelona 2024/25 - Local - Fan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio Fan</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="89.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player_price">Precio Player</Label>
                <Input
                  id="player_price"
                  type="number"
                  step="0.01"
                  value={formData.player_price}
                  onChange={(e) => setFormData({ ...formData, player_price: parseFloat(e.target.value) || 0 })}
                  placeholder="129.99"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_color">Color Principal</Label>
                <Input
                  id="primary_color"
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Activo</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Producto disponible</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tamaños Disponibles</Label>
              <div className="flex flex-wrap gap-2">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imágenes del Producto</Label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="URL de la imagen"
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addImage}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Imagen
              </Button>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProduct}>
                Crear Producto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary">{product.team}</Badge>
                <Badge variant="outline">{product.equipmentType}</Badge>
                <Badge variant="outline">{product.productType}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Precio Fan:</span>
                  <span className="font-semibold">{formatPriceSimple(product.price)}</span>
                </div>
                {product.playerPrice && product.playerPrice !== product.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Precio Player:</span>
                    <span className="font-semibold">{formatPriceSimple(product.playerPrice)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tamaños:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes?.map((size) => (
                      <Badge key={size} variant="secondary" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-team">Equipo</Label>
              <Select value={formData.team} onValueChange={(value) => setFormData({ ...formData, team: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-equipment_type">Tipo de Equipación</Label>
              <Select value={formData.equipment_type} onValueChange={(value: any) => setFormData({ ...formData, equipment_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="visitante">Visitante</SelectItem>
                  <SelectItem value="tercera">Tercera</SelectItem>
                  <SelectItem value="alternativa">Alternativa</SelectItem>
                  <SelectItem value="champions">Champions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-product_type">Tipo de Producto</Label>
              <Select value={formData.product_type} onValueChange={(value: any) => setFormData({ ...formData, product_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fan">Fan</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Producto</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Barcelona 2024/25 - Local - Fan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio Fan</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="89.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-player_price">Precio Player</Label>
              <Input
                id="edit-player_price"
                type="number"
                step="0.01"
                value={formData.player_price}
                onChange={(e) => setFormData({ ...formData, player_price: parseFloat(e.target.value) || 0 })}
                placeholder="129.99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-primary_color">Color Principal</Label>
              <Input
                id="edit-primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-is_active">Activo</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="edit-is_active">Producto disponible</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del producto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Tamaños Disponibles</Label>
            <div className="flex flex-wrap gap-2">
              {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-size-${size}`}
                    checked={formData.sizes.includes(size)}
                    onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                  />
                  <Label htmlFor={`edit-size-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imágenes del Producto</Label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  placeholder="URL de la imagen"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Imagen
            </Button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProduct}>
              Actualizar Producto
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
