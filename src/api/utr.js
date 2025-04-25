import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to get UTR data
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

// Function to update UTR number only
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