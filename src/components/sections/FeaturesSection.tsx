import { Card, CardContent } from "@/components/ui/card";
import { 
  Palette, 
  Truck, 
  Shield, 
  Crown, 
  Sparkles, 
  Clock 
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Personalización Completa",
    description: "Nombre, número y parches de Liga, Champions League, Mundial de Clubes y más."
  },
  {
    icon: Truck,
    title: "Envío Gratuito",
    description: "Envío gratuito en todos los pedidos. Entrega rápida en toda Guatemala."
  },
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description: "Camisolas 100% oficiales con garantía de autenticidad y calidad premium en todas las camisolas."
  },
  {
    icon: Crown,
    title: "Equipos de Elite",
    description: "Los mejores clubes del mundo: Barcelona, Real Madrid, City, PSG y más. En nuestra tienda encontrarás las camisolas de todos los equipos del mundo."
  },
  {
    icon: Sparkles,
    title: "Vista Previa en Tiempo Real",
    description: "Visualiza tu camisola personalizada antes de comprar con nuestra tecnología 3D."
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "Personalización y envío en 24-48 horas para que tengas tu camisola lo antes posible."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      {/* Título simple sin fondo repetitivo */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-black">
            ¿Por qué elegir 
            <span className="text-yellow-600 ml-2">
              COLECCIONES DE TEMPORADA?
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Somos la tienda líder en camisolas personalizadas con la mejor experiencia de compra online
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="product-card text-center border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-black">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}