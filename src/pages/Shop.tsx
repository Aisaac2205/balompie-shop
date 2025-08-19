import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LogoWatermark } from "@/components/layout/LogoWatermark";

const Shop = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <LogoWatermark />
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Tienda de <span className="accent-gradient bg-gradient-to-r bg-clip-text text-transparent font-display">Camisolas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre las mejores camisolas de fútbol con personalización completa
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;