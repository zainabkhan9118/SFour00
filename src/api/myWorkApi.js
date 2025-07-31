// myWorkApis.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Apply for a job
export const applyForJob = async (jobId, data) => {
  return axios.post(`api/apply/${jobId}`, data);
};

// Update application status
export const updateJobStatus = async (jobId, data) => {
  const jobSeekerId = localStorage.getItem("jobSeekerId");
  return axios.patch(`${BASE_URL}/apply/${jobId}`, data, {
    headers: {
      'jobSeekerId': jobSeekerId,
      'Content-Type': 'application/json'
    }
  });
};

// Create invoice for job application
export const createInvoice = async (jobId, jobSeekerId, invoiceData) => {
  return axios.post(`${BASE_URL}/apply/${jobId}/invoice`, invoiceData, {
    headers: {
      'jobSeekerId': jobSeekerId,
      'Content-Type': 'application/json'
    }
  });
};

// Enable assignment
export const enableAssignment = async (jobId, data) => {
  return axios.patch(`${BASE_URL}/apply/${jobId}/enable-assignment`, data);
};



// // Update job location
// export const updateLocation = async (jobId, locationData) => {
//   const jobSeekerId = localStorage.getItem("jobSeekerId");
//   return axios.patch(`${BASE_URL}/apply/${jobId}/location`, locationData, {
//     headers: {
//       'jobSeekerId': jobSeekerId,
//       'Content-Type': 'application/json'
//     }
//   });
// };







// Update job location
export const updateLocation = async (jobId, locationData) => {
  const jobSeekerId = localStorage.getItem("jobSeekerId");
  
  console.log("updateLocation called with:", {
    jobId,
    locationData,
    jobSeekerId,
    endpoint: `${BASE_URL}/apply/${jobId}/location`
  });

  if (!jobId) {
    throw new Error("Job ID is required for location update");
  }

  if (!jobSeekerId) {
    throw new Error("Job Seeker ID not found in localStorage");
  }

  return axios.patch(`${BASE_URL}/apply/${jobId}/location`, locationData, {
    headers: {
      'jobSeekerId': jobSeekerId,
      'Content-Type': 'application/json'
    }
  });
};











// Update status via QR
export const updateStatusByQR = async (jobId, qrData) => {
  const jobSeekerId = localStorage.getItem("jobSeekerId");
  
  // Payload should match exactly what the API expects
  // Based on the API screenshot, we need to send just the qrCodeData field
  const payload = {
    qrCodeData: qrData.qrCodeData
  };
  
  console.log(`Making QR status update request for job ${jobId}:`, {
    endpoint: `${BASE_URL}/apply/${jobId}/update-status-by-qr`,
    payload
  });
  
  // Using PATCH as per the API screenshot with jobSeekerId in header
  return axios.patch(`${BASE_URL}/apply/${jobId}/update-status-by-qr`, payload, {
    headers: {
      'jobSeekerId': jobSeekerId,
      'Content-Type': 'application/json'
    }
  });
};

export const getAppliedJobs = async (jobSeekerId, status = "applied") => {
    return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
        params: { status }, // Use params for query parameters
    });
};

// Get assigned jobs for job seeker - specifically jobs with status "applied" and isAssignable=true
export const getAssignedJobs = async (jobSeekerId) => {
    return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
        params: { status: "applied" }, // Keep the status as "applied"
        headers: {
            'accept': '*/*',
            'Content-Type': 'application/json'
        }
    });
};

// Get jobs with specific status and flags
export const getJobsByStatus = async (jobSeekerId, params = {}) => {
    return axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
        params, // Pass all parameters (status, isAssigned, isAssignable, etc.)
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
