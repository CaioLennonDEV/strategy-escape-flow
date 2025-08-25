
import React, { useState, useCallback } from 'react';
// TODO: Instalar dependências do drag & drop:
// npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
// 
// Imports que serão descomentados após instalação:
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverEvent,
//   DragOverlay,
//   DragStartEvent,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   closestCenter,
//   closestCorners,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   arrayMove,
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, GripVertical, X, ArrowUp, ArrowDown, Target, Zap } from 'lucide-react';
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

// Componente temporário para item (sem drag & drop)
const DraggableItem: React.FC<{
  action: DraggableAction;
  showNumber?: boolean;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}> = ({ action, showNumber = false, onRemove, onMoveUp, onMoveDown, canMoveUp = false, canMoveDown = false }) => {
  return (
    <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-4 transition-all duration-300" style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
    }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showNumber && (
            <Badge 
              variant="secondary" 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-unimed-primary text-white border-0"
            >
              {action.position}
            </Badge>
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-white/90">{action.title}</h4>
            {action.description && (
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{action.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {showNumber && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="h-8 w-8 p-0 hover:bg-unimed-primary/20 text-white/70 hover:text-unimed-primary border border-white/10"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="h-8 w-8 p-0 hover:bg-unimed-primary/20 text-white/70 hover:text-unimed-primary border border-white/10"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </>
          )}
          {showNumber && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
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

// Componente para área de destino (superior)
const DestinationArea: React.FC<{
  items: DraggableAction[];
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}> = ({ items, onRemove, onMoveUp, onMoveDown }) => {
  return (
    <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-6" style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-unimed-primary/20 flex items-center justify-center">
          <Target className="h-5 w-5 text-unimed-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Prioridades Definidas</h3>
          <p className="text-sm text-white/60">Organize na ordem de importância</p>
        </div>
        {items.length > 0 && (
          <Badge 
            variant="outline" 
            className="ml-auto bg-unimed-primary/10 text-unimed-primary border-unimed-primary/30"
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
          <p className="text-sm font-medium text-white/70">Clique nas prioridades abaixo para adicionar</p>
          <p className="text-xs text-white/50 mt-1">Organize na ordem de importância</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <DraggableItem
              key={item.id}
              action={{ ...item, position: index + 1 }}
              showNumber={true}
              onRemove={() => onRemove(item.id)}
              onMoveUp={() => onMoveUp(item.id)}
              onMoveDown={() => onMoveDown(item.id)}
              canMoveUp={index > 0}
              canMoveDown={index < items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para área de origem (inferior)
const SourceArea: React.FC<{
  items: DraggableAction[];
  onAdd: (id: string) => void;
}> = ({ items, onAdd }) => {
  return (
    <div className="rounded-2xl border-2 border-unimed-primary/30 bg-black/40 backdrop-blur-md p-6" style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 153, 84, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px rgba(0, 153, 84, 0.1)'
    }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-unimed-light/20 flex items-center justify-center">
          <Zap className="h-5 w-5 text-unimed-light" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Prioridades Disponíveis</h3>
          <p className="text-sm text-white/60">Clique para adicionar à lista</p>
        </div>
        {items.length > 0 && (
          <Badge 
            variant="outline" 
            className="ml-auto bg-unimed-light/10 text-unimed-light border-unimed-light/30"
          >
            {items.length} item{items.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-white/50">
          <CheckCircle2 className="h-12 w-12 text-unimed-primary mb-3" />
          <p className="text-sm font-medium text-white/70">Todas as prioridades foram organizadas!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onAdd(item.id)}
              className="cursor-pointer hover:scale-[1.02] transition-all duration-300"
            >
              <DraggableItem action={item} />
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

  // Função para mover item para cima no destino
  const moveUp = useCallback((itemId: string) => {
    setDestinationItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index <= 0) return prev;
      
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems;
    });
  }, []);

  // Função para mover item para baixo no destino
  const moveDown = useCallback((itemId: string) => {
    setDestinationItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index >= prev.length - 1) return prev;
      
      const newItems = [...prev];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return newItems;
    });
  }, []);

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

      toast({
        title: "Sucesso",
        description: "Prioridades salvas com sucesso!",
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
    <div className={`space-y-8 ${className}`}>
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

      {/* Área de Destino */}
      <DestinationArea
        items={destinationItems}
        onRemove={moveToSource}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
      />

      <Separator className="bg-white/10" />

      {/* Área de Origem */}
      <SourceArea 
        items={sourceItems} 
        onAdd={moveToDestination}
      />

      {/* Botão de conclusão */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleComplete}
          disabled={isSubmitting || destinationItems.length !== actions.length}
          className="px-8 py-4 text-base font-bold transition-all duration-300"
          style={{
            backgroundColor: destinationItems.length === actions.length ? 'hsl(148, 201, 91)' : 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            color: destinationItems.length === actions.length ? '#000' : 'rgba(255, 255, 255, 0.5)',
            boxShadow: destinationItems.length === actions.length 
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
