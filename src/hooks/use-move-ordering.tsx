import { useState, useCallback, useEffect } from 'react';

interface UseMoveOrderingOptions<T> {
  items: T[];
  onReorder?: (newItems: T[]) => void;
  idField?: keyof T;
}

export const useMoveOrdering = <T extends Record<string, any>>({
  items,
  onReorder,
  idField = 'id' as keyof T
}: UseMoveOrderingOptions<T>) => {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);
  const [movingItem, setMovingItem] = useState<string | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const startMoving = useCallback((itemId: string) => {
    setMovingItem(itemId);
  }, []);

  const moveToPosition = useCallback((targetPosition: number) => {
    if (!movingItem) return;

    const currentIndex = orderedItems.findIndex(item => item[idField] === movingItem);
    if (currentIndex === -1) return;

    const newItems = [...orderedItems];
    const itemToMove = newItems[currentIndex];
    
    // Remover o item da posição atual
    newItems.splice(currentIndex, 1);
    
    // Inserir na nova posição (ajustar índice se necessário)
    const insertIndex = targetPosition > currentIndex ? targetPosition - 1 : targetPosition;
    newItems.splice(insertIndex, 0, itemToMove);
    
    setOrderedItems(newItems);
    onReorder?.(newItems);
    setMovingItem(null);
  }, [movingItem, orderedItems, idField, onReorder]);

  const cancelMoving = useCallback(() => {
    setMovingItem(null);
  }, []);

  const isMoving = useCallback((itemId: string) => {
    return movingItem === itemId;
  }, [movingItem]);

  return {
    orderedItems,
    startMoving,
    moveToPosition,
    cancelMoving,
    isMoving,
    isMovingMode: movingItem !== null
  };
}; 