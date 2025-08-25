import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  Target, 
  X, 
  CheckCircle2, 
  Lock,
  ArrowUpDown,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getItemColor, getItemGradient, getItemBorderColor } from '@/lib/color-utils';
import type { Action } from '@/lib/types';
import type { PriorityItem } from '@/hooks/use-priority-popover';

interface PriorityPopoverProps {
  action: Action;
  currentPosition: number | null;
  availablePositions: number[];
  occupiedPositions: number[];
  totalActions: number; // Número total de ações
  onAssignPosition: (actionId: string, position: number) => void;
  onRemovePosition: (actionId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

export const PriorityPopover: React.FC<PriorityPopoverProps> = ({
  action,
  currentPosition,
  availablePositions,
  occupiedPositions,
  totalActions,
  onAssignPosition,
  onRemovePosition,
  isOpen,
  onOpenChange,
  disabled = false
}) => {
  const itemColor = getItemColor(action.id);

  const handlePositionClick = (position: number) => {
    if (currentPosition === position) {
      // Se clicar na posição atual, remove
      onRemovePosition(action.id);
    } else {
      // Se clicar em uma nova posição, atribui
      onAssignPosition(action.id, position);
    }
  };

  const renderPositionButton = (position: number, isAvailable: boolean) => {
    const isCurrentPosition = currentPosition === position;
    const isOccupied = occupiedPositions.includes(position) && !isCurrentPosition;

    return (
      <Button
        key={position}
        variant={isCurrentPosition ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200",
          isCurrentPosition && "bg-unimed-primary text-white border-unimed-primary shadow-lg",
          isOccupied && "opacity-50 cursor-not-allowed bg-gray-800/50 border-gray-600 text-gray-400",
          isAvailable && !isCurrentPosition && "hover:bg-unimed-primary/20 hover:border-unimed-primary/50 hover:text-unimed-primary",
          isAvailable && !isCurrentPosition && "bg-white/10 border-gray-600 text-white backdrop-blur-sm"
        )}
        onClick={() => handlePositionClick(position)}
        disabled={isOccupied || disabled}
      >
        {isCurrentPosition ? (
          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : isOccupied ? (
          <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          position
        )}
      </Button>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 sm:h-9 px-2 sm:px-3 gap-1.5 sm:gap-2 transition-all duration-200 text-xs sm:text-sm rounded-xl",
            currentPosition && "bg-unimed-primary/20 border-unimed-primary/50 text-unimed-primary hover:bg-unimed-primary/30",
            !currentPosition && "bg-white/10 border-gray-600 text-white hover:bg-white/20 backdrop-blur-sm"
          )}
          disabled={disabled}
        >
          {currentPosition ? (
            <>
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-bold">{currentPosition}º</span>
            </>
          ) : (
            <>
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Priorizar</span>
              <span className="sm:hidden">Pos</span>
            </>
          )}
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[calc(100vw-2rem)] max-w-sm p-0 border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md max-h-[80vh] overflow-y-auto rounded-2xl"
        align="center"
        sideOffset={8}
        side="bottom"
      >
                  <div className="p-3 sm:p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-5">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div 
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ 
                    background: getItemGradient(itemColor),
                    border: `2px solid ${getItemBorderColor(itemColor)}`
                  }}
                >
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-white leading-tight mb-1">
                    {action.title}
                  </h4>
                  {action.description && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
              
              {currentPosition && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePosition(action.id)}
                  className="h-8 w-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

          <Separator className="mb-3 sm:mb-4 border-unimed-support/30" />

          {/* Status atual */}
          {currentPosition && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-xl bg-unimed-primary/5 border border-unimed-primary/20">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-unimed-primary" />
                <span className="font-medium text-white">
                  Posição atual: <Badge variant="secondary" className="ml-1 text-xs bg-unimed-primary/20 text-unimed-primary border-unimed-primary/30">{currentPosition}º</Badge>
                </span>
              </div>
            </div>
          )}

          {/* Grid de posições */}
          <div className="space-y-2 sm:space-y-3">
            <h5 className="font-semibold text-xs sm:text-sm text-white">
              {currentPosition ? 'Trocar para posição:' : 'Selecionar posição:'}
            </h5>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
              {Array.from({ length: totalActions }, (_, i) => i + 1).map(position => {
                const isAvailable = availablePositions.includes(position) || currentPosition === position;
                return renderPositionButton(position, isAvailable);
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-unimed-support/30">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-unimed-primary" />
                <span>Atual</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Ocupada</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border border-gray-400 bg-white/10" />
                <span>Livre</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 