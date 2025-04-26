// API functions for handling job application and related requests
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to apply for a job with job seeker ID
export const applyForJobWithSeekerId = async (jobId, jobSeekerId, formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': formData ? 'multipart/form-data' : 'application/json',
        'jobSeekerId': jobSeekerId
      }
    };

    const data = formData || { status: "applied", jobSeekerId };
    const response = await axios.post(`${BASE_URL}/apply/${jobId}`, data, config);
    
    if (response.status >= 400) {
      throw new Error(response.data.message || 'Failed to apply for job');
    }
    
    return response.data;
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || error.response.data || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message || 'An error occurred while applying for the job');
    }
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

export const getAppliedJobs = async (jobSeekerId) => {
  return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
    params: { status: "applied" },
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
};

export const getInProgressJobs = async (jobSeekerId) => {
  return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
    params: { status: "inProgress" },
    headers: {
      'accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
};

