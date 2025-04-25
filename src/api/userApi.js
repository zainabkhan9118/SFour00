import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Function to fetch user data by Firebase ID
export const getUserData = async (firebaseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/job-seeker`, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Function to update user data
export const updateUserData = async (firebaseId, userData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/job-seeker`, userData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Function to create new user data
export const createUserData = async (firebaseId, userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/job-seeker`, userData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user data:', error);
    throw error;
  }
};

// Function to update profile picture
export const updateProfilePicture = async (firebaseId, pictureData) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', pictureData);

    const response = await axios.patch(`${BASE_URL}/job-seeker/profile-picture`, formData, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};