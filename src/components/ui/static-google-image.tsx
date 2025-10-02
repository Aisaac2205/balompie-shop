import React, { useState, useEffect, useRef } from 'react';

interface StaticGoogleImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}

/**
 * Componente que convierte imágenes de Google Drive a imágenes estáticas
 * No permite interacción ni navegación al Drive
 */
export const StaticGoogleImage: React.FC<StaticGoogleImageProps> = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 400,
  fallbackSrc = '/placeholder.svg'
}) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [staticImageSrc, setStaticImageSrc] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Extraer file ID de diferentes formatos de URL de Google
  const extractFileId = (url: string): string | null => {
    if (!url) return null;
    
    // Método 1: URL estándar de Google Drive (/file/d/)
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) return driveMatch[1];
    
    // Método 2: URL de Google User Content (lh3.googleusercontent.com)
    const userContentMatch = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    if (userContentMatch) return userContentMatch[1];
    
    // Método 3: URL con parámetro id= 
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];
    
    return null;
  };

  useEffect(() => {
    const fileId = extractFileId(src);
    
    if (!fileId) {
      // Si no es una URL de Google Drive, usar imagen normal
      setStaticImageSrc(src || fallbackSrc);
      setImageStatus('success');
      return;
    }

    // Para Google Drive, intentar diferentes URLs estáticas
    const tryStaticUrls = [
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`,
      `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-no`,
      `https://drive.google.com/uc?export=view&id=${fileId}`
    ];

    let currentTry = 0;

    const tryNextUrl = () => {
      if (currentTry >= tryStaticUrls.length) {
        console.warn('🚫 Todas las URLs estáticas fallaron, usando fallback:', src);
        setStaticImageSrc(fallbackSrc);
        setImageStatus('error');
        return;
      }

      const testUrl = tryStaticUrls[currentTry];
      const img = new Image();
      
      img.onload = () => {
        console.log('✅ URL estática funcionó:', testUrl);
        setStaticImageSrc(testUrl);
        setImageStatus('success');
      };
      
      img.onerror = () => {
        console.warn(`❌ URL estática falló (${currentTry + 1}/${tryStaticUrls.length}):`, testUrl);
        currentTry++;
        setTimeout(tryNextUrl, 100); // Pequeño delay para evitar spam
      };
      
      img.src = testUrl;
    };

    tryNextUrl();
  }, [src, fallbackSrc]);

  if (imageStatus === 'loading') {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-sm text-gray-500">Cargando imagen...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <img 
        src={staticImageSrc} 
        alt={alt}
        className={className}
        style={{ width, height }}
        loading="lazy"
        draggable={false} // Prevenir arrastrar la imagen
        onContextMenu={(e) => e.preventDefault()} // Bloquear menú contextual
        onError={() => {
          if (staticImageSrc !== fallbackSrc) {
            console.warn('❌ Imagen estática falló, usando fallback');
            setStaticImageSrc(fallbackSrc);
          }
        }}
      />
      {/* Canvas oculto para referencia (no usado actualmente) */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }} 
        width={width} 
        height={height}
      />
    </>
  );
};

export default StaticGoogleImage;