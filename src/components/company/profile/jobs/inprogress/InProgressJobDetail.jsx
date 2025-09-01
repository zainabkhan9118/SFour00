import React, { useState, useEffect, useContext, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { JobStatus } from "../../../../../constants/enums";
import { getJobsByStatus } from "../../../../../api/jobTrackingApi";
import { getWorkerLocation } from "../../../../../api/locationApi";
import { ThemeContext } from "../../../../../context/ThemeContext";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create custom red icon for worker location
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom green icon for previous locations
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32]
});

// Create custom orange icon for historical locations
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [18, 28],
  iconAnchor: [9, 28],
  popupAnchor: [1, -24],
  shadowSize: [28, 28]
});

// Map modal component to display worker location
const MapModal = ({ isOpen, onClose, location, jobLocation, isOutsideRadius, lastUpdated, locationHistory }) => {
  const intervalRef = useRef(null);
  
  if (!isOpen) return null;
  
  // Worker coordinates
  const workerLat = location.latitude || 34.1973229;
  const workerLng = location.longitude || 73.2422251;
  
  // Job location coordinates (center of the radius)
  const jobLat = jobLocation.latitude || 34.1973229;
  const jobLng = jobLocation.longitude || 73.2422251;
  
  // Radius in meters - set to 500m as requested
  const allowedRadius = 500;

  // Debug: Log coordinates to ensure they're correct
  console.log('Map coordinates - Job:', { jobLat, jobLng }, 'Worker:', { workerLat, workerLng }, 'Radius:', allowedRadius);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Worker Location Tracking</h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
              {isOutsideRadius && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium animate-pulse">
                  ⚠ Worker is outside allowed radius
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-xl">
            &times;
          </button>
        </div>
        <div className="h-[500px] w-full">
          <MapContainer
            center={[jobLat, jobLng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Job location marker (blue - center of radius) */}
            <Marker position={[jobLat, jobLng]}>
              <Popup>
                <strong>Job Location</strong><br />
                Work site center
              </Popup>
            </Marker>
            
            {/* Allowed radius circle - Pink/Red colored circle like in the image */}
            <Circle
              center={[jobLat, jobLng]}
              radius={allowedRadius}
              pathOptions={{
                fillColor: '#ff1493', // Bright pink color
                fillOpacity: 0.2, // Semi-transparent fill
                color: '#ff0080', // Bright pink border
                weight: 3, // Thicker border
                opacity: 1, // Fully opaque border
                dashArray: '10, 5', // Dashed line pattern for better visibility
              }}
            />
            
            {/* Historical location markers - Blue markers for all location changes */}
            {locationHistory && locationHistory.length > 0 && locationHistory.map((histLocation, index) => (
              <Marker 
                key={`history-${index}-${histLocation.timestamp}`}
                position={[histLocation.latitude, histLocation.longitude]} 
                icon={new L.Icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <strong>Location Change #{index + 1}</strong><br />
                  Time: {histLocation.timestamp}<br />
                  Distance from job: {histLocation.distanceFromJob}m<br />
                  Status: {histLocation.outsideRadius ? 
                    <span className="text-red-600 font-semibold">Outside radius</span> : 
                    <span className="text-green-600 font-semibold">Within radius</span>
                  }
                </Popup>
              </Marker>
            ))}
            
            {/* Worker current location marker (red center marker) */}
            <Marker position={[workerLat, workerLng]} icon={redIcon}>
              <Popup>
                <strong>Worker Current Location</strong><br />
                Last updated: {lastUpdated}<br />
                Status: {isOutsideRadius ? 
                  <span className="text-red-600 font-semibold">Outside radius</span> : 
                  <span className="text-green-600 font-semibold">Within radius</span>
                }<br />
                Total location changes: {locationHistory.length}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <span>� Job Center &nbsp;&nbsp;&nbsp; � Location Changes &nbsp;&nbsp;&nbsp; 🌸 Allowed Radius &nbsp;&nbsp;&nbsp; Radius: {allowedRadius}m</span>
            <span className="animate-pulse">🔄 Auto-updating every 10 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InProgressJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [workerLocation, setWorkerLocation] = useState({ latitude: null, longitude: null });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const [isReportLogsOpen, setIsReportLogsOpen] = useState(false);
  const [reportLogs, setReportLogs] = useState([]);
  const [reportLogsLoading, setReportLogsLoading] = useState(false);
  const [reportLogsError, setReportLogsError] = useState(null);
  const [isOutsideRadius, setIsOutsideRadius] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const locationIntervalRef = useRef(null);
  const [previousRadiusStatus, setPreviousRadiusStatus] = useState(false);
  const [showRadiusAlert, setShowRadiusAlert] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // Function to fetch worker location and check radius
  const fetchWorkerLocationContinuous = async () => {
    if (!jobId || !job) return;
    
    try {
      const companyId = localStorage.getItem('companyId');
      
      // Validate companyId before making API call
      if (!companyId) {
        console.error("Company ID not found in localStorage");
        return;
      }
      
      // Get the correct job ID from the job data structure
      const actualJobId = (job.jobId && job.jobId._id) ? job.jobId._id : job._id;
      
      const result = await getWorkerLocation(companyId, actualJobId);
      
      if (result.statusCode === 200) {
        let newLocation;
        let historyData = [];
        
        if (result.data && result.data.jobSeekerLatitude && result.data.jobSeekerLongitude) {
          newLocation = {
            latitude: result.data.jobSeekerLatitude,
            longitude: result.data.jobSeekerLongitude
          };
          
          // Process jobSeekerHistory from API response
          if (result.data.jobSeekerHistory && Array.isArray(result.data.jobSeekerHistory)) {
            historyData = result.data.jobSeekerHistory.map((histItem, index) => {
              // Calculate distance from job location for each history point
              const jobData = getJobData();
              const distance = calculateDistance(
                histItem.latitude || histItem.jobSeekerLatitude,
                histItem.longitude || histItem.jobSeekerLongitude,
                jobData.latitude || 34.1973229,
                jobData.longitude || 73.2422251
              );
              
              return {
                latitude: histItem.latitude || histItem.jobSeekerLatitude,
                longitude: histItem.longitude || histItem.jobSeekerLongitude,
                timestamp: histItem.timestamp ? new Date(histItem.timestamp).toLocaleTimeString() : `Entry ${index + 1}`,
                outsideRadius: distance > 500, // 500m radius check
                distanceFromJob: Math.round(distance)
              };
            });
          }
        } else {
          // Use default coordinates if data is null
          newLocation = {
            latitude: 34.1973229,
            longitude: 73.2422251
          };
        }
        
        setWorkerLocation(newLocation);
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Update location history with API data
        setLocationHistory(historyData);
        
        // Check if worker is outside the allowed radius
        const jobData = getJobData();
        const distance = calculateDistance(
          newLocation.latitude,
          newLocation.longitude,
          jobData.latitude || 34.1973229,
          jobData.longitude || 73.2422251
        );
        
        const allowedRadius = 500; // 500 meters as requested
        const wasOutsideRadius = isOutsideRadius;
        const currentlyOutside = distance > allowedRadius;
        setIsOutsideRadius(currentlyOutside);
        
        // Show alert if worker just went outside radius
        if (!wasOutsideRadius && currentlyOutside) {
          setShowRadiusAlert(true);
          setTimeout(() => setShowRadiusAlert(false), 8000); // Hide after 8 seconds
        }
        
        // Log the distance for debugging
        console.log(`Worker distance from job location: ${distance.toFixed(2)}m`);
        console.log(`Location history entries: ${historyData.length}`);
        
      }
    } catch (err) {
      console.error("Failed to fetch worker location continuously:", err);
      setLocationError(err.message);
    }
  };

  // Start continuous location tracking when map opens
  useEffect(() => {
    if (isMapOpen) {
      // Fetch immediately when map opens
      fetchWorkerLocationContinuous();
      
      // Set up interval for continuous updates every 10 seconds
      locationIntervalRef.current = setInterval(() => {
        fetchWorkerLocationContinuous();
      }, 10000);
    } else {
      // Clear interval when map closes
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    }

    // Cleanup interval on component unmount
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, [isMapOpen, jobId]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        
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
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  // Track worker function - calls the API to get worker location and opens map
  const trackWorker = async () => {
    if (!jobId || !job) return;
    
    try {
      setLocationLoading(true);
      setLocationError(null);
      
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      
      // Validate companyId before making API call
      if (!companyId) {
        throw new Error("Company ID not found in localStorage");
      }
      
      // Get the correct job ID from the job data structure
      const actualJobId = (job.jobId && job.jobId._id) ? job.jobId._id : job._id;
      
      // Use the imported getWorkerLocation function from locationApi.js
      const result = await getWorkerLocation(companyId, actualJobId);
      
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
          setWorkerLocation({
            latitude: 34.1973229,
            longitude: 73.2422251
          });
          console.log("Using default location as API returned null data");
        }
        
        setLastUpdated(new Date().toLocaleTimeString());
        
        // Open map modal - this will trigger the continuous polling
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
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500 dark:text-red-400">Error: {error || "Job not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Radius Alert Notification */}
      {showRadiusAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
          <div className="text-2xl">🚨</div>
          <div>
            <div className="font-semibold">Worker Outside 500m Radius!</div>
            <div className="text-sm opacity-90">The worker has moved outside the allowed work area (500m).</div>
          </div>
          <button 
            onClick={() => setShowRadiusAlert(false)}
            className="ml-4 text-white hover:text-gray-200 text-lg"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col flex-1">
        {/* Back Arrow Button */}
        <div className="flex items-center px-4 sm:px-6 md:px-8 mt-4 sm:mt-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-2xl focus:outline-none"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Find Job / {jobData.jobDuration} / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 sm:px-6 md:px-8 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 items-start sm:items-center mt-6">
              {/* Salary Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 sm:w-8 sm:h-8" alt="Salary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Salary</p>
                  <p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200">${jobData.pricePerHour}/hr</p>
                </div>
              </div>

              {/* Timing Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 sm:w-8 sm:h-8" alt="Time" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-200">Timings</p>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Start date & Time
                      </p>
                      <p className="text-[12px] text-gray-600 dark:text-gray-400">
                        {formatWorkDate(jobData.workDate)} {jobData.startTime}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        End date & Time:
                      </p>
                      <p className="text-[12px] text-gray-600 dark:text-gray-400">
                        {formatWorkDate(jobData.workDate)} {jobData.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Buttons Section */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img src={qr} alt="QR Code" className="w-20 h-20 sm:w-[90px] sm:h-[90px]" />
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="border-2 border-dashed border-gray-400 dark:border-gray-500 px-3 sm:px-4 py-2 rounded-full w-full sm:w-[284px] h-auto sm:h-[48px] text-gray-800 dark:text-gray-200">
                    <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">Accepted by: </span>
                    <span className="text-sm sm:text-base">
                      {jobData.assignedTo}
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-[#FD7F00] dark:border-orange-500 px-3 sm:px-4 py-2 rounded-full w-auto sm:w-[181px] h-auto sm:h-[48px] text-[#FD7F00] dark:text-orange-500">
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
                className="bg-[#FD7F00] dark:bg-orange-500 w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-orange-600 dark:hover:bg-orange-600 transition flex items-center justify-center"
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
              <button className="bg-[#1F2B44] dark:bg-gray-700 w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-800 transition">
                VIEW ALERT LOGS
              </button>
              
              <button className="bg-[#FD7F00] dark:bg-orange-500 w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-orange-600 dark:hover:bg-orange-600 transition">
                MESSAGE WORKER
              </button>
              <button 
                onClick={() => navigate(`/job-report-logs/${jobId}`)}
                className="bg-[#1F2B44] dark:bg-gray-700 w-full sm:w-auto px-4 sm:px-8 py-3 rounded-full text-sm sm:text-base text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-800 transition"
              >
                VIEW REPORT LOGS
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
        jobLocation={{ latitude: jobData.latitude, longitude: jobData.longitude }}
        isOutsideRadius={isOutsideRadius}
        lastUpdated={lastUpdated}
        locationHistory={locationHistory}
      />
    </div>
  );
};

export default InProgressJobDetail;