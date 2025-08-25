import { useEffect, useCallback } from 'react';
import { disablePageZoom } from '../lib/disable-zoom';

/**
 * Hook para gerenciar a funcionalidade de desabilitar zoom da página
 * 
 * @returns {object} Objeto com funções para controlar o zoom
 * @returns {Function} returns.disableZoom - Função para desabilitar o zoom
 * @returns {Function} returns.enableZoom - Função para reabilitar o zoom (cleanup)
 * @returns {boolean} returns.isZoomDisabled - Estado atual do zoom
 */
export function useDisableZoom() {
  const disableZoom = useCallback(() => {
    disablePageZoom();
  }, []);

  const enableZoom = useCallback(() => {
    // Função de cleanup exposta globalmente
    if ((window as any).disableZoomCleanup) {
      (window as any).disableZoomCleanup();
    }
  }, []);

  // Desabilitar zoom automaticamente quando o hook é montado
  useEffect(() => {
    disableZoom();
    
    // Cleanup quando o componente é desmontado
    return () => {
      enableZoom();
    };
  }, [disableZoom, enableZoom]);

  return {
    disableZoom,
    enableZoom,
    isZoomDisabled: true // Sempre true quando o hook está ativo
  };
} 