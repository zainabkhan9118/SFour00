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

    // First, check if the user has already applied for this job
    try {
      const alreadyApplied = await checkIfAlreadyApplied(jobId, jobSeekerId);
      if (alreadyApplied) {
        console.log("User has already applied for this job, returning 409 error");
        return {
          success: false,
          statusCode: 409,
          message: "You have already applied for this job",
          data: { status: "applied" }
        };
      }
    } catch (checkError) {
      console.log("Error checking if already applied:", checkError);
      // Continue with application attempt even if check fails
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
      
      // Check for specific 500 "Internal server error" which is likely an "already applied" scenario
      if (error.response.status === 500 && 
          (typeof message === 'string' && message.includes('Internal server error'))) {
        console.log("Received 500 error, treating as 'already applied'");
        
        // Double check by fetching applied jobs
        try {
          const appliedJobs = await _getAppliedJobs(jobSeekerId);
          if (appliedJobs?.data) {
            const isApplied = appliedJobs.data.some(job => 
              job.jobId === jobId || 
              (typeof job.jobId === 'object' && job.jobId._id === jobId)
            );
            
            if (isApplied) {
              return {
                success: false,
                statusCode: 409,
                message: "You have already applied for this job",
                data: { status: "applied" }
              };
            }
          }
        } catch (checkError) {
          console.log("Failed to verify applied status:", checkError);
        }
        
        // If we couldn't verify or it isn't applied, still treat 500 as a possible duplicate
        return {
          success: false,
          statusCode: 409,
          message: "You may have already applied for this job",
          data: null
        };
      }
      
      // Check if it's an already applied error (typically 409 Conflict)
      if (error.response.status === 409 || (typeof message === 'string' && message.toLowerCase().includes('already applied'))) {
        return {
          success: false,
          statusCode: 409,
          message: "You have already applied for this job",
          data: { status: "applied" }
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
  try {
    console.log(`Fetching job details for jobId: ${jobId} and jobSeekerId: ${jobSeekerId}`);
    
    // Use the correct endpoint based on backend implementation
    // Make a request to get the job application details which contain the job info
    const appResponse = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
      params: { 
        jobId: jobId 
      },
      headers: {
        'jobSeekerId': jobSeekerId,
        'Content-Type': 'application/json'
      }
    });

    // Find the specific job in the response
    if (appResponse?.data?.data && Array.isArray(appResponse.data.data)) {
      const matchingJob = appResponse.data.data.find(job => 
        (job.jobId?._id === jobId) || (job.jobId === jobId)
      );
      
      if (matchingJob?.jobId) {
        return matchingJob.jobId;
      }
    }
    
    // If not found through application, try fetching all jobs and filter manually
    console.log("Job not found in applications, trying alternative approach...");
    const jobsResponse = await axios.get(`${BASE_URL}/jobs`, {
      headers: {
        'jobSeekerId': jobSeekerId,
        'Content-Type': 'application/json'
      }
    });
    
    if (jobsResponse?.data?.data && Array.isArray(jobsResponse.data.data)) {
      const job = jobsResponse.data.data.find(item => 
        item._id === jobId
      );
      
      if (job) {
        return job;
      }
    }
    
    console.warn(`Job with ID ${jobId} not found in any endpoint`);
    return null;
  } catch (error) {
    console.error('Error in _getJobDetailsById:', error);
    throw error;
  }
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
    
    // Create a unique request ID for this specific call
    const requestId = `job-details-request-${jobSeekerId}-${jobId}`;
    
    // Check if this request is already in progress
    if (window.__pendingJobRequests && window.__pendingJobRequests[requestId]) {
      console.log(`Request already in progress for ${jobId}, waiting for result`);
      return window.__pendingJobRequests[requestId];
    }
    
    // Initialize pending requests object if not exists
    if (!window.__pendingJobRequests) {
      window.__pendingJobRequests = {};
    }
    
    // Store the promise for this request
    const requestPromise = cachedApiCall(_getJobDetailsById, [jobSeekerId, jobId], 
      `job-details-${jobSeekerId}-${jobId}`, 2 * 60 * 1000);
      
    window.__pendingJobRequests[requestId] = requestPromise;
    
    // When request completes, remove it from pending
    requestPromise.finally(() => {
      delete window.__pendingJobRequests[requestId];
    });
    
    return requestPromise;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response received from server');
    }
    throw error;
  }
};

