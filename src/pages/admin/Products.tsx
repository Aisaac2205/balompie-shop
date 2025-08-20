import { useState } from 'react';
import { useProducts, useProductMutations } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  Eye,
  Upload
} from 'lucide-react';
import { Product } from '@/types/product';
import { useProductState } from '@/hooks/use-products';

const Products = () => {
  const { data: products = [], isLoading } = useProducts();
  const { createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useProductMutations();
  const { product, updateProduct: updateLocalProduct, resetProduct } = useProductState();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || product.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  // Get unique teams
  const teams = [...new Set(products.map(p => p.team))];

  const handleCreateProduct = async () => {
    try {
      await createProduct(product as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
      setIsCreateDialogOpen(false);
      resetProduct();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await updateProduct({ id: editingProduct.id, updates: product });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetProduct();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    updateLocalProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      updateLocalProduct({ image: imageUrl });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetProduct()}
              className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo producto
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => updateLocalProduct({ name: e.target.value })}
                  placeholder="Camisola Local Barcelona 2024/25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Equipo</Label>
                <Input
                  id="team"
                  value={product.team}
                  onChange={(e) => updateLocalProduct({ team: e.target.value })}
                  placeholder="FC Barcelona"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={product.price}
                  onChange={(e) => updateLocalProduct({ price: Number(e.target.value) })}
                  placeholder="385"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="season">Temporada</Label>
                <Input
                  id="season"
                  value={product.season}
                  onChange={(e) => updateLocalProduct({ season: e.target.value })}
                  placeholder="2024/25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="competition">Competencia</Label>
                <Input
                  id="competition"
                  value={product.competition}
                  onChange={(e) => updateLocalProduct({ competition: e.target.value })}
                  placeholder="Liga Española"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={product.rating}
                  onChange={(e) => updateLocalProduct({ rating: Number(e.target.value) })}
                  placeholder="4.8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del producto..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Imagen del Producto</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {product.image && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProduct} disabled={isCreating}>
                {isCreating ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-800 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD100] focus:ring-[#FFD100]"
                />
              </div>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white focus:border-[#FFD100] focus:ring-[#FFD100]">
                <SelectValue placeholder="Filtrar por equipo" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="" className="text-white hover:bg-gray-700">Todos los equipos</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team} className="text-white hover:bg-gray-700">{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(product)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{product.team}</p>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">${product.price}</Badge>
                  <Badge variant="secondary">{product.season}</Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>⭐ {product.rating}</span>
                  <span>•</span>
                  <span>{product.reviews} reseñas</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-gray-900 border-gray-800 shadow-xl">
          <CardContent>
            <Package className="mx-auto h-16 w-16 text-[#FFD100] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || selectedTeam ? 'No se encontraron productos' : 'No hay productos'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedTeam 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer producto al catálogo'
              }
            </p>
            {!searchTerm && !selectedTeam && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Producto</Label>
              <Input
                id="edit-name"
                value={product.name}
                onChange={(e) => updateLocalProduct({ name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-team">Equipo</Label>
              <Input
                id="edit-team"
                value={product.team}
                onChange={(e) => updateLocalProduct({ team: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio</Label>
              <Input
                id="edit-price"
                type="number"
                value={product.price}
                onChange={(e) => updateLocalProduct({ price: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-season">Temporada</Label>
              <Input
                id="edit-season"
                value={product.season}
                onChange={(e) => updateLocalProduct({ season: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProduct} disabled={isUpdating}>
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
