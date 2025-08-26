import React from 'react';
import { DragAndDropList } from '../DragAndDropList';

export const DragAndDropExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <DragAndDropList 
        initialItems={[
          'JavaScript',
          'SCSS', 
          'HTML5',
          'Awesome DnD',
          'Follow me'
        ]}
        className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20"
      />
    </div>
  );
}; 