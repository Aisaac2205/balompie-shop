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
  Globe,
  Trophy,
  Users,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  country: string;
  league: string;
  founded: string;
  description: string;
  logo: string;
  primaryColors: string[];
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Real Madrid',
      country: 'España',
      league: 'La Liga',
      founded: '1902',
      description: 'Club de fútbol español fundado en 1902, uno de los más exitosos del mundo.',
      logo: '/src/assets/equipos/realmadrid.png',
      primaryColors: ['#FFFFFF', '#00529F'],
      website: 'https://www.realmadrid.com',
      socialMedia: {
        instagram: '@realmadrid',
        twitter: '@realmadrid',
        facebook: 'realmadrid'
      },
      achievements: ['14 Champions League', '36 La Liga', '20 Copa del Rey'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'FC Barcelona',
      country: 'España',
      league: 'La Liga',
      founded: '1899',
      description: 'Club de fútbol catalán fundado en 1899, conocido por su estilo de juego.',
      logo: '/src/assets/equipos/barcelona.png',
      primaryColors: ['#A50044', '#004D98'],
      website: 'https://www.fcbarcelona.com',
      socialMedia: {
        instagram: '@fcbarcelona',
        twitter: '@fcbarcelona',
        facebook: 'fcbarcelona'
      },
      achievements: ['5 Champions League', '27 La Liga', '31 Copa del Rey'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: '3',
      name: 'Liverpool FC',
      country: 'Inglaterra',
      league: 'Premier League',
      founded: '1892',
      description: 'Club de fútbol inglés fundado en 1892, con una rica historia y tradición.',
      logo: '/src/assets/equipos/liverpool.png',
      primaryColors: ['#C8102E', '#00A398'],
      website: 'https://www.liverpoolfc.com',
      socialMedia: {
        instagram: '@liverpoolfc',
        twitter: '@LFC',
        facebook: 'liverpoolfc'
      },
      achievements: ['6 Champions League', '19 Premier League', '8 FA Cup'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: '',
    country: '',
    league: '',
    founded: '',
    description: '',
    logo: '',
    primaryColors: ['#FFFFFF', '#000000'],
    website: '',
    socialMedia: {},
    achievements: []
  });

  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.league.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || team.country === selectedCountry;
    const matchesLeague = !selectedLeague || team.league === selectedLeague;
    return matchesSearch && matchesCountry && matchesLeague;
  });

  // Get unique filter options
  const countries = [...new Set(teams.map(t => t.country))];
  const leagues = [...new Set(teams.map(t => t.league))];

  const handleCreateTeam = () => {
    if (newTeam.name && newTeam.country && newTeam.league) {
      const team: Team = {
        ...newTeam as Omit<Team, 'id' | 'createdAt' | 'updatedAt'>,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTeams([...teams, team]);
      setIsCreateDialogOpen(false);
      setNewTeam({
        name: '',
        country: '',
        league: '',
        founded: '',
        description: '',
        logo: '',
        primaryColors: ['#FFFFFF', '#000000'],
        website: '',
        socialMedia: {},
        achievements: []
      });
    }
  };

  const handleEditTeam = () => {
    if (editingTeam && newTeam.name && newTeam.country && newTeam.league) {
      const updatedTeam: Team = {
        ...editingTeam,
        ...newTeam,
        updatedAt: new Date()
      };
      setTeams(teams.map(t => t.id === editingTeam.id ? updatedTeam : t));
      setIsEditDialogOpen(false);
      setEditingTeam(null);
      setNewTeam({
        name: '',
        country: '',
        league: '',
        founded: '',
        description: '',
        logo: '',
        primaryColors: ['#FFFFFF', '#000000'],
        website: '',
        socialMedia: {},
        achievements: []
      });
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      setTeams(teams.filter(t => t.id !== teamId));
    }
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setNewTeam(team);
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewTeam({ ...newTeam, logo: imageUrl });
    }
  };

  const addAchievement = () => {
    const achievement = prompt('Ingresa un logro del equipo:');
    if (achievement && newTeam.achievements) {
      setNewTeam({
        ...newTeam,
        achievements: [...newTeam.achievements, achievement]
      });
    }
  };

  const removeAchievement = (index: number) => {
    if (newTeam.achievements) {
      setNewTeam({
        ...newTeam,
        achievements: newTeam.achievements.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestión de Equipos</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setNewTeam({
                name: '',
                country: '',
                league: '',
                founded: '',
                description: '',
                logo: '',
                primaryColors: ['#FFFFFF', '#000000'],
                website: '',
                socialMedia: {},
                achievements: []
              })}
              className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo equipo
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Equipo *</Label>
                <Input
                  id="name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="Real Madrid"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={newTeam.country}
                  onChange={(e) => setNewTeam({ ...newTeam, country: e.target.value })}
                  placeholder="España"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="league">Liga *</Label>
                <Input
                  id="league"
                  value={newTeam.league}
                  onChange={(e) => setNewTeam({ ...newTeam, league: e.target.value })}
                  placeholder="La Liga"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="founded">Año de Fundación</Label>
                <Input
                  id="founded"
                  value={newTeam.founded}
                  onChange={(e) => setNewTeam({ ...newTeam, founded: e.target.value })}
                  placeholder="1902"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                placeholder="Descripción del equipo..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={newTeam.website}
                  onChange={(e) => setNewTeam({ ...newTeam, website: e.target.value })}
                  placeholder="https://www.equipo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo del Equipo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  {newTeam.logo && (
                    <div className="w-20 h-20 border rounded-lg overflow-hidden">
                      <img 
                        src={newTeam.logo} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Logros del Equipo</Label>
              <div className="space-y-2">
                {newTeam.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-[#FFD100]" />
                    <span className="text-sm text-white">{achievement}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAchievement(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                  className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Logro
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTeam} disabled={!newTeam.name || !newTeam.country || !newTeam.league}>
                Crear Equipo
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
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD100] focus:ring-[#FFD100]"
                />
              </div>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white focus:border-[#FFD100] focus:ring-[#FFD100]">
                <SelectValue placeholder="Filtrar por país" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="" className="text-white hover:bg-gray-700">Todos los países</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country} className="text-white hover:bg-gray-700">{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white focus:border-[#FFD100] focus:ring-[#FFD100]">
                <SelectValue placeholder="Filtrar por liga" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="" className="text-white hover:bg-gray-700">Todas las ligas</SelectItem>
                {leagues.map((league) => (
                  <SelectItem key={league} value={league} className="text-white hover:bg-gray-700">{league}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden bg-gray-900 border-gray-800 shadow-xl">
              <div className="aspect-square bg-gray-100 relative">
                {team.logo ? (
                  <img 
                    src={team.logo} 
                    alt={team.name}
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
                    onClick={() => openEditDialog(team)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2">
                  {team.name}
                </h3>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Globe className="h-3 w-3" />
                    <span>{team.country}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Trophy className="h-3 w-3" />
                    <span>{team.league}</span>
                  </div>
                  {team.founded && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Users className="h-3 w-3" />
                      <span>Fundado {team.founded}</span>
                    </div>
                  )}
                </div>
                
                {team.achievements && team.achievements.length > 0 && (
                  <div className="mb-3">
                    <Badge variant="outline" className="text-xs border-[#FFD100] text-[#FFD100]">
                      {team.achievements.length} logros
                    </Badge>
                  </div>
                )}
                
                {team.description && (
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {team.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-gray-900 border-gray-800 shadow-xl">
          <CardContent>
            <Shield className="mx-auto h-16 w-16 text-[#FFD100] mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm || selectedCountry || selectedLeague ? 'No se encontraron equipos' : 'No hay equipos'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedCountry || selectedLeague 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer equipo al catálogo'
              }
            </p>
            {!searchTerm && !selectedCountry && !selectedLeague && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-[#FFD100] to-[#FFB800] text-black font-semibold hover:from-[#FFB800] hover:to-[#FFD100] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Equipo
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogDescription>
              Modifica la información del equipo
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Equipo *</Label>
              <Input
                id="edit-name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-country">País *</Label>
              <Input
                id="edit-country"
                value={newTeam.country}
                onChange={(e) => setNewTeam({ ...newTeam, country: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-league">Liga *</Label>
              <Input
                id="edit-league"
                value={newTeam.league}
                onChange={(e) => setNewTeam({ ...newTeam, league: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-founded">Año de Fundación</Label>
              <Input
                id="edit-founded"
                value={newTeam.founded}
                onChange={(e) => setNewTeam({ ...newTeam, founded: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción</Label>
            <Textarea
              id="edit-description"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Logros del Equipo</Label>
            <div className="space-y-2">
              {newTeam.achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-[#FFD100]" />
                  <span className="text-sm text-white">{achievement}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAchievement(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addAchievement}
                className="border-[#FFD100] text-[#FFD100] hover:bg-[#FFD100] hover:text-black"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Logro
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditTeam} disabled={!newTeam.name || !newTeam.country || !newTeam.league}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;
