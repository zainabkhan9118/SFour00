import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";
import Sidebar from "../../../Sidebar";
import Header from "../../../Header";
import Headerjob from "../Headerjob";
import { JobStatus } from "../../../../../constants/enums";
import LoadingSpinner from "../../../../common/LoadingSpinner";

const Completed = () => {
  const navigate = useNavigate();
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleJobClick = (jobId) => {
    navigate(`/completed-jobDetail/${jobId}`);
  };

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API with the status parameter from JobStatus enum
        const response = await fetch(`/api/apply/company/${companyId}?status=${JobStatus.COMPLETED}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          setCompletedJobs(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch completed jobs:", err);
        setError(err.message);
        setCompletedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  // Format date function
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

  // Calculate completion time relative to now
  const getCompletionTimeAgo = (dateString) => {
    if (!dateString) return "completed recently";
    
    const completedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - completedDate;
    
    // Convert to appropriate units
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffDays > 0) {
      return `completed ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHrs > 0) {
      return `completed ${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `completed ${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return "completed just now";
    }
  };
  
  // Get the assigned user's name from the job
  const getAssignedUserName = (job) => {
    // Check for userJobRel first (most recent API structure)
    if (job.userJobRel && job.userJobRel.length > 0 && job.userJobRel[0].userId) {
      return job.userJobRel[0].userId.fullname || "Assigned Worker";
    }
    
    // Fall back to legacy applicantsList structure
    if (job.jobId && job.jobId.applicantsList && job.jobId.applicantsList.length > 0) {
      const assignedUser = job.jobId.applicantsList.find(
        user => user._id === job.jobSeekerId
      );
      
      return assignedUser ? assignedUser.fullname : "Assigned Worker";
    }
    
    return "Not assigned";
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="w-full lg:w-1/4" />

      <div className="flex flex-col gap-4 sm:gap-6 flex-1 p-3 sm:p-4 md:p-6">
        <Header />
        <Headerjob />

        {loading ? (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg flex justify-center items-center h-64">
            <p className="text-xl text-red-500">Error: {error}</p>
          </div>
        ) : (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg">
            {completedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No completed jobs found</p>
              </div>
            ) : (
              completedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    index === completedJobs.length - 1 ? "border-none" : "border-gray-200"
                  }`}
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={job.jobId?.companyId?.companyLogo || (index % 2 === 0 ? logo1 : logo2)} 
                        alt={job.jobId?.jobTitle || "Job"} 
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = index % 2 === 0 ? logo1 : logo2;
                        }}
                      />
                    </div>

                    <div className="flex-grow sm:w-[200px] md:w-[300px]">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                        {job.jobId?.jobTitle || "Untitled Job"}
                      </h2>
                      <div className="flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-2">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-500 mr-1" />
                          <span>
                            {job.jobId?.companyId?.address || 
                              (job.jobId?.latitude && job.jobId?.longitude) ? 
                                `${job.jobId.latitude}, ${job.jobId.longitude}` : 
                                "Location not specified"
                            }
                          </span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>${job.jobId?.pricePerHour || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full sm:w-auto gap-3">
                    <div className="flex items-center text-green-500 font-medium text-xs sm:text-sm">
                      <FaCheck className="mr-1" />
                      <span className="whitespace-nowrap">
                        {getCompletionTimeAgo(job.updatedAt)}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job._id);
                      }}
                      className="w-full sm:w-auto bg-[#1F2B44] text-white px-4 sm:px-7 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-medium"
                    >
                      <span className="font-semibold">Completed By: </span>
                      <span>{getAssignedUserName(job)}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;