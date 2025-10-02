import { ReactNode } from 'react';
import camisolasBackground from '@/assets/camisolas-background.jpg';

interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
  overlayOpacity?: 'light' | 'medium' | 'dark';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  height?: 'small' | 'medium' | 'large';
}

export function SectionHeader({ 
  children, 
  className = '', 
  overlayOpacity = 'medium',
  backgroundPosition = 'center',
  height = 'medium'
}: SectionHeaderProps) {
  const overlayClasses = {
    light: 'bg-black/30',
    medium: 'bg-black/60',
    dark: 'bg-black/80'
  };

  const heightClasses = {
    small: 'py-12',
    medium: 'py-16',
    large: 'py-20'
  };

  return (
    <div className={`relative ${heightClasses[height]} ${className}`}>
      {/* Background Image - Solo en el header */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${camisolasBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: backgroundPosition,
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className={`absolute inset-0 ${overlayClasses[overlayOpacity]}`}></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
