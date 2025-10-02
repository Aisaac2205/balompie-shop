import React, { useState } from 'react';

interface SimpleGoogleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Componente simple para mostrar imágenes de Google Drive usando iframe como fallback
 */
export const SimpleGoogleImage: React.FC<SimpleGoogleImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder.svg'
}) => {
  const [useIframe, setUseIframe] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => {
    // Convertir inmediatamente si es una URL de Google Drive
    if (src.includes('drive.google.com')) {
      const fileIdMatch = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    return src;
  });

  const handleImageError = () => {
    console.warn('❌ Imagen normal falló, cambiando a iframe:', imgSrc);
    setUseIframe(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen cargada exitosamente:', imgSrc);
  };

  // Si necesitamos usar iframe, crear URL de embed
  const iframeSrc = React.useMemo(() => {
    if (src.includes('drive.google.com')) {
      const fileIdMatch = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    return src;
  }, [src]);

  if (useIframe) {
    return (
      <div className={`${className} relative bg-gray-100 flex items-center justify-center`}>
        <iframe
          src={iframeSrc}
          title={alt}
          className="w-full h-full border-none"
          allow="autoplay"
          onLoad={() => console.log('✅ Iframe cargado:', iframeSrc)}
          onError={() => {
            console.error('❌ Iframe también falló');
            setUseIframe(false);
            setImgSrc(fallbackSrc);
          }}
        />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
};