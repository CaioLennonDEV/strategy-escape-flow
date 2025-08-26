import React, { useState, useEffect } from 'react';
import { useDragAndDrop } from '../hooks/use-drag-and-drop';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, GripVertical } from 'lucide-react';

interface DragAndDropListProps {
  initialItems?: string[];
  className?: string;
}

export const DragAndDropList: React.FC<DragAndDropListProps> = ({
  initialItems = ['JavaScript', 'SCSS', 'HTML5', 'Awesome DnD', 'Follow me'],
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const {
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
  } = useDragAndDrop(initialItems);

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

  const handleAddItem = () => {
    if (inputValue.trim()) {
      addItem(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 ${className}`}>
      <h1 className="text-4xl font-light text-center text-blue-600 mb-8 font-raleway">
        DRAG AND DROP HTML5
      </h1>
      
      {/* Add Item Section */}
      <div className="relative mb-6">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add items in your list"
          className="w-full h-12 bg-blue-600 border-blue-400 text-white placeholder-blue-200 font-bold text-base pl-3 pr-12 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <Button
          onClick={handleAddItem}
          className="absolute right-0 top-0 h-12 w-12 bg-transparent hover:bg-blue-700 text-white text-3xl font-bold flex items-center justify-center transition-transform duration-200 hover:rotate-180 rounded-none"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Draggable List */}
      <ul className="space-y-2">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            isDragging={isDragging}
            isDragged={draggedItem?.id === item.id}
            isDragOver={dragOverItem === item.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
          />
        ))}
      </ul>
    </div>
  );
};

interface DraggableItemProps {
  item: { id: string; content: string };
  isDragging: boolean;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent | React.TouchEvent, item: { id: string; content: string }) => void;
  onDragOver: (e: React.DragEvent | React.TouchEvent) => void;
  onDragEnter: (e: React.DragEvent | React.TouchEvent, itemId?: string) => void;
  onDragLeave: (e: React.DragEvent | React.TouchEvent) => void;
  onDrop: (e: React.DragEvent | React.TouchEvent, targetItem: { id: string; content: string }) => void;
  onDragEnd: () => void;
  onTouchStart: (e: React.TouchEvent, item: { id: string; content: string }) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  isDragging,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
  onTouchStart
}) => {
  return (
    <li
      draggable
      data-draggable
      data-item-id={item.id}
              className={`
          group relative h-12 bg-blue-600 text-white font-bold text-base px-3
          flex items-center cursor-move select-none transition-all duration-200
          font-raleway mx-auto w-full max-w-xs border border-transparent
          ${isDragged ? 'opacity-40 scale-95 shadow-lg' : 'opacity-100'}
          ${isDragOver ? 'scale-110 shadow-xl border-blue-300 bg-blue-500' : 'scale-100'}
          hover:shadow-md hover:bg-blue-500
        `}
      onDragStart={(e) => onDragStart(e, item)}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, item.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, item)}
      onDragEnd={onDragEnd}
      onTouchStart={(e) => onTouchStart(e, item)}
    >
      <GripVertical className="w-4 h-4 mr-2 text-blue-200" />
      {item.content}
      
      {/* "drag me" hint */}
      <span className="absolute right-2 text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-4 group-hover:translate-x-0">
        drag me
      </span>
    </li>
  );
};

// Add custom font
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;800&display=swap');
  
  .font-raleway {
    font-family: 'Raleway', sans-serif;
  }
`;

// Inject font styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fontStyle;
  document.head.appendChild(style);
} 