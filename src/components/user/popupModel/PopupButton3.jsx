import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from '../../../assets/images/Vector.svg';
import { updateLocation } from '../../../api/myWorkApi';
import { ThemeContext } from "../../../context/ThemeContext";

const PopupButton3 = ({ onClose, jobId, onLocationEnabled }) => {
  const [locationMessage, setLocationMessage] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef();
  const intervalRef = useRef(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Get jobId from props or from URL params if not passed directly
  const { id } = useParams();
  const currentJobId = jobId || id;

  // Debug effect to log jobId changes
  useEffect(() => {
    console.log("PopupButton3 - jobId from props:", jobId);
    console.log("PopupButton3 - id from params:", id);
    console.log("PopupButton3 - currentJobId:", currentJobId);
    console.log("PopupButton3 - jobSeekerId from localStorage:", localStorage.getItem("jobSeekerId"));
    
    // Check if location tracking is already active for this job
    const trackingActive = localStorage.getItem(`locationTracking_${currentJobId}`);
    if (trackingActive === 'active') {
      console.log("Location tracking already active for this job");
    }
  }, [jobId, id, currentJobId]);

  // Cleanup interval on component unmount - but keep it running globally
  useEffect(() => {
    return () => {
      // Don't clear interval on unmount - let location tracking continue globally
      console.log("Component unmounting - location tracking continues globally");
    };
  }, []);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      // Don't clear interval when closing the modal - let it continue running
      console.log("Modal closed - location tracking continues in background");
      onClose(); // Close the popup when clicking outside
    }
  };

  // Global function to stop all location tracking
  window.stopLocationTracking = () => {
    try {
      if (window.locationTrackingInterval) {
        clearInterval(window.locationTrackingInterval);
        window.locationTrackingInterval = null;
        console.log("Location tracking interval stopped");
      }
      
      if (window.locationWatchId) {
        navigator.geolocation.clearWatch(window.locationWatchId);
        window.locationWatchId = null;
        console.log("Location watch stopped");
      }
      
      // Clear all localStorage tracking data
      const jobId = localStorage.getItem('locationTrackingJobId');
      if (jobId) {
        localStorage.removeItem(`locationTracking_${jobId}`);
      }
      localStorage.removeItem('locationTrackingJobId');
      
      console.log("All location tracking stopped successfully");
      return true;
    } catch (error) {
      console.error("Error stopping location tracking:", error);
      return false;
    }
  };

  // Function to start continuous location tracking every 3 seconds
  const startLocationTracking = () => {
    console.log("Starting continuous location tracking every 3 seconds");
    
    // Store the interval globally so it persists across component unmounts
    const globalInterval = setInterval(() => {
      console.log("Auto-updating location every 3 seconds...");
      
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              console.log(`Auto-updating location for job ${currentJobId} with coordinates:`, { latitude, longitude });
              
              // Call the PATCH API to update location
              await updateLocation(currentJobId, { latitude, longitude });
              
              console.log(`Location auto-updated successfully: Lat ${latitude}, Long ${longitude}`);
            } catch (error) {
              console.error("Error in auto location update:", error);
            }
          },
          (error) => {
            console.log("Silent location update failed:", error.message);
          }
        );
      } else {
        console.log("Geolocation not supported");
      }
    }, 300000); // 5 minutes = 300000 milliseconds
    
    // Store interval ID globally
    window.locationTrackingInterval = globalInterval;
    intervalRef.current = globalInterval;
    
    // Store in localStorage for persistence
    localStorage.setItem(`locationTracking_${currentJobId}`, 'active');
    localStorage.setItem('locationTrackingJobId', currentJobId);
  };

  const handleTurnOnLocation = () => {
    setIsLoading(true);
    
    // Debug logging to check jobId
    console.log("Current jobId:", currentJobId);
    console.log("JobId from props:", jobId);
    console.log("JobId from params:", id);
    
    // Validate jobId before proceeding
    if (!currentJobId) {
      setIsLoading(false);
      setLocationMessage("Job ID not found. Please try again from the job page.");
      return;
    }
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            console.log(`Updating location for job ${currentJobId} with coordinates:`, { latitude, longitude });
            
            // Call the API to update location
            await updateLocation(currentJobId, { latitude, longitude });
            
            setLocationMessage(`Location shared successfully!`);
            setLocationEnabled(true);
            console.log(`Location updated successfully: Lat ${latitude}, Long ${longitude}`);
            
            // Start continuous location tracking every 3 seconds
            startLocationTracking();
            
            // Call parent callback if provided, otherwise navigate
            if (onLocationEnabled) {
              setTimeout(() => {
                onLocationEnabled();
              }, 1500);
            } else {
              // Navigate after location is shared successfully (fallback)
              setTimeout(() => {
                navigate("/User-MyWorkAssignedPage");
              }, 1500);
            }
          } catch (error) {
            console.error("Error updating location:", error);
            
            // Enhanced error handling
            if (error.response) {
              console.error("Error response:", error.response.data);
              setLocationMessage(`Failed to share location: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
              setLocationMessage("Network error. Please check your internet connection.");
            } else {
              setLocationMessage("Failed to share location with company. Please try again.");
            }
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setIsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationMessage("Please enable location access in your browser settings.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationMessage("Location information is unavailable. Please check your device settings.");
              break;
            case error.TIMEOUT:
              setLocationMessage("The location request timed out. Try again.");
              break;
            default:
              setLocationMessage("An unknown error occurred. Please try again.");
              break;
          }
        }
      );
    } else {
      setIsLoading(false);
      setLocationMessage("Geolocation is not supported by this browser. Please use a modern browser.");
    }
  };

  return (
    <div
      ref={buttonRef}
      onClick={closeModel}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] md:h-auto lg:w-[561px] lg:h-[333px] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 focus:outline-none">
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        <img src={logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 mb-5" />

        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Enable location
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] h-auto text-sm md:text-base">
          You have 1 hour left before your job starts.
        </p>

        {locationMessage && (
          <p className={`${locationEnabled ? 'text-green-500' : 'text-orange-500'} text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] h-auto text-sm md:text-base`}>
            {locationMessage}
          </p>
        )}

        {!locationEnabled && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleTurnOnLocation}
              disabled={isLoading}
              className="px-6 py-2 w-full md:w-[160px] h-12 md:h-[40px] bg-[#FD7F00] text-white rounded-full transition duration-200 disabled:bg-gray-400 flex items-center justify-center"
            >
              {isLoading ? "Sharing..." : "Turn on Location"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupButton3;
