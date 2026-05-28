import { useState, useCallback } from 'react';

/**
 * Hook para gestionar notificaciones Toast.
 * Permite agregar toasts con tipos: error, success, info
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', autoClose = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, autoClose };
    
    setToasts(prev => [...prev, toast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const error = useCallback((message, autoClose) => {
    return addToast(message, 'error', autoClose);
  }, [addToast]);

  const success = useCallback((message, autoClose) => {
    return addToast(message, 'success', autoClose);
  }, [addToast]);

  const info = useCallback((message, autoClose) => {
    return addToast(message, 'info', autoClose);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    error,
    success,
    info,
  };
};
