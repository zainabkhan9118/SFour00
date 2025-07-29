import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api';

// Create rota management for a specific company
export const createRotaManagement = async (companyId, rotaData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rota-management/${companyId}`, rotaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating rota management:', error);
    throw error.response?.data || error.message;
  }
};

// Get all rota management records for a specific company
export const getRotaManagementByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rota-management/all/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rota management:', error);
    throw error.response?.data || error.message;
  }
};

// Update specific rota management record
export const updateRotaManagement = async (rotaId, updateData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/rota-management/${rotaId}`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating rota management:', error);
    throw error.response?.data || error.message;
  }
};

// Delete specific rota management record
export const deleteRotaManagement = async (rotaId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/rota-management/${rotaId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting rota management:', error);
    throw error.response?.data || error.message;
  }
};

// Get rota management by date range
export const getRotaManagementByDateRange = async (companyId, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rota-management/all/${companyId}`, {
      params: {
        startDate,
        endDate
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rota management by date range:', error);
    throw error.response?.data || error.message;
  }
};

// Get rota management by employee
export const getRotaManagementByEmployee = async (companyId, employeeId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rota-management/all/${companyId}`, {
      params: {
        employeeId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rota management by employee:', error);
    throw error.response?.data || error.message;
  }
};

// Bulk create rota management records
export const bulkCreateRotaManagement = async (companyId, rotaDataArray) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rota-management/${companyId}/bulk`, {
      rotaRecords: rotaDataArray
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error bulk creating rota management:', error);
    throw error.response?.data || error.message;
  }
};

// Assign employee to rota
export const assignEmployeeToRota = async (rotaId, employeeId, assignmentData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/rota-management/${rotaId}`, {
      employeeId,
      ...assignmentData
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning employee to rota:', error);
    throw error.response?.data || error.message;
  }
};

// Get rota statistics for company
export const getRotaStatistics = async (companyId, period = 'week') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rota-management/stats/${companyId}`, {
      params: {
        period
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rota statistics:', error);
    throw error.response?.data || error.message;
  }
};

export default {
  createRotaManagement,
  getRotaManagementByCompany,
  updateRotaManagement,
  deleteRotaManagement,
  getRotaManagementByDateRange,
  getRotaManagementByEmployee,
  bulkCreateRotaManagement,
  assignEmployeeToRota,
  getRotaStatistics
};
