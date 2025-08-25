import { useState, useCallback, useEffect } from 'react';

interface UseSwapModalOrderingOptions<T> {
  items: T[];
  onReorder?: (newItems: T[]) => void;
  idField?: keyof T;
}

export const useSwapModalOrdering = <T extends Record<string, any>>({
  items,
  onReorder,
  idField = 'id' as keyof T
}: UseSwapModalOrderingOptions<T>) => {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [targetPosition, setTargetPosition] = useState<number | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const openSwapModal = useCallback((item: T) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setTargetPosition(null);
  }, []);

  const selectTargetPosition = useCallback((position: number) => {
    setTargetPosition(position);
  }, []);

  const confirmSwap = useCallback(() => {
    if (!selectedItem || targetPosition === null) return;

    const selectedIndex = orderedItems.findIndex(item => item[idField] === selectedItem[idField]);
    const targetIndex = targetPosition - 1; // Converter posição para índice

    if (selectedIndex === -1 || targetIndex < 0 || targetIndex >= orderedItems.length) return;

    const newItems = [...orderedItems];
    const temp = newItems[selectedIndex];
    newItems[selectedIndex] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setOrderedItems(newItems);
    onReorder?.(newItems);
    closeModal();
  }, [selectedItem, targetPosition, orderedItems, idField, onReorder, closeModal]);

  const getItemPosition = useCallback((itemId: string) => {
    const index = orderedItems.findIndex(item => item[idField] === itemId);
    return index + 1;
  }, [orderedItems, idField]);

  const getItemById = useCallback((itemId: string) => {
    return orderedItems.find(item => item[idField] === itemId);
  }, [orderedItems, idField]);

  return {
    orderedItems,
    isModalOpen,
    selectedItem,
    targetPosition,
    openSwapModal,
    closeModal,
    selectTargetPosition,
    confirmSwap,
    getItemPosition,
    getItemById,
    totalItems: orderedItems.length
  };
}; 