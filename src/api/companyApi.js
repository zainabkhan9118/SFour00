// API functions for handling company-related operations
import axios from 'axios';

// Use the environment variable for the base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://s4backend-c7f27664aa4d.herokuapp.com';

console.log('API Base URL:', BASE_URL); // For debugging

/**
 * Get company profile data
 * @param {string} firebaseId - The Firebase ID of the company
 * @returns {Promise} - Promise with the response data
 */
export const getCompanyProfile = async (firebaseId) => {
  try {
    // According to the API docs, we use the base /company endpoint with firebase-id header
    console.log('Fetching company data with Firebase ID:', firebaseId);
    
    const response = await axios.get(`${BASE_URL}/company`, {
      headers: {
        "firebase-id": firebaseId,
      },
    });
    
    // If we get data with an ID, store it in localStorage
    if (response.data?.data?._id) {
      localStorage.setItem('companyId', response.data.data._id);
      console.log('Stored company ID:', response.data.data._id);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};

/**
 * Update company profile
 * @param {string} firebaseId - The Firebase ID of the company
 * @param {Object|FormData} data - Data to update
 * @returns {Promise} - Promise with the response data
 */
export const updateCompanyProfile = async (firebaseId, data) => {
  try {
    const isFormData = data instanceof FormData;
    
    console.log('Updating company with Firebase ID:', firebaseId);
    console.log('Update data:', isFormData ? 'FormData object' : data);
    
    // According to API docs, PATCH to /company with firebase-id header
    const response = await axios.patch(`${BASE_URL}/company`, data, {
      headers: {
        "firebase-id": firebaseId,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating company data:', error);
    throw error;
  }
};

/**
 * Create company profile
 * @param {string} firebaseId - The Firebase ID of the company
 * @param {Object|FormData} data - Company data or FormData
 * @returns {Promise} - Promise with the response data
 */
export const createCompanyProfile = async (firebaseId, data) => {
  const isFormData = data instanceof FormData;
  
  try {
    console.log('Creating company profile with Firebase ID:', firebaseId);
    console.log('Profile data:', isFormData ? 'FormData object' : data);
    
    // According to API docs, POST to /company with firebase-id header
    const response = await axios.post(`${BASE_URL}/company`, data, {
      headers: {
        "firebase-id": firebaseId,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    
    // Store company ID if available
    if (response.data?.data?._id) {
      localStorage.setItem('companyId', response.data.data._id);
      console.log('Stored new company ID:', response.data.data._id);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating company profile:', error);
    throw error;
  }
};

/**
 * Update company contact information
 * @param {string} firebaseId - The Firebase ID of the company
 * @param {string} contact - Company contact
 * @returns {Promise} - Promise with the response data
 */
export const updateCompanyContact = async (firebaseId, contact) => {
  try {
    console.log('Updating company contact with Firebase ID:', firebaseId);
    
    // According to API docs, we use PATCH to /company
    const response = await axios.patch(`${BASE_URL}/company`, 
      { companyContact: contact },
      {
        headers: {
          "firebase-id": firebaseId,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating company contact:', error);
    throw error;
  }
};

/**
 * Update company email
 * @param {string} firebaseId - The Firebase ID of the company
 * @param {string} email - Company email
 * @returns {Promise} - Promise with the response data
 */
export const updateCompanyEmail = async (firebaseId, email) => {
  try {
    console.log('Updating company email with Firebase ID:', firebaseId);
    
    // According to API docs, we use PATCH to /company
    const response = await axios.patch(`${BASE_URL}/company`, 
      { companyEmail: email },
      {
        headers: {
          "firebase-id": firebaseId,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating company email:', error);
    throw error;
  }
};

/**
 * Update company manager information
 * @param {string} firebaseId - The Firebase ID of the company
 * @param {Object} managerData - Manager data to update
 * @returns {Promise} - Promise with the response data
 */
export const updateCompanyManager = async (firebaseId, managerData) => {
  try {
    console.log('Updating company manager with Firebase ID:', firebaseId);
    console.log('Manager data:', managerData);
    
    // According to API docs, we use PATCH to /company
    const response = await axios.patch(`${BASE_URL}/company`, 
      { manager: managerData },
      {
        headers: {
          "firebase-id": firebaseId,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating company manager:', error);
    throw error;
  }
};