import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { extendedMockProducts } from "@/data/extendedMockProducts";
import { Users, Trophy, Calendar } from "lucide-react";

const Teams = () => {
  // Get unique teams with their info
  const teams = Array.from(new Set(extendedMockProducts.map(p => p.team)))
    .map(teamName => {
      const teamProducts = extendedMockProducts.filter(p => p.team === teamName);
      const leagues = Array.from(new Set(teamProducts.map(p => p.competition)));
      return {
        name: teamName,
        productsCount: teamProducts.length,
        leagues,
        image: teamProducts[0]?.image
      };
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Nuestros <span className="accent-gradient bg-gradient-to-r bg-clip-text text-transparent font-display">Equipos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora los mejores equipos europeos disponibles en nuestra tienda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {teams.map((team) => (
              <Card key={team.name} className="product-card cursor-pointer group">
                <CardContent className="p-6">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-muted/30">
                    <img 
                      src={team.image} 
                      alt={`${team.name} jersey`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 font-display">{team.name}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {team.productsCount} camisolas disponibles
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {team.leagues.map((league) => (
                        <Badge key={league} variant="secondary" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          {league}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-accent" />
                <h3 className="text-2xl font-semibold mb-4 font-display">Próximamente Más Equipos</h3>
                <p className="text-muted-foreground">
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