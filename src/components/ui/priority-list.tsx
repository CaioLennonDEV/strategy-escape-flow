import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Target, 
  CheckCircle2,
  ArrowUpDown,
  Star,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getItemColor, getItemGradient, getItemBorderColor, getPillarColor } from '@/lib/color-utils';
import { PriorityPopover } from './priority-popover';
import { usePriorityPopover } from '@/hooks/use-priority-popover';
import type { Action, Pillar } from '@/lib/types';
import type { PriorityItem } from '@/hooks/use-priority-popover';

interface PriorityListProps {
  pillar: Pillar;
  actions: Action[];
  onComplete?: (priorities: PriorityItem[]) => void;
  isCompleted?: boolean;
  className?: string;
}

export const PriorityList: React.FC<PriorityListProps> = ({
  pillar,
  actions,
  onComplete,
  isCompleted = false,
  className = ''
}) => {
  const {
    priorities,
    isPopoverOpen,
    selectedAction,
    openPopover,
    closePopover,
    assignPosition,
    removePosition,
    clearAllPriorities,
    getCurrentPriorities,
    getOccupiedPositions,
    getAvailablePositions,
    getActionPosition,
    getOrderedActions,
    hasPriority
  } = usePriorityPopover({
    actions,
    pillarId: pillar.id
  });

  const occupiedPositions = getOccupiedPositions();
  const availablePositions = getAvailablePositions();
  const orderedActions = getOrderedActions();

  const handleComplete = () => {
    if (onComplete) {
      const currentPriorities = getCurrentPriorities();
      onComplete(currentPriorities);
    }
  };

  const isAllActionsPrioritized = priorities.length === actions.length;
  const pillarColor = getPillarColor(pillar.name);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header da Missão */}
      <Card className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 sm:gap-4">
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-unimed-primary to-unimed-light flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${pillarColor}15 0%, ${pillarColor}30 100%)`
                }}
              >
                <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="font-poppins text-base sm:text-lg md:text-xl lg:text-2xl text-white leading-tight truncate">
                  🎯 {pillar.name}
                </CardTitle>
                <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium leading-relaxed line-clamp-2">
                  {pillar.description}
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <Badge className="bg-unimed-primary text-white font-bold px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                MISSÃO CONCLUÍDA
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Console de Priorização */}
      <Card className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-unimed-orange" />
              RANKING DE PRIORIDADES
            </CardTitle>
            
            {priorities.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllPriorities}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs sm:text-sm px-2 sm:px-3"
                disabled={isCompleted}
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Limpar</span>
                <span className="sm:hidden">Limpar</span>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
            <h4 className="font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              Clique em <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" /> para organizar as ações:
            </h4>
            
            {/* Lista de ações */}
            <div className="space-y-2 sm:space-y-3">
              {actions.map((action) => {
                const currentPosition = getActionPosition(action.id);
                const itemColor = getItemColor(action.id);
                
                return (
                  <div 
                    key={action.id}
                    className="backdrop-blur-sm p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 sm:gap-4"
                    style={{ 
                      background: getItemGradient(itemColor),
                      borderColor: getItemBorderColor(itemColor)
                    }}
                  >
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}80 100%)`
                      }}
                    >
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-xs sm:text-sm text-white leading-tight truncate">
                        {action.title}
                      </h5>
                      {action.description && (
                        <p className="text-xs text-white/70 mt-1 font-medium leading-relaxed line-clamp-2">
                          {action.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      {currentPosition && (
                        <Badge 
                          className="text-white font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs"
                          style={{ 
                            backgroundColor: itemColor,
                            borderColor: itemColor
                          }}
                        >
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                          {currentPosition}º
                        </Badge>
                      )}
                      
                      <PriorityPopover
                        action={action}
                        currentPosition={currentPosition}
                        availablePositions={availablePositions}
                        occupiedPositions={occupiedPositions}
                        totalActions={actions.length}
                        onAssignPosition={assignPosition}
                        onRemovePosition={removePosition}
                        isOpen={isPopoverOpen && selectedAction?.id === action.id}
                        onOpenChange={(open) => {
                          if (open) {
                            openPopover(action);
                          } else {
                            closePopover();
                          }
                        }}
                        disabled={isCompleted}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-unimed-support/30">
            <Button 
              onClick={handleComplete}
              disabled={isCompleted || !isAllActionsPrioritized}
              className="escape-run-button text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
            >
              {isCompleted ? 'Concluído' : 'Concluir Pilar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 