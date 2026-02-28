import React, { useEffect } from 'react';
import { CheckIcon, CloseIcon, AlertIcon, InfoIcon } from './Icons';
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type];
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon size={20} className="text-white" />;
      case 'error':
        return <CloseIcon size={20} className="text-white" />;
      case 'warning':
        return <AlertIcon size={20} className="text-white" />;
      case 'info':
        return <InfoIcon size={20} className="text-white" />;
      default:
        return <CheckIcon size={20} className="text-white" />;
    }
  };
  return (
    <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slideUp`}>
      <span className="flex-shrink-0">{getIcon()}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
export { Toast, ToastContainer };

