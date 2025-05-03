// API functions for handling location-related operations
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Update job seeker location (for tracking)
 * @param {string} jobId - The ID of the job
 * @param {Object} locationData - Object containing latitude and longitude
 * @returns {Promise} - Promise with the response data
 */
export const updateLocation = async (jobId, locationData) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      throw new Error("Job seeker ID not found in local storage");
    }

    const response = await axios.post(
      `${BASE_URL}/apply/${jobId}/location`,
      locationData,
      {
        headers: {
          'jobSeekerId': jobSeekerId,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};

/**
 * Get worker location for a specific job
 * @param {string} companyId - The ID of the company
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the worker's location data
 */
export const getWorkerLocation = async (companyId, jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/${companyId}/${jobId}/location`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching worker location:', error);
    throw error;
  }
};

/**
 * Get job location details
 * @param {string} companyId - The ID of the company
 * @param {string} jobId - The ID of the job
 * @returns {Promise} - Promise with the job location data
 */
export const getJobLocation = async (companyId, jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/apply/${companyId}/${jobId}/location`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching job location:', error);
    throw error;
  }
};

/**
 * Search for locations using OpenStreetMap
 * @param {string} query - The search query
 * @returns {Promise} - Promise with the search results
 */
export const searchLocations = async (query) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} - Promise with the address data
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};