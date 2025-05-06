// API functions for handling job-related operations
import axios from 'axios';
import { cachedApiCall } from '../services/apiCache';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://s4backend-c7f27664aa4d.herokuapp.com';

console.log('Jobs API Base URL:', BASE_URL); // For debugging

/**
 * Get all jobs for a company
 * @param {string} companyId - The ID of the company
 * @returns {Promise} - Promise with the response data
 */
export const getCompanyJobs = async (companyId) => {
  try {
    console.log('Fetching jobs for company ID:', companyId);
    
    const response = await axios.get(`${BASE_URL}/jobs/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }
};

/**
 * Get a specific job by ID
 * @param {string} jobId - The ID of the job
 * @param {string} companyId - The ID of the company (for validation)
 * @returns {Promise} - Promise with the response data
 */
export const getJobById = async (jobId, companyId) => {
  try {
    console.log('Fetching job with ID:', jobId);
    
    // First get all jobs for the company
    const response = await getCompanyJobs(companyId);
    
    // Find the specific job by ID
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      const job = response.data.find(job => job._id === jobId);
      if (job) {
        return { 
          statusCode: 200, 
          data: job 
        };
      } else {
        throw new Error("Job not found");
      }
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw error;
  }
};

/**
 * Create a new job
 * @param {Object} jobData - The job data
 * @param {string} companyId - The ID of the company creating the job
 * @returns {Promise} - Promise with the response data
 */
export const createJob = async (jobData, companyId) => {
  try {
    console.log('Creating job for company ID:', companyId);
    console.log('Job data:', jobData);
    
    const response = await axios.post(`${BASE_URL}/jobs`, jobData, {
      headers: {
        'Content-Type': 'application/json',
        'companyId': companyId
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Check if a job is already assigned
 * @param {string} jobId - The ID of the job
 * @returns {Promise<boolean>} - Promise with a boolean indicating if the job is assigned
 */
export const checkJobAssignmentStatus = async (jobId) => {
  try {
    console.log('Checking assignment status for job ID:', jobId);
    
    const response = await axios.get(`${BASE_URL}/apply/${jobId}/status`);
    
    if (response.data.statusCode === 200) {
      return response.data.data?.status === "ASSIGNED";
    }
    return false;
  } catch (error) {
    console.error('Failed to check job assignment status:', error);
    throw error;
  }
};

/**
 * Enable assignment for a job to a specific job seeker
 * @param {string} jobId - The ID of the job
 * @param {string} jobSeekerId - The ID of the job seeker
 * @returns {Promise} - Promise with the response data
 */
export const enableJobAssignment = async (jobId, jobSeekerId) => {
  try {
    console.log('Enabling assignment for job ID:', jobId, 'to job seeker ID:', jobSeekerId);
    
    if (!jobId || !jobSeekerId) {
      throw new Error('Missing required parameters: jobId or jobSeekerId');
    }
    
    // Request body should only contain isAssignable flag
    const payload = { 
      isAssignable: true
    };
    
    console.log('Request URL:', `${BASE_URL}/apply/${jobId}/enable-assignment`);
    console.log('Request payload:', JSON.stringify(payload));
    console.log('Request headers:', { jobSeekerId });
    
    // Make the API call with the correct structure:
    // - jobId as path parameter
    // - jobSeekerId as header
    // - isAssignable as the only body parameter
    const response = await axios({
      method: 'PATCH',
      url: `${BASE_URL}/apply/${jobId}/enable-assignment`,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'jobSeekerId': jobSeekerId
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('Error enabling job assignment - Full error:', error);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      console.error('Error data:', error.response.data);
    }
    
    throw error;
  }
};

/**
 * Get jobs by status for a company
 * @param {string} companyId - The ID of the company
 * @param {string} status - The status of the jobs to fetch (e.g., ASSIGNED, IN_PROGRESS, COMPLETED)
 * @returns {Promise} - Promise with the response data
 */
export const getJobsByStatus = async (companyId, status) => {
  try {
    console.log('Fetching jobs with status:', status, 'for company ID:', companyId);
    
    const response = await axios.get(`${BASE_URL}/apply/company/${companyId}?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${status} jobs:`, error);
    throw error;
  }
};

// Original function kept for reference and direct use when needed
const _fetchAllJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Cached version of fetchAllJobs - 5 minute cache by default
export const fetchAllJobs = async () => {
  return cachedApiCall(_fetchAllJobs, [], 'all-jobs');
};

// Original function kept for reference
const _fetchJobsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching jobs for company with ID ${companyId}:`, error);
    throw error;
  }
};

// Cached version of fetchJobsByCompany - 5 minute cache by default
export const fetchJobsByCompany = async (companyId) => {
  return cachedApiCall(_fetchJobsByCompany, [companyId], `company-jobs-${companyId}`);
};

// Function to apply for a job - no caching for POST requests
export const applyForJob = async (jobId, userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, userData);
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

// Function to bookmark a job - no caching for POST requests
export const toggleJobBookmark = async (jobId, isBookmarked) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/${jobId}/bookmark`, { isBookmarked });
    return response.data;
  } catch (error) {
    console.error('Error toggling job bookmark:', error);
    throw error;
  }
};