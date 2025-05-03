import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import Sidebar from "../../../Sidebar";
import Header from "../../../Header";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { JobStatus } from "../../../../../constants/enums";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map modal component to display worker location
const MapModal = ({ isOpen, onClose, location }) => {
  if (!isOpen) return null;
  
  // Default coordinates if no location data (for demonstration)
  const lat = location.latitude || 34.1973229;
  const lng = location.longitude || 73.2422251;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Worker Location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>
        <div className="h-[500px] w-full">
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                <strong>Worker is here</strong><br />
                Last updated: {new Date().toLocaleTimeString()}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const InProgressJobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [workerLocation, setWorkerLocation] = useState({ latitude: null, longitude: null });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

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

  // Track worker function - calls the API to get worker location
  const trackWorker = async () => {
    if (!jobId) return;
    
    try {
      setLocationLoading(true);
      setLocationError(null);
      
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
      
      // Call the API to get worker location
      const response = await fetch(`/api/apply/${companyId}/${jobId}/location`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Worker location API response:", result);
      
      if (result.statusCode === 200) {
        // If data is available, use it
        if (result.data && result.data.jobSeekerLatitude && result.data.jobSeekerLongitude) {
          setWorkerLocation({
            latitude: result.data.jobSeekerLatitude,
            longitude: result.data.jobSeekerLongitude
          });
        } else {
          // Use default coordinates if data is null
          // These are the coordinates you provided in your example
          setWorkerLocation({
            latitude: 34.1973229,
            longitude: 73.2422251
          });
          console.log("Using default location as API returned null data");
        }
        // Open map modal in both cases
        setIsMapOpen(true);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Failed to fetch worker location:", err);
      setLocationError(err.message);
      // Show error to user
      alert(`Could not track worker: ${err.message}`);
    } finally {
      setLocationLoading(false);
    }
  };

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
            <LoadingSpinner />
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
              <button 
                onClick={trackWorker}
                disabled={locationLoading}
                className="bg-[#FD7F00] w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-orange-600 transition flex items-center justify-center"
              >
                {locationLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    TRACKING...
                  </>
                ) : (
                  "TRACK WORKER"
                )}
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

      {/* Map Modal for worker location */}
      <MapModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        location={workerLocation} 
      />
    </div>
  );
};

export default InProgressJobDetail;