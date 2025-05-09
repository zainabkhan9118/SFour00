// API functions for handling logbook-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Submit a new logbook entry (report) for a job
 * @param {string} jobId - The ID of the job (path parameter)
 * @param {string} jobSeekerId - The job seeker ID (header parameter)
 * @param {Object} reportData - The report data containing description and optional picture
 * @returns {Promise} - Promise with the response data
 */
export const submitLogbookReport = async (jobId, jobSeekerId, reportData) => {
  try {
    console.log('Submitting logbook report with parameters:', {
      jobId,
      jobSeekerId,
      description: reportData.description,
      hasImage: reportData.picture ? true : false
    });

    // Prepare the request body according to the API documentation
    const requestBody = {
      description: reportData.description || ""
    };

    // If there's a picture and it's a File object, handle it with FormData
    if (reportData.picture instanceof File) {
      const formData = new FormData();
      formData.append('description', reportData.description || "");
      formData.append('picture', reportData.picture);
      
      console.log(`POST ${BASE_URL}/log-book/${jobId} (with FormData containing image)`);
      
      const response = await axios.post(`${BASE_URL}/log-book/${jobId}`, formData, {
        headers: {
          'jobSeekerId': jobSeekerId, // Header parameter as shown in the API doc
        }
      });
      
      console.log('Logbook API response:', response.status, response.data);
      return response.data;
    } 
    // If picture is a URL string, include it in the JSON
    else if (typeof reportData.picture === 'string' && reportData.picture) {
      requestBody.picture = reportData.picture;
    }
    
    console.log(`POST ${BASE_URL}/log-book/${jobId} with body:`, requestBody);
    
    // Make the API call with JSON data
    const response = await axios.post(`${BASE_URL}/log-book/${jobId}`, requestBody, {
      headers: {
        'jobSeekerId': jobSeekerId, // Header parameter as shown in the API doc
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Logbook API response:', response.status, response.data);
    return response.data;
  } 
  catch (error) {
    // Detailed error logging
    console.error('Error submitting logbook report:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      jobId,
      jobSeekerId
    });
    
    // Throw error with specific message from API if available
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Get logbook entries for a job
 * @param {string} jobId - The ID of the job (path parameter)
 * @param {string} jobSeekerId - The job seeker ID (header parameter)
 * @returns {Promise} - Promise with the logbook entries
 */
export const getLogbookEntries = async (jobId, jobSeekerId) => {
  try {
    console.log(`GET ${BASE_URL}/log-book/${jobId}/logbooks`);

    const response = await axios.get(`${BASE_URL}/log-book/${jobId}/logbooks`, {
      headers: {
        'jobSeekerId': jobSeekerId // Header parameter exactly as shown in the API doc
      }
    });
    
    console.log('Fetched logbook entries:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching logbook entries:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      jobId,
      jobSeekerId
    });
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};