// API functions for handling job-related requests
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to fetch all jobs
export const fetchAllJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};



// Function to fetch jobs by company ID
export const fetchJobsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching jobs for company with ID ${companyId}:`, error);
    throw error;
  }
};

// Function to apply for a job
export const applyForJob = async (jobId, userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, userData);
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

// Function to bookmark a job
export const toggleJobBookmark = async (jobId, isBookmarked) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/${jobId}/bookmark`, { isBookmarked });
    return response.data;
  } catch (error) {
    console.error('Error toggling job bookmark:', error);
    throw error;
  }
};