import React from 'react';
import { PriorityDragDrop } from '../PriorityDragDrop';
import { usePriorityDragDrop } from '../../hooks/use-priority-drag-drop';

// Dados de exemplo
const mockActions = [
  {
    id: '1',
    title: 'Prioridade 1',
    description: 'Primeira ação mais importante',
    pillar_id: '1'
  },
  {
    id: '2', 
    title: 'Prioridade 2',
    description: 'Segunda ação importante',
    pillar_id: '1'
  },
  {
    id: '3',
    title: 'Prioridade 3', 
    description: 'Terceira ação importante',
    pillar_id: '1'
  },
  {
    id: '4',
    title: 'Prioridade 4',
    description: 'Quarta ação importante', 
    pillar_id: '1'
  },
  {
    id: '5',
    title: 'Prioridade 5',
    description: 'Quinta ação importante',
    pillar_id: '1'
  }
];

export const PriorityDragDropExample: React.FC = () => {
  const {
    priorities,
    hasPriorities,
    reorderPriorities,
    setInitialPriorities,
    clearPriorities
  } = usePriorityDragDrop({
    actions: mockActions,
    pillarId: 'example',
    onPrioritiesChange: (newPriorities) => {
      console.log('Prioridades atualizadas:', newPriorities);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Prioridades
          </h2>
          <div className="flex gap-2">
            <button
              onClick={setInitialPriorities}
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Definir Todas
            </button>
            <button
              onClick={clearPriorities}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Limpar
            </button>
          </div>
        </div>
        
        {hasPriorities ? (
          <PriorityDragDrop
            priorities={priorities}
            onReorder={reorderPriorities}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60 text-sm mb-4">
              Clique em "Definir Todas" para começar a organizar as prioridades
            </p>
            <button
              onClick={setInitialPriorities}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Definir Prioridades
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 