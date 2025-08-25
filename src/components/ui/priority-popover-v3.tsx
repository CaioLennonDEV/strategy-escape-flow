import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  Target, 
  X, 
  CheckCircle2, 
  Star,
  ArrowUpDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getItemColor, getItemGradient, getItemBorderColor } from '@/lib/color-utils';
import type { Action } from '@/lib/types';

interface PriorityPopoverV3Props {
  action: Action;
  currentPosition: number | null;
  nextPosition: number;
  onAddAsNextPriority: (actionId: string) => void;
  onRemovePriority: (actionId: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

export const PriorityPopoverV3: React.FC<PriorityPopoverV3Props> = ({
  action,
  currentPosition,
  nextPosition,
  onAddAsNextPriority,
  onRemovePriority,
  isOpen,
  onOpenChange,
  disabled = false
}) => {
  const itemColor = getItemColor(action.id);

  const handleAddPriority = () => {
    onAddAsNextPriority(action.id);
  };

  const handleRemovePriority = () => {
    onRemovePriority(action.id);
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
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Adicionar</span>
              <span className="sm:hidden">Add</span>
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
                onClick={handleRemovePriority}
                className="h-8 w-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Separator className="mb-3 sm:mb-4 border-unimed-support/30" />

          {/* Status atual */}
          {currentPosition && (
            <div className="mb-4 sm:mb-5 p-2 sm:p-3 rounded-xl bg-unimed-primary/5 border border-unimed-primary/20">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-unimed-primary" />
                <span className="font-medium text-white">
                  Posição atual: <Badge variant="secondary" className="ml-1 text-xs bg-unimed-primary/20 text-unimed-primary border-unimed-primary/30">{currentPosition}º</Badge>
                </span>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="space-y-3 sm:space-y-4">
            {currentPosition ? (
              <>
                <h5 className="font-semibold text-xs sm:text-sm text-white">
                  Remover prioridade
                </h5>
                <p className="text-xs text-white/60 leading-relaxed">
                  Clique no botão X acima para remover esta ação da lista de prioridades.
                </p>
              </>
            ) : (
              <>
                <h5 className="font-semibold text-xs sm:text-sm text-white">
                  Adicionar como próxima prioridade
                </h5>
                <p className="text-xs text-white/60 leading-relaxed mb-3">
                  Esta ação será adicionada como a {nextPosition}ª prioridade.
                </p>
                
                <Button
                  onClick={handleAddPriority}
                  disabled={disabled}
                  className="w-full bg-unimed-primary hover:bg-unimed-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar como {nextPosition}ª Prioridade
                </Button>
              </>
            )}
          </div>

          {/* Legenda */}
          <div className="mt-4 sm:mt-5 pt-2 sm:pt-3 border-t border-unimed-support/30">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-unimed-primary" />
                <span>Priorizada</span>
              </div>
              <div className="flex items-center gap-1">
                <Plus className="w-3 h-3 text-white/60" />
                <span>Adicionar</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}; 