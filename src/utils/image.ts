// Utilidades para manejo de imágenes
// Soporta tanto imágenes locales como URLs externas

// Configuración de imágenes
const IMAGE_CONFIG = {
  // Servicios de imágenes recomendados para producción
  CLOUDINARY_BASE_URL: 'https://res.cloudinary.com/tu-cloud-name/image/upload',
  FIREBASE_STORAGE_BASE_URL: 'https://firebasestorage.googleapis.com',
  
  // Tamaños de imagen optimizados
  THUMBNAIL_SIZE: 'w_200,h_200,c_fill',
  PRODUCT_SIZE: 'w_400,h_400,c_fill',
  HERO_SIZE: 'w_1200,h_600,c_fill',
  
  // Formato de imagen
  FORMAT: 'f_auto,q_auto'
};

// Función para obtener la URL de imagen optimizada
export function getOptimizedImageUrl(
  imageUrl: string, 
  size: 'thumbnail' | 'product' | 'hero' = 'product'
): string {
  // Si es una URL externa válida, devolverla tal como está
  if (isExternalUrl(imageUrl)) {
    return imageUrl;
  }
  
  // Si es una imagen local, devolver la ruta relativa
  if (isLocalImage(imageUrl)) {
    return imageUrl;
  }
  
  // Si es una URL de Cloudinary, optimizarla
  if (isCloudinaryUrl(imageUrl)) {
    return optimizeCloudinaryUrl(imageUrl, size);
  }
  
  // Por defecto, devolver la URL original
  return imageUrl;
}

// Verificar si es una URL externa
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

// Verificar si es una imagen local
export function isLocalImage(url: string): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

// Verificar si es una URL de Cloudinary
export function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('cloudinary.com');
}

// Optimizar URL de Cloudinary
function optimizeCloudinaryUrl(url: string, size: string): string {
  const sizeConfig = {
    thumbnail: IMAGE_CONFIG.THUMBNAIL_SIZE,
    product: IMAGE_CONFIG.PRODUCT_SIZE,
    hero: IMAGE_CONFIG.HERO_SIZE
  }[size];
  
  // Insertar transformaciones en la URL de Cloudinary
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${sizeConfig}/${IMAGE_CONFIG.FORMAT}/${parts[1]}`;
  }
  
  return url;
}

// Función para validar si una imagen existe
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Función para obtener placeholder si la imagen falla
export function getPlaceholderUrl(): string {
  return '/placeholder.svg';
}

// Función para manejar errores de imagen
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>): void {
  event.currentTarget.src = getPlaceholderUrl();
  event.currentTarget.alt = 'Imagen no disponible';
}

// Función para precargar imágenes
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

// Función para obtener dimensiones de imagen
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error(`Failed to get dimensions for: ${url}`));
    img.src = url;
  });
}

// Función para generar URLs de ejemplo para desarrollo
export function getExampleImageUrl(team: string, type: string): string {
  const examples = {
    'Barcelona': {
      local: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      visitante: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      tercera: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    'Real Madrid': {
      local: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      visitante: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      tercera: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    }
  };
  
  return examples[team as keyof typeof examples]?.[type as keyof typeof examples.Barcelona] || 
         'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop';
}
