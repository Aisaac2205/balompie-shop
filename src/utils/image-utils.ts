/**
 * Utilities for handling image URLs from various sources
 */

/**
 * Convert Google Drive share URL to direct image URL with multiple fallback methods
 */
export function convertGoogleDriveUrl(url: string): { convertedUrl: string; wasConverted: boolean; fileId?: string; alternativeUrls?: string[] } {
  console.log('🔄 Intentando convertir URL de Google Drive:', url);
  
  // Check if it's a Google Drive URL
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match) {
    const fileId = match[1];
    
    // Multiple URL formats to try - some work better than others depending on file permissions
    const alternativeUrls = [
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/uc?id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
      `https://lh3.googleusercontent.com/d/${fileId}=w400`
    ];
    
    const primaryUrl = alternativeUrls[0]; // Use the most reliable format
    
    console.log('✅ URL convertida exitosamente:', { 
      fileId, 
      primaryUrl,
      alternativeUrls 
    });
    
    return { 
      convertedUrl: primaryUrl, 
      wasConverted: true, 
      fileId,
      alternativeUrls 
    };
  }
  
  console.log('❌ No se pudo convertir la URL (no es una URL válida de Google Drive)');
  return { convertedUrl: url, wasConverted: false };
}

/**
 * Convert various image URLs to direct displayable URLs for frontend display
 */
export function normalizeImageUrl(url: string): string {
  if (!url) return url;
  
  // Convert Google Drive URLs to the most compatible format for display
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Use Google User Content proxy for better compatibility
      const proxyUrl = `https://lh3.googleusercontent.com/d/${fileId}=w400-h400-no`;
      console.log('🔄 Conversión a proxy Google User Content:', { original: url, proxy: proxyUrl });
      return proxyUrl;
    }
  }
  
  // Add more URL conversions here for other services if needed
  // Example: Dropbox, OneDrive, etc.
  
  return url;
}

/**
 * Convert various image URLs to standard format for database storage
 */
export function normalizeImageUrlForStorage(url: string): string {
  if (!url) return url;
  
  // For Google Drive URLs, store the original share URL or a standard uc format
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Store in standard Google Drive format
      const standardUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      console.log('🔄 Normalización para almacenamiento:', { original: url, standard: standardUrl });
      return standardUrl;
    }
  }
  
  return url;
}

/**
 * Create a local object URL from a remote image to bypass CORS issues
 */
export async function createObjectUrlFromImage(url: string): Promise<{ objectUrl: string; originalUrl: string } | null> {
  try {
    console.log('🔄 Creando Object URL para:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Try CORS first
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    console.log('✅ Object URL creado exitosamente:', { originalUrl: url, objectUrl });
    return { objectUrl, originalUrl: url };
    
  } catch (corsError) {
    console.log('⚠️ Error con CORS, intentando modo no-cors:', corsError);
    
    try {
      // Try no-cors mode as fallback
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      });
      
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      console.log('✅ Object URL creado con no-cors:', { originalUrl: url, objectUrl });
      return { objectUrl, originalUrl: url };
      
    } catch (finalError) {
      console.error('❌ No se pudo crear Object URL:', finalError);
      return null;
    }
  }
}

/**
 * Validate if an image URL is accessible
 */
export function validateImageUrl(url: string): Promise<{ isValid: boolean; finalUrl: string; objectUrl?: string; error?: string }> {
  return new Promise(async (resolve) => {
    const finalUrl = normalizeImageUrl(url);
    
    console.log('🔍 Validando imagen:', { originalUrl: url, finalUrl });
    
    // For Google Drive URLs, try to create an object URL first
    if (finalUrl.includes('drive.google.com')) {
      try {
        const objectResult = await createObjectUrlFromImage(finalUrl);
        if (objectResult) {
          console.log('✅ Imagen validada con Object URL:', objectResult);
          resolve({ 
            isValid: true, 
            finalUrl, 
            objectUrl: objectResult.objectUrl 
          });
          return;
        }
      } catch (error) {
        console.log('⚠️ No se pudo crear Object URL, intentando validación normal:', error);
      }
    }
    
    // Fallback to normal image validation
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Imagen cargada exitosamente:', finalUrl);
      resolve({ isValid: true, finalUrl });
    };
    
    img.onerror = (error) => {
      console.log('❌ Error al cargar imagen:', { finalUrl, error });
      
      // For Google Drive URLs, treat them as valid even if CORS blocks the validation
      if (finalUrl.includes('drive.google.com/uc?id=')) {
        console.log('🔄 URL de Google Drive detectada - asumiendo válida a pesar del error CORS');
        resolve({ isValid: true, finalUrl });
      } else {
        resolve({ isValid: false, finalUrl, error: 'No se pudo cargar la imagen' });
      }
    };
    
    // Set a timeout to avoid hanging
    setTimeout(() => {
      console.log('⏰ Timeout al validar imagen:', finalUrl);
      
      // For Google Drive URLs, treat timeout as valid since CORS might be blocking
      if (finalUrl.includes('drive.google.com/uc?id=')) {
        console.log('🔄 Timeout en Google Drive - asumiendo válida (problema de CORS)');
        resolve({ isValid: true, finalUrl });
      } else {
        resolve({ isValid: false, finalUrl, error: 'Timeout al cargar la imagen' });
      }
    }, 5000);
    
    // For Google Drive URLs, don't use crossOrigin as it may cause more issues
    if (!finalUrl.includes('drive.google.com')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = finalUrl;
  });
}

/**
 * Get example image URLs for teams
 */
export function getExampleTeamImages() {
  return {
    'FC Barcelona': 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
    'Real Madrid': 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
    'Manchester City': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png',
    'PSG': 'https://logos-world.net/wp-content/uploads/2020/06/PSG-Logo.png',
    'Liverpool': 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png'
  };
}

/**
 * Diagnose Google Drive URL issues
 */
export function diagnoseGoogleDriveUrl(url: string): {
  isGoogleDriveUrl: boolean;
  canConvert: boolean;
  fileId?: string;
  convertedUrl?: string;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check if it's a Google Drive URL
  const isGoogleDriveUrl = url.includes('drive.google.com');
  
  if (!isGoogleDriveUrl) {
    return {
      isGoogleDriveUrl: false,
      canConvert: false,
      issues: ['No es una URL de Google Drive'],
      recommendations: ['Usa una URL de Google Drive válida']
    };
  }
  
  // Try to extract file ID
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (!match) {
    issues.push('No se pudo extraer el ID del archivo de la URL');
    recommendations.push('Asegúrate de usar el formato: https://drive.google.com/file/d/ID/view');
    return {
      isGoogleDriveUrl: true,
      canConvert: false,
      issues,
      recommendations
    };
  }
  
  const fileId = match[1];
  const convertedUrl = `https://drive.google.com/uc?id=${fileId}`;
  
  // Check for common issues
  if (url.includes('/edit')) {
    issues.push('URL en modo edición detectada');
    recommendations.push('Usa el enlace de compartir, no el de edición');
  }
  
  if (!url.includes('usp=sharing') && !url.includes('usp=share_link')) {
    issues.push('URL podría no tener permisos de compartir');
    recommendations.push('Asegúrate de generar el enlace desde "Compartir" en Google Drive');
  }
  
  recommendations.push('Verifica que el archivo tenga permisos públicos (Cualquier persona con el enlace)');
  recommendations.push('Asegúrate de que el archivo sea una imagen (PNG, JPG, etc.)');
  
  return {
    isGoogleDriveUrl: true,
    canConvert: true,
    fileId,
    convertedUrl,
    issues,
    recommendations
  };
}