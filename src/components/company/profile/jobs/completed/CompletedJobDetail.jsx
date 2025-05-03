import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import { JobStatus } from "../../../../../constants/enums";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getJobsByStatus } from "../../../../../api/jobTrackingApi";
import LoadingSpinner from "../../../../../components/common/LoadingSpinner";

const CompletedJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Use the imported getJobsByStatus function from jobTrackingApi.js
        const result = await getJobsByStatus(companyId, JobStatus.COMPLETED);
        
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
        console.error("Failed to fetch job detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time function
  const formatTime = (timeString) => {
    return timeString || "";
  };

  // Helper function to get assigned user info from the job data
  const getAssignedUser = () => {
    if (!job || !job.jobId || !job.jobId.applicantsList) return null;
    
    return job.jobId.applicantsList.find(
      user => user._id === job.jobSeekerId
    );
  };

  // Format location function to display latitude and longitude in a friendly way
  const formatLocation = (lat, lng) => {
    if (!lat || !lng) return "Location not available";
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <div className="flex flex-col flex-1">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <div className="flex flex-col flex-1 justify-center items-center">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <div className="flex flex-col flex-1 justify-center items-center">
          <p className="text-xl text-gray-500">No job details found</p>
        </div>
      </div>
    );
  }

  const jobData = job.jobId || {};
  const assignedUser = getAssignedUser();
  
  // Get company logo from jobData or job object
  const companyLogo = jobData.companyLogo || jobData.companyId?.companyLogo || job.companyId?.companyLogo || insta;
  
  // Get location from job or parent job object
  const latitude = jobData.latitude || job.latitude;
  const longitude = jobData.longitude || job.longitude;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">

      <div className="flex flex-col flex-1">
        <div className="flex justify-end px-4 sm:px-6 md:px-8">
          <p className="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
            Find Job / Completed Jobs / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 sm:px-6 md:px-8 gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
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
                  <h2 className="text-xl sm:text-2xl text-gray-700 font-semibold">
                    {jobData.jobTitle || "Job Title Not Available"}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 rounded-full flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-gray-600" />
                      {formatLocation(latitude, longitude)}
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 rounded-full">
                      ID: {jobData.jobPin || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Include a map preview if coordinates are available */}
            {latitude && longitude && (
              <div className="mt-4 w-full">
                <iframe 
                  title="Job Location"
                  className="w-full h-[150px] sm:h-[200px] rounded-lg border border-gray-200"
                  frameBorder="0" 
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`} 
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 items-start sm:items-center mt-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 sm:w-8 sm:h-8" alt="Salary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Salary</p>
                  <p className="text-sm sm:text-base font-semibold">${jobData.pricePerHour || 0}/hr</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 sm:w-8 sm:h-8" alt="Time" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-900 font-semibold">Timings</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Start date & Time</p>
                      <p className="text-[10px] sm:text-[12px]">
                        {jobData.workDate ? `${formatDate(jobData.workDate)} ${formatTime(jobData.startTime)}` : "Not specified"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">End date & Time:</p>
                      <p className="text-[10px] sm:text-[12px]">
                        {jobData.workDate ? `${formatDate(jobData.workDate)} ${formatTime(jobData.endTime)}` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
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
                />
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="border-2 border-dashed border-gray-400 px-3 sm:px-4 py-2 rounded-full w-full sm:w-[284px] h-auto sm:h-[48px] text-gray-800">
                    <span className="text-sm sm:text-base font-bold text-gray-700">Assigned To: </span>
                    <span className="text-sm sm:text-base">
                      {assignedUser ? assignedUser.fullname : "Not assigned"}
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#FD7F00] px-3 sm:px-4 py-2 rounded-full w-auto sm:w-[181px] h-auto sm:h-[48px] text-[#FD7F00]">
                    <span className="text-sm sm:text-base font-semibold">Status: </span>
                    <span className="text-sm sm:text-base capitalize">{job.status || "Unknown"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button className="bg-[#FD7F00] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-orange-600 transition">
                  Save Worker in Rota
                </button>
                <button className="bg-[#1F2B44] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition">
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedJobDetail;