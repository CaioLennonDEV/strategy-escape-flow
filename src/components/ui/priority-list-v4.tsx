import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  CheckCircle2, 
  ArrowUpDown,
  Star,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { getItemColor, getItemGradient, getItemBorderColor, getPillarColor } from '@/lib/color-utils';
import { usePriorityV4 } from '@/hooks/use-priority-v4';
import type { Action, Pillar } from '@/lib/types';
import type { PriorityItem } from '@/hooks/use-priority-v4';

interface PriorityListV4Props {
  pillar: Pillar;
  actions: Action[];
  onComplete?: (priorities: PriorityItem[]) => void;
  isCompleted?: boolean;
  className?: string;
}

export const PriorityListV4: React.FC<PriorityListV4Props> = ({
  pillar,
  actions,
  onComplete,
  isCompleted = false,
  className = ''
}) => {
  const {
    priorities,
    addAsNextPriority,
    removePriority,
    clearAllPriorities,
    getCurrentPriorities,
    getActionPosition,
    getOrderedActions,
    hasPriority,
    getNextPosition,
    isAnimating
  } = usePriorityV4({
    actions,
    pillarId: pillar.id
  });

  const orderedActions = getOrderedActions();

  const handleComplete = () => {
    if (onComplete) {
      const currentPriorities = getCurrentPriorities();
      onComplete(currentPriorities);
    }
  };

  const isAllActionsPrioritized = priorities.length === actions.length;
  const pillarColor = getPillarColor(pillar.name);

  // Função para ordenar ações visualmente
  const getOrderedActionsForDisplay = () => {
    const prioritizedActions = actions.filter(action => hasPriority(action.id));
    const nonPrioritizedActions = actions.filter(action => !hasPriority(action.id));
    
    // Ordenar ações priorizadas por posição
    const sortedPrioritizedActions = prioritizedActions.sort((a, b) => {
      const posA = getActionPosition(a.id) || 0;
      const posB = getActionPosition(b.id) || 0;
      return posA - posB;
    });
    
    // Combinar listas: priorizadas primeiro, depois não priorizadas
    return [...sortedPrioritizedActions, ...nonPrioritizedActions];
  };

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
                        <div className="bg-gradient-to-r from-unimed-primary/10 to-unimed-light/10 border border-unimed-primary/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Target className="w-4 h-4 text-unimed-orange" />
                Como Priorizar suas Ações:
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-white/80">
                <div className="flex items-start gap-2">
                  <span className="text-unimed-orange font-bold">1.</span>
                  <span>Clique em <strong>"Selecionar"</strong> na ação que você quer priorizar</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-unimed-orange font-bold">2.</span>
                  <span>A ação será automaticamente a <strong>próxima prioridade</strong> (1º, 2º, 3º...)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-unimed-orange font-bold">3.</span>
                  <span>O card se move para a <strong>posição correta</strong> na lista</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-unimed-orange font-bold">4.</span>
                  <span>Para remover, clique em <strong>"Remover"</strong> e reorganize</span>
                </div>
              </div>
            </div>
            
            {/* Lista de ações */}
            <div className="space-y-2 sm:space-y-3">
              {getOrderedActionsForDisplay().map((action) => {
                const currentPosition = getActionPosition(action.id);
                const itemColor = getItemColor(action.id);
                
                return (
                  <div 
                    key={action.id}
                    className={`backdrop-blur-sm p-3 sm:p-4 rounded-xl border-2 transition-all duration-800 ease-out ${
                      isAnimating(action.id) 
                        ? 'animate-slide-to-position shadow-2xl animate-subtle-pulse' 
                        : currentPosition 
                          ? 'animate-settle-in shadow-lg' 
                          : 'animate-settle-in'
                    }`}
                    style={{ 
                      background: getItemGradient(itemColor),
                      borderColor: isAnimating(action.id) ? itemColor : getItemBorderColor(itemColor),
                      zIndex: isAnimating(action.id) ? 20 : 1,
                      boxShadow: isAnimating(action.id) 
                        ? `0 0 30px ${itemColor}40, 0 25px 50px -12px rgba(0, 0, 0, 0.5)` 
                        : undefined
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div 
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          background: currentPosition 
                            ? `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}95 100%)`
                            : `linear-gradient(135deg, ${itemColor}40 0%, ${itemColor}20 100%)`,
                          boxShadow: currentPosition 
                            ? `0 0 12px ${itemColor}80`
                            : undefined
                        }}
                      >
                        {currentPosition ? (
                          <span 
                            className="font-black text-xs sm:text-sm"
                            style={{
                              color: '#FFFFFF',
                              textShadow: '0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,255,255,0.6)',
                              fontWeight: '900'
                            }}
                          >
                            {currentPosition}
                          </span>
                        ) : (
                          <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <h5 className="font-bold text-xs sm:text-sm text-white leading-tight">
                            {action.title}
                          </h5>
                        </div>
                        {action.description && (
                          <p className="text-xs text-white/70 font-medium leading-relaxed">
                            {action.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Desktop: Botões ao lado */}
                      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        {currentPosition ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removePriority(action.id)}
                            disabled={isCompleted}
                            className="h-9 px-3 gap-2 transition-all duration-200 text-sm rounded-xl bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                          >
                            <X className="w-4 h-4" />
                            Remover
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAsNextPriority(action.id)}
                            disabled={isCompleted}
                            className="h-9 px-3 gap-2 transition-all duration-200 text-sm rounded-xl bg-white/10 border-gray-600 text-white hover:bg-white/20 backdrop-blur-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Selecionar
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile: Botões embaixo */}
                    <div className="sm:hidden flex items-center justify-end mt-3 pt-3 border-t border-white/10">
                      {currentPosition ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePriority(action.id)}
                          disabled={isCompleted}
                          className="h-8 px-2 gap-1.5 transition-all duration-200 text-xs rounded-xl bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                        >
                          <X className="w-3 h-3" />
                          Remover
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addAsNextPriority(action.id)}
                          disabled={isCompleted}
                          className="h-8 px-2 gap-1.5 transition-all duration-200 text-xs rounded-xl bg-white/10 border-gray-600 text-white hover:bg-white/20 backdrop-blur-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Selecionar
                        </Button>
                      )}
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
              className="text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 font-bold transition-all duration-300"
              style={{
                backgroundColor: isCompleted || !isAllActionsPrioritized 
                  ? 'rgba(0, 0, 0, 0.6)' 
                  : 'rgba(0, 0, 0, 0.8)',
                border: isCompleted || !isAllActionsPrioritized 
                  ? '2px solid rgba(255, 255, 255, 0.2)' 
                  : '2px solid rgba(0, 153, 84, 0.8)',
                color: isCompleted || !isAllActionsPrioritized 
                  ? 'rgba(255, 255, 255, 0.5)' 
                  : '#FFFFFF',
                boxShadow: isCompleted || !isAllActionsPrioritized 
                  ? 'none' 
                  : '0 0 15px rgba(0, 153, 84, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {isCompleted ? 'Concluído' : 'Concluir Pilar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 