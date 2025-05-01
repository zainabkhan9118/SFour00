// API functions for handling company-related operations
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Get company profile data
 * @param {string} firebaseId - The Firebase ID of the company
 * @returns {Promise} - Promise with the response data
 */
export const getCompanyProfile = async (firebaseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/company`, {
      headers: {
        "firebase-id": firebaseId,
      },
    });
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
    const response = await axios.patch(`${BASE_URL}/company`, data, {
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
    const response = await axios.post(`${BASE_URL}/company`, data, {
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