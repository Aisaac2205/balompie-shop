import React, { useState, useEffect } from 'react';
import { StaticGoogleImage } from './static-google-image';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

/**
 * Componente inteligente que detecta automáticamente el mejor método para mostrar imágenes
 * Evita errores CORS, 429 (Too Many Requests) y otros problemas de Google Drive
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  fallbackSrc = '/placeholder.svg'
}) => {
  const [imageStrategy, setImageStrategy] = useState<'loading' | 'normal' | 'drive-embed' | 'fallback'>('loading');
  const [finalSrc, setFinalSrc] = useState<string>('');

  useEffect(() => {
    if (!src) {
      setImageStrategy('fallback');
      setFinalSrc(fallbackSrc);
      return;
    }

    // Detectar cualquier tipo de URL de Google Drive o Google User Content
    const isGoogleDriveUrl = src.includes('drive.google.com') || src.includes('googleusercontent.com');
    
    if (isGoogleDriveUrl) {
      console.log('🎯 Detectada URL de Google (Drive/UserContent), usando iframe embed para evitar CORS/429:', src);
      setImageStrategy('drive-embed');
      return;
    }

    // Para otras URLs, intentar cargar normalmente
    const img = new Image();
    img.onload = () => {
      console.log('✅ Imagen normal cargada:', src);
      setImageStrategy('normal');
      setFinalSrc(src);
    };
    img.onerror = () => {
      console.warn('❌ Error cargando imagen normal, usando fallback:', src);
      setImageStrategy('fallback');
      setFinalSrc(fallbackSrc);
    };
    img.src = src;
  }, [src, fallbackSrc]);

  // Loading state
  if (imageStrategy === 'loading') {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={width && height ? { width, height } : {}}
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-sm text-gray-500">Cargando...</span>
        </div>
      </div>
    );
  }

  // Google Drive: usar imagen estática (no-interactiva)
  if (imageStrategy === 'drive-embed') {
    return (
      <StaticGoogleImage 
        src={src} 
        alt={alt}
        className={className}
        width={width}
        height={height}
        fallbackSrc={fallbackSrc}
      />
    );
  }

  // Imagen normal o fallback
  return (
    <img 
      src={finalSrc} 
      alt={alt}
      className={className}
      style={width && height ? { width, height } : {}}
      loading="lazy"
      onError={(e) => {
        if (finalSrc !== fallbackSrc) {
          console.warn('❌ Error en imagen, cambiando a fallback:', finalSrc);
          setImageStrategy('fallback');
          setFinalSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default SmartImage;