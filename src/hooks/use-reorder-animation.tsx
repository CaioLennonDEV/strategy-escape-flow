import { useState, useCallback } from 'react';

interface AnimationState {
  itemId: string;
  fromPosition: number;
  toPosition: number;
  direction: 'up' | 'down';
  affectedItems: {
    movedItem: string;
    swappedItem: string;
  };
}

export const useReorderAnimation = () => {
  const [animatingItems, setAnimatingItems] = useState<Map<string, AnimationState>>(new Map());

  const triggerAnimation = useCallback((
    itemId: string, 
    fromPosition: number, 
    toPosition: number, 
    direction: 'up' | 'down',
    affectedItems: { movedItem: string; swappedItem: string }
  ) => {
    const animationState: AnimationState = {
      itemId,
      fromPosition,
      toPosition,
      direction,
      affectedItems
    };
    
    setAnimatingItems(prev => new Map(prev).set(itemId, animationState));
    
    // Remover a animação após 2 segundos (tempo para ver as cores)
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newMap = new Map(prev);
        newMap.delete(itemId);
        return newMap;
      });
    }, 2000);
  }, []);

  const isAnimating = useCallback((itemId: string) => {
    return animatingItems.has(itemId);
  }, [animatingItems]);

  const getAnimationState = useCallback((itemId: string) => {
    return animatingItems.get(itemId);
  }, [animatingItems]);

  const isOldPosition = useCallback((itemId: string) => {
    for (const [animatingItemId, state] of animatingItems) {
      if (state.affectedItems.swappedItem === itemId) {
        return true;
      }
    }
    return false;
  }, [animatingItems]);

  const isNewPosition = useCallback((itemId: string) => {
    for (const [animatingItemId, state] of animatingItems) {
      if (state.affectedItems.movedItem === itemId) {
        return true;
      }
    }
    return false;
  }, [animatingItems]);

  return {
    triggerAnimation,
    isAnimating,
    getAnimationState,
    isOldPosition,
    isNewPosition
  };
}; 