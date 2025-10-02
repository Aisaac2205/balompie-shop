// ============= Responsive Container Component =============
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function ResponsiveContainer({ 
  children, 
  className,
  size = 'lg' 
}: ResponsiveContainerProps) {
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}