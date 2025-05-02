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
    // Get the company ID from localStorage
    const companyId = localStorage.getItem('companyId');
    
    // If we have a companyId, use the /{id} endpoint format
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    console.log('Fetching company with endpoint:', endpoint);
    console.log('Using Firebase ID:', firebaseId);
    
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        "firebase-id": firebaseId,
      },
    });
    
    // If we get data and don't have a companyId stored yet, store it
    if (response.data?.data?._id && !companyId) {
      localStorage.setItem('companyId', response.data.data._id);
      console.log('Stored new company ID:', response.data.data._id);
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
 * @param {Object} data - Data to update
 * @returns {Promise} - Promise with the response data
 */
export const updateCompanyProfile = async (firebaseId, data) => {
  try {
    const companyId = localStorage.getItem('companyId');
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    const response = await axios.patch(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": "application/json",
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
    const companyId = localStorage.getItem('companyId');
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        "firebase-id": firebaseId,
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
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
    const companyId = localStorage.getItem('companyId');
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    const response = await axios.patch(`${BASE_URL}${endpoint}`, 
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
    const companyId = localStorage.getItem('companyId');
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    const response = await axios.patch(`${BASE_URL}${endpoint}`, 
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
    const companyId = localStorage.getItem('companyId');
    const endpoint = companyId ? `/company/${companyId}` : '/company';
    
    const response = await axios.patch(`${BASE_URL}${endpoint}`, 
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