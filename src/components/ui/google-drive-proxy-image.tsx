/**
 * Simple proxy component to handle Google Drive images with CORS bypass
 */
import React, { useState, useEffect } from 'react';

interface GoogleDriveProxyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const GoogleDriveProxyImage: React.FC<GoogleDriveProxyImageProps> = ({
  src,
  alt,
  className = '',
  onLoad,
  onError
}) => {
  const [proxySrc, setProxySrc] = useState(src);

  useEffect(() => {
    if (src.includes('drive.google.com')) {
      // Extract file ID and create different URL formats
      const fileIdMatch = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        
        // Use the most compatible format for embedding
        const proxyUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-no`;
        console.log('🔄 Usando Google User Content proxy:', proxyUrl);
        setProxySrc(proxyUrl);
        return;
      }
    }
    
    setProxySrc(src);
  }, [src]);

  const handleError = () => {
    console.warn('❌ Error con proxy, probando URL original:', src);
    
    // If proxy failed, try the original URL
    if (proxySrc !== src) {
      setProxySrc(src);
      return;
    }
    
    // If both failed, try a different Google Drive format
    if (src.includes('drive.google.com')) {
      const fileIdMatch = src.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        const fallbackUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        console.log('🔄 Probando URL de fallback:', fallbackUrl);
        setProxySrc(fallbackUrl);
        return;
      }
    }
    
    onError?.();
  };

  const handleLoad = () => {
    console.log('✅ Imagen cargada con proxy:', proxySrc);
    onLoad?.();
  };

  return (
    <img
      src={proxySrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      crossOrigin="anonymous"
    />
  );
};