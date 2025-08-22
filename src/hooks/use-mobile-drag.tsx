import { useState, useCallback, useRef } from 'react';

interface UseMobileDragOptions {
  onDragStart?: (index: number) => void;
  onDragEnd?: (fromIndex: number, toIndex: number) => void;
  longPressDelay?: number;
  minSwipeDistance?: number;
}

export const useMobileDrag = (options: UseMobileDragOptions = {}) => {
  const {
    onDragStart,
    onDragEnd,
    longPressDelay = 500,
    minSwipeDistance = 30
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);
  
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchStartIndex(index);
    touchStartTimeRef.current = Date.now();

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      setIsDragging(true);
      setDraggedIndex(index);
      onDragStart?.(index);
      
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, longPressDelay);
  }, [longPressDelay, onDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || touchStartY === null) return;
    e.preventDefault();
  }, [isDragging, touchStartY]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, dropIndex: number) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!isDragging || touchStartIndex === null || touchStartY === null) {
      setTouchStartY(null);
      setTouchStartIndex(null);
      return;
    }

    const touch = e.changedTouches[0];
    const touchEndY = touch.clientY;
    const touchDistance = Math.abs(touchEndY - touchStartY);
    const touchDuration = touchStartTimeRef.current 
      ? Date.now() - touchStartTimeRef.current 
      : 0;

    // Only trigger reorder if there's significant movement and it's not a tap
    if (touchDistance > minSwipeDistance && touchDuration > 200 && touchStartIndex !== dropIndex) {
      onDragEnd?.(touchStartIndex, dropIndex);
    }

    // Reset state
    setIsDragging(false);
    setDraggedIndex(null);
    setTouchStartY(null);
    setTouchStartIndex(null);
    touchStartTimeRef.current = null;
  }, [isDragging, touchStartIndex, touchStartY, minSwipeDistance, onDragEnd]);

  const handleMouseDown = useCallback((index: number) => {
    // For devices that support both touch and mouse
    longPressTimerRef.current = setTimeout(() => {
      setIsDragging(true);
      setDraggedIndex(index);
      onDragStart?.(index);
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, longPressDelay);
  }, [longPressDelay, onDragStart]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
    setDraggedIndex(null);
    setTouchStartY(null);
    setTouchStartIndex(null);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return {
    isDragging,
    draggedIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    resetDrag
  };
}; 