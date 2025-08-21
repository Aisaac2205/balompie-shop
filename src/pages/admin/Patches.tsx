import { useState } from 'react';
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
  Shield,
  Star,
  Tag,
  Image as ImageIcon,
  Upload,
  Globe
} from 'lucide-react';

interface Patch {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'league' | 'cup' | 'international' | 'special' | 'custom';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  available: boolean;
  stock: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Patches = () => {
  const [patches, setPatches] = useState<Patch[]>([
    {
      id: '1',
      name: 'Champions League 2024/25',
      description: 'Parche oficial de la UEFA Champions League para la temporada 2024/25',
      price: 25.00,
      image: '/src/assets/placeholder.svg',
      category: 'international',
      rarity: 'epic',
      available: true,
      stock: 50,
      tags: ['Champions League', 'UEFA', 'Oficial', '2024/25'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'La Liga Santander',
      description: 'Parche oficial de La Liga Santander para equipos españoles',
      price: 18.00,
      image: '/src/assets/placeholder.svg',
      category: 'league',
      rarity: 'common',
      available: true,
      stock: 100,
      tags: ['La Liga', 'España', 'Oficial'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Premier League',
      description: 'Parche oficial de la Premier League inglesa',
      price: 20.00,
      image: '/src/assets/placeholder.svg',
      category: 'league',
      rarity: 'common',
      available: true,
      stock: 75,
      tags: ['Premier League', 'Inglaterra', 'Oficial'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPatch, setEditingPatch] = useState<Patch | null>(null);
  const [newPatch, setNewPatch] = useState<Partial<Patch>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'league',
    rarity: 'common',
    available: true,
    stock: 0,
    tags: []
  });

  // Filter patches
  const filteredPatches = patches.filter(patch => {
    const matchesSearch = patch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patch.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || patch.category === selectedCategory;
    const matchesRarity = !selectedRarity || patch.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const handleCreatePatch = () => {
    if (newPatch.name && newPatch.description && newPatch.price > 0) {
      const patch: Patch = {
        ...newPatch as Omit<Patch, 'id' | 'createdAt' | 'updatedAt'>,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setPatches([...patches, patch]);
      setIsCreateDialogOpen(false);
      setNewPatch({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: 'league',
        rarity: 'common',
        available: true,
        stock: 0,
        tags: []
      });
    }
  };

  const handleEditPatch = () => {
    if (editingPatch && newPatch.name && newPatch.description && newPatch.price > 0) {
      const updatedPatch: Patch = {
        ...editingPatch,
        ...newPatch,
        updatedAt: new Date()
      };
      setPatches(patches.map(p => p.id === editingPatch.id ? updatedPatch : p));
      setIsEditDialogOpen(false);
      setEditingPatch(null);
      setNewPatch({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: 'league',
        rarity: 'common',
        available: true,
        stock: 0,
        tags: []
      });
    }
  };

  const handleDeletePatch = (patchId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este parche?')) {
      setPatches(patches.filter(p => p.id !== patchId));
    }
  };

  const openEditDialog = (patch: Patch) => {
    setEditingPatch(patch);
    setNewPatch(patch);
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewPatch({ ...newPatch, image: imageUrl });
    }
  };

  const addTag = () => {
    const tag = prompt('Ingresa una etiqueta:');
    if (tag && newPatch.tags) {
      setNewPatch({
        ...newPatch,
        tags: [...newPatch.tags, tag]
      });
    }
  };

  const removeTag = (index: number) => {
    if (newPatch.tags) {
      setNewPatch({
        ...newPatch,
        tags: newPatch.tags.filter((_, i) => i !== index)
      });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'league': return <Shield className="h-4 w-4" />;
      case 'cup': return <Star className="h-4 w-4" />;
      case 'international': return <Globe className="h-4 w-4" />;
      case 'special': return <Tag className="h-4 w-4" />;
      case 'custom': return <ImageIcon className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestión de Parches</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setNewPatch({
                name: '',
                description: '',
                price: 0,
                image: '',
                category: 'league',
                rarity: 'common',
                available: true,
                stock: 0,
                tags: []
              })}
              className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Parche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Parche</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo parche
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Parche *</Label>
                <Input
                  id="name"
                  value={newPatch.name}
                  onChange={(e) => setNewPatch({ ...newPatch, name: e.target.value })}
                  placeholder="Champions League 2024/25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPatch.price}
                  onChange={(e) => setNewPatch({ ...newPatch, price: Number(e.target.value) })}
                  placeholder="25.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={newPatch.category} onValueChange={(value: any) => setNewPatch({ ...newPatch, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="league">Liga</SelectItem>
                    <SelectItem value="cup">Copa</SelectItem>
                    <SelectItem value="international">Internacional</SelectItem>
                    <SelectItem value="special">Especial</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rarity">Rareza *</Label>
                <Select value={newPatch.rarity} onValueChange={(value: any) => setNewPatch({ ...newPatch, rarity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Común</SelectItem>
                    <SelectItem value="rare">Raro</SelectItem>
                    <SelectItem value="epic">Épico</SelectItem>
                    <SelectItem value="legendary">Legendario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={newPatch.stock}
                  onChange={(e) => setNewPatch({ ...newPatch, stock: Number(e.target.value) })}
                  placeholder="50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Disponible</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newPatch.available}
                    onChange={(e) => setNewPatch({ ...newPatch, available: e.target.checked })}
                    className="rounded border-gray-300 text-[#FFD100] focus:ring-[#FFD100]"
                  />
                  <span className="text-sm text-white">Disponible para venta</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={newPatch.description}
                onChange={(e) => setNewPatch({ ...newPatch, description: e.target.value })}
                placeholder="Descripción del parche..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Imagen del Parche</Label>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                {newPatch.image && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden">
                    <img 
                      src={newPatch.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <div className="space-y-2">
                {newPatch.tags?.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTag(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Etiqueta
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePatch} disabled={!newPatch.name || !newPatch.description || newPatch.price <= 0}>
                Crear Parche
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
                  placeholder="Buscar parches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD100] focus:ring-[#FFD100]"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white focus:border-[#FFD100] focus:ring-[#FFD100]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="" className="text-white hover:bg-gray-700">Todas las categorías</SelectItem>
                <SelectItem value="league" className="text-white hover:bg-gray-700">Liga</SelectItem>
                <SelectItem value="cup" className="text-white hover:bg-gray-700">Copa</SelectItem>
                <SelectItem value="international" className="text-white hover:bg-gray-700">Internacional</SelectItem>
                <SelectItem value="special" className="text-white hover:bg-gray-700">Especial</SelectItem>
                <SelectItem value="custom" className="text-white hover:bg-gray-700">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white focus:border-[#FFD100] focus:ring-[#FFD100]">
                <SelectValue placeholder="Filtrar por rareza" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="" className="text-white hover:bg-gray-700">Todas las rarezas</SelectItem>
                <SelectItem value="common" className="text-white hover:bg-gray-700">Común</SelectItem>
                <SelectItem value="rare" className="text-white hover:bg-gray-700">Raro</SelectItem>
                <SelectItem value="epic" className="text-white hover:bg-gray-700">Épico</SelectItem>
                <SelectItem value="legendary" className="text-white hover:bg-gray-700">Legendario</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patches Grid */}
      {filteredPatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatches.map((patch) => (
            <Card key={patch.id} className="overflow-hidden bg-gray-900 border-gray-800 shadow-xl">
              <div className="aspect-square bg-gray-100 relative">
                {patch.image ? (
                  <img 
                    src={patch.image} 
                    alt={patch.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Shield className="h-16 w-16 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditDialog(patch)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePatch(patch.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(patch.rarity)}`}
                  >
                    {patch.rarity}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-white line-clamp-2 flex-1">
                    {patch.name}
                  </h3>
                  <Badge variant="outline" className="text-[#FFD100] border-[#FFD100] ml-2">
                    Q{patch.price}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    {getCategoryIcon(patch.category)}
                    <span className="capitalize">{patch.category}</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-gray-400">Stock: {patch.stock}</span>
                </div>
                
                {patch.description && (
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {patch.description}
                  </p>
                )}
                
                {patch.tags && patch.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {patch.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {patch.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{patch.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${patch.available ? 'text-green-400' : 'text-red-400'}`}>
                      {patch.available ? 'Disponible' : 'No disponible'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {patch.id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-gray-900 border-gray-800 shadow-xl">
          <CardContent>
            <Shield className="mx-auto h-16 w-16 text-[#FFD100] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || selectedCategory || selectedRarity ? 'No se encontraron parches' : 'No hay parches'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedCategory || selectedRarity 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer parche al catálogo'
              }
            </p>
            {!searchTerm && !selectedCategory && !selectedRarity && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Parche
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Parche</DialogTitle>
            <DialogDescription>
              Modifica la información del parche
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Parche *</Label>
              <Input
                id="edit-name"
                value={newPatch.name}
                onChange={(e) => setNewPatch({ ...newPatch, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Precio *</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                value={newPatch.price}
                onChange={(e) => setNewPatch({ ...newPatch, price: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría *</Label>
              <Select value={newPatch.category} onValueChange={(value: any) => setNewPatch({ ...newPatch, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="league">Liga</SelectItem>
                  <SelectItem value="cup">Copa</SelectItem>
                  <SelectItem value="international">Internacional</SelectItem>
                  <SelectItem value="special">Especial</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-rarity">Rareza *</Label>
              <Select value={newPatch.rarity} onValueChange={(value: any) => setNewPatch({ ...newPatch, rarity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Común</SelectItem>
                  <SelectItem value="rare">Raro</SelectItem>
                  <SelectItem value="epic">Épico</SelectItem>
                  <SelectItem value="legendary">Legendario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción *</Label>
            <Textarea
              id="edit-description"
              value={newPatch.description}
              onChange={(e) => setNewPatch({ ...newPatch, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Etiquetas</Label>
            <div className="space-y-2">
              {newPatch.tags?.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTag(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Etiqueta
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPatch} disabled={!newPatch.name || !newPatch.description || newPatch.price <= 0}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patches;
