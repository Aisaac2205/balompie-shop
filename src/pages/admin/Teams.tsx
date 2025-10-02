import { useState, useRef, useEffect } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { useProducts } from '@/hooks/use-products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Users, Shirt, Upload, Edit, Trash2, Globe, Trophy, ExternalLink, AlertCircle, HelpCircle } from 'lucide-react';
import { CreateTeamDto, Team } from '@/types/team';
import { normalizeImageUrl, normalizeImageUrlForStorage, validateImageUrl, getExampleTeamImages, diagnoseGoogleDriveUrl } from '@/utils/image-utils';
import { ImageUrlHelper } from '@/components/admin/ImageUrlHelper';
import { SmartImage } from '@/components/ui/smart-image';
import { DriveImageDisplay } from '@/components/ui/drive-image-display';
import { SimpleGoogleImage } from '@/components/ui/simple-google-image';
import { GoogleDriveEmbed } from '@/components/ui/google-drive-embed';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { TeamSquadManager } from '@/components/admin/TeamSquadManager';

const Teams = () => {
  const { teams, isLoading, createTeam, updateTeam, deleteTeam } = useTeams();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const objectUrlRef = useRef<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTeamDto>({
    name: '',
    country: '',
    league: '',
    logoUrl: '',
    primaryColor: '#000000',
    achievements: [],
    isActive: true
  });
  const [imageValidation, setImageValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    normalizedUrl: string;  // For display purposes (can be object URL or proxy)
    originalUrl: string;    // Original URL to save to database
  }>({
    isValidating: false,
    isValid: null,
    normalizedUrl: '',
    originalUrl: ''
  });
  const [showImageHelper, setShowImageHelper] = useState(false);
  
  // Estados para el diálogo de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Estado para el gestor de plantilla
  const [squadDialogOpen, setSquadDialogOpen] = useState(false);
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState<Team | null>(null);

  // Obtener estadísticas por equipo
  const getTeamStats = (teamName: string) => {
    const teamProducts = products.filter(p => p.team === teamName);
    return {
      totalProducts: teamProducts.length,
      activeProducts: teamProducts.filter(p => p.isActive).length,
      equipmentTypes: [...new Set(teamProducts.map(p => p.equipmentType))].length
    };
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // Validate image URL when it changes
  const handleImageUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, logoUrl: url }));
    
    if (!url.trim()) {
      setImageValidation({ isValidating: false, isValid: null, normalizedUrl: '', originalUrl: '' });
      return;
    }
    
    setImageValidation({ isValidating: true, isValid: null, normalizedUrl: '', originalUrl: url });
    
    console.log('🔄 Iniciando validación de imagen para:', url);
    
    // Diagnose Google Drive URLs specifically
    if (url.includes('drive.google.com')) {
      const diagnosis = diagnoseGoogleDriveUrl(url);
      console.log('🩺 Diagnóstico de Google Drive:', diagnosis);
      
      if (diagnosis.issues.length > 0) {
        console.warn('⚠️ Problemas detectados:', diagnosis.issues);
        console.log('💡 Recomendaciones:', diagnosis.recommendations);
      }
    }
    
    const validationResult = await validateImageUrl(url);
    
    console.log('📊 Resultado de validación:', validationResult);
    
    setImageValidation({ 
      isValidating: false, 
      isValid: validationResult.isValid, 
      normalizedUrl: validationResult.objectUrl || validationResult.finalUrl,
      originalUrl: url
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del equipo es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!formData.country.trim() || !formData.league.trim()) {
      toast({
        title: "Error", 
        description: "País y liga son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      // Normalize the URL for storage (standard format for database)
      const normalizedForStorage = normalizeImageUrlForStorage(formData.logoUrl);
      const dataToSave = {
        ...formData,
        logoUrl: normalizedForStorage
      };
      
      console.log('💾 Enviando datos al backend:', { 
        original: formData.logoUrl, 
        normalized: normalizedForStorage,
        dataToSave 
      });
      
      if (editingTeam) {
        await updateTeam(editingTeam, dataToSave);
        toast({
          title: "Éxito",
          description: "Equipo actualizado exitosamente",
        });
      } else {
        await createTeam(dataToSave);
        toast({
          title: "Éxito", 
          description: "Equipo creado exitosamente",
        });
      }
      
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el equipo",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    // Clean up object URL if it exists
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    
    setFormData({
      name: '',
      country: '',
      league: '',
      logoUrl: '',
      primaryColor: '#000000',
      achievements: [],
      isActive: true
    });
    setImageValidation({ isValidating: false, isValid: null, normalizedUrl: '', originalUrl: '' });
    setShowImageHelper(false);
    setEditingTeam(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (team: Team) => {
    setFormData({
      name: team.name,
      country: team.country,
      league: team.league,
      logoUrl: team.logoUrl || '',
      primaryColor: team.primaryColor,
      achievements: team.achievements || [],
      isActive: team.isActive
    });
    
    // Initialize image validation for existing logo
    if (team.logoUrl) {
      handleImageUrlChange(team.logoUrl);
    } else {
      setImageValidation({ isValidating: false, isValid: null, normalizedUrl: '', originalUrl: '' });
    }
    
    setEditingTeam(team.id);
    setIsDialogOpen(true);
  };

  // Abrir diálogo de confirmación para eliminar
  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleSquadClick = (team: Team) => {
    setSelectedTeamForSquad(team);
    setSquadDialogOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTeam(teamToDelete.id);
      toast({
        title: "✅ Éxito",
        description: `El equipo "${teamToDelete.name}" ha sido eliminado exitosamente`,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      setTeamToDelete(null);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: `No se pudo eliminar el equipo "${teamToDelete.name}"`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los equipos del catálogo ({filteredTeams.length} equipos)
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Equipo
        </Button>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map(team => {
          const stats = getTeamStats(team.name);
          
          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {team.logoUrl ? (
                      <SmartImage 
                        src={team.logoUrl} 
                        alt={team.name}
                        className="w-12 h-12 object-contain rounded-lg border"
                        width={48}
                        height={48}
                      />
                    ) : null}
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ 
                        backgroundColor: team.primaryColor, 
                        display: team.logoUrl ? 'none' : 'flex' 
                      }}
                    >
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Globe className="h-3 w-3 mr-1" />
                        {team.country} • {team.league}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSquadClick(team)}
                      className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      title="Gestionar plantilla"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(team)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(team)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
                    <div className="text-xs text-gray-500">Productos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
                    <div className="text-xs text-gray-500">Activos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.equipmentTypes}</div>
                    <div className="text-xs text-gray-500">Tipos</div>
                  </div>
                </div>

                {/* Logros */}
                {team.achievements && team.achievements.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">Logros</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.achievements.slice(0, 2).map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                      {team.achievements.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{team.achievements.length - 2} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Estado */}
                <div className="flex items-center justify-between">
                  <Badge variant={team.isActive ? "default" : "secondary"}>
                    {team.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: team.primaryColor }}
                    title="Color principal"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog para agregar/editar equipo */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Equipo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="FC Barcelona"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="España"
                />
              </div>
              <div>
                <Label htmlFor="league">Liga *</Label>
                <Input
                  id="league"
                  value={formData.league}
                  onChange={(e) => setFormData(prev => ({ ...prev, league: e.target.value }))}
                  placeholder="La Liga"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageHelper(!showImageHelper)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  {showImageHelper ? 'Ocultar ayuda' : 'Ayuda Google Drive'}
                </Button>
              </div>
              
              {showImageHelper && <ImageUrlHelper />}
              
              {/* Quick test button for the specific URL */}
              {showImageHelper && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium text-yellow-800 mb-2">🧪 Prueba Rápida - Tu URL:</p>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const testUrl = "https://drive.google.com/file/d/1n9l3fEBYhxG6DOm8YzJfT26lBbtDXaUq/view?usp=sharing";
                        handleImageUrlChange(testUrl);
                        toast({
                          title: "URL problemática aplicada",
                          description: "🧪 Probando tu URL que da error CORS - revisa la consola",
                        });
                      }}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      🚨 Probar URL que falla por CORS
                    </Button>
                    
                    {/* Pruebas con diferentes componentes - usando tu URL problemática */}
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs font-medium mb-2 text-green-800">🚀 SimpleGoogleImage (con iframe fallback):</p>
                        <SimpleGoogleImage 
                          src="https://drive.google.com/file/d/1n9l3fEBYhxG6DOm8YzJfT26lBbtDXaUq/view?usp=sharing"
                          alt="Test SimpleGoogleImage - URL problemática"
                          className="w-16 h-16 object-contain border rounded mx-auto"
                        />
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs font-medium mb-2 text-blue-800">🔧 DriveImageDisplay (thumbnail CORS-friendly):</p>
                        <DriveImageDisplay 
                          src="https://drive.google.com/file/d/1n9l3fEBYhxG6DOm8YzJfT26lBbtDXaUq/view?usp=sharing"
                          alt="Test DriveImageDisplay - URL problemática"
                          className="w-16 h-16 object-contain border rounded mx-auto"
                        />
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs font-medium mb-2 text-yellow-800">📋 Imagen HTML directa (fallará por CORS):</p>
                        <img 
                          src="https://drive.google.com/uc?export=view&id=1n9l3fEBYhxG6DOm8YzJfT26lBbtDXaUq"
                          alt="Imagen directa - URL problemática"
                          className="w-16 h-16 object-contain border rounded mx-auto"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          onLoad={() => console.log('✅ Imagen HTML directa funcionó')}
                          onError={() => console.log('❌ Imagen HTML directa falló por CORS')}
                        />
                      </div>
                      
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-xs font-medium mb-2 text-purple-800">🎯 GoogleDriveEmbed (iframe - NO CORS):</p>
                        <GoogleDriveEmbed 
                          src="https://drive.google.com/file/d/1n9l3fEBYhxG6DOm8YzJfT26lBbtDXaUq/view?usp=sharing"
                          alt="Test GoogleDriveEmbed - URL problemática"
                          className="mx-auto border rounded"
                          width={64}
                          height={64}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://drive.google.com/file/d/... o https://example.com/logo.png"
                className="mt-2"
              />
              
              {/* Image validation status */}
              {formData.logoUrl && (
                <div className="mt-2">
                  {imageValidation.isValidating && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Validando imagen...
                    </div>
                  )}
                  
                  {!imageValidation.isValidating && imageValidation.isValid === false && (
                    <div className="flex items-center text-sm text-red-600 mb-2">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      No se pudo cargar la imagen. Verifica la URL.
                    </div>
                  )}
                  
                  {!imageValidation.isValidating && imageValidation.isValid === true && (
                    <div className="flex items-center text-sm text-green-600 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Imagen válida
                      {imageValidation.normalizedUrl !== formData.logoUrl && (
                        <span className="ml-2 text-xs text-gray-500">(URL convertida automáticamente)</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Image preview */}
              {formData.logoUrl && imageValidation.isValid && (
                <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                  <SmartImage 
                    src={formData.logoUrl} 
                    alt="Preview"
                    className="w-16 h-16 object-contain mx-auto rounded"
                    width={64}
                    height={64}
                  />
                  <p className="text-xs text-center text-gray-500 mt-2">Vista previa del logo</p>
                </div>
              )}
              
              {/* Help text for Google Drive */}
              {formData.logoUrl && formData.logoUrl.includes('drive.google.com') && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="flex items-start">
                    <ExternalLink className="w-3 h-3 mt-0.5 mr-2 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800">Enlaces de Google Drive detectados</p>
                      <p className="text-blue-600 mt-1">
                        Los enlaces se convertirán automáticamente para mostrar la imagen correctamente.
                        Asegúrate de que el archivo tenga permisos de "Cualquier persona con el enlace puede ver".
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="primaryColor">Color Principal</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-12 h-10 rounded border"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="achievements">Logros (separados por comas)</Label>
              <Textarea
                id="achievements"
                value={formData.achievements?.join(', ') || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  achievements: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                }))}
                placeholder="Champions League, La Liga, Copa del Rey"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">Equipo activo</Label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingTeam ? 'Actualizar' : 'Crear'} Equipo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar Equipo"
        description="¿Estás seguro de que quieres eliminar este equipo? Esta acción eliminará permanentemente todos los datos asociados."
        itemName={teamToDelete?.name}
        isDeleting={isDeleting}
      />

      {/* Diálogo de gestión de plantilla */}
      <Dialog open={squadDialogOpen} onOpenChange={setSquadDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Plantilla</DialogTitle>
          </DialogHeader>
          {selectedTeamForSquad && (
            <TeamSquadManager 
              teamId={selectedTeamForSquad.id} 
              teamName={selectedTeamForSquad.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teams;