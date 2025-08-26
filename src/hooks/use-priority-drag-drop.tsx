import { useState, useEffect, useCallback } from 'react';
import type { Action } from '@/lib/types';

interface UsePriorityDragDropProps {
  actions: Action[];
  pillarId: string;
  onPrioritiesChange?: (priorities: Action[]) => void;
}

export const usePriorityDragDrop = ({
  actions,
  pillarId,
  onPrioritiesChange
}: UsePriorityDragDropProps) => {
  const [priorities, setPriorities] = useState<Action[]>([]);

  // Carregar prioridades do localStorage
  useEffect(() => {
    const loadPriorities = () => {
      const storageKey = `priority_drag_drop_${pillarId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPriorities(parsed);
        } catch (error) {
          console.error('Erro ao carregar prioridades:', error);
        }
      }
    };

    loadPriorities();
  }, [pillarId]);

  // Salvar prioridades no localStorage
  const savePriorities = useCallback((newPriorities: Action[]) => {
    const storageKey = `priority_drag_drop_${pillarId}`;
    localStorage.setItem(storageKey, JSON.stringify(newPriorities));
    setPriorities(newPriorities);
    
    // Chamar callback se fornecido
    if (onPrioritiesChange) {
      onPrioritiesChange(newPriorities);
    }
  }, [pillarId, onPrioritiesChange]);

  // Reordenar prioridades
  const reorderPriorities = useCallback((newOrder: Action[]) => {
    savePriorities(newOrder);
  }, [savePriorities]);

  // Definir prioridades iniciais (todas as ações)
  const setInitialPriorities = useCallback(() => {
    savePriorities([...actions]);
  }, [actions, savePriorities]);

  // Limpar todas as prioridades
  const clearPriorities = useCallback(() => {
    savePriorities([]);
  }, [savePriorities]);

  // Verificar se há prioridades
  const hasPriorities = priorities.length > 0;

  // Obter número de prioridades
  const prioritiesCount = priorities.length;

  return {
    priorities,
    hasPriorities,
    prioritiesCount,
    reorderPriorities,
    setInitialPriorities,
    clearPriorities
  };
}; 