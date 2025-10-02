import React from 'react';

interface DriveImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Componente para mostrar imágenes de Google Drive usando proxy CORS-friendly
 */
export const DriveImageDisplay: React.FC<DriveImageDisplayProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder.svg'
}) => {
  
  // Convertir URL de Google Drive usando un proxy que evita CORS
  const getProxyUrl = (url: string): string => {
    if (!url || !url.includes('drive.google.com')) {
      return url || fallbackSrc;
    }
    
    let fileId = '';
    
    // Extraer el file ID - soportar múltiples formatos
    // Formato 1: /file/d/FILE_ID/view
    const fileIdMatch1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch1) {
      fileId = fileIdMatch1[1];
    } else {
      // Formato 2: uc?export=view&id=FILE_ID
      const fileIdMatch2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch2) {
        fileId = fileIdMatch2[1];
      }
    }
    
    if (fileId) {
      // Usar thumbnail que suele ser más permisivo con CORS
      const proxyUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
      console.log('🔄 Usando thumbnail para evitar CORS:', { original: url, fileId, proxy: proxyUrl });
      return proxyUrl;
    }
    
    console.warn('⚠️ No se pudo extraer file ID de:', url);
    return url;
  };

  const displayUrl = getProxyUrl(src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn('❌ Error cargando imagen (CORS/403):', displayUrl);
    
    // Extraer fileId de cualquier formato
    let fileId = '';
    const fileIdMatch1 = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileIdMatch2 = src.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    
    if (fileIdMatch1) {
      fileId = fileIdMatch1[1];
    } else if (fileIdMatch2) {
      fileId = fileIdMatch2[1];
    }
    
    if (fileId && src.includes('drive.google.com')) {
      // Intentar diferentes fallbacks en orden
      const currentSrc = e.currentTarget.src;
      
      if (currentSrc.includes('thumbnail')) {
        // Si falla el thumbnail, intentar con Google User Content
        const googleUserContent = `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-no`;
        console.log('🔄 Fallback 1: Intentando con Google User Content:', googleUserContent);
        e.currentTarget.src = googleUserContent;
        return;
      } else if (currentSrc.includes('lh3.googleusercontent.com') && !currentSrc.includes('=s400')) {
        // Si falla Google User Content, intentar formato directo
        const directFormat = `https://lh3.googleusercontent.com/d/${fileId}=s400-c`;
        console.log('🔄 Fallback 2: Intentando formato directo:', directFormat);
        e.currentTarget.src = directFormat;
        return;
      } else if (!currentSrc.includes('uc?export=view')) {
        // Último intento: URL original de export
        const originalExport = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('🔄 Fallback 3: Intentando URL original:', originalExport);
        e.currentTarget.src = originalExport;
        return;
      }
    }
    
    // Si todo falla, usar fallback
    console.log('💔 Todos los fallbacks fallaron, usando placeholder');
    e.currentTarget.src = fallbackSrc;
  };

  const handleLoad = () => {
    console.log('✅ Imagen de Google Drive cargada exitosamente:', displayUrl);
  };

  return (
    <img
      src={displayUrl}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};