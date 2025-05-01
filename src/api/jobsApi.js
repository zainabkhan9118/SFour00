// API functions for handling job-related requests
import axios from 'axios';
import { cachedApiCall } from '../services/apiCache';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

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