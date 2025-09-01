import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react';
import { Product } from '@/types/product';
import { formatPriceSimple } from '@/utils/currency';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
  teams: string[];
  equipmentTypes: { value: string; label: string }[];
  productTypes: { value: string; label: string }[];
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
  teams,
  equipmentTypes,
  productTypes
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !selectedTeam || product.team === selectedTeam;
    const matchesEquipment = !selectedEquipmentType || product.equipmentType === selectedEquipmentType;
    const matchesProductType = !selectedProductType || product.productType === selectedProductType;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive);

    return matchesSearch && matchesTeam && matchesEquipment && matchesProductType && matchesStatus;
  });

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      onDelete(productId);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTeam('');
    setSelectedEquipmentType('');
    setSelectedProductType('');
    setStatusFilter('all');
  };

  const getEquipmentTypeLabel = (value: string) => {
    return equipmentTypes.find(type => type.value === value)?.label || value;
  };

  const getProductTypeLabel = (value: string) => {
    return productTypes.find(type => type.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de camisolas ({filteredProducts.length} de {products.length})
          </p>
        </div>
        <Button onClick={onAddNew} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="h-5 w-5 text-yellow-600" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-gray-900"
              />
            </div>

            {/* Equipo */}
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Todos los equipos" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="" className="text-gray-900 hover:bg-yellow-50">
                  Todos los equipos
                </SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team} className="text-gray-900 hover:bg-yellow-50">
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tipo de Equipación */}
            <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Todas las equipaciones" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="" className="text-gray-900 hover:bg-yellow-50">
                  Todas las equipaciones
                </SelectItem>
                {equipmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-yellow-50">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tipo de Producto */}
            <Select value={selectedProductType} onValueChange={setSelectedProductType}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="" className="text-gray-900 hover:bg-yellow-50">
                  Todos los tipos
                </SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-yellow-50">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="all" className="text-gray-900 hover:bg-yellow-50">
                  Todos los estados
                </SelectItem>
                <SelectItem value="active" className="text-gray-900 hover:bg-yellow-50">
                  Activos
                </SelectItem>
                <SelectItem value="inactive" className="text-gray-900 hover:bg-yellow-50">
                  Inactivos
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limpiar filtros */}
          {(searchTerm || selectedTeam || selectedEquipmentType || selectedProductType || statusFilter !== 'all') && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Productos */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-sm animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-4">
              {products.length === 0 
                ? 'Aún no hay productos en el catálogo. Comienza agregando el primer producto.'
                : 'No hay productos que coincidan con los filtros aplicados.'
              }
            </p>
            {products.length === 0 && (
              <Button onClick={onAddNew} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactivo
                      </Badge>
                    )}
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${product.productType === 'player' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}
                    >
                      {getProductTypeLabel(product.productType)}
                    </Badge>
                  </div>
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
                      {getEquipmentTypeLabel(product.equipmentType)}
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
                      onClick={() => onEdit(product)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
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
  );
}
