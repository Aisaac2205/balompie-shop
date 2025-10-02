import React, { useState, useEffect, useRef } from 'react';
import { convertGoogleDriveUrl, createObjectUrlFromImage } from '@/utils/image-utils';

interface GoogleDriveImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const GoogleDriveImage: React.FC<GoogleDriveImageProps> = ({
  src,
  alt,
  className = '',
  onLoad,
  onError,
  fallbackSrc = '/placeholder.svg'
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoadingObjectUrl, setIsLoadingObjectUrl] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup previous object URL
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setCurrentSrc(src);
    setAttemptIndex(0);
    setHasError(false);
    setIsLoadingObjectUrl(false);

    // If it's a Google Drive URL, try to create an object URL immediately
    if (src.includes('drive.google.com')) {
      createObjectUrlForGoogleDrive(src);
    }
  }, [src]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const createObjectUrlForGoogleDrive = async (originalSrc: string) => {
    setIsLoadingObjectUrl(true);
    console.log('🔄 Intentando crear Object URL para Google Drive:', originalSrc);

    const conversion = convertGoogleDriveUrl(originalSrc);
    if (!conversion.wasConverted || !conversion.alternativeUrls) {
      setIsLoadingObjectUrl(false);
      return;
    }

    // Try each alternative URL to create an object URL
    for (const altUrl of conversion.alternativeUrls) {
      try {
        console.log('🧪 Probando crear Object URL con:', altUrl);
        const result = await createObjectUrlFromImage(altUrl);
        
        if (result) {
          console.log('✅ Object URL creado exitosamente:', result.objectUrl);
          objectUrlRef.current = result.objectUrl;
          setCurrentSrc(result.objectUrl);
          setIsLoadingObjectUrl(false);
          return;
        }
      } catch (error) {
        console.log('⚠️ Error creando Object URL con', altUrl, ':', error);
        continue;
      }
    }

    console.log('❌ No se pudo crear Object URL, usando URL original');
    setIsLoadingObjectUrl(false);
  };

  const handleError = () => {
    console.warn(`❌ Error cargando imagen (intento ${attemptIndex + 1}):`, currentSrc);
    
    // If we're using an object URL and it failed, try the alternatives
    if (objectUrlRef.current && currentSrc === objectUrlRef.current) {
      console.log('💔 Object URL falló, probando URLs alternativas');
      if (src.includes('drive.google.com')) {
        const conversion = convertGoogleDriveUrl(src);
        if (conversion.alternativeUrls && conversion.alternativeUrls.length > 0) {
          setCurrentSrc(conversion.alternativeUrls[0]);
          setAttemptIndex(0);
          return;
        }
      }
    }
    
    // Try alternative URLs if available
    if (src.includes('drive.google.com')) {
      const conversion = convertGoogleDriveUrl(src);
      
      if (conversion.wasConverted && conversion.alternativeUrls) {
        const nextIndex = attemptIndex + 1;
        
        if (nextIndex < conversion.alternativeUrls.length) {
          console.log(`🔄 Probando URL alternativa ${nextIndex + 1}:`, conversion.alternativeUrls[nextIndex]);
          setCurrentSrc(conversion.alternativeUrls[nextIndex]);
          setAttemptIndex(nextIndex);
          return;
        }
      }
    }
    
    // All attempts failed, use fallback
    console.log('💔 Todos los intentos fallaron, usando fallback:', fallbackSrc);
    setCurrentSrc(fallbackSrc);
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    console.log(`✅ Imagen cargada exitosamente (intento ${attemptIndex + 1}):`, currentSrc);
    setHasError(false);
    setIsLoadingObjectUrl(false);
    onLoad?.();
  };

  return (
    <div className="relative">
      {isLoadingObjectUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ opacity: isLoadingObjectUrl ? 0.5 : 1 }}
      />
    </div>
  );
};