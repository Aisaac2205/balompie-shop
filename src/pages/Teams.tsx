import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { useProducts } from "@/hooks/use-products";
import { useTeams } from "@/hooks/use-teams";
import { Users, Trophy, Calendar, Globe, Shirt } from "lucide-react";
import { normalizeImageUrl } from "@/utils/image-utils";

const Teams = () => {
  const { products } = useProducts();
  const { teams: apiTeams, isLoading } = useTeams();
  
  // Combine team data from database with product statistics
  const teams = apiTeams.map(team => {
    const teamProducts = products.filter(p => p.team === team.name);
    const normalizedLogoUrl = team.logoUrl ? normalizeImageUrl(team.logoUrl) : null;
    
    console.log('🔍 Procesando equipo:', {
      name: team.name,
      originalLogoUrl: team.logoUrl,
      normalizedLogoUrl,
      hasProducts: teamProducts.length > 0
    });
    
    return {
      ...team,
      productsCount: teamProducts.length,
      image: normalizedLogoUrl || teamProducts[0]?.images[0] || '/placeholder.svg'
    };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-8 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando equipos...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-black">
              Nuestros <span className="text-yellow-600 font-display">Equipos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora los mejores equipos europeos disponibles en nuestra tienda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {teams.map((team) => (
              <Card key={team.name} className="product-card cursor-pointer group bg-white border-gray-200 hover:border-yellow-500/40 shadow-lg hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                    <SmartImage 
                      src={team.image} 
                      alt={`${team.name} logo`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      fallbackSrc="/placeholder.svg"
                    />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 font-display text-black">{team.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Globe className="h-4 w-4 mr-2" />
                      {team.country} • {team.league}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Shirt className="h-4 w-4 mr-2" />
                      {team.productsCount} camisolas disponibles
                    </div>
                    
                    {team.achievements && team.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {team.achievements.slice(0, 2).map((achievement, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                            <Trophy className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                        {team.achievements.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{team.achievements.length - 2} más
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-2xl font-semibold mb-4 font-display text-black">Próximamente Más Equipos</h3>
                <p className="text-gray-600">
                  Estamos trabajando para agregar más equipos y ligas a nuestra colección. 
                  ¡Mantente atento a las novedades!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Teams;