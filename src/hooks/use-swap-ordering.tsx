import { useState, useCallback, useEffect } from 'react';

interface UseSwapOrderingOptions<T> {
  items: T[];
  onReorder?: (newItems: T[]) => void;
  idField?: keyof T;
}

export const useSwapOrdering = <T extends Record<string, any>>({
  items,
  onReorder,
  idField = 'id' as keyof T
}: UseSwapOrderingOptions<T>) => {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const selectItem = useCallback((itemId: string) => {
    if (selectedItem === itemId) {
      // Deselecionar se clicar no mesmo item
      setSelectedItem(null);
    } else if (selectedItem) {
      // Trocar posições
      const selectedIndex = orderedItems.findIndex(item => item[idField] === selectedItem);
      const targetIndex = orderedItems.findIndex(item => item[idField] === itemId);
      
      if (selectedIndex !== -1 && targetIndex !== -1) {
        const newItems = [...orderedItems];
        const temp = newItems[selectedIndex];
        newItems[selectedIndex] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        
        setOrderedItems(newItems);
        onReorder?.(newItems);
      }
      
      setSelectedItem(null);
    } else {
      // Selecionar primeiro item
      setSelectedItem(itemId);
    }
  }, [selectedItem, orderedItems, idField, onReorder]);

  const isSelected = useCallback((itemId: string) => {
    return selectedItem === itemId;
  }, [selectedItem]);

  const resetSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    orderedItems,
    selectItem,
    isSelected,
    resetSelection,
    hasSelection: selectedItem !== null
  };
}; 