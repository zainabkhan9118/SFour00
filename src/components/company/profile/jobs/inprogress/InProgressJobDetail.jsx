import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import Sidebar from "../../../Sidebar";
import Header from "../../../Header";
import { JobStatus } from "../../../../../constants/enums";

const InProgressJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API to get the job details
        const response = await fetch(`/api/apply/company/${companyId}?status=${JobStatus.IN_PROGRESS}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
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
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

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

  // Format work date (might be in a different format)
  const formatWorkDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Extract data from job object, handling potential nested structure
  const getJobData = () => {
    if (!job) return {};
    
    // The job data might be directly in job or nested in job.jobId
    const jobData = job.jobId || job;
    
    // Get company data either from nested structure or from companyId object
    const companyData = jobData.companyId || {};
    
    // Extract the applicant's full name from applicantsList if available
    let assignedTo = "Not assigned";
    if (job.userJobRel && job.userJobRel.length > 0) {
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        assignedTo = job.userJobRel[0].userId.fullname;
      } else if (job.userJobRel[0].userId) {
        assignedTo = "Assigned Worker";
      }
    } else if (jobData.applicantsList && jobData.applicantsList.length > 0) {
      assignedTo = jobData.applicantsList[0].fullname || "Assigned Worker";
    }
    
    return {
      id: jobData._id || "",
      title: jobData.jobTitle || "Untitled Job",
      pricePerHour: jobData.pricePerHour || "0",
      workDate: jobData.workDate || "",
      startTime: jobData.startTime || "",
      endTime: jobData.endTime || "",
      jobPin: jobData.jobPin || "",
      checkpoints: jobData.checkpoints || [],
      alertDuration: jobData.alertDuration || 0,
      jobDuration: jobData.jobDuration || "",
      jobDescription: jobData.jobDescription || "No description available.",
      companyName: companyData.companyName || "Company",
      companyAddress: companyData.address || "Address not specified",
      companyLogo: companyData.companyLogo || insta,
      assignedTo: assignedTo,
      latitude: jobData.latitude || 0,
      longitude: jobData.longitude || 0,
      noOfApplicants: jobData.noOfApplicants || 0
    };
  };

  // Get all job data
  const jobData = getJobData();

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar className="w-full lg:w-1/4" />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Sidebar className="w-full lg:w-1/4" />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">Error: {error || "Job not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="w-full lg:w-1/4" />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-end px-4 sm:px-6 md:px-8">
          <p className="text-sm text-gray-400 mt-4 sm:mt-6">
            Find Job / {jobData.jobDuration} / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 sm:px-6 md:px-8 gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row justify-between mt-4 sm:mt-8">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  <img 
                    src={jobData.companyLogo} 
                    alt={jobData.title} 
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = insta;
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl text-gray-700 font-semibold">{jobData.title}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 rounded-full flex items-center">
                      {jobData.companyAddress}
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 rounded-full">
                      ID: {jobData.id.substring(0, 6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 items-start sm:items-center mt-6">
              {/* Salary Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 sm:w-8 sm:h-8" alt="Salary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-sm sm:text-base">${jobData.pricePerHour}/hr</p>
                </div>
              </div>

              {/* Timing Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 sm:w-8 sm:h-8" alt="Time" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">Timings</p>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Start date & Time
                      </p>
                      <p className="text-[12px]">
                        {formatWorkDate(jobData.workDate)} {jobData.startTime}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        End date & Time:
                      </p>
                      <p className="text-[12px]">
                        {formatWorkDate(jobData.workDate)} {jobData.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Buttons Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img src={qr} alt="QR Code" className="w-20 h-20 sm:w-[90px] sm:h-[90px]" />
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="border-2 border-dashed border-gray-400 px-3 sm:px-4 py-2 rounded-full w-full sm:w-[284px] h-auto sm:h-[48px] text-gray-800">
                    <span className="text-sm sm:text-base font-bold text-gray-700">Accepted by: </span>
                    <span className="text-sm sm:text-base">
                      {jobData.assignedTo}
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#FD7F00] px-3 sm:px-4 py-2 rounded-full w-auto sm:w-[181px] h-auto sm:h-[48px] text-[#FD7F00]">
                    <span className="text-sm sm:text-base font-semibold">Status: </span>
                    <span className="text-sm sm:text-base">Book On</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button className="bg-[#FD7F00] w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-orange-600 transition">
                TRACK WORKER
              </button>
              <button className="bg-[#1F2B44] w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-gray-800 transition">
                VIEW ALERT LOGS
              </button>
              <button className="bg-[#FD7F00] w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-orange-600 transition">
                MESSAGE WORKER
              </button>
            </div>
          </div>
          
          
          
        </div>
      </div>
    </div>
  );
};

export default InProgressJobDetail;