import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export const ImageUrlHelper = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const exampleDriveUrl = "https://drive.google.com/file/d/1txSWmDTYs4w4e4R45CX4NiDULPh5TRmb/view?usp=sharing";
  const convertedUrl = "https://drive.google.com/uc?id=1txSWmDTYs4w4e4R45CX4NiDULPh5TRmb";

  const copyToClipboard = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast({
        title: "Copiado!",
        description: `${type} copiada al portapapeles`,
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar la URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center">
        <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="font-semibold text-blue-800">Guía para URLs de Google Drive</h3>
      </div>
      
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-blue-800 mb-1">1. URL de compartir (NO funciona directamente):</p>
          <div className="flex items-center space-x-2 p-2 bg-white border rounded">
            <code className="flex-1 text-xs break-all text-gray-700">{exampleDriveUrl}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(exampleDriveUrl, "URL original")}
              className="flex-shrink-0"
            >
              {copiedUrl === exampleDriveUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        <div>
          <p className="font-medium text-green-800 mb-1">2. URL convertida (SÍ funciona):</p>
          <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded">
            <code className="flex-1 text-xs break-all text-green-700">{convertedUrl}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(convertedUrl, "URL convertida")}
              className="flex-shrink-0"
            >
              {copiedUrl === convertedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-200">
          <p className="font-medium text-blue-800 mb-2">✅ La conversión es automática:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Pega cualquier URL de Google Drive</li>
            <li>• Se convertirá automáticamente al formato correcto</li>
            <li>• Verás una vista previa si la imagen se carga correctamente</li>
          </ul>
        </div>
        
        <div className="pt-2 border-t border-yellow-200 bg-yellow-50 p-3 rounded">
          <p className="font-medium text-yellow-800 mb-2">⚠️ IMPORTANTE - Permisos de Google Drive:</p>
          <ol className="space-y-1 text-yellow-700 text-xs">
            <li><strong>1.</strong> Abre tu archivo en Google Drive</li>
            <li><strong>2.</strong> Haz clic derecho → "Compartir"</li>
            <li><strong>3.</strong> Cambia a "Cualquier persona con el enlace"</li>
            <li><strong>4.</strong> Asegúrate de que sea "Viewer" (Visualizador)</li>
            <li><strong>5.</strong> Copia el enlace y úsalo aquí</li>
          </ol>
        </div>
      </div>
    </div>
  );
};