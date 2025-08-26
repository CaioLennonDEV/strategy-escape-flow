import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Badge } from './ui/badge';
import type { Action } from '@/lib/types';

interface PriorityDragDropProps {
  priorities: Action[];
  onReorder: (newOrder: Action[]) => void;
  className?: string;
}

interface DraggablePriority extends Action {
  id: string;
  position: number;
}

// Componente Sortable para item arrastável
const SortablePriorityItem: React.FC<{
  priority: DraggablePriority;
  isDragging?: boolean;
}> = ({ priority, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: priority.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isItemDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        group relative h-14 bg-blue-600 text-white font-bold text-base px-4
        flex items-center cursor-move select-none transition-all duration-200
        mx-auto w-full max-w-md border border-transparent rounded-lg
        ${isDragging ? 'scale-105 shadow-xl' : 'scale-100'}
        hover:shadow-md hover:bg-blue-500
      `}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-4 h-4 mr-3 text-blue-200" />
      
      <Badge 
        variant="secondary" 
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-blue-700 text-white border-0 flex-shrink-0 mr-3"
      >
        {priority.position}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white/90 truncate">{priority.title}</h4>
        {priority.description && (
          <p className="text-xs text-white/60 mt-1 line-clamp-1">{priority.description}</p>
        )}
      </div>
      
      {/* "Arraste para reorganizar" hint */}
      <span className="absolute right-3 text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-4 group-hover:translate-x-0">
        Arraste para reorganizar
      </span>
    </div>
  );
};

// Overlay para item sendo arrastado
const DragOverlayItem: React.FC<{ priority: DraggablePriority }> = ({ priority }) => {
  return (
    <div className="group relative h-14 bg-blue-600 text-white font-bold text-base px-4 flex items-center select-none mx-auto w-full max-w-md border border-transparent rounded-lg scale-105 shadow-2xl">
      <GripVertical className="w-4 h-4 mr-3 text-blue-200" />
      
      <Badge 
        variant="secondary" 
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-blue-700 text-white border-0 flex-shrink-0 mr-3"
      >
        {priority.position}
      </Badge>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white/90 truncate">{priority.title}</h4>
        {priority.description && (
          <p className="text-xs text-white/60 mt-1 line-clamp-1">{priority.description}</p>
        )}
      </div>
    </div>
  );
};

export const PriorityDragDrop: React.FC<PriorityDragDropProps> = ({
  priorities,
  onReorder,
  className = ''
}) => {
  const [activePriority, setActivePriority] = useState<DraggablePriority | null>(null);

  // Configurar sensores para desktop e mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Converter prioridades para formato arrastável
  const draggablePriorities: DraggablePriority[] = priorities.map((priority, index) => ({
    ...priority,
    id: priority.id.toString(),
    position: index + 1
  }));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const priority = draggablePriorities.find(p => p.id === active.id);
    if (priority) {
      setActivePriority(priority);
    }
  }, [draggablePriorities]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActivePriority(null);

    if (over && active.id !== over.id) {
      const oldIndex = draggablePriorities.findIndex(p => p.id === active.id);
      const newIndex = draggablePriorities.findIndex(p => p.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(draggablePriorities, oldIndex, newIndex);
        
        // Atualizar posições
        const updatedItems = reorderedItems.map((item, index) => ({
          ...item,
          position: index + 1
        }));

        // Chamar callback com nova ordem
        onReorder(updatedItems);
      }
    }
  }, [draggablePriorities, onReorder]);

  if (priorities.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-white/60 text-sm">Nenhuma prioridade definida</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={draggablePriorities.map(item => item.id)} 
          strategy={verticalListSortingStrategy}
        >
          {draggablePriorities.map((priority) => (
            <SortablePriorityItem
              key={priority.id}
              priority={priority}
              isDragging={activePriority?.id === priority.id}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activePriority ? <DragOverlayItem priority={activePriority} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}; 