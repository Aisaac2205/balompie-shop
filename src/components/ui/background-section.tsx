import { ReactNode } from 'react';
import camisolasBackground from '@/assets/camisolas-background.jpg';

interface BackgroundSectionProps {
  children: ReactNode;
  className?: string;
  overlayOpacity?: 'light' | 'medium' | 'dark';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  overlayColor?: 'black' | 'blue' | 'yellow' | 'custom';
  customOverlayColor?: string;
  parallax?: boolean;
  blur?: boolean;
}

export function BackgroundSection({ 
  children, 
  className = '', 
  overlayOpacity = 'medium',
  backgroundPosition = 'center',
  overlayColor = 'black',
  customOverlayColor,
  parallax = false,
  blur = false
}: BackgroundSectionProps) {
  const overlayClasses = {
    light: 'bg-black/30',
    medium: 'bg-black/60',
    dark: 'bg-black/80'
  };

  const colorOverlays = {
    black: overlayClasses[overlayOpacity],
    blue: 'bg-blue-900/50',
    yellow: 'bg-yellow-900/40',
    custom: customOverlayColor || overlayClasses[overlayOpacity]
  };

  const parallaxClass = parallax ? 'transform-gpu' : '';
  const blurClass = blur ? 'backdrop-blur-sm' : '';

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <div 
        className={`absolute inset-0 z-0 ${parallaxClass}`}
        style={{
          backgroundImage: `url(${camisolasBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: backgroundPosition,
          backgroundRepeat: 'no-repeat',
          ...(parallax && { transform: 'translateZ(0)' })
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${colorOverlays[overlayColor]} ${blurClass}`}></div>
        
        {/* Optional Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
