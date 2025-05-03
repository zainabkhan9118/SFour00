import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Export constant for toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const toastTypes = {
  [TOAST_TYPES.SUCCESS]: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    iconColor: 'text-green-400'
  },
  [TOAST_TYPES.ERROR]: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    iconColor: 'text-red-400'
  },
  [TOAST_TYPES.WARNING]: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-400'
  },
  [TOAST_TYPES.INFO]: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-400'
  }
};

const Toast = ({ id, type = TOAST_TYPES.INFO, title, message, duration = 5000, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);
  
  const startTimer = () => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          return 0;
        }
        return prev - (100 / (duration / 10));
      });
    }, 10);
    
    setIntervalId(id);
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  useEffect(() => {
    startTimer();
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    if (progress <= 0) {
      onClose(id);
    }
  }, [progress, onClose, id]);

  const toastStyle = toastTypes[type] || toastTypes[TOAST_TYPES.INFO];

  return (
    <motion.div
      className={`max-w-md w-full ${toastStyle.bgColor} border ${toastStyle.borderColor} rounded-lg shadow-lg overflow-hidden`}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${toastStyle.iconColor}`}>
            {toastStyle.icon}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${toastStyle.textColor}`}>{title}</p>
            {message && (
              <p className={`mt-1 text-sm ${toastStyle.textColor} opacity-90`}>{message}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
              onClick={() => onClose(id)}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 h-1">
        <div
          className={`h-full ${type === TOAST_TYPES.SUCCESS ? 'bg-green-500' : type === TOAST_TYPES.ERROR ? 'bg-red-500' : type === TOAST_TYPES.WARNING ? 'bg-yellow-500' : 'bg-blue-500'}`}
          style={{ width: `${progress}%`, transition: 'width 10ms linear' }}
        />
      </div>
    </motion.div>
  );
};

export { Toast };