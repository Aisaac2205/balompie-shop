import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-black">404</h1>
        <p className="text-xl text-gray-600 mb-8">¡Oops! Página no encontrada</p>
        <a href="/">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Home className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
