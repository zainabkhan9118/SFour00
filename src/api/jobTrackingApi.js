// API functions for handling job tracking and status operations
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get all jobs with a specific status for a company
 * @param {string} companyId - The ID of the company
 * @param {string} status - The status of the jobs to fetch (in-progress, completed, etc.)
 * @returns {Promise} - Promise with the jobs data
 */
export const getJobsByStatus = async (companyId, status) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/company/${companyId}?status=${status}`
    );
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${status} jobs:`, error);
    throw error;
  }
};

/**
 * Get job details by ID
 * @param {string} companyId - The ID of the company
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the job details
 */
export const getJobDetailsById = async (companyId, jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/${companyId}/${jobId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

/**
 * Update job status
 * @param {string} companyId - The ID of the company
 * @param {string} jobId - The ID of the job
 * @param {string} status - The new status
 * @returns {Promise} - Promise with the update response
 */
export const updateJobStatus = async (companyId, jobId, status) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/apply/${companyId}/${jobId}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};

/**
 * Check job completion status
 * @param {string} companyId - The ID of the company
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the completion status data
 */
export const checkJobCompletionStatus = async (companyId, jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/${companyId}/${jobId}/completed`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error checking job completion status:', error);
    throw error;
  }
};

/**
 * Get all alerting jobs for a company
 * @param {string} companyId - The ID of the company
 * @returns {Promise} - Promise with the alerting jobs data
 */
export const getAlertingJobs = async (companyId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/company/${companyId}/alerts`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching alerting jobs:', error);
    throw error;
  }
};

/**
 * Get job alert logs
 * @param {string} companyId - The ID of the company 
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the alert logs data
 */
export const getJobAlertLogs = async (companyId, jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/${companyId}/${jobId}/alerts`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching job alert logs:', error);
    throw error;
  }
};