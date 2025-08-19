import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { JerseysShowcase } from "@/components/sections/JerseysShowcase";
import { FeaturesSection } from "@/components/sections/FeaturesSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <JerseysShowcase />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
