import React from 'react';
import type { Action } from '@/lib/types';

export interface PriorityItem {
  actionId: string;
  position: number;
  action: Action;
}

export interface UsePriorityPopoverProps {
  actions: Action[];
  pillarId: string;
  onPrioritiesChange?: (priorities: PriorityItem[]) => void;
}

export const usePriorityPopover = ({
  actions,
  pillarId,
  onPrioritiesChange
}: UsePriorityPopoverProps) => {
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

  // Obter posições ocupadas
  const getOccupiedPositions = React.useCallback(() => {
    return priorities.map(p => p.position);
  }, [priorities]);

  // Obter posições disponíveis
  const getAvailablePositions = React.useCallback(() => {
    const occupied = getOccupiedPositions();
    const available: number[] = [];
    
    // Criar posições apenas até o número de ações
    for (let i = 1; i <= actions.length; i++) {
      if (!occupied.includes(i)) {
        available.push(i);
      }
    }
    
    return available;
  }, [getOccupiedPositions, actions.length]);

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

  // Atribuir posição a uma ação
  const assignPosition = React.useCallback((actionId: string, position: number) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    // Remover posição anterior se existir
    const newPriorities = priorities.filter(p => p.actionId !== actionId);
    
    // Adicionar nova posição
    newPriorities.push({
      actionId,
      position,
      action
    });

    // Ordenar por posição
    newPriorities.sort((a, b) => a.position - b.position);
    
    savePriorities(newPriorities);
    closePopover();
  }, [priorities, actions, savePriorities, closePopover]);

  // Remover posição de uma ação
  const removePosition = React.useCallback((actionId: string) => {
    const newPriorities = priorities.filter(p => p.actionId !== actionId);
    savePriorities(newPriorities);
  }, [priorities, savePriorities]);

  // Limpar todas as prioridades
  const clearAllPriorities = React.useCallback(() => {
    savePriorities([]);
  }, [savePriorities]);

  // Função para obter prioridades atuais (para uso externo)
  const getCurrentPriorities = React.useCallback(() => {
    return priorities;
  }, [priorities]);

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

  return {
    // Estado
    priorities,
    isPopoverOpen,
    selectedAction,
    
    // Funções
    openPopover,
    closePopover,
    assignPosition,
    removePosition,
    clearAllPriorities,
    getCurrentPriorities,
    
    // Utilitários
    getOccupiedPositions,
    getAvailablePositions,
    getActionPosition,
    getOrderedActions,
    hasPriority
  };
}; 