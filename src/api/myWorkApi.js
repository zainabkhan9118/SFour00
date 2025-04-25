// myWorkApis.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Apply for a job
export const applyForJob = async (jobId, data) => {
  return axios.post(`api/apply/${jobId}`, data);
};

// Update application status
export const updateJobStatus = async (jobId, data) => {
  return axios.patch(`${BASE_URL}/apply/${jobId}`, data);
};

// Create invoice for job application
export const createInvoice = async (jobId, invoiceData) => {
  return axios.post(`${BASE_URL}/apply/${jobId}/invoice`, invoiceData);
};

// Enable assignment
export const enableAssignment = async (jobId, data) => {
  return axios.patch(`${BASE_URL}/apply/${jobId}/enable-assignment`, data);
};

// Update job location
export const updateLocation = async (jobId, locationData) => {
  return axios.patch(`${BASE_URL}/apply/${jobId}/location`, locationData);
};

// Update status via QR
export const updateStatusByQR = async (jobId, qrData) => {
  return axios.patch(`${BASE_URL}/apply/${jobId}/update-status-by-qr`, qrData);
};

export const getAppliedJobs = async (jobSeekerId) => {
    return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
        params: { status: "applied" }, // Use params for query parameters
    });
};
  

// Get job location (for company + job)
export const getJobLocation = async (companyId, jobId) => {
  return axios.get(`${BASE_URL}/apply/${companyId}/${jobId}/location`);
};

// Get invoices for job seeker
export const getInvoices = async (jobSeekerId) => {
  return axios.get(`${BASE_URL}/apply/${jobSeekerId}/invoices`);
};

// Generate invoice PDF
export const getInvoicePDF = async (jobSeekerId) => {
  return axios.get(`${BASE_URL}/apply/${jobSeekerId}/invoices/pdf`);
};

// Get jobs by company and their applicant status
export const getCompanyJobsWithApplicants = async (companyId) => {
  return axios.get(`${BASE_URL}/apply/company/${companyId}`);
};
