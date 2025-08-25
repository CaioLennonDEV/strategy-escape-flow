
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, CheckCircle2, ArrowUpDown, Zap, Star, Timer, GripVertical, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDragReorder } from '@/hooks/use-drag-reorder';
import { useReorderFeedback } from '@/hooks/use-reorder-feedback';
import { getItemColor, getItemGradient, getItemBorderColor, getPillarColor } from '@/lib/color-utils';
import type { Action, Pillar } from '@/lib/types';

interface MissionConsoleProps {
  pillar: Pillar;
  actions: Action[];
  onComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
}

export const MissionConsole: React.FC<MissionConsoleProps> = ({
  pillar,
  actions,
  onComplete,
  isCompleted = false,
  className = ''
}) => {
  // Usar cor padronizada baseada no nome do pilar
  const pillarColor = getPillarColor(pillar.name);
  const [progress, setProgress] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(isCompleted ? 100 : 45), 100);
    return () => clearTimeout(timer);
  }, [isCompleted]);

  // Hook para feedback visual durante reordenação
  const { triggerReorderAnimation, isItemAnimating } = useReorderFeedback();

  // Hook para drag and drop com animações
  const {
    orderedItems: actionRanking,
    isDragging,
    draggedIndex,
    dragOverIndex,
    isAnimating,
    showPlaceholder,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    getItemPosition,
    totalItems
  } = useDragReorder({
    items: actions,
    onReorder: (newItems) => {
      // Callback opcional para quando a ordem muda
    },
    onItemMove: (itemId, fromIndex, toIndex) => {
      // Trigger animação de feedback quando item é movido
      triggerReorderAnimation(itemId);
    }
  });

  const saveRankingAndComplete = async () => {
    try {
      setIsSubmitting(true);
      const sessionId = localStorage.getItem('session_id');
      
      if (!sessionId) {
        toast({
          title: "Erro",
          description: "Sessão não encontrada",
          variant: "destructive",
        });
        return;
      }

      // Limpar rankings anteriores para este pilar
      await supabase
        .from('user_priorities')
        .delete()
        .eq('session_id', sessionId)
        .in('action_id', actions.map(a => a.id));

      // Salvar novo ranking
      const rankingData = actionRanking.map((action, index) => ({
        session_id: sessionId,
        action_id: action.id,
        rank: index + 1
      }));

      const { error: rankingError } = await supabase
        .from('user_priorities')
        .insert(rankingData);

      if (rankingError) {
        throw rankingError;
      }

      // Chamar onComplete para finalizar o pilar
      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error('Erro ao salvar ranking:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar ranking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header da Missão */}
      <Card className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-unimed-primary to-unimed-light flex items-center justify-center text-lg sm:text-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${pillarColor}15 0%, ${pillarColor}30 100%)`
                }}
              >
                <Target className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <CardTitle className="font-poppins text-lg sm:text-xl md:text-2xl text-white leading-tight">🎯 {pillar.name}</CardTitle>
                <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium leading-relaxed">{pillar.description}</p>
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
          <CardTitle className="flex items-center gap-2 text-white text-lg sm:text-xl">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-unimed-orange" />
            RANKING DE PRIORIDADES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r from-unimed-support/5 to-unimed-info/5 border border-unimed-support/20 mission-drag-container ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => !isCompleted && e.preventDefault()}
            onDragEnter={(e) => !isCompleted && e.preventDefault()}
          >
            <h4 className="font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              {isMobile ? 'Segure e arraste para reorganizar:' : 'Arraste e solte para reorganizar:'}
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {actionRanking.map((action, index) => {
                const currentPosition = getItemPosition(action.id);
                const itemColor = getItemColor(action.id);
                const isItemDragging = isDragging && draggedIndex === index;
                const isItemDragOver = dragOverIndex === index && !isItemDragging;
                const isItemAnimatingFeedback = isItemAnimating(action.id);
                
                return (
                  <React.Fragment key={action.id}>
                    {/* Placeholder antes do item */}
                    {showPlaceholder && dragOverIndex === index && !isItemDragging && (
                      <div className="drag-placeholder visible">
                        <span className="placeholder-text">
                          <ArrowDown className="placeholder-icon" />
                          Soltar aqui
                        </span>
                      </div>
                    )}
                    
                    <div 
                      className={`mission-card backdrop-blur-sm p-3 sm:p-4 rounded-xl border-2 flex items-center gap-3 sm:gap-4 unique-color-item ${
                        isItemDragging ? 'dragging' : ''
                      } ${
                        isItemDragOver ? 'drag-over with-placeholder' : ''
                      } ${
                        isItemAnimatingFeedback ? 'reordering' : ''
                      }`}
                      style={{ 
                        background: getItemGradient(itemColor),
                        borderColor: getItemBorderColor(itemColor)
                      }}
                      draggable={!isCompleted}
                      onTouchStart={(e) => !isCompleted && handleTouchStart(e, index)}
                      onTouchMove={!isCompleted ? handleTouchMove : undefined}
                      onTouchEnd={(e) => !isCompleted && handleTouchEnd(e)}
                      onMouseDown={() => !isCompleted && handleMouseDown(index)}
                      onMouseUp={!isCompleted ? handleMouseUp : undefined}
                      onMouseLeave={!isCompleted ? handleMouseUp : undefined}
                                          onDragStart={(e) => !isCompleted && e.dataTransfer.setData('text/plain', index.toString())}
                    onDragOver={(e) => !isCompleted && handleDragOver(e, index)}
                    onDragEnter={(e) => !isCompleted && handleDragEnter(e, index)}
                    onDrop={(e) => !isCompleted && handleDrop(e, index)}
                    >
                      {/* Drag Handle */}
                      <div 
                        className="drag-handle w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center cursor-grab"
                        style={{ 
                          background: `linear-gradient(135deg, ${itemColor} 0%, ${itemColor}80 100%)`
                        }}
                      >
                        <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-white leading-tight">{action.title}</h5>
                        {action.description && (
                          <p className="text-xs text-white/70 mt-1 font-medium leading-relaxed">{action.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          className="text-white font-bold px-2 py-1 sm:px-3 text-xs"
                          style={{ 
                            backgroundColor: itemColor,
                            borderColor: itemColor
                          }}
                        >
                          {currentPosition}º
                        </Badge>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              
              {/* Placeholder no final da lista */}
              {showPlaceholder && dragOverIndex === actionRanking.length && (
                <div className="drag-placeholder visible">
                  <span className="placeholder-text">
                    <ArrowDown className="placeholder-icon" />
                    Soltar no final
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-unimed-support/30">
            <Button 
              onClick={saveRankingAndComplete}
              disabled={isCompleted || isSubmitting}
              className="escape-run-button text-sm sm:text-base"
            >
              {isSubmitting ? 'Finalizando...' : isCompleted ? 'Pilar Concluído' : 'Concluir Pilar'}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default MissionConsole;
