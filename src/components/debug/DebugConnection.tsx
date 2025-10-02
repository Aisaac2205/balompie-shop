import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Wifi, WifiOff } from 'lucide-react';
import { JerseyTestComponent } from './JerseyTestComponent';

export const DebugConnection: React.FC = () => {
  const { data: teams, isLoading: teamsLoading, error: teamsError, refetch: refetchTeams } = useQuery({
    queryKey: ['debug-teams'],
    queryFn: () => apiClient.getTeams(),
    retry: 1,
  });

  const { data: products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['debug-products'],
    queryFn: () => apiClient.getProducts(),
    retry: 1,
  });

  // Test player fetch for FC Barcelona if it exists
  const barcelonaTeam = teams?.find(team => team.name.toLowerCase().includes('barcelona'));
  const { data: players, isLoading: playersLoading, error: playersError, refetch: refetchPlayers } = useQuery({
    queryKey: ['debug-players', barcelonaTeam?.id],
    queryFn: () => barcelonaTeam ? apiClient.getPlayersByTeam(barcelonaTeam.id) : Promise.resolve([]),
    enabled: !!barcelonaTeam,
    retry: 1,
  });

  const handleRefreshAll = () => {
    refetchTeams();
    refetchProducts();
    if (barcelonaTeam) {
      refetchPlayers();
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🔧 Debug de Conexión Backend</h1>
        <Button onClick={handleRefreshAll} className="bg-blue-500 hover:bg-blue-600">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refrescar Todo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teams Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Database className="h-5 w-5 mr-2" />
              Equipos
              {teamsLoading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />
              ) : teamsError ? (
                <WifiOff className="h-4 w-4 ml-2 text-red-500" />
              ) : (
                <Wifi className="h-4 w-4 ml-2 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamsError ? (
              <div className="text-red-600 text-sm">
                <p className="font-medium">Error:</p>
                <p className="break-words">{(teamsError as Error).message}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {teams?.length || 0} equipos encontrados
                </Badge>
                {teams?.slice(0, 3).map(team => (
                  <div key={team.id} className="text-sm text-gray-600">
                    • {team.name} ({team.country})
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Database className="h-5 w-5 mr-2" />
              Productos
              {productsLoading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />
              ) : productsError ? (
                <WifiOff className="h-4 w-4 ml-2 text-red-500" />
              ) : (
                <Wifi className="h-4 w-4 ml-2 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsError ? (
              <div className="text-red-600 text-sm">
                <p className="font-medium">Error:</p>
                <p className="break-words">{(productsError as Error).message}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {products?.length || 0} productos encontrados
                </Badge>
                {products?.slice(0, 3).map(product => (
                  <div key={product.id} className="text-sm text-gray-600">
                    • {product.name} ({product.team})
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Players Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Database className="h-5 w-5 mr-2" />
              Jugadores
              {playersLoading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-2" />
              ) : playersError ? (
                <WifiOff className="h-4 w-4 ml-2 text-red-500" />
              ) : (
                <Wifi className="h-4 w-4 ml-2 text-green-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!barcelonaTeam ? (
              <div className="text-yellow-600 text-sm">
                <p>No se encontró FC Barcelona</p>
              </div>
            ) : playersError ? (
              <div className="text-red-600 text-sm">
                <p className="font-medium">Error:</p>
                <p className="break-words">{(playersError as Error).message}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {players?.length || 0} jugadores en Barcelona
                </Badge>
                {players?.slice(0, 3).map(player => (
                  <div key={player.id} className="text-sm text-gray-600">
                    • #{player.shirtNumber} {player.name} ({player.position})
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jersey Test Component */}
      <JerseyTestComponent />

      {/* Raw Data */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Datos Raw (para debugging)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Teams Response:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(teams, null, 2)}
              </pre>
            </div>
            
            {barcelonaTeam && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Players Response (Barcelona):</h4>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(players, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};