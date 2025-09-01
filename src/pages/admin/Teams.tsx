import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
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
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  country: string;
  league: string;
  founded_year: number;
  achievements: string[];
  social_media: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  logo_url: string;
  primary_color: string;
  created_at?: string;
  updated_at?: string;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    league: '',
    founded_year: '',
    achievements: '',
    logo_url: '',
    primary_color: '#000000',
    social_media: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Cargar equipos desde el backend
  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams`);
      if (!response.ok) {
        throw new Error('Error al cargar equipos');
      }
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Crear nuevo equipo
  const handleCreateTeam = async () => {
    try {
      const achievementsArray = formData.achievements.split(',').map(a => a.trim()).filter(a => a);
      
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          achievements: achievementsArray,
          founded_year: parseInt(formData.founded_year)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear equipo');
      }

      toast({
        title: "Éxito",
        description: "Equipo creado correctamente",
      });

      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        country: '',
        league: '',
        founded_year: '',
        achievements: '',
        logo_url: '',
        primary_color: '#000000',
        social_media: {
          instagram: '',
          twitter: '',
          facebook: ''
        }
      });
      loadTeams();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo",
        variant: "destructive",
      });
    }
  };

  // Actualizar equipo
  const handleUpdateTeam = async () => {
    if (!editingTeam) return;

    try {
      const achievementsArray = formData.achievements.split(',').map(a => a.trim()).filter(a => a);
      
      const response = await fetch(`${API_BASE_URL}/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          achievements: achievementsArray,
          founded_year: parseInt(formData.founded_year)
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar equipo');
      }

      toast({
        title: "Éxito",
        description: "Equipo actualizado correctamente",
      });

      setIsEditDialogOpen(false);
      setEditingTeam(null);
      loadTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo",
        variant: "destructive",
      });
    }
  };

  // Eliminar equipo
  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar equipo');
      }

      toast({
        title: "Éxito",
        description: "Equipo eliminado correctamente",
      });

      loadTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el equipo",
        variant: "destructive",
      });
    }
  };

  // Abrir diálogo de edición
  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      country: team.country,
      league: team.league,
      founded_year: team.founded_year.toString(),
      achievements: team.achievements.join(', '),
      logo_url: team.logo_url,
      primary_color: team.primary_color,
      social_media: {
        instagram: team.social_media.instagram || '',
        twitter: team.social_media.twitter || '',
        facebook: team.social_media.facebook || ''
      }
    });
    setIsEditDialogOpen(true);
  };

  // Filtrar equipos por búsqueda
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.league.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Equipos</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona los equipos de fútbol</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
              <DialogDescription>
                Completa la información del equipo
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Equipo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Real Madrid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Ej: España"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="league">Liga</Label>
                <Input
                  id="league"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  placeholder="Ej: La Liga"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded_year">Año de Fundación</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                  placeholder="Ej: 1902"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL del Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://ejemplo.com/logo.png"
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
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="achievements">Logros (separados por comas)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Ej: 14 Champions League, 36 La Liga, 20 Copa del Rey"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_media.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, instagram: e.target.value }
                  })}
                  placeholder="@realmadrid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social_media.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, twitter: e.target.value }
                  })}
                  placeholder="@realmadrid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_media.facebook}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media: { ...formData.social_media, facebook: e.target.value }
                  })}
                  placeholder="realmadrid"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTeam}>
                Crear Equipo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
              {team.logo_url ? (
                <img
                  src={team.logo_url}
                  alt={`${team.name} logo`}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4" />
                    {team.country} • {team.league}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(team)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                  Fundado en {team.founded_year}
                </div>
                {team.achievements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Logros</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.achievements.slice(0, 3).map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                      {team.achievements.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{team.achievements.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {Object.values(team.social_media).some(social => social) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Redes sociales disponibles</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogDescription>
              Modifica la información del equipo
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre del Equipo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Real Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-country">País</Label>
              <Input
                id="edit-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Ej: España"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-league">Liga</Label>
              <Input
                id="edit-league"
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                placeholder="Ej: La Liga"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-founded_year">Año de Fundación</Label>
              <Input
                id="edit-founded_year"
                type="number"
                value={formData.founded_year}
                onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                placeholder="Ej: 1902"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo_url">URL del Logo</Label>
              <Input
                id="edit-logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://ejemplo.com/logo.png"
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
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="edit-achievements">Logros (separados por comas)</Label>
              <Textarea
                id="edit-achievements"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                placeholder="Ej: 14 Champions League, 36 La Liga, 20 Copa del Rey"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instagram">Instagram</Label>
              <Input
                id="edit-instagram"
                value={formData.social_media.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, instagram: e.target.value }
                })}
                placeholder="@realmadrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-twitter">Twitter</Label>
              <Input
                id="edit-twitter"
                value={formData.social_media.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, twitter: e.target.value }
                })}
                placeholder="@realmadrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facebook">Facebook</Label>
              <Input
                id="edit-facebook"
                value={formData.social_media.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_media: { ...formData.social_media, facebook: e.target.value }
                })}
                placeholder="realmadrid"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTeam}>
              Actualizar Equipo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;
