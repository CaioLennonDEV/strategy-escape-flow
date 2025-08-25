
import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, GripVertical, X, Target, Zap } from 'lucide-react';
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

// Componente Sortable para item arrastável
const SortableItem: React.FC<{
  action: DraggableAction;
  showNumber?: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
}> = ({ 
  action, 
  showNumber = false, 
  onRemove, 
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: action.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isItemDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-4 transition-all duration-300 cursor-grab active:cursor-grabbing ${
        isDragging ? 'scale-105 shadow-2xl' : ''
      }`}
      style={{
        ...style,
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 153, 84, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(0, 153, 84, 0.3)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
      }}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showNumber && (
            <Badge 
              variant="secondary" 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-unimed-primary text-white border-0 flex-shrink-0"
            >
              {action.position}
            </Badge>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-white/90 truncate">{action.title}</h4>
            {action.description && (
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{action.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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

// Componente para área de prioridades (única área)
const PriorityArea: React.FC<{
  items: DraggableAction[];
  onRemove: (id: string) => void;
  isFrozen: boolean;
}> = ({ items, onRemove, isFrozen }) => {
  return (
    <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-6" style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-unimed-primary/20 flex items-center justify-center">
          <Target className="h-5 w-5 text-unimed-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">Prioridades</h3>
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
            />
          ))}
        </div>
      )}
    </div>
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
              className={`rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-4 transition-all duration-300 ${
                !isFrozen ? 'cursor-pointer hover:scale-[1.02] hover:border-unimed-primary/50' : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-unimed-primary/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-unimed-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white/90 truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
                {!isFrozen && (
                  <div className="flex-shrink-0">
                    <Badge 
                      variant="outline" 
                      className="bg-unimed-primary/10 text-unimed-primary border-unimed-primary/30 text-xs"
                    >
                      Adicionar
                    </Badge>
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
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Sensores para drag & drop (otimizados para mobile)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Item ativo sendo arrastado
  const activeItem = React.useMemo(() => {
    if (!activeId) return null;
    return [...destinationItems, ...sourceItems].find(item => item.id === activeId);
  }, [activeId, destinationItems, sourceItems]);

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

  // Handlers para drag & drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (isFrozen) return;
    setActiveId(event.active.id as string);
  }, [isFrozen]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (isFrozen) return;
    
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Se o item está sendo arrastado para uma área diferente
    const activeItem = [...destinationItems, ...sourceItems].find(item => item.id === activeId);
    const overItem = [...destinationItems, ...sourceItems].find(item => item.id === overId);

    if (!activeItem || !overItem) return;

    // Se o item ativo está na origem e o item de destino está no destino
    if (!activeItem.isInDestination && overItem.isInDestination) {
      moveToDestination(activeId);
      return;
    }

    // Se o item ativo está no destino e o item de destino está na origem
    if (activeItem.isInDestination && !overItem.isInDestination) {
      moveToSource(activeId);
      return;
    }

    // Reordenação dentro da mesma área
    if (activeItem.isInDestination && overItem.isInDestination) {
      setDestinationItems(prev => {
        const oldIndex = prev.findIndex(item => item.id === activeId);
        const newIndex = prev.findIndex(item => item.id === overId);
        
        if (oldIndex !== newIndex) {
          return arrayMove(prev, oldIndex, newIndex);
        }
        return prev;
      });
    } else if (!activeItem.isInDestination && !overItem.isInDestination) {
      setSourceItems(prev => {
        const oldIndex = prev.findIndex(item => item.id === activeId);
        const newIndex = prev.findIndex(item => item.id === overId);
        
        if (oldIndex !== newIndex) {
          return arrayMove(prev, oldIndex, newIndex);
        }
        return prev;
      });
    }
  }, [isFrozen, destinationItems, sourceItems, moveToDestination, moveToSource]);

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
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: pillar.color + '20' }}
          >
            <Target className="h-6 w-6" style={{ color: pillar.color }} />
          </div>
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

      {/* Contexto principal de drag & drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Área de Prioridades */}
        <SortableContext items={destinationItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <PriorityArea
            items={destinationItems}
            onRemove={moveToSource}
            isFrozen={isFrozen}
          />
        </SortableContext>

        <Separator className="bg-white/10" />

        {/* Área de Ações Disponíveis */}
        <SortableContext items={sourceItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <AvailableActionsArea 
            items={sourceItems} 
            onAdd={moveToDestination}
            isFrozen={isFrozen}
          />
        </SortableContext>

        {/* Overlay para item sendo arrastado */}
        <DragOverlay>
          {activeItem ? (
            <SortableItem
              action={activeItem}
              showNumber={activeItem.isInDestination}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

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
