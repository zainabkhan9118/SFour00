import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Headerjob from "./Headerjob";
import LoadingSpinner from "../../../common/LoadingSpinner";
import logo1 from "../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";
import { getJobsByStatus } from "../../../../api/jobsApi";
import { JobStatus } from "../../../../constants/enums";
import { ThemeContext } from "../../../../context/ThemeContext";
import { createRotaManagement } from "../../../../api/rotaManagementApi";

const AssignedJob = () => {
  const navigate = useNavigate();
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingToRota, setSavingToRota] = useState({});
  const [workerSavedToRota, setWorkerSavedToRota] = useState({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const handleJobClick = (jobId) => {
    navigate(`/assign-jobDetail/${jobId}`);
  };

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";

        const result = await getJobsByStatus(companyId, JobStatus.ASSIGNED);

        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const processedJobs = result.data.map(job => {
            const jobData = job.jobId || job;
            const companyData = jobData.companyId || {};

            return {
              _id: job._id,
              jobId: jobData._id,
              jobTitle: jobData.jobTitle || "Untitled Job",
              pricePerHour: jobData.pricePerHour || 0,
              createdAt: job.createdAt,
              updatedAt: job.updatedAt,
              jobStatus: job.status || JobStatus.ASSIGNED,
              userJobRel: job.userJobRel || [],
              jobSeekerId: job.jobSeekerId || null,
              applicantsList: jobData.applicantsList || [],
              companyId: {
                companyLogo: companyData.companyLogo,
                address: companyData.address || "Location not specified"
              }
            };
          });

          setAssignedJobs(processedJobs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch assigned jobs:", err);
        setError(err.message);
        setAssignedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedJobs();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + " " + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignedJobseekerName = (job) => {
    if (job.userJobRel && job.userJobRel.length > 0) {
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        return job.userJobRel[0].userId.fullname;
      }

      if (job.userJobRel[0].jobSeekerId && typeof job.userJobRel[0].jobSeekerId === 'object') {
        return job.userJobRel[0].jobSeekerId.fullname || "Jobseeker";
      }
    }

    if (job.jobSeekerId) {
      if (typeof job.jobSeekerId === 'object' && job.jobSeekerId.fullname) {
        return job.jobSeekerId.fullname;
      }
    }

    if (job.applicantsList && job.applicantsList.length > 0) {
      const assignedApplicant = job.applicantsList.find(applicant => 
        applicant.status === JobStatus.ASSIGNED || 
        applicant.status === "ASSIGNED"
      ) || job.applicantsList[0];

      return assignedApplicant.fullname || "Jobseeker";
    }

    return "Not assigned";
  };

  const handleSaveWorkerInRota = async (job) => {
    try {
      setSavingToRota(prev => ({ ...prev, [job._id]: true }));
      
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Get assigned user information
      const assignedUser = getAssignedUser(job);
      if (!assignedUser || !assignedUser._id) {
        throw new Error('No assigned worker found for this job');
      }

      // Prepare request body with the required format for POST request
      const requestBody = {
        jobSeeker_id: assignedUser._id
      };

      console.log('Making POST request to rota-management API:', {
        companyId,
        requestBody
      });

      // Call the POST API using the existing function
      const result = await createRotaManagement(companyId, requestBody);
      
      console.log('Rota management API response:', result);
      
      // Check if the result indicates success
      if (result && (result.statusCode === 200 || result.statusCode === 201 || result.success)) {
        // Successfully added worker - show success popup
        setWorkerSavedToRota(prev => ({ ...prev, [job._id]: true }));
        setShowSuccessPopup(true);
      } else if (result && result.message && 
          (result.message.toLowerCase().includes('already') || 
           result.message.toLowerCase().includes('duplicate') ||
           result.message.toLowerCase().includes('exists'))) {
        // Worker already exists in rota - show error popup
        setErrorMessage('This worker has already been added to the rota.');
        setShowErrorPopup(true);
      } else {
        // Unexpected response format
        setWorkerSavedToRota(prev => ({ ...prev, [job._id]: true }));
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
      } else if (error.response && error.response.status === 409) {
        // Handle 409 Conflict status code
        setErrorMessage('This worker has already been added to the rota.');
        setShowErrorPopup(true);
      } else {
        // For other errors, show generic error popup
        setErrorMessage(`Failed to save worker to rota: ${error.message || error}`);
        setShowErrorPopup(true);
      }
    } finally {
      setSavingToRota(prev => ({ ...prev, [job._id]: false }));
    }
  };

  const getAssignedUser = (job) => {
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
    
    // Check the applicantsList
    if (job?.applicantsList && job.applicantsList.length > 0) {
      // Try to find the assigned applicant matching the jobSeekerId
      if (job.jobSeekerId) {
        const assignedUser = job.applicantsList.find(
          user => user._id === job.jobSeekerId
        );
        
        if (assignedUser) {
          return assignedUser;
        }
      }
      
      // If no specific match, return the first applicant
      return job.applicantsList[0];
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col gap-4 lg:gap-6 flex-1 p-4 lg:p-6">
          <Headerjob />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col gap-4 lg:gap-6 flex-1 p-4 lg:p-6">
        <Headerjob />

        {error ? (
          <div className="w-full bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-md rounded-lg flex justify-center items-center h-64">
            <p className="text-xl text-red-500 dark:text-red-400">Error: {error}</p>
          </div>
        ) : (
          <div className="w-full bg-white dark:bg-gray-800 p-4 lg:p-6 shadow-md rounded-lg">
            {assignedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">No assigned jobs found</p>
              </div>
            ) : (
              assignedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index === assignedJobs.length - 1 ? "border-none" : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={job.companyId?.companyLogo || (index % 2 === 0 ? logo1 : logo2)} 
                        alt={job.jobTitle} 
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" 
                      />
                    </div>

                    <div className="flex-grow sm:w-[200px] md:w-[300px]">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{job.jobTitle}</h2>
                      <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm gap-2">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400" />
                          <span>{job.companyId?.address || "Location not specified"}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>${job.pricePerHour || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-2 sm:gap-6 mb-3 sm:mb-0">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
                      {formatDate(job.createdAt || job.updatedAt)}
                    </div>
                    <div className="flex items-center text-green-500 dark:text-green-400 font-medium text-xs sm:text-sm">
                      <FaCheck className="mr-1" />
                      {job.jobStatus || "Assigned"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
                    <FaRegBookmark className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-lg sm:text-xl flex-shrink-0" />
                    <div className="flex flex-row gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                      <button className="bg-[#1F2B44] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                        <span className="font-semibold">Assigned To: </span>
                        <span className="text-xs sm:text-sm">
                          {getAssignedJobseekerName(job)}
                        </span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveWorkerInRota(job);
                        }}
                        disabled={savingToRota[job._id]}
                        className={`px-3 sm:px-5 py-2 sm:py-3 text-white rounded-full text-xs sm:text-sm transition whitespace-nowrap ${
                          workerSavedToRota[job._id] 
                            ? 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700' 
                            : 'bg-[#FD7F00] dark:bg-orange-500 hover:bg-orange-600 dark:hover:bg-orange-600'
                        } ${savingToRota[job._id] ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {savingToRota[job._id] ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : workerSavedToRota[job._id] ? (
                          <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Saved
                          </div>
                        ) : (
                          'Save Worker in Rota'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
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

export default AssignedJob;
