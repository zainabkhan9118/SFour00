// API functions for handling job application and related requests
import axios from 'axios';
import { cachedApiCall, clearCache } from '../services/apiCache';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Apply for a job with the provided job ID and seeker ID
 * @param {string} jobId - The ID of the job to apply for
 * @param {string} jobSeekerId - The job seeker's ID
 * @param {FormData|Object} [formData] - Optional form data or job application data
 * @returns {Promise} - Promise with the response data
 */
export const applyForJob = async (jobId, jobSeekerId, formData = null) => {
  try {
    const config = {
      headers: {
        'jobSeekerId': jobSeekerId
      }
    };

    // If formData is provided, set appropriate content type
    if (formData) {
      if (formData instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    // Use either the provided formData or a default object
    const data = formData || { status: "applied" };
    
    console.log(`Applying for job ${jobId} with job seeker ${jobSeekerId}`);
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`, data, config);
    
    // Handle non-success responses that might not throw errors
    if (response.status >= 400) {
      throw new Error(response.data?.message || 'Failed to apply for job');
    }
    
    // Clear the cached applied jobs to ensure fresh data on next fetch
    clearCache(`applied-jobs-${jobSeekerId}`);
    
    return response.data;
  } catch (error) {
    // Detailed error handling
    console.error('Error applying for job:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      jobId,
      jobSeekerId
    });
    
    // Format error message based on response type
    if (error.response) {
      const message = error.response.data?.message || error.response.data || 'Server error occurred';
      // Check if it's an already applied error (typically 409 Conflict)
      if (error.response.status === 409 || (typeof message === 'string' && message.toLowerCase().includes('already applied'))) {
        return {
          success: false,
          statusCode: 409,
          message: "You have already applied for this job",
          data: null
        };
      }
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response received from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred while applying for the job');
    }
  }
};

/**
 * Check if a user has already applied for a specific job
 * @param {string} jobId - The ID of the job to check
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise<boolean>} - True if already applied, false otherwise
 */
export const checkIfAlreadyApplied = async (jobId, jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/apply/check-status`, {
      params: { jobId, jobSeekerId }
    });
    return response.data?.data?.isApplied || false;
  } catch (error) {
    console.error('Error checking application status:', error);
    // If error, assume not applied to be safe
    return false;
  }
};

/**
 * Withdraw a job application
 * @param {string} jobId - The ID of the job to withdraw from
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise} - Promise with the response data
 */
export const withdrawApplication = async (jobId, jobSeekerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/apply/${jobId}`, {
      headers: {
        'jobSeekerId': jobSeekerId,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw error;
  }
};

// Internal functions for GET methods (to be cached)
const _getAppliedJobs = async (jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
      params: { status: "applied" },
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in _getAppliedJobs:', error);
    throw error;
  }
};

const _getInProgressJobs = async (jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
      params: { status: "inProgress" },
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in _getInProgressJobs:', error);
    throw error;
  }
};

const _getCompletedJobs = async (jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
      params: { status: "completed" },
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in _getCompletedJobs:', error);
    throw error;
  }
};

const _getJobDetailsById = async (jobSeekerId, jobId) => {
  const response = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
    params: { 
      status: "inProgress",
      jobId: jobId 
    },
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
  
  return response.data?.data?.[0]?.jobId;
};

/**
 * Get all jobs a job seeker has applied for
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise} - Promise with the response data (cached for 2 minutes)
 */
export const getAppliedJobs = async (jobSeekerId) => {
  return cachedApiCall(_getAppliedJobs, [jobSeekerId], `applied-jobs-${jobSeekerId}`, 2 * 60 * 1000);
};

/**
 * Get all in-progress jobs for a job seeker
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise} - Promise with the response data (cached for 2 minutes)
 */
export const getInProgressJobs = async (jobSeekerId) => {
  return cachedApiCall(_getInProgressJobs, [jobSeekerId], `in-progress-jobs-${jobSeekerId}`, 2 * 60 * 1000);
};

/**
 * Get all completed jobs for a job seeker
 * @param {string} jobSeekerId - The job seeker's ID
 * @returns {Promise} - Promise with the response data (cached for 5 minutes)
 */
export const getCompletedJobs = async (jobSeekerId) => {
  return cachedApiCall(_getCompletedJobs, [jobSeekerId], `completed-jobs-${jobSeekerId}`, 5 * 60 * 1000);
};

/**
 * Get details of a specific job for a job seeker
 * @param {string} jobSeekerId - The job seeker's ID
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the job details
 */
export const getJobDetailsById = async (jobSeekerId, jobId) => {
  try {
    console.log(`Fetching job details for jobId: ${jobId} and jobSeekerId: ${jobSeekerId}`);
    return cachedApiCall(_getJobDetailsById, [jobSeekerId, jobId], `job-details-${jobSeekerId}-${jobId}`, 2 * 60 * 1000);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response received from server');
    }
    throw error;
  }
};

