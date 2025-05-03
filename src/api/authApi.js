// API functions for handling authentication-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Log in a user with Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise} - Promise with the response data
 */
export const login = async (idToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      idToken: idToken,
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User data for registration
 * @returns {Promise} - Promise with the response data
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/user`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Store user session data in localStorage
 * @param {string} firebaseId - Firebase ID
 * @param {Object} userData - User data to store
 * @param {Function} setRole - Function to set user role in context
 * @param {Function} setUser - Function to set user data in context
 * @param {Function} setSessionData - Function to set session data in context
 * @returns {string} - User role
 */
export const storeUserSession = (firebaseId, userData, setRole, setUser, setSessionData) => {
  // Store the basic user data
  if (setUser) setUser(userData);
  if (setRole) setRole(userData.role);

  // Store the user ID from login response
  const userId = userData.userId || userData._id;
  if (userId) {
    localStorage.setItem("userId", userId);
    console.log("User ID stored:", userId);
  }

  // Create session data
  const sessionData = {
    firebaseId: firebaseId,
    role: userData.role,
    timestamp: Date.now(),
    userId: userId,
  };

  if (setSessionData) setSessionData(sessionData);
  localStorage.setItem("sessionData", JSON.stringify(sessionData));

  return userData.role;
};

/**
 * Fetch and store job seeker ID
 * @param {string} firebaseId - Firebase ID of user
 * @returns {Promise<string|null>} - Job seeker ID or null
 */
export const fetchAndStoreJobSeekerId = async (firebaseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/job-seeker`, {
      headers: {
        "firebase-id": firebaseId,
      },
    });

    if (response.data?.data?._id) {
      const jobSeekerId = response.data.data._id;
      localStorage.setItem("jobSeekerId", jobSeekerId);
      
      // Also try to get associated data like certificates, licenses, etc.
      if (response.data.data.certificates && response.data.data.certificates.length > 0) {
        const certificateId = response.data.data.certificates[0]?._id || null;
        localStorage.setItem("certificateId", certificateId);
      }
      
      if (response.data.data.licenses && response.data.data.licenses.length > 0) {
        const licenseId = response.data.data.licenses[0]?._id || null;
        localStorage.setItem("licenseId", licenseId);
      }
      
      return jobSeekerId;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching job seeker ID:', error);
    return null;
  }
};

/**
 * Fetch bank details
 * @param {string} jobSeekerId - Job seeker ID
 * @returns {Promise} - Promise with the response data
 */
export const fetchBankDetails = async (jobSeekerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/bank-details`, {
      headers: {
        jobseekerid: jobSeekerId,
      },
    });
    
    if (response.data?.data?.length > 0) {
      const bankDetailId = response.data.data[0]._id;
      localStorage.setItem("bankDetailId", bankDetailId);
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching bank details:', error);
    return null;
  }
};

/**
 * Log out a user
 */
export const logout = () => {
  localStorage.removeItem("sessionData");
  localStorage.removeItem("jobSeekerId");
  localStorage.removeItem("certificateId");
  localStorage.removeItem("licenseId");
  localStorage.removeItem("bankDetailId");
  localStorage.removeItem("userId");
};