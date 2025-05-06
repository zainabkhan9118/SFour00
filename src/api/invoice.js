// API functions for handling invoice operations
import axios from 'axios';
import { cachedApiCall, clearCache } from '../services/apiCache';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Create an invoice for a job booking
 * @param {string} jobId - The ID of the job to create invoice for
 * @param {string} jobSeekerId - The job seeker's ID
 * @param {Object} invoiceData - Invoice details like startTime, endTime, pricePerHour, workDate, totalHours, totalPrice
 * @returns {Promise} - Promise with the response data
 */
export const createInvoice = async (jobId, jobSeekerId, invoiceData = {}) => {
  try {
    const config = {
      headers: {
        'jobSeekerId': jobSeekerId,
        'Content-Type': 'application/json'
      }
    };

    console.log(`Creating invoice for job ${jobId} with job seeker ${jobSeekerId}`);
    const response = await axios.post(`${BASE_URL}/apply/${jobId}/invoice`, invoiceData, config);
    
    // Clear the cached invoices to ensure fresh data on next fetch
    clearCache(`invoices-${jobSeekerId}`);
    
    return response.data;
  } catch (error) {
    // Detailed error handling
    console.error('Error creating invoice:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      jobId,
      jobSeekerId
    });
    
    if (error.response) {
      const message = error.response.data?.message || error.response.data || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response received from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred while creating the invoice');
    }
  }
};

/**
 * Get all invoices for a job seeker
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise} - Promise with the response data (cached for 5 minutes)
 */
const _getInvoices = async (jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices/${jobSeekerId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in _getInvoices:', error);
    throw error;
  }
};

export const getInvoices = async (jobSeekerId) => {
  return cachedApiCall(_getInvoices, [jobSeekerId], `invoices-${jobSeekerId}`, 5 * 60 * 1000);
};

/**
 * Get details of a specific invoice
 * @param {string} jobSeekerId - The job seeker's ID
 * @param {string} invoiceId - The ID of the invoice
 * @returns {Promise} - Promise with the invoice details
 */
const _getInvoiceById = async (jobSeekerId, invoiceId) => {
  try {
    const response = await axios.get(`${BASE_URL}/invoices/${jobSeekerId}/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in _getInvoiceById:', error);
    throw error;
  }
};

export const getInvoiceById = async (jobSeekerId, invoiceId) => {
  return cachedApiCall(_getInvoiceById, [jobSeekerId, invoiceId], `invoice-${jobSeekerId}-${invoiceId}`, 5 * 60 * 1000);
};