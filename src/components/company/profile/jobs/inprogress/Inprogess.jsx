import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Headerjob from "../Headerjob";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import logo1 from "../../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark, FaClock } from "react-icons/fa";
import { getJobsByStatus } from "../../../../../api/jobsApi";
import { JobStatus } from "../../../../../constants/enums";
import { ThemeContext } from "../../../../../context/ThemeContext";

// Sample data for fallback if needed
const sampleJobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
];

const Inprogess = () => {
  const navigate = useNavigate();
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const handleJobClick = (jobId) => {
    navigate(`/inProgress-jobDetail/${jobId}`);
  };

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API with the status parameter from JobStatus enum using our new API function
        const result = await getJobsByStatus(companyId, JobStatus.IN_PROGRESS);
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          console.log("In-progress jobs data:", result.data);
            // Map the data for consistent access
          const processedJobs = result.data.map(job => {
            // Make sure to access the job information correctly
            const jobData = job.jobId || job;
            const companyData = jobData.companyId || {};
            
            return {
              _id: job._id || jobData._id,
              jobTitle: jobData.jobTitle || "Untitled Job", 
              pricePerHour: jobData.pricePerHour || "300.0",
              startTime: job.startTime || job.updatedAt,
              location: companyData.address || jobData.location || "Location not specified",
              // Include all possible user relationship data for worker information
              userJobRel: job.userJobRel || [],
              jobSeekerId: job.jobSeekerId || null,
              applicantsList: jobData.applicantsList || [],
              companyLogo: companyData.companyLogo || null
            };
          });
          
          setInProgressJobs(processedJobs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch in-progress jobs:", err);
        setError(err.message);
        // Use sample data as fallback for testing
        setInProgressJobs(sampleJobs.map((job, index) => ({
          _id: `sample-${index}`,
          jobTitle: job.title,
          pricePerHour: job.rate.replace('$', '').replace('/hr', ''),
          updatedAt: new Date().toISOString(),
          userJobRel: [{ userId: { fullname: job.assignedto } }],
          companyLogo: job.logo
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressJobs();
  }, []);

  // Format time from date string (e.g., "12:00 PM")
  const formatTime = (dateString) => {
    if (!dateString) return "12:00 PM";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Get assigned jobseeker name
  const getAssignedJobseekerName = (job) => {
    // Check for userJobRel first (most common structure)
    if (job.userJobRel && job.userJobRel.length > 0) {
      // Check if userId is an object with fullname property
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        return job.userJobRel[0].userId.fullname;
      }
      
      // Check if jobSeekerId is available as an object
      if (job.userJobRel[0].jobSeekerId && typeof job.userJobRel[0].jobSeekerId === 'object') {
        return job.userJobRel[0].jobSeekerId.fullname || "Assigned Worker";
      }
    }
    
    // Check for direct jobSeekerId reference
    if (job.jobSeekerId) {
      // If jobSeekerId is an object with fullname
      if (typeof job.jobSeekerId === 'object' && job.jobSeekerId.fullname) {
        return job.jobSeekerId.fullname;
      }
    }
    
    // Fall back to applicantsList structure
    if (job.applicantsList && job.applicantsList.length > 0) {
      const assignedApplicant = job.applicantsList.find(applicant => 
        applicant.status === JobStatus.ASSIGNED || 
        applicant.status === "ASSIGNED"
      ) || job.applicantsList[0];
      
      return assignedApplicant.fullname || "Assigned Worker";
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
            {inProgressJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">No in-progress jobs found</p>
              </div>
            ) : (
              inProgressJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    index === inProgressJobs.length - 1 ? "border-none" : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={job.companyLogo || (index % 2 === 0 ? logo1 : logo2)} 
                        alt={job.jobTitle} 
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" 
                      />
                    </div>

                    <div className="flex-grow sm:w-[200px] md:w-[300px]">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{job.jobTitle}</h2>
                      <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm gap-2">                      <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400" />
                          <span>{job.location || "Location not specified"}</span>
                      </div>
                        <span className="hidden sm:inline">•</span>
                        <span>${job.pricePerHour || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-2 sm:gap-6 mb-3 sm:mb-0">
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto">
                      {formatDate(job.startTime || job.updatedAt)}
                    </div>
                    <div className="flex items-center text-blue-500 dark:text-blue-400 font-medium text-xs sm:text-sm">
                      <FaCheck className="mr-1" />
                      In Progress
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6">
                    <FaRegBookmark className="text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-lg sm:text-xl" />                    <button className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                      <span className="font-bold">Assigned To: </span>
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

export default Inprogess;