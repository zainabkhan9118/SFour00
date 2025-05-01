import { useState } from 'react';
import { useToast } from '../components/notifications/ToastManager';

/**
 * A custom hook for handling API requests with automatic toast notifications
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - Object containing state and handler function
 */
export const useApiWithToast = (apiFunction, options = {}) => {
  const {
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    loadingMessage = null,
    onSuccess = () => {},
    onError = () => {},
  } = options;
  
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    
    if (loadingMessage) {
      toast.showInfo(loadingMessage);
    }
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      toast.showSuccess(successMessage);
      onSuccess(result);
      return result;
    } catch (err) {
      const message = err.message || errorMessage;
      setError(err);
      toast.showError(message);
      onError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
};

export default useApiWithToast;