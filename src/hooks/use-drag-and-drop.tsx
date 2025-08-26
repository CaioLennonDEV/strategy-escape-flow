import { useState, useRef, useCallback } from 'react';

interface DragItem {
  id: string;
  content: string;
}

interface UseDragAndDropReturn {
  items: DragItem[];
  draggedItem: DragItem | null;
  isDragging: boolean;
  dragOverItem: string | null;
  addItem: (content: string) => void;
  handleDragStart: (e: React.DragEvent | React.TouchEvent, item: DragItem) => void;
  handleDragOver: (e: React.DragEvent | React.TouchEvent) => void;
  handleDragEnter: (e: React.DragEvent | React.TouchEvent, itemId?: string) => void;
  handleDragLeave: (e: React.DragEvent | React.TouchEvent) => void;
  handleDrop: (e: React.DragEvent | React.TouchEvent, targetItem: DragItem) => void;
  handleDragEnd: () => void;
  handleTouchStart: (e: React.TouchEvent, item: DragItem) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export const useDragAndDrop = (initialItems: string[] = []): UseDragAndDropReturn => {
  const [items, setItems] = useState<DragItem[]>(
    initialItems.map((content, index) => ({
      id: `item-${index}`,
      content
    }))
  );
  
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  
  const touchStartRef = useRef<{ x: number; y: number; item: DragItem | null }>({
    x: 0,
    y: 0,
    item: null
  });

  const addItem = useCallback((content: string) => {
    if (content.trim()) {
      const newItem: DragItem = {
        id: `item-${Date.now()}`,
        content: content.trim()
      };
      setItems(prev => [...prev, newItem]);
    }
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent | React.TouchEvent, item: DragItem) => {
    setDraggedItem(item);
    setIsDragging(true);
    
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.content);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent | React.TouchEvent) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    if ('dataTransfer' in e) {
      e.dataTransfer.dropEffect = 'move';
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent | React.TouchEvent, itemId?: string) => {
    if (itemId) {
      setDragOverItem(itemId);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent | React.TouchEvent) => {
    if ('stopPropagation' in e) {
      e.stopPropagation();
    }
    setDragOverItem(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent | React.TouchEvent, targetItem: DragItem) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
    if (draggedItem && draggedItem.id !== targetItem.id) {
      setItems(prev => {
        const draggedIndex = prev.findIndex(item => item.id === draggedItem.id);
        const targetIndex = prev.findIndex(item => item.id === targetItem.id);
        
        const newItems = [...prev];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, removed);
        
        return newItems;
      });
    }
    
    setDragOverItem(null);
  }, [draggedItem]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverItem(null);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, item: DragItem) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      item
    };
    setDraggedItem(item);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Only start drag if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      // Find element under touch
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const draggableElement = element?.closest('[data-draggable]');
      
      if (draggableElement) {
        const itemId = draggableElement.getAttribute('data-item-id');
        if (itemId && itemId !== dragOverItem) {
          setDragOverItem(itemId);
        }
      }
    }
  }, [isDragging, dragOverItem]);

  const handleTouchEnd = useCallback(() => {
    if (draggedItem && dragOverItem) {
      const targetItem = items.find(item => item.id === dragOverItem);
      if (targetItem) {
        handleDrop({} as React.TouchEvent, targetItem);
      }
    }
    handleDragEnd();
  }, [draggedItem, dragOverItem, items, handleDrop, handleDragEnd]);

  return {
    items,
    draggedItem,
    isDragging,
    dragOverItem,
    addItem,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}; 