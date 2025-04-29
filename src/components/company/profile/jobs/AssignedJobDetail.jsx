import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import qr from "../../../../assets/images/qr-code.png";
import QRCodeModal from "./popupsButtons/QRCodeModal";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { JobStatus } from "../../../../constants/enums";

const AssignedJobDetail = () => {
  const [showButton, setShowButton] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();

  // Format date function for workDate
  const formatWorkDate = (dateString) => {
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API to get all assigned jobs for the company
        const response = await fetch(`/api/apply/company/${companyId}?status=${JobStatus.ASSIGNED}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
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
            console.log("Found job details:", foundJob);
            setJob(foundJob);
          } else {
            throw new Error("Job not found");
          }
        } else {
          throw new Error("Invalid response format or no data received");
        }
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);
  
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />
        <div className="flex flex-col flex-1 justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />
        <div className="flex flex-col flex-1 justify-center items-center">
          <p className="text-red-500 text-xl">{error || "Job not found"}</p>
        </div>
      </div>
    );
  }

  // Extract job details - job.jobId contains job info, job contains relation info
  const jobData = job.jobId || {};
  const companyData = jobData.companyId || {};
  
  // Get assigned worker's name from user job relationship
  const getAssignedWorkerName = () => {
    // Check for userJobRel first (most recent API structure)
    if (job.userJobRel && job.userJobRel.length > 0) {
      if (job.userJobRel[0].userId && job.userJobRel[0].userId.fullname) {
        return job.userJobRel[0].userId.fullname;
      }
      
      // Sometimes userId might be just the ID, not an object
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
    if (jobData.applicantsList && jobData.applicantsList.length > 0) {
      // Find the assigned applicant
      const assignedApplicant = jobData.applicantsList.find(applicant => 
        applicant.status === JobStatus.ASSIGNED || 
        applicant.status === "ASSIGNED"
      ) || jobData.applicantsList[0];
      
      return assignedApplicant.fullname || "Assigned Worker";
    }
    
    return "Not assigned";
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-end px-4 md:px-8">
          <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-base">
            Find Job / {jobData.jobDuration || "Job"} / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 md:px-8 gap-4 md:gap-2">
          <div className="flex flex-col md:flex-row justify-between mt-4 md:mt-8">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="flex items-center justify-center rounded-full">
                <img
                  src={companyData.companyLogo || insta}
                  alt="Company Logo"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = insta;
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl text-gray-700 font-semibold">
                  {jobData.jobTitle || "Job Title"}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2 text-sm">
                  {companyData.address && (
                    <span className="px-3 py-1 border border-gray-500 rounded-full">
                      {companyData.address}
                    </span>
                  )}
                  {jobData._id && (
                    <span className="px-3 py-1 border border-gray-500 rounded-full">
                      ID: {jobData._id.substring(0, 6)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:flex md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 md:w-8 md:h-8" alt="" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Salary</p>
                  <p className="font-semibold text-sm md:text-base">${jobData.pricePerHour || 0}/hr</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 md:w-8 md:h-8" alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-900 font-semibold text-xs md:text-sm">Timings</p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm font-medium text-gray-700">Start date & Time</p>
                      <p className="text-[10px] md:text-[12px]">
                        {jobData.workDate ? `${formatWorkDate(jobData.workDate)} ${formatTime(jobData.startTime)}` : "Not specified"}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm font-medium text-gray-700">End date & Time:</p>
                      <p className="text-[10px] md:text-[12px]">
                        {jobData.workDate ? `${formatWorkDate(jobData.workDate)} ${formatTime(jobData.endTime)}` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <img 
              src={jobData.checkpoints && jobData.checkpoints[0]?.qrCodeData ? jobData.checkpoints[0].qrCodeData : qr} 
              alt="QR Code" 
              className="w-[70px] h-[70px] md:w-[90px] md:h-[90px]" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = qr;
              }}
            />
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="border-2 border-dashed border-gray-400 px-3 md:px-4 py-2 rounded-full text-gray-800 text-sm md:text-base">
                <span className="font-bold text-gray-700">Assigned To: </span>
                <span>{getAssignedWorkerName()}</span>
              </div>
              <div className="border-2 border-dashed border-[#FD7F00] px-3 md:px-4 py-2 rounded-full text-[#FD7F00] text-sm md:text-base">
                <span className="font-semibold">Status: </span>
                <span>{job.status || JobStatus.ASSIGNED}</span>
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6 w-full max-w-[1110px] mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Job Description
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {jobData.jobDescription || "No job description available."}
            </p>
            <div className="flex flex-col sm:flex-row mt-4 gap-3">
              <button
                onClick={() => setShowButton(true)}
                className="bg-[#FD7F00] w-full sm:w-[220px] h-[46px] md:h-[56px] text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-normal hover:bg-orange-600 transition">
                Track Worker
              </button>
              <button className="bg-[#1F2B44] w-full sm:w-[220px] h-[46px] md:h-[56px] text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-normal hover:bg-gray-800 transition">
                Message Worker
              </button>
            </div>
          </div>
        </div>
        {showButton && <QRCodeModal onClose={() => setShowButton(false)} />}
      </div>
    </div>
  );
};

export default AssignedJobDetail;