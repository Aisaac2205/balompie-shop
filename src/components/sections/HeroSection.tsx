import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shirt, Star, Trophy, Zap } from "lucide-react";
import camisolasBackground from "@/assets/camisolas-background.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${camisolasBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="animate-bounce-in">
          <Badge className="mb-6 accent-gradient text-balompie-black font-semibold px-4 py-2">
            <Trophy className="h-4 w-4 mr-2" />
            Tienda Oficial de Camisolas
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-display text-white">
            La Casa del
            <span className="block accent-gradient bg-gradient-to-r bg-clip-text text-transparent">
              Balompié
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
            Personaliza tu camisola favorita con nombre, número y parches oficiales.
            <br />
            <strong className="text-white">Los mejores equipos del mundo están aquí.</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="/shop">
              <Button className="btn-hero text-lg px-8 py-4 w-full sm:w-auto">
                <Shirt className="h-5 w-5 mr-2" />
                Explorar Camisolas
              </Button>
            </a>
            
            <a href="/teams">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-4 w-full sm:w-auto font-medium">
                <Zap className="h-5 w-5 mr-2" />
                Ver Equipos
              </Button>
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Star className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2 font-display text-white">Calidad Premium</h3>
              <p className="text-white/80">Camisolas oficiales con tecnología deportiva de última generación</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Shirt className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2 font-display text-white">Personalización Total</h3>
              <p className="text-white/80">Nombre, número y parches oficiales de todas las competiciones</p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2 font-display text-white">9 Equipos Top + Retros</h3>
              <p className="text-white/80">Barcelona, Real Madrid, Liverpool, Bayern Munich y colección retro exclusiva</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}