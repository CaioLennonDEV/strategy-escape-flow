import React from 'react';

interface MovementLineProps {
  fromPosition: number;
  toPosition: number;
  direction: 'up' | 'down';
  isVisible: boolean;
  className?: string;
}

export const MovementLine: React.FC<MovementLineProps> = ({
  fromPosition,
  toPosition,
  direction,
  isVisible,
  className = ''
}) => {
  if (!isVisible) return null;

  return (
    <div className={`movement-line-container ${className}`}>
      <div className="movement-line" />
      <div className="movement-arrow">
        {direction === 'up' ? '↑' : '↓'}
      </div>
    </div>
  );
}; 