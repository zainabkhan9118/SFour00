// API functions for handling job application and related requests
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to apply for a job with job seeker ID
export const applyForJobWithSeekerId = async (jobId, jobSeekerId) => {
  try {
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`, null, {
      headers: {
        'jobSeekerId': jobSeekerId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

// Function specifically for the /applied/{jobId} endpoint
export const applyForJob = async (jobId, jobSeekerId) => {
  try {
    console.log(`Calling API: POST ${BASE_URL}/apply/${jobId} with jobSeekerId: ${jobSeekerId}`);
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`, null, {
      headers: {
        'jobSeekerId': jobSeekerId
      }
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error applying for job with ID ${jobId}:`, error);
    throw error;
  }
};

// Try with request body instead of header
export const applyForJobWithBody = async (jobId, jobSeekerId) => {
  try {
    console.log(`Calling API: POST ${BASE_URL}/apply/${jobId} with jobSeekerId in body: ${jobSeekerId}`);
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`, { 
      jobSeekerId: jobSeekerId 
    });
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error applying for job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to apply using query params - this format works with your backend
export const applyForJobWithParams = async (jobId) => {
  try {
    // This endpoint seems to be working in your network logs
    console.log(`Calling API: POST ${BASE_URL}/apply/${jobId} with no jobSeekerId in request`);
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error applying for job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to check application status
export const checkApplicationStatus = async (jobId, jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/applications/status`, {
      params: { jobId, jobSeekerId }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking application status:', error);
    throw error;
  }
};

// Function to withdraw a job application
export const withdrawApplication = async (jobId, jobSeekerId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/applications`, {
      params: { jobId, jobSeekerId }
    });
    return response.data;
  } catch (error) {
    console.error('Error withdrawing application:', error);
    throw error;
  }
};