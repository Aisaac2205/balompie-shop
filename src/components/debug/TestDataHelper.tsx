import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { CreatePlayerDto } from '@/types/player';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Plus, Trash2 } from 'lucide-react';

interface TestDataHelperProps {
  teamId: string;
  teamName: string;
}

const BARCELONA_PLAYERS: Omit<CreatePlayerDto, 'teamId'>[] = [
  { name: 'Ter Stegen', shirtNumber: 1, position: 'Portero', isActive: true },
  { name: 'Koundé', shirtNumber: 2, position: 'Defensa', isActive: true },
  { name: 'Balde', shirtNumber: 3, position: 'Defensa', isActive: true },
  { name: 'Araujo', shirtNumber: 4, position: 'Defensa', isActive: true },
  { name: 'Iñigo Martínez', shirtNumber: 5, position: 'Defensa', isActive: true },
  { name: 'Gavi', shirtNumber: 6, position: 'Centrocampista', isActive: true },
  { name: 'Ferran Torres', shirtNumber: 7, position: 'Delantero', isActive: true },
  { name: 'Pedri', shirtNumber: 8, position: 'Centrocampista', isActive: true },
  { name: 'Lewandowski', shirtNumber: 9, position: 'Delantero', isActive: true },
  { name: 'Ansu Fati', shirtNumber: 10, position: 'Delantero', isActive: true },
  { name: 'Raphinha', shirtNumber: 11, position: 'Delantero', isActive: true },
  { name: 'Héctor Fort', shirtNumber: 12, position: 'Defensa', isActive: true },
  { name: 'Iñaki Peña', shirtNumber: 13, position: 'Portero', isActive: true },
  { name: 'João Félix', shirtNumber: 14, position: 'Delantero', isActive: true },
  { name: 'Christensen', shirtNumber: 15, position: 'Defensa', isActive: true },
];

export const TestDataHelper: React.FC<TestDataHelperProps> = ({ teamId, teamName }) => {
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const createMultiplePlayers = useMutation({
    mutationFn: async () => {
      setIsCreating(true);
      const results = [];
      
      for (const playerData of BARCELONA_PLAYERS) {
        try {
          const result = await apiClient.createPlayer({
            ...playerData,
            teamId
          });
          results.push({ success: true, player: playerData.name });
        } catch (error) {
          results.push({ success: false, player: playerData.name, error });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: `✅ Plantilla creada`,
        description: `${successful} jugadores creados${failed > 0 ? `, ${failed} fallaron` : ''}`,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      
      // Invalidar queries para refrescar
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Error creating players:', error);
      toast({
        title: "❌ Error",
        description: "Error al crear la plantilla",
        variant: "destructive",
      });
      setIsCreating(false);
    }
  });

  const clearPlayers = useMutation({
    mutationFn: async () => {
      // Obtener jugadores actuales
      const currentPlayers = await apiClient.getPlayersByTeam(teamId);
      
      // Eliminar todos
      const results = [];
      for (const player of currentPlayers) {
        try {
          await apiClient.deletePlayer(player.id);
          results.push({ success: true, player: player.name });
        } catch (error) {
          results.push({ success: false, player: player.name, error });
        }
      }
      
      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      
      toast({
        title: `🗑️ Plantilla limpiada`,
        description: `${successful} jugadores eliminados`,
        className: "border-blue-200 bg-blue-50 text-blue-800",
      });
      
      // Invalidar queries para refrescar
      queryClient.invalidateQueries({ queryKey: ['players', teamId] });
    },
    onError: (error) => {
      console.error('Error clearing players:', error);
      toast({
        title: "❌ Error",
        description: "Error al limpiar la plantilla",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-yellow-800">
          <Users className="h-5 w-5 mr-2" />
          Helper: Datos de Prueba para {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-yellow-700">
          <p>Crea rápidamente una plantilla completa de {BARCELONA_PLAYERS.length} jugadores para pruebas.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {BARCELONA_PLAYERS.slice(0, 5).map(player => (
            <Badge key={player.shirtNumber} variant="outline" className="text-xs">
              #{player.shirtNumber} {player.name}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            +{BARCELONA_PLAYERS.length - 5} más...
          </Badge>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={() => createMultiplePlayers.mutate()}
            disabled={isCreating || createMultiplePlayers.isPending}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            size="sm"
          >
            {isCreating || createMultiplePlayers.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Crear Plantilla Completa
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => clearPlayers.mutate()}
            disabled={clearPlayers.isPending}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            {clearPlayers.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2" />
                Limpiando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Plantilla
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};