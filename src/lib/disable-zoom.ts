/**
 * Função global para desabilitar o zoom da página
 * Impede zoom via CTRL + Scroll, CTRL + "+", CTRL + "-", e pinch zoom em mobile
 */
export function disablePageZoom(): void {
  // Desabilitar zoom via teclado (CTRL + "+", CTRL + "-")
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === '+' || event.key === '-' || event.key === '=')
    ) {
      event.preventDefault();
    }
  };

  // Desabilitar zoom via mousewheel (CTRL + Scroll)
  const handleWheel = (event: WheelEvent): void => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  };

  // Desabilitar pinch zoom em dispositivos móveis
  const handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };

  const handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };

  // Adicionar listeners
  document.addEventListener('keydown', handleKeyDown, { passive: false });
  document.addEventListener('wheel', handleWheel, { passive: false });
  document.addEventListener('touchstart', handleTouchStart, { passive: false });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  // Atualizar meta viewport para desabilitar zoom em mobile
  const updateViewportMeta = (): void => {
    const existingMeta = document.querySelector('meta[name="viewport"]');
    const newMeta = document.createElement('meta');
    newMeta.name = 'viewport';
    newMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

    if (existingMeta) {
      existingMeta.remove();
    }
    document.head.appendChild(newMeta);
  };

  // Executar imediatamente se o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateViewportMeta);
  } else {
    updateViewportMeta();
  }

  // Função para limpar os listeners (opcional, para cleanup)
  const cleanup = (): void => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('wheel', handleWheel);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
  };

  // Expor função de cleanup globalmente (opcional)
  (window as any).disableZoomCleanup = cleanup;
} 