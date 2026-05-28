import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, X } from 'lucide-react';

/**
 * Sistema de notificaciones Toast sin dependencias externas.
 * Soporta tipos: error, success, info
 */
const Toast = ({ message, type = 'info', onClose, autoClose = 4000 }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const iconMap = {
    error: { icon: AlertCircle, bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', textColor: 'text-red-300' },
    success: { icon: CheckCircle, bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', textColor: 'text-green-300' },
    info: { icon: InfoIcon, bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-300' },
  };

  const config = iconMap[type] || iconMap.info;
  const Icon = config.icon;

  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-lg
      ${config.bgColor} border ${config.borderColor}
      text-white backdrop-filter backdrop-blur-md
      animate-slideIn transition-all
    `}>
      <Icon size={20} className={config.textColor} />
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};

/**
 * Contenedor para múltiples toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          autoClose={toast.autoClose}
        />
      ))}
    </div>
  );
};

export default Toast;
