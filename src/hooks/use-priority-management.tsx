import { useState, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { Action } from '@/lib/types';

interface DraggableAction extends Action {
  id: string;
  isInDestination: boolean;
  position?: number;
  customOrder?: number; // Para ordenação manual
}

interface PriorityState {
  destinationItems: DraggableAction[];
  sourceItems: DraggableAction[];
  isFrozen: boolean;
}

export const usePriorityManagement = (actions: Action[], pillarId: string) => {
  const [state, setState] = useState<PriorityState>(() => {
    // Tentar carregar do localStorage
    const savedState = localStorage.getItem(`priority_state_${pillarId}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return parsed;
      } catch (error) {
        console.error('Erro ao carregar estado salvo:', error);
      }
    }
    
    // Estado inicial
    return {
      destinationItems: [],
      sourceItems: actions.map(action => ({
        ...action,
        id: action.id.toString(),
        isInDestination: false
      })),
      isFrozen: false
    };
  });

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(`priority_state_${pillarId}`, JSON.stringify(state));
  }, [state, pillarId]);

  // Função para mover item da origem para o destino
  const moveToDestination = useCallback((itemId: string) => {
    if (state.isFrozen) return;
    
    setState(prev => {
      const item = prev.sourceItems.find(i => i.id === itemId);
      if (!item) return prev;

      // Adicionar posição automática baseada na ordem atual
      const newPosition = prev.destinationItems.length + 1;
      
      return {
        ...prev,
        sourceItems: prev.sourceItems.filter(i => i.id !== itemId),
        destinationItems: [...prev.destinationItems, { 
          ...item, 
          isInDestination: true,
          position: newPosition,
          customOrder: newPosition
        }]
      };
    });
  }, [state.isFrozen]);

  // Função para mover item do destino para a origem
  const moveToSource = useCallback((itemId: string) => {
    if (state.isFrozen) return;
    
    setState(prev => {
      const item = prev.destinationItems.find(i => i.id === itemId);
      if (!item) return prev;

      // Reordenar posições dos itens restantes
      const updatedDestinationItems = prev.destinationItems
        .filter(i => i.id !== itemId)
        .map((item, index) => ({
          ...item,
          position: index + 1,
          customOrder: index + 1
        }));

      return {
        ...prev,
        destinationItems: updatedDestinationItems,
        sourceItems: [...prev.sourceItems, { 
          ...item, 
          isInDestination: false,
          position: undefined,
          customOrder: undefined
        }]
      };
    });
  }, [state.isFrozen]);

  // Função para reordenar itens no destino
  const reorderDestination = useCallback((oldIndex: number, newIndex: number) => {
    if (state.isFrozen) return;
    
    setState(prev => {
      const reorderedItems = arrayMove(prev.destinationItems, oldIndex, newIndex);
      
      // Atualizar posições numeradas
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        position: index + 1,
        customOrder: index + 1
      }));

      return {
        ...prev,
        destinationItems: updatedItems
      };
    });
  }, [state.isFrozen]);

  // Função para reordenar itens na origem
  const reorderSource = useCallback((oldIndex: number, newIndex: number) => {
    if (state.isFrozen) return;
    
    setState(prev => ({
      ...prev,
      sourceItems: arrayMove(prev.sourceItems, oldIndex, newIndex)
    }));
  }, [state.isFrozen]);

  // Função para ordenar por número específico
  const sortByNumber = useCallback((itemId: string, newPosition: number) => {
    if (state.isFrozen) return;
    
    setState(prev => {
      const currentIndex = prev.destinationItems.findIndex(item => item.id === itemId);
      if (currentIndex === -1) return prev;

      const maxPosition = prev.destinationItems.length;
      const validPosition = Math.max(1, Math.min(newPosition, maxPosition));

      // Se a posição não mudou, não fazer nada
      if (prev.destinationItems[currentIndex].position === validPosition) return prev;

      // Criar nova lista com a posição atualizada
      const updatedItems = [...prev.destinationItems];
      updatedItems[currentIndex] = {
        ...updatedItems[currentIndex],
        position: validPosition,
        customOrder: validPosition
      };

      // Ordenar pela nova posição
      const sortedItems = updatedItems.sort((a, b) => {
        const posA = a.position || 0;
        const posB = b.position || 0;
        return posA - posB;
      });

      // Reajustar posições para garantir sequência
      const finalItems = sortedItems.map((item, index) => ({
        ...item,
        position: index + 1,
        customOrder: index + 1
      }));

      return {
        ...prev,
        destinationItems: finalItems
      };
    });
  }, [state.isFrozen]);

  // Função para ordenar automaticamente (1, 2, 3...)
  const autoSort = useCallback(() => {
    if (state.isFrozen) return;
    
    setState(prev => ({
      ...prev,
      destinationItems: prev.destinationItems.map((item, index) => ({
        ...item,
        position: index + 1,
        customOrder: index + 1
      }))
    }));
  }, [state.isFrozen]);

  // Função para inverter ordem
  const reverseOrder = useCallback(() => {
    if (state.isFrozen) return;
    
    setState(prev => ({
      ...prev,
      destinationItems: prev.destinationItems
        .reverse()
        .map((item, index) => ({
          ...item,
          position: index + 1,
          customOrder: index + 1
        }))
    }));
  }, [state.isFrozen]);

  // Função para ordenar alfabeticamente
  const sortAlphabetically = useCallback(() => {
    if (state.isFrozen) return;
    
    setState(prev => ({
      ...prev,
      destinationItems: prev.destinationItems
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((item, index) => ({
          ...item,
          position: index + 1,
          customOrder: index + 1
        }))
    }));
  }, [state.isFrozen]);

  // Função para congelar as prioridades
  const freezePriorities = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFrozen: true
    }));
  }, []);

  // Função para resetar o estado
  const resetState = useCallback(() => {
    setState({
      destinationItems: [],
      sourceItems: actions.map(action => ({
        ...action,
        id: action.id.toString(),
        isInDestination: false
      })),
      isFrozen: false
    });
  }, [actions]);

  // Função para verificar se todas as ações foram priorizadas
  const isComplete = state.destinationItems.length === actions.length;

  // Função para obter itens ordenados por posição
  const getSortedDestinationItems = useCallback(() => {
    return [...state.destinationItems].sort((a, b) => {
      const posA = a.position || 0;
      const posB = b.position || 0;
      return posA - posB;
    });
  }, [state.destinationItems]);

  return {
    destinationItems: state.destinationItems,
    sourceItems: state.sourceItems,
    isFrozen: state.isFrozen,
    isComplete,
    moveToDestination,
    moveToSource,
    reorderDestination,
    reorderSource,
    sortByNumber,
    autoSort,
    reverseOrder,
    sortAlphabetically,
    freezePriorities,
    resetState,
    getSortedDestinationItems
  };
}; 