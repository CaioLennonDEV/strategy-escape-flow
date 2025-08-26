import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import type { Action } from '@/lib/types';

interface SimplePriorityDragDropProps {
  priorities: Action[];
  onReorder: (newOrder: Action[]) => void;
  className?: string;
}

export const SimplePriorityDragDrop: React.FC<SimplePriorityDragDropProps> = ({
  priorities,
  onReorder,
  className = ''
}) => {
  const [draggedItem, setDraggedItem] = useState<Action | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; item: Action | null }>({
    x: 0,
    y: 0,
    item: null
  });

  const handleDragStart = useCallback((e: React.DragEvent, item: Action) => {
    setDraggedItem(item);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', item.id);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.add('over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    e.currentTarget.classList.remove('over');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItem: Action) => {
    if (draggedItem && draggedItem.id !== targetItem.id) {
      const draggedIndex = priorities.findIndex(item => item.id === draggedItem.id);
      const targetIndex = priorities.findIndex(item => item.id === targetItem.id);
      
      const newPriorities = [...priorities];
      const [removed] = newPriorities.splice(draggedIndex, 1);
      newPriorities.splice(targetIndex, 0, removed);
      
      onReorder(newPriorities);
    }
    return false;
  }, [draggedItem, priorities, onReorder]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const listItems = document.querySelectorAll('.draggable');
    listItems.forEach(item => {
      item.classList.remove('over');
    });
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverItem(null);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent, item: Action) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      item
    };
    setDraggedItem(item);
    setIsDragging(true);
    (e.currentTarget as HTMLElement).style.opacity = '0.4';
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
      const draggableElement = element?.closest('.draggable');
      
      if (draggableElement) {
        const itemId = draggableElement.getAttribute('data-id');
        if (itemId && itemId !== dragOverItem) {
          setDragOverItem(itemId);
          draggableElement.classList.add('over');
        }
      }
    }
  }, [isDragging, dragOverItem]);

  const handleTouchEnd = useCallback(() => {
    if (draggedItem && dragOverItem) {
      const targetItem = priorities.find(item => item.id === dragOverItem);
      if (targetItem) {
        const draggedIndex = priorities.findIndex(item => item.id === draggedItem.id);
        const targetIndex = priorities.findIndex(item => item.id === targetItem.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
          const newPriorities = [...priorities];
          const [removed] = newPriorities.splice(draggedIndex, 1);
          newPriorities.splice(targetIndex, 0, removed);
          
          onReorder(newPriorities);
        }
      }
    }
    
    // Clean up
    const listItems = document.querySelectorAll('.draggable');
    listItems.forEach(item => {
      item.classList.remove('over');
      (item as HTMLElement).style.opacity = '1';
    });
    
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverItem(null);
  }, [draggedItem, dragOverItem, priorities, onReorder]);

  // Add global touch event listeners for mobile
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleTouchMove(e as any);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleTouchEnd();
      }
    };

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  if (priorities.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-white/60 text-sm">Nenhuma prioridade definida</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .over {
            transform: scale(1.1, 1.1);
          }
          
          /* Mobile optimizations */
          @media (max-width: 768px) {
            .draggable {
              touch-action: none;
              user-select: none;
              -webkit-user-select: none;
              -webkit-touch-callout: none;
            }
          }
        `}
      </style>
      <div className={`space-y-2 ${className}`}>
        <ul>
          {priorities.map((priority, index) => (
            <li
              key={priority.id}
              className="draggable group relative h-12 bg-blue-600 text-white font-bold text-base px-3 flex items-center cursor-move select-none transition-all duration-200 mx-auto w-full max-w-xs border border-transparent hover:shadow-md hover:bg-blue-500"
              draggable
              data-id={priority.id}
              onDragStart={(e) => handleDragStart(e, priority)}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, priority)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, priority)}
            >
              <GripVertical className="w-4 h-4 mr-2 text-blue-200" />
              
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                {index + 1}
              </span>
              
              <span className="flex-1 truncate">{priority.title}</span>
              
              {/* "Arraste para reorganizar" hint */}
              <span className="absolute right-2 text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-4 group-hover:translate-x-0">
                Arraste para reorganizar
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}; 