import { useState, useCallback, useEffect } from 'react';

interface UseQuickOrderingOptions<T> {
  items: T[];
  onReorder?: (newItems: T[]) => void;
  idField?: keyof T;
  onItemMove?: (
    itemId: string, 
    fromPosition: number, 
    toPosition: number, 
    direction: 'up' | 'down',
    affectedItems: { movedItem: string; swappedItem: string }
  ) => void;
}

export const useQuickOrdering = <T extends Record<string, any>>({
  items,
  onReorder,
  idField = 'id' as keyof T,
  onItemMove
}: UseQuickOrderingOptions<T>) => {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const moveItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    const currentIndex = orderedItems.findIndex(item => item[idField] === itemId);
    if (currentIndex === -1) return;

    const newItems = [...orderedItems];
    const fromPosition = currentIndex + 1;
    let toPosition = fromPosition;
    let swappedItemId = '';
    
    if (direction === 'up' && currentIndex > 0) {
      // Mover para cima
      swappedItemId = newItems[currentIndex - 1][idField];
      const temp = newItems[currentIndex];
      newItems[currentIndex] = newItems[currentIndex - 1];
      newItems[currentIndex - 1] = temp;
      toPosition = currentIndex;
    } else if (direction === 'down' && currentIndex < newItems.length - 1) {
      // Mover para baixo
      swappedItemId = newItems[currentIndex + 1][idField];
      const temp = newItems[currentIndex];
      newItems[currentIndex] = newItems[currentIndex + 1];
      newItems[currentIndex + 1] = temp;
      toPosition = currentIndex + 2;
    } else {
      return; // Não pode mover
    }

    setOrderedItems(newItems);
    onReorder?.(newItems);
    onItemMove?.(itemId, fromPosition, toPosition, direction, {
      movedItem: itemId,
      swappedItem: swappedItemId
    });
  }, [orderedItems, idField, onReorder, onItemMove]);

  const moveToTop = useCallback((itemId: string) => {
    const currentIndex = orderedItems.findIndex(item => item[idField] === itemId);
    if (currentIndex <= 0) return;

    const newItems = [...orderedItems];
    const itemToMove = newItems[currentIndex];
    newItems.splice(currentIndex, 1);
    newItems.unshift(itemToMove);

    setOrderedItems(newItems);
    onReorder?.(newItems);
  }, [orderedItems, idField, onReorder]);

  const moveToBottom = useCallback((itemId: string) => {
    const currentIndex = orderedItems.findIndex(item => item[idField] === itemId);
    if (currentIndex === -1 || currentIndex === orderedItems.length - 1) return;

    const newItems = [...orderedItems];
    const itemToMove = newItems[currentIndex];
    newItems.splice(currentIndex, 1);
    newItems.push(itemToMove);

    setOrderedItems(newItems);
    onReorder?.(newItems);
  }, [orderedItems, idField, onReorder]);

  const canMoveUp = useCallback((itemId: string) => {
    const index = orderedItems.findIndex(item => item[idField] === itemId);
    return index > 0;
  }, [orderedItems, idField]);

  const canMoveDown = useCallback((itemId: string) => {
    const index = orderedItems.findIndex(item => item[idField] === itemId);
    return index < orderedItems.length - 1;
  }, [orderedItems, idField]);

  const getItemPosition = useCallback((itemId: string) => {
    const index = orderedItems.findIndex(item => item[idField] === itemId);
    return index + 1;
  }, [orderedItems, idField]);

  return {
    orderedItems,
    moveItem,
    moveToTop,
    moveToBottom,
    canMoveUp,
    canMoveDown,
    getItemPosition,
    totalItems: orderedItems.length
  };
}; 