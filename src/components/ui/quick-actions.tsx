import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface QuickActionsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled?: boolean;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 quick-actions-container ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onMoveUp}
        disabled={disabled || !canMoveUp}
        className="h-9 w-9 p-0 flex-shrink-0 quick-actions-button"
        title="Mover para cima"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onMoveDown}
        disabled={disabled || !canMoveDown}
        className="h-9 w-9 p-0 flex-shrink-0 quick-actions-button"
        title="Mover para baixo"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}; 