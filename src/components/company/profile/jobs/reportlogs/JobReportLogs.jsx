import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { getCompanyLogbooks } from "../../../../../api/logbookApi";
import { getJobsByStatus } from "../../../../../api/jobTrackingApi";
import { JobStatus } from "../../../../../constants/enums";
import insta from "../../../../../assets/images/insta.png";

const JobReportLogs = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [reportLogs, setReportLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setJobLoading(true);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Use the imported getJobsByStatus function
        const result = await getJobsByStatus(companyId, JobStatus.IN_PROGRESS);
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          console.log("API response:", result.data);
          
          // Find the specific job by ID
          const foundJob = result.data.find(job => 
            job._id === jobId || 
            (job.jobId && job.jobId._id === jobId)
          );
          
          if (foundJob) {
            console.log("Found job:", foundJob);
            setJob(foundJob);
          } else {
            throw new Error("Job not found");
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError(err.message);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Fetch report logs
  useEffect(() => {
    const fetchReportLogs = async () => {
      if (!jobId || !job) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Find the correct job ID to use
        const jobData = job.jobId || job;
        const effectiveJobId = jobData._id || jobId;
        
        console.log("Using job ID for logbook API:", effectiveJobId);
        
        // Use the imported getCompanyLogbooks function from logbookApi.js
        const result = await getCompanyLogbooks(companyId, effectiveJobId);
        
        console.log("Report logs API response:", result);
        
        if (result.statusCode === 200) {
          // Check if data has a logBooks property (based on the actual API response)
          if (result.data && result.data.logBooks && Array.isArray(result.data.logBooks)) {
            console.log(`Found ${result.data.logBooks.length} logs in the logBooks array`);
            setReportLogs(result.data.logBooks);
          } else if (Array.isArray(result.data)) {
            // Fallback to using data directly if it's an array
            setReportLogs(result.data);
          } else if (result.data && typeof result.data === 'object') {
            // Check for other possible array properties
            const possibleLogsProperties = ['logs', 'items', 'entries', 'logbooks'];
            let logsArray = null;
            
            for (const prop of possibleLogsProperties) {
              if (Array.isArray(result.data[prop])) {
                logsArray = result.data[prop];
                console.log(`Found logs array in property: ${prop}`);
                break;
              }
            }
            
            if (logsArray) {
              setReportLogs(logsArray);
            } else if (Object.keys(result.data).length > 0) {
              // Last resort: if it's a single object entry, wrap it in an array
              setReportLogs([result.data]);
            } else {
              setReportLogs([]);
            }
          } else {
            // Fallback to empty array
            console.log("API returned null/undefined or unexpected data type. Using empty array.");
            setReportLogs([]);
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Failed to fetch report logs:", err);
        setError(err.message);
        setReportLogs([]);
      } finally {
        setLoading(false);
      }
    };

    if (job) {
      fetchReportLogs();
    }
  }, [jobId, job]);

  // Format date function for better display
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

  // Extract data from job object, handling potential nested structure
  const getJobData = () => {
    if (!job) return {};
    
    // The job data might be directly in job or nested in job.jobId
    const jobData = job.jobId || job;
    
    // Get company data either from nested structure or from companyId object
    const companyData = jobData.companyId || {};
    
    return {
      id: jobData._id || "",
      title: jobData.jobTitle || "Untitled Job",
      companyName: companyData.companyName || "Company",
      companyAddress: companyData.address || "Address not specified",
      companyLogo: companyData.companyLogo || insta,
    };
  };

  const jobData = getJobData();

  if (jobLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error && jobLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500 dark:text-red-400">Error: {error || "Job not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col flex-1">
        {/* Breadcrumb navigation */}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
          <div>
            <button 
              onClick={() => navigate(`/inProgress-jobDetail/${jobId}`)} 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Job Details
            </button>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Find Job / Job Details / Report Logs
          </p>
        </div>
        
        {/* Job header */}
        <div className="px-4 sm:px-6 md:px-8 mb-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={jobData.companyLogo} 
                  alt={jobData.title} 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = insta;
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-semibold">{jobData.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 dark:border-gray-600 rounded-full flex items-center">
                    {jobData.companyAddress}
                  </span>
                  <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 dark:border-gray-600 rounded-full">
                    ID: {jobData.id.substring(0, 6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Report logs section */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Worker Report Logs
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : error && !jobLoading ? (
              <div className="text-center text-red-500 dark:text-red-400 py-8">
                <p>Error loading logs: {error}</p>
              </div>
            ) : reportLogs.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>No report logs available for this job.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reportLogs.map((log, index) => (
                  <div key={log._id || index} className="p-4 border dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {log.userId?.fullname }
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{log.description}</p>
                    {log.picture && (
                      <div className="mt-2">
                        <img 
                          src={log.picture} 
                          alt="Report attachment" 
                          className="max-h-64 rounded-lg object-contain" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReportLogs;