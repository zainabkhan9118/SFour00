// API functions for handling UTR-related operations
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get UTR data for the currently authenticated user
 * @returns {Promise<string|null>} - UTR number or null if not found
 */
export const getUtrData = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const firebaseId = currentUser.uid;
    const response = await axios.get(`${BASE_URL}/job-seeker`, {
      headers: {
        'firebase-id': firebaseId,
        'Content-Type': 'application/json'
      }
    });

    return response.data?.data?.utrNumber || null;
  } catch (error) {
    console.error('Error fetching UTR data:', error);
    throw error;
  }
};

/**
 * Update the UTR number for the currently authenticated user
 * @param {string} utrNumber - The new UTR number
 * @returns {Promise} - Promise with the response data
 */
export const updateUtrData = async (utrNumber) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const firebaseId = currentUser.uid;

    // First get current data
    const currentData = await getUtrData();
    
    // Only update if the UTR number is different
    if (currentData !== utrNumber) {
      const response = await axios.patch(`${BASE_URL}/job-seeker`, 
        { utrNumber },  
        {
          headers: {
            'firebase-id': firebaseId,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    }

    return { message: "UTR number unchanged" };
  } catch (error) {
    console.error('Error updating UTR number:', error);
    throw error;
  }
};

/**
 * Get UTR data with explicit firebase ID
 * @param {string} firebaseId - The Firebase ID of the user
 * @returns {Promise<string|null>} - UTR number or null if not found
 */
export const getUtrDataByFirebaseId = async (firebaseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/job-seeker`, {
      headers: {
        'firebase-id': firebaseId,
        'Content-Type': 'application/json'
      }
    });

    return response.data?.data?.utrNumber || null;
  } catch (error) {
    console.error('Error fetching UTR data by firebase ID:', error);
    throw error;
  }
};

/**
 * Update UTR data with explicit firebase ID
 * @param {string} firebaseId - The Firebase ID of the user 
 * @param {string} utrNumber - The new UTR number
 * @returns {Promise} - Promise with the response data
 */
export const updateUtrDataByFirebaseId = async (firebaseId, utrNumber) => {
  try {
    const response = await axios.patch(`${BASE_URL}/job-seeker`, 
      { utrNumber },  
      {
        headers: {
          'firebase-id': firebaseId,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating UTR number by firebase ID:', error);
    throw error;
  }
};