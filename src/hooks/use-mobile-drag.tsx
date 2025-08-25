import { useEffect, useState } from 'react';

export const useMobileDrag = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevenir zoom durante drag no mobile
  useEffect(() => {
    if (isMobile && isDragging) {
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventZoom, { passive: false });
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('touchmove', preventZoom);
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isDragging]);

  return {
    isMobile,
    isDragging,
    setIsDragging
  };
}; 