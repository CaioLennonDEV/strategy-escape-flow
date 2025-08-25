import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onClick,
  disabled = false,
  className,
  size = 'md',
  variant = 'outline'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'transition-all duration-200 hover:scale-105 active:scale-95',
        'bg-white/80 hover:bg-white/90 border-unimed-primary/30 hover:border-unimed-primary/50',
        'text-unimed-primary hover:text-unimed-primary/80',
        'shadow-sm hover:shadow-md',
        sizeClasses[size],
        className
      )}
      title="Trocar posição"
    >
      <ArrowRightLeft className={iconSizes[size]} />
    </Button>
  );
}; 