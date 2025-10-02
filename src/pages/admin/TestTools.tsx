import { ImageUrlTester } from '@/components/admin/ImageUrlTester';

export default function TestTools() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Herramientas de Prueba</h1>
          <p className="text-muted-foreground mt-2">
            Herramientas para probar funcionalidades del sistema
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Probador de URLs de Imágenes</h2>
            <ImageUrlTester />
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">URLs de Ejemplo</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Logos de Equipos</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Barcelona: Busca logo oficial en Google Drive</li>
                  <li>• Real Madrid: Busca logo oficial en Google Drive</li>
                  <li>• Manchester City: Busca logo oficial en Google Drive</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Imágenes de Productos</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Camisetas locales: Busca imágenes en Google Drive</li>
                  <li>• Camisetas visitantes: Busca imágenes en Google Drive</li>
                  <li>• Camisetas tercera equipación: Busca imágenes en Google Drive</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚡ Configuración Rápida</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p><strong>1. Backend:</strong> Ejecutándose en http://localhost:5000</p>
              <p><strong>2. Frontend:</strong> Ejecutándose en http://localhost:8080</p>
              <p><strong>3. Base de datos:</strong> Railway PostgreSQL ✅ Conectada</p>
              <p><strong>4. Imágenes:</strong> URLs públicas (Google Drive recomendado)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}