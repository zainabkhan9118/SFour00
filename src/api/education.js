// API functions for handling job-related requests
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getEducation = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/education`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  };

// Add a function to get education by user id (firebaseId)
export const getEducationByUserId = async (firebaseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/education`, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching education data:', error);
    throw error;
  }
};

// Function to update an education entry
export const updateEducation = async (id, firebaseId, educationData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/education/${id}`, educationData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating education data:', error);
    throw error;
  }
};

// Function to create a new education entry
export const createEducation = async (firebaseId, educationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/education`, educationData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating education data:', error);
    throw error;
  }
};

// Function to delete an education entry
export const deleteEducation = async (id, firebaseId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/education/${id}`, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting education data:', error);
    throw error;
  }
};