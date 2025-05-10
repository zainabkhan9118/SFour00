import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Headerjob from "../Headerjob";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import logo1 from "../../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";
import { getJobsByStatus } from "../../../../../api/jobsApi";
import { JobStatus } from "../../../../../constants/enums";
import { ThemeContext } from "../../../../../context/ThemeContext";

const Completed = () => {
  const navigate = useNavigate();
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const handleJobClick = (jobId) => {
    navigate(`/completed-jobDetail/${jobId}`);
  };
  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        const result = await getJobsByStatus(companyId, JobStatus.COMPLETED);
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          // Process the jobs data for consistent access
          const processedJobs = result.data.map(job => {
            // Ensure we have all the necessary data even if the structure varies
            return {
              ...job, // Keep original data
              _id: job._id || job.jobId?._id,
              jobId: job.jobId || {},
              completedDate: job.completedDate || job.updatedAt,
              // Include worker relationship info from all possible sources
              userJobRel: job.userJobRel || [],
              jobSeekerId: job.jobSeekerId || null
            };
          });
          
          setCompletedJobs(processedJobs);
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
    // Check for userJobRel first (most common structure)
    if (job.userJobRel && job.userJobRel.length > 0) {
      // Check if userId is an object with fullname property
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        return job.userJobRel[0].userId.fullname;
      }
      
      // Check if jobSeekerId is available as an object
      if (job.userJobRel[0].jobSeekerId && typeof job.userJobRel[0].jobSeekerId === 'object') {
        return job.userJobRel[0].jobSeekerId.fullname || "Worker";
      }
    }
    
    // Check for direct jobSeekerId reference
    if (job.jobSeekerId) {
      // If jobSeekerId is an object with fullname
      if (typeof job.jobSeekerId === 'object' && job.jobSeekerId.fullname) {
        return job.jobSeekerId.fullname;
      }
    }
    
    // Check for jobId.applicantsList structure (specific to completed jobs)
    if (job.jobId && job.jobId.applicantsList && job.jobId.applicantsList.length > 0) {
      // Try to find the assigned applicant
      const assignedUser = job.jobId.applicantsList.find(
        user => user._id === job.jobSeekerId
      );
      
      if (assignedUser && assignedUser.fullname) {
        return assignedUser.fullname;
      }
      
      // If no match found, use the first applicant as fallback
      return job.jobId.applicantsList[0].fullname || "Worker";
    }
    
    return "Not assigned";
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
            {completedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">No completed jobs found</p>
              </div>
            ) : (
              completedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index === completedJobs.length - 1 ? "border-none" : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
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
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {job.jobId?.jobTitle || "Untitled Job"}
                      </h2>
                      <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm gap-2">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400" />
                          <span>{job.jobId?.location || "Location not specified"}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>${job.jobId?.pricePerHour || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-2 sm:gap-6 mb-3 sm:mb-0">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
                      {formatDate(job.completedDate || job.updatedAt)}
                    </div>
                    <div className="flex items-center text-green-500 dark:text-green-400 font-medium text-xs sm:text-sm">
                      <FaCheck className="mr-1" />
                      Completed
                    </div>
                  </div>                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6">
                    <FaRegBookmark className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-lg sm:text-xl" />
                    <button className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                      <span className="font-bold">Completed By: </span>
                      {getAssignedJobseekerName(job)}
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