import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { JerseysShowcase } from "@/components/sections/JerseysShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <JerseysShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
