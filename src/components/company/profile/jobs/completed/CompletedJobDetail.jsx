import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import { JobStatus } from "../../../../../constants/enums";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getJobsByStatus } from "../../../../../api/jobTrackingApi";
import { createRotaManagement } from "../../../../../api/rotaManagementApi";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";
import { ThemeContext } from "../../../../../context/ThemeContext";

const CompletedJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingToRota, setSavingToRota] = useState(false);
  const [workerSavedToRota, setWorkerSavedToRota] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const companyId = localStorage.getItem('companyId');
        const result = await getJobsByStatus(companyId, JobStatus.COMPLETED);
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const foundJob = result.data.find(job => 
            job._id === jobId || 
            (job.jobId && job.jobId._id === jobId)
          );
          
          if (foundJob) {
            setJob(foundJob);
          } else {
            throw new Error("Job not found");
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return timeString || "";
  };
  const getAssignedUser = () => {
    // First check if job has userJobRel (most common structure)
    if (job?.userJobRel && job.userJobRel.length > 0) {
      // Check if userId contains fullname
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        return job.userJobRel[0].userId;
      }
      
      // Check if jobSeekerId is an object with fullname
      if (job.userJobRel[0].jobSeekerId && typeof job.userJobRel[0].jobSeekerId === 'object') {
        return job.userJobRel[0].jobSeekerId;
      }
    }
    
    // Check for direct jobSeekerId reference
    if (job?.jobSeekerId && typeof job.jobSeekerId === 'object' && job.jobSeekerId.fullname) {
      return job.jobSeekerId;
    }
    
    // Check the applicantsList in jobId (specific to completed jobs)
    if (job?.jobId?.applicantsList && job.jobId.applicantsList.length > 0) {
      // Try to find the assigned applicant matching the jobSeekerId
      if (job.jobSeekerId) {
        const assignedUser = job.jobId.applicantsList.find(
          user => user._id === job.jobSeekerId
        );
        
        if (assignedUser) {
          return assignedUser;
        }
      }
      
      // If no specific match, return the first applicant
      return job.jobId.applicantsList[0];
    }
    
    return null;
  };

  const formatLocation = (lat, lng) => {
    if (!lat || !lng) return "Location not available";
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };

  const handleSaveWorkerInRota = async () => {
    try {
      setSavingToRota(true);
      
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Get assigned user information
      const assignedUser = getAssignedUser();
      if (!assignedUser || !assignedUser._id) {
        throw new Error('No assigned worker found for this job');
      }

      // Prepare request body with the required format
      const requestBody = {
        jobSeeker_id: assignedUser._id
      };

      // Call the API using the existing function
      const result = await createRotaManagement(companyId, requestBody);
      
      // Check if the result indicates the worker was already in rota
      if (result && result.message && 
          (result.message.toLowerCase().includes('already') || 
           result.message.toLowerCase().includes('duplicate') ||
           result.message.toLowerCase().includes('exists'))) {
        // Worker already exists in rota - show error popup
        setErrorMessage('This worker has already been added to the rota.');
        setShowErrorPopup(true);
      } else if (result) {
        // Successfully added new worker - show success popup
        setWorkerSavedToRota(true);
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error('Error saving worker to rota:', error);
      
      // Check if the error is about duplicate entry
      if (error.message && (error.message.toLowerCase().includes('duplicate') || 
          error.message.toLowerCase().includes('already exists') ||
          error.message.toLowerCase().includes('already added') ||
          error.message.toLowerCase().includes('already in rota'))) {
        setErrorMessage('This worker has already been added to the rota.');
        setShowErrorPopup(true);
      } else {
        // For other errors, show generic error popup
        setErrorMessage(`Failed to save worker to rota: ${error.message || error}`);
        setShowErrorPopup(true);
      }
    } finally {
      setSavingToRota(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-red-500 dark:text-red-400 mb-4">Error: {error}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Job ID: {jobId}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1 justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No job details found</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Job ID: {jobId}</p>
            <button 
              onClick={() => window.history.back()} 
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const jobData = job.jobId || {};
  const assignedUser = getAssignedUser();
  
  const companyLogo = jobData.companyLogo || jobData.companyId?.companyLogo || job.companyId?.companyLogo || insta;
  const latitude = jobData.latitude || job.latitude;
  const longitude = jobData.longitude || job.longitude;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col flex-1">
        {/* Back Arrow at the top */}
        <div className="flex items-center px-4 sm:px-6 md:px-8 mt-4 sm:mt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 focus:outline-none mr-2"
            aria-label="Go Back"
          >
            <FaArrowLeft className="mr-1" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 ml-auto">
            Find Job / Completed Jobs / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 sm:px-6 md:px-8 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between mt-4 sm:mt-8">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  <img 
                    src={companyLogo}
                    alt={jobData.jobTitle || "Company Logo"}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = insta;
                    }} 
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-semibold">
                    {jobData.jobTitle || "Job Title Not Available"}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 dark:border-gray-600 rounded-full flex items-center text-gray-700 dark:text-gray-300">
                      <FaMapMarkerAlt className="mr-1 text-gray-600 dark:text-gray-400" />
                      {formatLocation(latitude, longitude)}
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                      ID: {jobData.jobPin || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {latitude && longitude && (
              <div className="mt-4 w-full">
                <iframe 
                  title="Job Location"
                  className="w-full h-[150px] sm:h-[200px] rounded-lg border border-gray-200 dark:border-gray-700"
                  frameBorder="0" 
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`} 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 items-start sm:items-center mt-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 sm:w-8 sm:h-8" alt="Salary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Salary</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">${jobData.pricePerHour || 0}/hr</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 sm:w-8 sm:h-8" alt="Time" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-200 font-semibold">Timings</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Start date & Time</p>
                      <p className="text-[10px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                        {jobData.workDate ? `${formatDate(jobData.workDate)} ${formatTime(jobData.startTime)}` : "Not specified"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">End date & Time:</p>
                      <p className="text-[10px] sm:text-[12px] text-gray-600 dark:text-gray-400">
                        {jobData.workDate ? `${formatDate(jobData.workDate)} ${formatTime(jobData.endTime)}` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img 
                  src={jobData.checkpoints && jobData.checkpoints[0]?.qrCodeData ? jobData.checkpoints[0].qrCodeData : qr} 
                  alt="QR Code" 
                  className="w-20 h-20 sm:w-[90px] sm:h-[90px]" 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = qr;
                  }}
                />                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="border-2 border-dashed border-gray-400 dark:border-gray-500 px-3 sm:px-4 py-2 rounded-full w-full sm:w-[284px] h-auto sm:h-[48px] text-gray-800 dark:text-gray-200">
                    <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">Completed By: </span>
                    <span className="text-sm sm:text-base">
                      {assignedUser ? assignedUser.fullname : "Not assigned"}
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#FD7F00] dark:border-orange-500 px-3 sm:px-4 py-2 rounded-full w-auto sm:w-[181px] h-auto sm:h-[48px] text-[#FD7F00] dark:text-orange-400">
                    <span className="text-sm sm:text-base font-semibold">Status: </span>
                    <span className="text-sm sm:text-base capitalize">Book Off</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button 
                  onClick={handleSaveWorkerInRota}
                  disabled={savingToRota}
                  className={`w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm transition ${
                    workerSavedToRota 
                      ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' 
                      : 'bg-[#FD7F00] dark:bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-600'
                  } ${savingToRota ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {savingToRota ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : workerSavedToRota ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Worker Saved to Rota
                    </div>
                  ) : (
                    'Save Worker in Rota'
                  )}
                </button>
                <button className="bg-[#1F2B44] dark:bg-gray-700 w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-gray-800 dark:hover:bg-gray-800 transition">
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Popup Modal */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Cannot Add Worker
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {errorMessage}
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowErrorPopup(false)}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This job seeker has been successfully added to the rota.
                </p>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedJobDetail;