import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GridSelectorProps {
  totalItems: number;
  currentPosition: number;
  onPositionSelect: (position: number) => void;
  disabled?: boolean;
  className?: string;
}

export const GridSelector: React.FC<GridSelectorProps> = ({
  totalItems,
  currentPosition,
  onPositionSelect,
  disabled = false,
  className = ''
}) => {
  const positions = Array.from({ length: totalItems }, (_, i) => i + 1);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Posição:</span>
        <Badge className="bg-unimed-primary text-white text-xs">
          {currentPosition}º
        </Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-1">
        {positions.map((position) => (
          <Button
            key={position}
            type="button"
            variant={position === currentPosition ? "default" : "outline"}
            size="sm"
            onClick={() => onPositionSelect(position)}
            disabled={disabled}
            className={`h-8 w-8 p-0 text-xs font-bold ${
              position === currentPosition 
                ? 'bg-unimed-primary text-white' 
                : 'hover:bg-slate-100'
            }`}
          >
            {position}
          </Button>
        ))}
      </div>
    </div>
  );
}; 