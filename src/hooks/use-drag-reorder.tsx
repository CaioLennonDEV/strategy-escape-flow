import { useState, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface UseDragReorderOptions {
  items: any[];
  onReorder?: (newItems: any[]) => void;
  onItemMove?: (itemId: string, fromIndex: number, toIndex: number) => void;
  longPressDelay?: number;
  minSwipeDistance?: number;
}

export const useDragReorder = (options: UseDragReorderOptions) => {
  const {
    items,
    onReorder,
    onItemMove,
    longPressDelay = 400,
    minSwipeDistance = 20
  } = options;

  const [orderedItems, setOrderedItems] = useState(items);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const dragElementRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  // Atualizar itens quando a prop mudar
  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleDragStart = useCallback((index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
    setDragOverIndex(null);
    setShowPlaceholder(true);
    
    // Feedback háptico
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const handleDragEnd = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex === null || toIndex === null) {
      setIsDragging(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Animar a reordenação
    setIsAnimating(true);
    
    const newItems = [...orderedItems];
    const draggedItem = newItems[fromIndex];
    newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, draggedItem);
    
    setOrderedItems(newItems);
    onReorder?.(newItems);
    onItemMove?.(draggedItem.id, fromIndex, toIndex);

    // Resetar estado após animação
    setTimeout(() => {
      setIsDragging(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      setIsAnimating(false);
      setShowPlaceholder(false);
    }, 300);
  }, [orderedItems, onReorder, onItemMove]);

  // Touch handlers para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchStartIndex(index);
    touchStartTimeRef.current = Date.now();

    longPressTimerRef.current = setTimeout(() => {
      handleDragStart(index);
    }, longPressDelay);
  }, [longPressDelay, handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || touchStartY === null || draggedIndex === null) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const container = e.currentTarget.parentElement;
    
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const itemHeight = containerRect.height / orderedItems.length;
    let newIndex = Math.max(0, Math.min(
      orderedItems.length,
      Math.floor((currentY - containerRect.top) / itemHeight)
    ));

    // Ajustar para permitir drop no final da lista
    if (newIndex > draggedIndex) {
      newIndex = Math.min(newIndex, orderedItems.length);
    } else {
      newIndex = Math.max(newIndex, 0);
    }

    if (newIndex !== dragOverIndex) {
      setDragOverIndex(newIndex);
    }
  }, [isDragging, touchStartY, draggedIndex, dragOverIndex, orderedItems.length]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!isDragging || touchStartIndex === null || draggedIndex === null) {
      setTouchStartY(null);
      setTouchStartIndex(null);
      return;
    }

    const touch = e.changedTouches[0];
    const touchEndY = touch.clientY;
    const touchDistance = Math.abs(touchEndY - (touchStartY || 0));
    const touchDuration = touchStartTimeRef.current 
      ? Date.now() - touchStartTimeRef.current 
      : 0;

    if (touchDistance > minSwipeDistance && touchDuration > 200) {
      const finalIndex = dragOverIndex !== null ? dragOverIndex : draggedIndex;
      handleDragEnd(draggedIndex, finalIndex);
    } else {
      setIsDragging(false);
      setDraggedIndex(null);
      setDragOverIndex(null);
      setShowPlaceholder(false);
    }

    setTouchStartY(null);
    setTouchStartIndex(null);
    touchStartTimeRef.current = null;
  }, [isDragging, touchStartIndex, draggedIndex, dragOverIndex, touchStartY, minSwipeDistance, handleDragEnd]);

  // Mouse handlers para desktop
  const handleMouseDown = useCallback((index: number) => {
    longPressTimerRef.current = setTimeout(() => {
      handleDragStart(index);
    }, longPressDelay);
  }, [longPressDelay, handleDragStart]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }, [draggedIndex]);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      handleDragEnd(draggedIndex, dropIndex);
    }
  }, [draggedIndex, handleDragEnd]);

  const getItemPosition = useCallback((itemId: string) => {
    return orderedItems.findIndex(item => item.id === itemId) + 1;
  }, [orderedItems]);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setShowPlaceholder(false);
    setTouchStartY(null);
    setTouchStartIndex(null);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return {
    orderedItems,
    isDragging,
    draggedIndex,
    dragOverIndex,
    isAnimating,
    showPlaceholder,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    getItemPosition,
    resetDrag,
    totalItems: orderedItems.length
  };
}; 