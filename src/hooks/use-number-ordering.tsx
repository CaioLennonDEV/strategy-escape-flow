import { useState, useCallback, useEffect } from 'react';

interface UseNumberOrderingOptions<T> {
  items: T[];
  onReorder?: (newItems: T[]) => void;
  idField?: keyof T;
}

export const useNumberOrdering = <T extends Record<string, any>>({
  items,
  onReorder,
  idField = 'id' as keyof T
}: UseNumberOrderingOptions<T>) => {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);
  const [positions, setPositions] = useState<Record<string, number>>({});

  // Inicializar posições quando os itens mudam
  useEffect(() => {
    const initialPositions: Record<string, number> = {};
    items.forEach((item, index) => {
      const id = item[idField];
      initialPositions[id] = index + 1;
    });
    setPositions(initialPositions);
    setOrderedItems(items);
  }, [items, idField]);

  // Função para reordenar baseado nas posições
  const reorderByPositions = useCallback((newPositions: Record<string, number>) => {
    const sortedItems = [...items].sort((a, b) => {
      const posA = newPositions[a[idField]] || 1;
      const posB = newPositions[b[idField]] || 1;
      return posA - posB;
    });
    
    setOrderedItems(sortedItems);
    onReorder?.(sortedItems);
  }, [items, idField, onReorder]);

  // Função para atualizar a posição de um item
  const updatePosition = useCallback((itemId: string, newPosition: number) => {
    const totalItems = items.length;
    
    // Validar posição
    if (newPosition < 1 || newPosition > totalItems) {
      return;
    }

    const currentPosition = positions[itemId] || 1;
    
    // Se a posição não mudou, não fazer nada
    if (currentPosition === newPosition) {
      return;
    }

    const newPositions = { ...positions };
    
    // Se está movendo para uma posição maior
    if (newPosition > currentPosition) {
      // Mover itens entre a posição atual e a nova para cima
      Object.keys(newPositions).forEach(id => {
        const pos = newPositions[id];
        if (pos > currentPosition && pos <= newPosition) {
          newPositions[id] = pos - 1;
        }
      });
    } else {
      // Se está movendo para uma posição menor
      // Mover itens entre a nova posição e a atual para baixo
      Object.keys(newPositions).forEach(id => {
        const pos = newPositions[id];
        if (pos >= newPosition && pos < currentPosition) {
          newPositions[id] = pos + 1;
        }
      });
    }
    
    // Definir a nova posição do item
    newPositions[itemId] = newPosition;
    
    setPositions(newPositions);
    reorderByPositions(newPositions);
  }, [positions, items.length, reorderByPositions]);

  // Função para obter a posição atual de um item
  const getPosition = useCallback((itemId: string) => {
    return positions[itemId] || 1;
  }, [positions]);

  // Função para resetar a ordem original
  const resetOrder = useCallback(() => {
    const originalPositions: Record<string, number> = {};
    items.forEach((item, index) => {
      const id = item[idField];
      originalPositions[id] = index + 1;
    });
    setPositions(originalPositions);
    setOrderedItems(items);
    onReorder?.(items);
  }, [items, idField, onReorder]);

  return {
    orderedItems,
    positions,
    updatePosition,
    getPosition,
    resetOrder,
    totalItems: items.length
  };
}; 