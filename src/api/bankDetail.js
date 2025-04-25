import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createBankDetails = async (bankData) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      throw new Error("Job seeker ID not found");
    }

    const response = await axios.post(`${BASE_URL}/bank-details`, bankData, {
      headers: {
        'jobSeekerId': jobSeekerId,
        'Content-Type': 'application/json'
      }
    });

    console.log('Bank details created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating bank details:', error);
    throw error;
  }
};

export const getBankDetails = async (bankDetailId) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      throw new Error("Job seeker ID not found");
    }
    const response = await axios.get(`${BASE_URL}/bank-details/${bankDetailId}`, {
      headers: {
        'jobSeekerId': jobSeekerId
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching bank details:', error);
    throw error;
  }
};

export const updateBankDetails = async (bankDetailId, bankData) => {
  try {
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      throw new Error("Job seeker ID not found");
    }

    const response = await axios.patch(
      `${BASE_URL}/bank-details/${bankDetailId}`,
      bankData,
      {
        headers: {
          'jobSeekerId': jobSeekerId,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Bank details updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating bank details:', error);
    throw error;
  }
};