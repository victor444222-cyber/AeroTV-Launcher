import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gestionar el lanzamiento de aplicaciones de streaming.
 * Maneja estado de carga, detección de bloqueos de popup y errores.
 * 
 * @returns {Object} { loadingId, openStreamingApp, isLoading }
 */
export const useStreamingLauncher = () => {
  const [loadingId, setLoadingId] = useState(null);

  const openStreamingApp = useCallback(async (url, appId) => {
    try {
      setLoadingId(appId);

      // Abre la ventana
      const win = window.open(url, '_blank', 'noopener,noreferrer');

      // Verifica si la ventana fue bloqueada
      if (!win || win.closed) {
        const error = new Error('POPUP_BLOCKED');
        error.code = 'POPUP_BLOCKED';
        throw error;
      }

      // Simula un pequeño delay para que el spinner sea visible
      // (en caso de que la ventana se abra muy rápido)
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      if (error.code === 'POPUP_BLOCKED') {
        const popupError = new Error(
          'El navegador bloqueó la ventana emergente. Habilítalas en la configuración.'
        );
        popupError.code = 'POPUP_BLOCKED';
        throw popupError;
      }

      console.error('Error al lanzar streaming:', error);
      throw new Error(`Error al lanzar ${url}: ${error.message}`);

    } finally {
      setLoadingId(null);
    }
  }, []);

  return {
    loadingId,
    openStreamingApp,
    isLoading: (appId) => loadingId === appId,
  };
};
