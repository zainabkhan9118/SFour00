// API functions for handling experience-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get experience data for a job seeker
 * @param {string} firebaseId - Firebase ID of the user
 * @param {string} jobSeekerId - Job seeker ID (optional)
 * @returns {Promise} - Promise with the response data
 */
export const getExperience = async (firebaseId, jobSeekerId = null) => {
  try {
    const headers = {
      "firebase-id": firebaseId,
      "Content-Type": "application/json"
    };
    
    if (jobSeekerId) {
      headers["jobseekerid"] = jobSeekerId;
    }
    
    const response = await axios.get(`${BASE_URL}/experience`, {
      headers
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching experience data:', error);
    throw error;
  }
};

/**
 * Add a new experience entry
 * @param {string} firebaseId - Firebase ID of the user
 * @param {string} jobSeekerId - Job seeker ID
 * @param {Object} experienceData - Experience data to create
 * @returns {Promise} - Promise with the response data
 */
export const addExperience = async (firebaseId, jobSeekerId, experienceData) => {
  try {
    // Determine if we're working with FormData or regular JSON
    const isFormData = experienceData instanceof FormData;
    const contentType = isFormData ? "multipart/form-data" : "application/json";
    
    const response = await axios.post(`${BASE_URL}/experience`, experienceData, {
      headers: {
        "firebase-id": firebaseId,
        "jobseekerid": jobSeekerId,
        "Content-Type": contentType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

/**
 * Update an experience entry
 * @param {string} experienceId - ID of the experience entry to update
 * @param {string} firebaseId - Firebase ID of the user
 * @param {Object} experienceData - Updated experience data
 * @returns {Promise} - Promise with the response data
 */
export const updateExperience = async (experienceId, firebaseId, experienceData) => {
  try {
    // Determine if we're working with FormData or regular JSON
    const isFormData = experienceData instanceof FormData;
    const contentType = isFormData ? "multipart/form-data" : "application/json";
    
    const response = await axios.patch(`${BASE_URL}/experience/${experienceId}`, experienceData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": contentType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

/**
 * Delete an experience entry
 * @param {string} experienceId - ID of the experience entry to delete
 * @param {string} firebaseId - Firebase ID of the user
 * @returns {Promise} - Promise with the response data
 */
export const deleteExperience = async (experienceId, firebaseId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/experience/${experienceId}`, {
      headers: {
        "firebase-id": firebaseId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};