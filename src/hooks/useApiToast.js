import { useToast } from '../components/notifications/ToastManager';
import axios from 'axios';

/**
 * Hook for making API calls with automatic toast notifications
 * @returns {Object} API call methods with built-in toast notifications
 */
export const useApiToast = () => {
  const toast = useToast();

  /**
   * Make a GET request with toast notifications
   * @param {string} url - API endpoint
   * @param {Object} options - Axios request options
   * @param {Object} toastOptions - Custom toast options
   * @returns {Promise} - The API response
   */
  const get = async (url, options = {}, toastOptions = {}) => {
    try {
      const response = await axios.get(url, options);
      if (toastOptions.successMessage) {
        toast.showSuccess(toastOptions.successMessage);
      }
      return response.data;
    } catch (error) {
      const errorMessage = toastOptions.errorMessage || 
        error.response?.data?.message || 
        'An error occurred while fetching data';
      toast.showError(errorMessage);
      throw error;
    }
  };

  /**
   * Make a POST request with toast notifications
   * @param {string} url - API endpoint
   * @param {Object} data - Data to post
   * @param {Object} options - Axios request options
   * @param {Object} toastOptions - Custom toast options
   * @returns {Promise} - The API response
   */
  const post = async (url, data, options = {}, toastOptions = {}) => {
    try {
      const response = await axios.post(url, data, options);
      if (toastOptions.successMessage) {
        toast.showSuccess(toastOptions.successMessage);
      }
      return response.data;
    } catch (error) {
      const errorMessage = toastOptions.errorMessage || 
        error.response?.data?.message || 
        'An error occurred while saving data';
      toast.showError(errorMessage);
      throw error;
    }
  };

  /**
   * Make a PUT request with toast notifications
   * @param {string} url - API endpoint
   * @param {Object} data - Data to update
   * @param {Object} options - Axios request options
   * @param {Object} toastOptions - Custom toast options
   * @returns {Promise} - The API response
   */
  const put = async (url, data, options = {}, toastOptions = {}) => {
    try {
      const response = await axios.put(url, data, options);
      if (toastOptions.successMessage) {
        toast.showSuccess(toastOptions.successMessage);
      }
      return response.data;
    } catch (error) {
      const errorMessage = toastOptions.errorMessage || 
        error.response?.data?.message || 
        'An error occurred while updating data';
      toast.showError(errorMessage);
      throw error;
    }
  };

  /**
   * Make a DELETE request with toast notifications
   * @param {string} url - API endpoint
   * @param {Object} options - Axios request options
   * @param {Object} toastOptions - Custom toast options
   * @returns {Promise} - The API response
   */
  const remove = async (url, options = {}, toastOptions = {}) => {
    try {
      const response = await axios.delete(url, options);
      if (toastOptions.successMessage) {
        toast.showSuccess(toastOptions.successMessage);
      }
      return response.data;
    } catch (error) {
      const errorMessage = toastOptions.errorMessage || 
        error.response?.data?.message || 
        'An error occurred while deleting data';
      toast.showError(errorMessage);
      throw error;
    }
  };

  return { get, post, put, remove };
};