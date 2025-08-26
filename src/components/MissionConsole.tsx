
import React, { useState, useCallback, useRef, useEffect } from 'react';


import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, GripVertical, X, Target, Zap, Plus } from 'lucide-react';
import type { Action, Pillar } from '@/lib/types';

interface MissionConsoleProps {
  pillar: Pillar;
  actions: Action[];
  onComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
}

interface DraggableAction extends Action {
  id: string;
  isInDestination: boolean;
  position?: number;
}

// Componente Sortable para item arrastável (versão funcional baseada no exemplo original)
const SortableItem: React.FC<{
  action: DraggableAction;
  showNumber?: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent | React.TouchEvent, item: DraggableAction) => void;
  onDragEnter?: (e: React.DragEvent | React.TouchEvent) => void;
  onDragLeave?: (e: React.DragEvent | React.TouchEvent) => void;
  onDragOver?: (e: React.DragEvent | React.TouchEvent) => void;
  onDrop?: (e: React.DragEvent | React.TouchEvent, item: DraggableAction) => void;
  onDragEnd?: (e: React.DragEvent | React.TouchEvent) => void;
  onTouchStart?: (e: React.TouchEvent, item: DraggableAction) => void;
}> = ({ 
  action, 
  showNumber = false, 
  onRemove, 
  isDragging = false,
  onDragStart,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onDragEnd,
  onTouchStart
}) => {
  return (
    <div
      className={`draggable rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-4 transition-all duration-300 cursor-grab active:cursor-grabbing min-h-[80px] ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      }`}
      style={{
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 153, 84, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(0, 153, 84, 0.3)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
      }}
      draggable
      data-id={action.id}
      onDragStart={(e) => onDragStart?.(e, action)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, action)}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart?.(e, action)}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex items-start gap-3 flex-1">
          {showNumber && (
            <Badge 
              variant="secondary" 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-unimed-primary text-white border-0 flex-shrink-0 mt-0.5"
            >
              {action.position}
            </Badge>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base text-white/90">{action.title}</h4>
            {action.description && (
              <p className="text-sm text-white/60 mt-1 leading-relaxed">{action.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-1 flex-shrink-0">
          <div className="p-1 text-white/50">
            <GripVertical className="h-4 w-4" />
          </div>
          {showNumber && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="h-8 w-8 p-0 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para área de prioridades (única área) com drag and drop funcional
const PriorityArea: React.FC<{
  items: DraggableAction[];
  onRemove: (id: string) => void;
  isFrozen: boolean;
  onReorder?: (newOrder: DraggableAction[]) => void;
}> = ({ items, onRemove, isFrozen, onReorder }) => {
  const [draggedItem, setDraggedItem] = useState<DraggableAction | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; item: DraggableAction | null }>({
    x: 0,
    y: 0,
    item: null
  });

  const handleDragStart = useCallback((e: React.DragEvent | React.TouchEvent, item: DraggableAction) => {
    if (isFrozen) return;
    setDraggedItem(item);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
    
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.id);
    }
  }, [isFrozen]);

  const handleDragEnter = useCallback((e: React.DragEvent | React.TouchEvent, itemId?: string) => {
    if (isFrozen) return;
    if (itemId) {
      setDragOverItem(itemId);
      (e.currentTarget as HTMLElement).classList.add('over');
    }
  }, [isFrozen]);

  const handleDragLeave = useCallback((e: React.DragEvent | React.TouchEvent) => {
    if (isFrozen) return;
    if ('stopPropagation' in e) {
      e.stopPropagation();
    }
    (e.currentTarget as HTMLElement).classList.remove('over');
    setDragOverItem(null);
  }, [isFrozen]);

  const handleDragOver = useCallback((e: React.DragEvent | React.TouchEvent) => {
    if (isFrozen) return;
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    if ('dataTransfer' in e) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, [isFrozen]);

  const handleDrop = useCallback((e: React.DragEvent | React.TouchEvent, targetItem: DraggableAction) => {
    if (isFrozen) return;
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
    if (draggedItem && draggedItem.id !== targetItem.id && onReorder) {
      const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
      const targetIndex = items.findIndex(item => item.id === targetItem.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newItems = [...items];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, removed);
        
        onReorder(newItems);
      }
    }
    
    setDragOverItem(null);
  }, [draggedItem, items, onReorder, isFrozen]);

  const handleDragEnd = useCallback((e: React.DragEvent | React.TouchEvent) => {
    const listItems = document.querySelectorAll('.draggable');
    listItems.forEach(item => {
      item.classList.remove('over');
      (item as HTMLElement).style.opacity = '1';
    });
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverItem(null);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, item: DraggableAction) => {
    if (isFrozen) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      item
    };
    setDraggedItem(item);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
  }, [isFrozen]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || isFrozen) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Only start drag if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      // Find element under touch
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const draggableElement = element?.closest('.draggable');
      
      if (draggableElement) {
        const itemId = draggableElement.getAttribute('data-id');
        if (itemId && itemId !== dragOverItem) {
          setDragOverItem(itemId);
          draggableElement.classList.add('over');
        }
      }
    }
  }, [isDragging, dragOverItem, isFrozen]);

  const handleTouchEnd = useCallback(() => {
    if (draggedItem && dragOverItem && onReorder) {
      const targetItem = items.find(item => item.id === dragOverItem);
      if (targetItem) {
        const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
        const targetIndex = items.findIndex(item => item.id === targetItem.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
          const newItems = [...items];
          const [removed] = newItems.splice(draggedIndex, 1);
          newItems.splice(targetIndex, 0, removed);
          
          onReorder(newItems);
        }
      }
    }
    
    // Clean up
    const listItems = document.querySelectorAll('.draggable');
    listItems.forEach(item => {
      item.classList.remove('over');
      (item as HTMLElement).style.opacity = '1';
    });
    
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverItem(null);
  }, [draggedItem, dragOverItem, items, onReorder]);

  // Add global touch event listeners for mobile
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && !isFrozen) {
        e.preventDefault();
        handleTouchMove(e as any);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleTouchEnd();
      }
    };

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd, isFrozen]);

  return (
    <>
      <style>
        {`
          .over {
            transform: scale(1.1, 1.1);
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .draggable {
              touch-action: none;
              user-select: none;
              -webkit-user-select: none;
              -webkit-touch-callout: none;
            }
          }
        `}
      </style>
      <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-6" style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
      }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-unimed-primary/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-unimed-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Prioridades</h3>
            <p className="text-sm text-white/60">
              {isFrozen ? 'Prioridades congeladas' : 'Arraste para reorganizar'}
            </p>
          </div>
          {items.length > 0 && (
            <Badge 
              variant="outline" 
              className="bg-unimed-primary/10 text-unimed-primary border-unimed-primary/30"
            >
              {items.length} item{items.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/50">
            <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center mb-4">
              <GripVertical className="h-8 w-8 text-white/30" />
            </div>
            <p className="text-sm font-medium text-white/70">Nenhuma prioridade definida</p>
            <p className="text-xs text-white/50 mt-1">Adicione ações da lista abaixo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <SortableItem
                key={item.id}
                action={{ ...item, position: index + 1 }}
                showNumber={true}
                onRemove={isFrozen ? undefined : () => onRemove(item.id)}
                isDragging={draggedItem?.id === item.id}
                onDragStart={handleDragStart}
                onDragEnter={(e) => handleDragEnter(e, item.id)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onTouchStart={handleTouchStart}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// Componente para área de ações disponíveis
const AvailableActionsArea: React.FC<{
  items: DraggableAction[];
  onAdd: (id: string) => void;
  isFrozen: boolean;
}> = ({ items, onAdd, isFrozen }) => {
  return (
    <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-6" style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-unimed-light/20 flex items-center justify-center">
          <Zap className="h-5 w-5 text-unimed-light" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Ações Disponíveis</h3>
          <p className="text-sm text-white/60">
            {isFrozen ? 'Prioridades congeladas' : 'Clique para adicionar'}
          </p>
        </div>
        {items.length > 0 && (
          <Badge 
            variant="outline" 
            className="bg-unimed-light/10 text-unimed-light border-unimed-light/30"
          >
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-white/50">
          <CheckCircle2 className="h-12 w-12 text-unimed-primary mb-3" />
          <p className="text-sm font-medium text-white/70">Todas as ações foram priorizadas!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => !isFrozen && onAdd(item.id)}
              className={`rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-4 transition-all duration-300 min-h-[80px] ${
                !isFrozen ? 'cursor-pointer hover:scale-[1.02] hover:border-unimed-primary/50' : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
              }}
            >
              <div className="flex items-start justify-between h-full">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-unimed-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-unimed-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base text-white/90">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-white/60 mt-1 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
                {!isFrozen && (
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAdd(item.id)}
                      className="h-8 w-8 p-0 hover:bg-unimed-primary/20 text-white/70 hover:text-unimed-primary border border-white/10"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MissionConsole: React.FC<MissionConsoleProps> = ({
  pillar,
  actions,
  onComplete,
  isCompleted = false,
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [destinationItems, setDestinationItems] = useState<DraggableAction[]>([]);
  const [sourceItems, setSourceItems] = useState<DraggableAction[]>(
    actions.map(action => ({
      ...action,
      id: action.id.toString(),
      isInDestination: false
    }))
  );
  
  const { toast } = useToast();

  // Função para mover item da origem para o destino
  const moveToDestination = useCallback((itemId: string) => {
    const item = sourceItems.find(i => i.id === itemId);
    if (!item) return;

    setSourceItems(prev => prev.filter(i => i.id !== itemId));
    setDestinationItems(prev => [...prev, { ...item, isInDestination: true }]);
  }, [sourceItems]);

  // Função para mover item do destino para a origem
  const moveToSource = useCallback((itemId: string) => {
    const item = destinationItems.find(i => i.id === itemId);
    if (!item) return;

    setDestinationItems(prev => prev.filter(i => i.id !== itemId));
    setSourceItems(prev => [...prev, { ...item, isInDestination: false }]);
  }, [destinationItems]);

  // Função para reordenar itens no destino
  const reorderDestination = useCallback((newOrder: DraggableAction[]) => {
    if (isFrozen) return;
    
    const updatedItems = newOrder.map((item, index) => ({
      ...item,
      position: index + 1
    }));
    
    setDestinationItems(updatedItems);
  }, [isFrozen]);



  const handleComplete = async () => {
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

      // Verificar se todas as ações foram priorizadas
      if (destinationItems.length !== actions.length) {
        toast({
          title: "Atenção",
          description: "Todas as ações devem ser priorizadas antes de concluir",
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
      const rankingData = destinationItems.map((item, index) => ({
        session_id: sessionId,
        action_id: item.id,
        rank: index + 1
      }));

      const { error: rankingError } = await supabase
        .from('user_priorities')
        .insert(rankingData);

      if (rankingError) {
        throw rankingError;
      }

      // Congelar as prioridades
      setIsFrozen(true);

      toast({
        title: "Sucesso",
        description: "Prioridades salvas e congeladas com sucesso!",
        variant: "default",
      });

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
    <div className={`space-y-6 ${className}`}>
      {/* Header da Missão */}
      <div className="mission-header">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{pillar.name}</h2>
            <p className="text-white/70">{pillar.description}</p>
          </div>
        </div>
        
        {/* Indicador de progresso */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-unimed-primary">{destinationItems.length}</div>
            <div className="text-xs text-white/60">Prioridades</div>
          </div>
          <div className="text-white/30">/</div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white/70">{actions.length}</div>
            <div className="text-xs text-white/60">Total</div>
          </div>
        </div>
      </div>

      {/* Área de Prioridades */}
      <PriorityArea
        items={destinationItems}
        onRemove={moveToSource}
        isFrozen={isFrozen}
        onReorder={reorderDestination}
      />

      <Separator className="bg-white/10" />

      {/* Área de Ações Disponíveis */}
      <AvailableActionsArea 
        items={sourceItems} 
        onAdd={moveToDestination}
        isFrozen={isFrozen}
      />

      {/* Botão de conclusão */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleComplete}
          disabled={isSubmitting || destinationItems.length !== actions.length || isFrozen}
          className="px-8 py-4 text-base font-bold transition-all duration-300"
          style={{
            backgroundColor: destinationItems.length === actions.length && !isFrozen ? 'hsl(148, 201, 91)' : 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: destinationItems.length === actions.length && !isFrozen ? '#000' : 'rgba(255, 255, 255, 0.5)',
            boxShadow: destinationItems.length === actions.length && !isFrozen
              ? '0 0 20px rgba(148, 201, 91, 0.4)' 
              : '0 0 15px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Salvando...
            </>
          ) : isFrozen ? (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Prioridades Concluídas
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Concluir Priorização
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MissionConsole;
