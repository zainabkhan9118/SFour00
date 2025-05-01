import React, { useState, useContext, createContext } from 'react';
import { Toast, TOAST_TYPES } from './Toast';

// Create context for toast notifications
const ToastContext = createContext({
  showToast: () => {},
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = TOAST_TYPES.INFO, duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Convenience methods for different toast types
  const showSuccess = (message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration);
  const showError = (message, duration) => addToast(message, TOAST_TYPES.ERROR, duration);
  const showWarning = (message, duration) => addToast(message, TOAST_TYPES.WARNING, duration);
  const showInfo = (message, duration) => addToast(message, TOAST_TYPES.INFO, duration);
  
  // Custom method to handle object-style toast params
  const showToast = ({ type = 'info', title = '', message = '', duration = 3000 }) => {
    const toastMessage = title ? `${title}: ${message}` : message;
    const toastType = TOAST_TYPES[type.toUpperCase()] || TOAST_TYPES.INFO;
    return addToast(toastMessage, toastType, duration);
  };

  return (
    <ToastContext.Provider value={{ 
      addToast, 
      removeToast, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo,
      showToast
    }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};