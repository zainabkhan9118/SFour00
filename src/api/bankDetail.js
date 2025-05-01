// API functions for handling bank details-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get bank details for a job seeker
 * @param {string} bankDetailId - ID of the bank detail to retrieve
 * @returns {Promise} - Promise with the response data
 */
export const getBankDetails = async (bankDetailId) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      throw new Error("jobSeekerId not found in localStorage");
    }
    
    const response = await axios.get(`${BASE_URL}/bank-details/${bankDetailId}`, {
      headers: {
        "jobSeekerId": jobSeekerId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bank details:', error);
    throw error;
  }
};

/**
 * Create new bank details
 * @param {Object} bankData - Bank details data to create
 * @returns {Promise} - Promise with the response data
 */
export const createBankDetails = async (bankData) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      throw new Error("jobSeekerId not found in localStorage");
    }
    
    const response = await axios.post(`${BASE_URL}/bank-details`, bankData, {
      headers: {
        "jobSeekerId": jobSeekerId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating bank details:', error);
    throw error;
  }
};

/**
 * Update bank details
 * @param {string} bankDetailId - ID of the bank detail to update
 * @param {Object} bankData - Updated bank details data
 * @returns {Promise} - Promise with the response data
 */
export const updateBankDetails = async (bankDetailId, bankData) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      throw new Error("jobSeekerId not found in localStorage");
    }
    
    const response = await axios.patch(`${BASE_URL}/bank-details/${bankDetailId}`, bankData, {
      headers: {
        "jobSeekerId": jobSeekerId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating bank details:', error);
    throw error;
  }
};

/**
 * Delete bank details
 * @param {string} bankDetailId - ID of the bank detail to delete
 * @returns {Promise} - Promise with the response data
 */
export const deleteBankDetails = async (bankDetailId) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      throw new Error("jobSeekerId not found in localStorage");
    }
    
    const response = await axios.delete(`${BASE_URL}/bank-details/${bankDetailId}`, {
      headers: {
        "jobSeekerId": jobSeekerId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting bank details:', error);
    throw error;
  }
};