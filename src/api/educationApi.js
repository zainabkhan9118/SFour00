// API functions for handling education-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get education data for a job seeker
 * @param {string} firebaseId - Firebase ID of the user
 * @param {string} jobSeekerId - Job seeker ID (optional)
 * @returns {Promise} - Promise with the response data
 */
export const getEducation = async (firebaseId, jobSeekerId = null) => {
  try {
    const headers = {
      "firebase-id": firebaseId,
      "Content-Type": "application/json"
    };
    
    if (jobSeekerId) {
      headers["jobseekerid"] = jobSeekerId;
    }
    
    const response = await axios.get(`${BASE_URL}/education`, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching education data:', error);
    throw error;
  }
};

/**
 * Add a new education entry
 * @param {string} firebaseId - Firebase ID of the user
 * @param {string} jobSeekerId - Job seeker ID
 * @param {Object} educationData - Education data to create
 * @returns {Promise} - Promise with the response data
 */
export const addEducation = async (firebaseId, jobSeekerId, educationData) => {
  try {
    // Determine if we're working with FormData or regular JSON
    const isFormData = educationData instanceof FormData;
    const contentType = isFormData ? "multipart/form-data" : "application/json";
    
    const response = await axios.post(`${BASE_URL}/education`, educationData, {
      headers: {
        "firebase-id": firebaseId,
        "jobseekerid": jobSeekerId,
        "Content-Type": contentType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

/**
 * Update an education entry
 * @param {string} educationId - ID of the education entry to update
 * @param {string} firebaseId - Firebase ID of the user
 * @param {Object} educationData - Updated education data
 * @param {string} jobSeekerId - Job seeker ID
 * @returns {Promise} - Promise with the response data
 */
export const updateEducation = async (educationId, firebaseId, educationData, jobSeekerId) => {
  try {
    // Determine if we're working with FormData or regular JSON
    const isFormData = educationData instanceof FormData;
    const contentType = isFormData ? "multipart/form-data" : "application/json";
    
    const headers = {
      "firebase-id": firebaseId,
      "Content-Type": contentType
    };

    if (jobSeekerId) {
      headers["jobseekerid"] = jobSeekerId;
    }
    
    const response = await axios.patch(`${BASE_URL}/education/${educationId}`, educationData, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

/**
 * Delete an education entry
 * @param {string} educationId - ID of the education entry to delete
 * @param {string} firebaseId - Firebase ID of the user
 * @param {string} jobSeekerId - Job seeker ID (optional)
 * @returns {Promise} - Promise with the response data
 */
export const deleteEducation = async (educationId, firebaseId, jobSeekerId = null) => {
  try {
    const headers = {
      "firebase-id": firebaseId
    };
    
    if (jobSeekerId) {
      headers["jobseekerid"] = jobSeekerId;
    }
    
    const response = await axios.delete(`${BASE_URL}/education/${educationId}`, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};