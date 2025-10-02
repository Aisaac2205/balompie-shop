import React, { useState } from 'react';

interface GoogleDriveEmbedProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Componente que muestra imágenes de Google Drive usando iframe embed
 * Este método evita completamente los problemas de CORS y rate limiting
 */
export const GoogleDriveEmbed: React.FC<GoogleDriveEmbedProps> = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 400
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    let fileId: string | null = null;
    
    // Método 1: URL estándar de Google Drive (/file/d/)
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      fileId = driveMatch[1];
    }
    
    // Método 2: URL de Google User Content (lh3.googleusercontent.com)
    if (!fileId) {
      const userContentMatch = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
      if (userContentMatch) {
        fileId = userContentMatch[1];
      }
    }
    
    // Método 3: URL con parámetro id= 
    if (!fileId) {
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch) {
        fileId = idMatch[1];
      }
    }
    
    if (fileId) {
      const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      console.log('🔄 Convirtiendo URL de Google a iframe embed:', { original: url, fileId, embed: embedUrl });
      return embedUrl;
    }
    
    console.warn('⚠️ No se pudo extraer file ID de la URL de Google:', url);
    return null;
  };

  const embedUrl = getEmbedUrl(src);

  if (!embedUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg`} style={{ width, height }}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📄</div>
          <span className="text-sm">URL no válida</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg`} style={{ width, height }}>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <span className="text-sm">Imagen no disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden rounded-lg relative`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span className="text-sm text-gray-500">Cargando...</span>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        title={alt}
        frameBorder="0"
        allow="autoplay"
        style={{
          border: 'none',
          display: 'block',
          pointerEvents: 'none' // Bloquea todas las interacciones del iframe
        }}
        onLoad={() => {
          console.log('✅ Iframe de Google Drive cargado exitosamente (sin interacción):', embedUrl);
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          console.warn('❌ Error en iframe de Google Drive:', embedUrl);
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {/* Overlay invisible que bloquea clics en el iframe */}
      <div 
        className="absolute inset-0 bg-transparent"
        style={{ 
          pointerEvents: 'auto',
          zIndex: 10
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🚫 Clic bloqueado en imagen de Google Drive');
        }}
        title={alt}
      />
    </div>
  );
};

export default GoogleDriveEmbed;