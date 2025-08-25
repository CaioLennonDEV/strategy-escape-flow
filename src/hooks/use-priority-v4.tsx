import React from 'react';
import type { Action } from '@/lib/types';

export interface PriorityItem {
  actionId: string;
  position: number;
  action: Action;
}

export interface UsePriorityV4Props {
  actions: Action[];
  pillarId: string;
  onPrioritiesChange?: (priorities: PriorityItem[]) => void;
}

export const usePriorityV4 = ({
  actions,
  pillarId,
  onPrioritiesChange
}: UsePriorityV4Props) => {
  const [priorities, setPriorities] = React.useState<PriorityItem[]>([]);
  const [animatingItems, setAnimatingItems] = React.useState<Set<string>>(new Set());

  // Carregar prioridades do localStorage
  React.useEffect(() => {
    const loadPriorities = () => {
      const storageKey = `priorities_${pillarId}`;
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
  const savePriorities = React.useCallback((newPriorities: PriorityItem[]) => {
    const storageKey = `priorities_${pillarId}`;
    localStorage.setItem(storageKey, JSON.stringify(newPriorities));
    setPriorities(newPriorities);
  }, [pillarId]);

  // Obter próxima posição disponível
  const getNextPosition = React.useCallback(() => {
    return priorities.length + 1;
  }, [priorities.length]);

  // Obter posição atual de uma ação
  const getActionPosition = React.useCallback((actionId: string) => {
    const priority = priorities.find(p => p.actionId === actionId);
    return priority?.position || null;
  }, [priorities]);

  // Adicionar ação como próxima prioridade com animação
  const addAsNextPriority = React.useCallback((actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const nextPosition = getNextPosition();
    
    // Marcar item como animando
    setAnimatingItems(prev => new Set(prev).add(actionId));
    
    // Adicionar nova prioridade
    const newPriorities = [...priorities, {
      actionId,
      position: nextPosition,
      action
    }];

    savePriorities(newPriorities);
    
    // Remover da lista de animação após 800ms (tempo da animação)
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 800);
  }, [priorities, actions, getNextPosition, savePriorities]);

  // Remover prioridade de uma ação com animação
  const removePriority = React.useCallback((actionId: string) => {
    // Marcar item como animando
    setAnimatingItems(prev => new Set(prev).add(actionId));
    
    const newPriorities = priorities.filter(p => p.actionId !== actionId);
    
    // Reordenar as posições restantes
    const reorderedPriorities = newPriorities
      .sort((a, b) => a.position - b.position)
      .map((priority, index) => ({
        ...priority,
        position: index + 1
      }));
    
    savePriorities(reorderedPriorities);
    
    // Remover da lista de animação após 800ms
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 800);
  }, [priorities, savePriorities]);

  // Limpar todas as prioridades
  const clearAllPriorities = React.useCallback(() => {
    savePriorities([]);
  }, [savePriorities]);

  // Obter ações ordenadas por prioridade
  const getOrderedActions = React.useCallback(() => {
    return priorities
      .sort((a, b) => a.position - b.position)
      .map(p => p.action);
  }, [priorities]);

  // Verificar se uma ação tem prioridade
  const hasPriority = React.useCallback((actionId: string) => {
    return priorities.some(p => p.actionId === actionId);
  }, [priorities]);

  // Obter prioridades atuais (para uso externo)
  const getCurrentPriorities = React.useCallback(() => {
    return priorities;
  }, [priorities]);

  // Verificar se um item está animando
  const isAnimating = React.useCallback((actionId: string) => {
    return animatingItems.has(actionId);
  }, [animatingItems]);

  return {
    // Estado
    priorities,
    
    // Funções
    addAsNextPriority,
    removePriority,
    clearAllPriorities,
    getCurrentPriorities,
    
    // Utilitários
    getActionPosition,
    getOrderedActions,
    hasPriority,
    getNextPosition,
    isAnimating
  };
}; 