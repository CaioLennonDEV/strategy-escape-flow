import React from 'react';
import type { Action } from '@/lib/types';

export interface PriorityItem {
  actionId: string;
  position: number;
  action: Action;
}

export interface UsePriorityPopoverV3Props {
  actions: Action[];
  pillarId: string;
  onPrioritiesChange?: (priorities: PriorityItem[]) => void;
}

export const usePriorityPopoverV3 = ({
  actions,
  pillarId,
  onPrioritiesChange
}: UsePriorityPopoverV3Props) => {
  const [priorities, setPriorities] = React.useState<PriorityItem[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState<Action | null>(null);

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

  // Abrir popover para uma ação
  const openPopover = React.useCallback((action: Action) => {
    setSelectedAction(action);
    setIsPopoverOpen(true);
  }, []);

  // Fechar popover
  const closePopover = React.useCallback(() => {
    setIsPopoverOpen(false);
    setSelectedAction(null);
  }, []);

  // Adicionar ação como próxima prioridade
  const addAsNextPriority = React.useCallback((actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const nextPosition = getNextPosition();
    
    // Adicionar nova prioridade
    const newPriorities = [...priorities, {
      actionId,
      position: nextPosition,
      action
    }];

    savePriorities(newPriorities);
    closePopover();
  }, [priorities, actions, getNextPosition, savePriorities, closePopover]);

  // Remover prioridade de uma ação
  const removePriority = React.useCallback((actionId: string) => {
    const newPriorities = priorities.filter(p => p.actionId !== actionId);
    
    // Reordenar as posições restantes
    const reorderedPriorities = newPriorities
      .sort((a, b) => a.position - b.position)
      .map((priority, index) => ({
        ...priority,
        position: index + 1
      }));
    
    savePriorities(reorderedPriorities);
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

  return {
    // Estado
    priorities,
    isPopoverOpen,
    selectedAction,
    
    // Funções
    openPopover,
    closePopover,
    addAsNextPriority,
    removePriority,
    clearAllPriorities,
    getCurrentPriorities,
    
    // Utilitários
    getActionPosition,
    getOrderedActions,
    hasPriority,
    getNextPosition
  };
}; 