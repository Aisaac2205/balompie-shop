import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateImageUrl } from '@/services/api';

export function ImageUrlTester() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    processedUrl?: string;
    originalUrl?: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!url.trim()) {
      setResult({
        success: false,
        message: 'Por favor ingresa una URL',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await validateImageUrl(url);
      setResult({
        success: true,
        processedUrl: response.url,
        originalUrl: response.originalUrl,
        message: response.message,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error al validar la URL',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    // URL de ejemplo de Google Drive (reemplazar por una real)
    setUrl('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Probador de URLs de Imágenes</CardTitle>
        <CardDescription>
          Prueba URLs de Google Drive o imágenes públicas para usar en los productos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="https://drive.google.com/file/d/... o https://ejemplo.com/imagen.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={handleTest} disabled={isLoading}>
            {isLoading ? 'Probando...' : 'Probar'}
          </Button>
        </div>
        
        <Button variant="outline" onClick={handleUseSample} className="w-full">
          Usar URL de ejemplo
        </Button>

        {result && (
          <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription>
              <div className="space-y-2">
                <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </p>
                {result.success && result.processedUrl && (
                  <div className="space-y-2">
                    <div>
                      <strong>URL Original:</strong>
                      <p className="text-sm text-gray-600 break-all">{result.originalUrl}</p>
                    </div>
                    <div>
                      <strong>URL Procesada:</strong>
                      <p className="text-sm text-gray-600 break-all">{result.processedUrl}</p>
                    </div>
                    <div className="mt-4">
                      <strong>Vista previa:</strong>
                      <img
                        src={result.processedUrl}
                        alt="Vista previa"
                        className="mt-2 max-w-full h-auto max-h-48 rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'text-red-500 text-sm mt-2';
                          errorDiv.textContent = 'No se pudo cargar la imagen. Verifica que la URL sea pública.';
                          target.parentNode?.appendChild(errorDiv);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Consejos para Google Drive:</h4>
          <ul className="text-sm space-y-1 text-blue-800">
            <li>1. Sube tu imagen a Google Drive</li>
            <li>2. Haz clic derecho → "Obtener enlace"</li>
            <li>3. Cambia los permisos a "Cualquier persona con el enlace"</li>
            <li>4. Copia el enlace y pégalo aquí</li>
            <li>5. El sistema convertirá automáticamente la URL para mostrar la imagen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}