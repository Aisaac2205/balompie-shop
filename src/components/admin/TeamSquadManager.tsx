import React, { useState } from 'react';
import { usePlayers, useAdminPlayers } from '@/hooks/use-players';
import { Player, CreatePlayerDto } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { TestDataHelper } from '@/components/debug/TestDataHelper';
import { Plus, Edit, Trash2, Users, Shirt } from 'lucide-react';

interface TeamSquadManagerProps {
  teamId: string;
  teamName: string;
}

const POSITIONS = [
  'Portero',
  'Defensa', 
  'Centrocampista',
  'Delantero'
] as const;

export const TeamSquadManager: React.FC<TeamSquadManagerProps> = ({ teamId, teamName }) => {
  const { players, isLoading } = usePlayers(teamId);
  const { createPlayer, updatePlayer, deletePlayer, isCreating, isUpdating, isDeleting } = useAdminPlayers(teamId);
  
  console.log('🏟️ TeamSquadManager:', { teamId, teamName, playersCount: players.length, isLoading });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  
  const [formData, setFormData] = useState<CreatePlayerDto>({
    teamId,
    name: '',
    shirtNumber: 1,
    position: 'Delantero',
    isActive: true
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      teamId,
      name: '',
      shirtNumber: 1,
      position: 'Delantero',
      isActive: true
    });
    setEditingPlayer(null);
  };

  // Handle add new player
  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Handle edit player
  const handleEdit = (player: Player) => {
    setFormData({
      teamId: player.teamId,
      name: player.name,
      shirtNumber: player.shirtNumber,
      position: player.position,
      isActive: player.isActive
    });
    setEditingPlayer(player);
    setIsDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    
    try {
      const result = await deletePlayer(playerToDelete.id);
      if (result.success) {
        toast({
          title: "✅ Éxito",
          description: `El jugador "${playerToDelete.name}" ha sido eliminado exitosamente`,
          className: "border-green-200 bg-green-50 text-green-800",
        });
      } else {
        toast({
          title: "❌ Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setPlayerToDelete(null);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: `No se pudo eliminar el jugador "${playerToDelete.name}"`,
        variant: "destructive",
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 TeamSquadManager: Submitting form...', { formData, editingPlayer: !!editingPlayer });
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "❌ Error",
        description: "El nombre del jugador es obligatorio",
        variant: "destructive",
      });
      return;
    }

    // Check if shirt number already exists (excluding current player if editing)
    const existingPlayer = players.find(p => 
      p.shirtNumber === formData.shirtNumber && 
      p.id !== editingPlayer?.id
    );
    
    if (existingPlayer) {
      toast({
        title: "❌ Error",
        description: `El dorsal ${formData.shirtNumber} ya está asignado a ${existingPlayer.name}`,
        variant: "destructive",
      });
      return;
    }

    try {
      let result;
      if (editingPlayer) {
        console.log('📝 TeamSquadManager: Updating player...', editingPlayer.id);
        result = await updatePlayer(editingPlayer.id, formData);
      } else {
        console.log('🆕 TeamSquadManager: Creating new player...');
        result = await createPlayer(formData);
      }

      console.log('✅ TeamSquadManager: Operation result:', result);

      if (result.success) {
        toast({
          title: "✅ Éxito",
          description: result.message,
          className: "border-green-200 bg-green-50 text-green-800",
        });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "❌ Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ TeamSquadManager: Unexpected error:', error);
      toast({
        title: "❌ Error",
        description: "Error inesperado al guardar el jugador",
        variant: "destructive",
      });
    }
  };

  // Group players by position
  const playersByPosition = POSITIONS.reduce((acc, position) => {
    acc[position] = players.filter(p => p.position === position && p.isActive);
    return acc;
  }, {} as Record<typeof POSITIONS[number], Player[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Data Helper - Solo mostrar si no hay jugadores */}
      {players.length === 0 && (
        <TestDataHelper teamId={teamId} teamName={teamName} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Plantilla de {teamName}</h3>
            <p className="text-sm text-gray-500">{players.length} jugadores registrados</p>
          </div>
        </div>
        <Button onClick={handleAddNew} className="bg-yellow-500 hover:bg-yellow-600">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Jugador
        </Button>
      </div>

      {/* Players by Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {POSITIONS.map(position => (
          <Card key={position}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                {position}s ({playersByPosition[position].length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {playersByPosition[position].length === 0 ? (
                <p className="text-xs text-gray-400 italic">No hay jugadores</p>
              ) : (
                playersByPosition[position]
                  .sort((a, b) => a.shirtNumber - b.shirtNumber)
                  .map(player => (
                    <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {player.shirtNumber}
                        </Badge>
                        <span className="text-sm font-medium truncate">{player.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(player)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(player)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Player Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlayer ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Jugador</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Araujo"
                required
              />
            </div>

            <div>
              <Label htmlFor="shirtNumber">Dorsal</Label>
              <Input
                id="shirtNumber"
                type="number"
                min="1"
                max="99"
                value={formData.shirtNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, shirtNumber: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="position">Posición</Label>
              <Select
                value={formData.position}
                onValueChange={(value: typeof POSITIONS[number]) => 
                  setFormData(prev => ({ ...prev, position: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(position => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isCreating || isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {editingPlayer ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <Shirt className="h-4 w-4 mr-2" />
                    {editingPlayer ? 'Actualizar Jugador' : 'Crear Jugador'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Eliminar Jugador"
        description="¿Estás seguro de que quieres eliminar este jugador de la plantilla? Esta acción no se puede deshacer."
        itemName={playerToDelete ? `${playerToDelete.name} (#${playerToDelete.shirtNumber})` : undefined}
        isDeleting={isDeleting}
      />
    </div>
  );
};