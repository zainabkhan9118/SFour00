import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from '../../../assets/images/Vector.svg';
import { updateLocation } from '../../../api/myWorkApi';

const PopupButton3 = ({ onClose, jobId }) => {
  const [locationMessage, setLocationMessage] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const buttonRef = useRef();

  // Get jobId from props or from URL params if not passed directly
  const { id } = useParams();
  const currentJobId = jobId || id;

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose(); // Close the popup when clicking outside
    }
  };

  const handleTurnOnLocation = () => {
    setIsLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Call the API to update location
            await updateLocation(currentJobId, { latitude, longitude });
            
            setLocationMessage(`Location shared successfully!`);
            setLocationEnabled(true);
            console.log(`Location updated: Lat ${latitude}, Long ${longitude}`);
            
            // Navigate after location is shared successfully
            setTimeout(() => {
              navigate("/User-MyWorkAssignedBook");
            }, 1500);
          } catch (error) {
            console.error("Error updating location:", error);
            setLocationMessage("Failed to share location with company. Please try again.");
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
        className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] md:h-auto lg:w-[561px] lg:h-[333px] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
          <button onClick={onClose} className="text-gray-500 focus:outline-none">
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        <img src={logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 mb-5" />

        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900">
          Enable location
        </h2>

        <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] h-auto text-sm md:text-base">
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