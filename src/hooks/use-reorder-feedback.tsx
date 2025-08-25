import { useState, useCallback, useRef } from 'react';

interface UseReorderFeedbackOptions {
  animationDuration?: number;
  hapticFeedback?: boolean;
}

export const useReorderFeedback = (options: UseReorderFeedbackOptions = {}) => {
  const {
    animationDuration = 600,
    hapticFeedback = true
  } = options;

  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const animationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const triggerReorderAnimation = useCallback((itemId: string) => {
    // Limpar timeout anterior se existir
    const existingTimeout = animationTimeoutsRef.current.get(itemId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Adicionar item à lista de animações
    setAnimatingItems(prev => new Set(prev).add(itemId));

    // Feedback háptico
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }

    // Remover animação após duração
    const timeout = setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      animationTimeoutsRef.current.delete(itemId);
    }, animationDuration);

    animationTimeoutsRef.current.set(itemId, timeout);
  }, [animationDuration, hapticFeedback]);

  const isItemAnimating = useCallback((itemId: string) => {
    return animatingItems.has(itemId);
  }, [animatingItems]);

  const clearAllAnimations = useCallback(() => {
    // Limpar todos os timeouts
    animationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutsRef.current.clear();
    setAnimatingItems(new Set());
  }, []);

  return {
    triggerReorderAnimation,
    isItemAnimating,
    clearAllAnimations,
    animatingItems
  };
}; 