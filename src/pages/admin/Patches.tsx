import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Plus, 
  Search, 
  Star,
  Award,
  Crown,
  Zap
} from 'lucide-react';

// Datos de ejemplo para parches (en el futuro vendrán del backend)
const mockPatches = [
  {
    id: '1',
    name: 'Liga Española',
    category: 'league',
    rarity: 'common',
    price: 15,
    image: '/api/placeholder/60/60',
    isActive: true
  },
  {
    id: '2',
    name: 'Champions League',
    category: 'cup',
    rarity: 'legendary',
    price: 35,
    image: '/api/placeholder/60/60',
    isActive: true
  },
  {
    id: '3',
    name: 'Mundial FIFA',
    category: 'international',
    rarity: 'epic',
    price: 25,
    image: '/api/placeholder/60/60',
    isActive: true
  },
  {
    id: '4',
    name: 'Copa del Rey',
    category: 'cup',
    rarity: 'rare',
    price: 20,
    image: '/api/placeholder/60/60',
    isActive: true
  }
];

const Patches = () => {
  const [patches] = useState(mockPatches);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatches = patches.filter(patch => 
    patch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-4 w-4" />;
      case 'rare': return <Award className="h-4 w-4" />;
      case 'epic': return <Crown className="h-4 w-4" />;
      case 'legendary': return <Zap className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'league': return 'Liga';
      case 'cup': return 'Copa';
      case 'international': return 'Internacional';
      case 'special': return 'Especial';
      default: return category;
    }
  };

  const handleAddPatch = () => {
    toast({
      title: "Próximamente",
      description: "La funcionalidad de agregar parches estará disponible pronto",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parches</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los parches disponibles para las camisolas ({filteredPatches.length} parches)
          </p>
        </div>
        <Button 
          onClick={handleAddPatch}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Parche
        </Button>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar parches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Parches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patches.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {patches.filter(p => p.isActive).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {[...new Set(patches.map(p => p.category))].length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Precio Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Q.{Math.round(patches.reduce((sum, p) => sum + p.price, 0) / patches.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Parches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPatches.map((patch) => (
          <Card key={patch.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gray-600" />
                </div>
                <Badge className={`${getRarityColor(patch.rarity)} border-0`}>
                  <span className="flex items-center">
                    {getRarityIcon(patch.rarity)}
                    <span className="ml-1 capitalize">{patch.rarity}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{patch.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {getCategoryLabel(patch.category)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    Q.{patch.price}
                  </span>
                  <Badge variant={patch.isActive ? "default" : "secondary"}>
                    {patch.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron parches' : 'No hay parches registrados'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Los parches permiten personalizar las camisolas con logos de competiciones'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={handleAddPatch}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Parche
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información sobre Parches */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre Parches</CardTitle>
          <CardDescription>
            Los parches son elementos decorativos que se pueden agregar a las camisolas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Categorías de Parches</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Liga:</strong> Parches de ligas nacionales</li>
                <li>• <strong>Copa:</strong> Competiciones de copa</li>
                <li>• <strong>Internacional:</strong> Torneos internacionales</li>
                <li>• <strong>Especial:</strong> Ediciones limitadas</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Niveles de Rareza</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Común:</strong> Parches básicos</li>
                <li>• <strong>Raro:</strong> Competiciones importantes</li>
                <li>• <strong>Épico:</strong> Torneos prestigiosos</li>
                <li>• <strong>Legendario:</strong> Eventos históricos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patches;