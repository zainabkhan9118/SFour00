import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { IoIosTimer } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa"; 
import { FaSearch, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jsQR from "jsqr";
import { createJob } from "../../../api/jobsApi";
import PopupButton5 from "../../user/popupModel/PopupButton5";
import ReactDOM from 'react-dom';
import { IoCloseCircleOutline } from "react-icons/io5";

import CompanyProfileCompletionCheck from "./CompanyProfileCompletionCheck";
import ProfileSuccessPopup from "../../user/popupModel/ProfileSuccessPopup";

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to handle map clicks
function ClickableMap({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// New component to handle map location search and positioning
function LocationSearch({ setPosition, setLocationName, setSearching }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const map = useMap();

  // Function to search for locations
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  // Handle selecting a search result
  const handleResultSelect = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    // Create a latlng object for consistency with map click handler
    const latlng = { lat, lng };
    
    // Set position and location name
    setPosition(latlng);
    setLocationName(result.display_name);
    
    // Fly to the selected location
    map.flyTo([lat, lng], 16, {
      animate: true,
      duration: 1.5,
    });
    
    // Clear search results
    setSearchResults([]);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-[1000] bg-white rounded-b-lg shadow-md">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a location..."
          className="flex-grow p-3 rounded-l-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white p-3 rounded-r-lg hover:bg-orange-600 transition"
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          ) : (
            <FaSearch />
          )}
        </button>
      </form>

      {/* Search results dropdown */}
      {searchResults.length > 0 && (
        <div className="bg-white shadow-lg border-t overflow-y-auto max-h-60">
          {searchResults.map((result, index) => (
            <div
              key={`${result.place_id}-${index}`}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b flex items-start"
              onClick={() => handleResultSelect(result)}
            >
              <FaMapMarkerAlt className="text-gray-500 mt-1 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium">{result.display_name.split(',')[0]}</div>
                <div className="text-sm text-gray-500 truncate">{result.display_name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// New component for current location button
function CurrentLocationMarker({ setPosition, setLocationName }) {
  const map = useMap();
  const [currentLocation, setCurrentLocation] = useState(null);

  // Function to get user's current location
  const locateUser = () => {
    map.locate({
      setView: true,
      maxZoom: 16
    });
  };

  // Set up map events for location
  useMapEvents({
    locationfound(e) {
      const { lat, lng } = e.latlng;
      setCurrentLocation([lat, lng]);
      
      // Fly to the user's location with animation
      map.flyTo(e.latlng, 16, {
        animate: true,
        duration: 1.5
      });

      // Create latlng object for consistency with map click handler
      const latlng = { lat, lng };
      setPosition(latlng);

      // Fetch address for current location
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
        .then(res => res.json())
        .then(data => {
          const locationAddress = data.display_name || 'Your current location';
          setLocationName(locationAddress);
        })
        .catch(err => {
          console.error("Error fetching location name:", err);
          setLocationName('Your current location');
        });
    },
    locationerror(e) {
      console.error("Location error:", e);
      alert("Unable to find your location. Please ensure location services are enabled.");
    }
  });

  return (
    <div className="absolute bottom-5 right-5 z-[1000]">
      <button 
        onClick={locateUser}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none flex items-center justify-center"
        title="Find my location"
      >
        <FaLocationArrow className="text-blue-500 text-xl" />
      </button>
      
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>
            <strong>You are here</strong><br />
            Your current location
          </Popup>
        </Marker>
      )}
    </div>
  );
}

const JobPosting = () => {
  const navigate = useNavigate();
  const [isToggled, setIsToggled] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [position, setPosition] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    pricePerHour: "", 
    latitude: null,
    longitude: null,
    jobLocation: "", 
    workDate: "", 
    days: [{
     day: "Monday",
     startTime: "",
     endTime: ""
    }],
    jobPin: Array(4).fill(""), 
    checkpoints: [{ 
      name: "Location A", 
      qrCodeData: "" 
    }],
    alertDuration: "30", 
    jobDuration: "1 Week", 
    jobDescription: "",
    jobStatus: "Open", 
    noOfApplicants: 0 
  });

  // QR scanner related states
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [currentScanningIndex, setCurrentScanningIndex] = useState(0);
  
  // Refs
  const pointDropdownRef = useRef(null);
  
  
  const availablePoints = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const generateRandomPin = () => {
    const digits = '0123456789';
    return Array(4).fill().map(() => 
      digits.charAt(Math.floor(Math.random() * digits.length))
    );
  };

  
  const handleToggle = () => {
    const newToggleState = !isToggled;
    setIsToggled(newToggleState);
    
    if (newToggleState) {
      const randomPin = generateRandomPin();
      setFormData(prevData => ({
        ...prevData,
        jobPin: randomPin
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        jobPin: Array(4).fill("") 
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle day schedule changes
  const handleDayChange = (index, field, value) => {
    setFormData(prevData => {
      const newDays = [...prevData.days];
      newDays[index] = {
        ...newDays[index],
        [field]: value
      };
      return {
        ...prevData,
        days: newDays
      };
    });
  };

  // Add new day schedule
  const addDaySchedule = () => {
    setFormData(prevData => ({
      ...prevData,
      days: [...prevData.days, {
        day: "Monday",
        startTime: "",
        endTime: ""
      }]
    }));
  };

  // Remove day schedule
  const removeDaySchedule = (index) => {
    if (formData.days.length > 1) {
      setFormData(prevData => ({
        ...prevData,
        days: prevData.days.filter((_, i) => i !== index)
      }));
    }
  };
  
  // Handle showing the map and getting user's location
  const handleLocationClick = () => {
    setShowMap(true);
    
    // Get user's live location immediately when map opens
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Set map center to user's location
          setMapCenter([latitude, longitude]);
          
          // Create latlng object for consistency with map click handler
          const latlng = { lat: latitude, lng: longitude };
          setPosition(latlng);
          
          // Get address for the location
          fetchLocationName(latlng);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };
  
  // New separate function to fetch location name from coordinates
  const fetchLocationName = async (latlng) => {
    try {
      setIsSearching(true);
      
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await res.json();
      const locationAddress = data.display_name || 'Unknown location';
      setLocationName(locationAddress);
      
      // Store latitude and longitude in form data
      setFormData(prevData => ({
        ...prevData,
        latitude: latlng.lat,
        longitude: latlng.lng,
        jobLocation: locationAddress // Auto-fill the location name
      }));
    } catch (err) {
      setLocationName('Location fetch failed');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleMapClick = async (latlng) => {
    // Update position immediately to provide immediate feedback
    setPosition(latlng);
    
    // Fetch location name using the common function
    fetchLocationName(latlng);
  };
  
  const handleSelectLocation = () => {
    setFormData((prevData) => ({
      ...prevData,
      jobLocation: locationName, 
      latitude: position.lat,  
      longitude: position.lng   
    }));
    setShowMap(false);
  };
  
  const handleJobPinChange = (index, value) => {
    // Only allow numeric values
    if (!/^\d*$/.test(value) && value !== '') {
      return;
    }
    
    setFormData((prevData) => {
      const newJobPin = [...prevData.jobPin];
      newJobPin[index] = value;
      return {
        ...prevData,
        jobPin: newJobPin,
      };
    });
  };

  // Handle success popup close
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    navigate('/recents-jobs');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);
    
    try {
      
      const companyId = localStorage.getItem('companyId');
      
      if (!companyId) {
        throw new Error("Company ID not found. Please complete your company profile first.");
      }
      
      const apiData = {
        jobTitle: formData.jobTitle,
        pricePerHour: parseFloat(formData.pricePerHour) || 0,
        latitude: formData.latitude || 0.0,
        longitude: formData.longitude || 0.0,
        jobLocation: formData.jobLocation,
        workDate: formData.workDate,
        days: formData.days.filter(day => day.day && day.startTime && day.endTime),
        jobPin: parseInt(formData.jobPin.join(''), 10) || 0,
        checkpoints: formData.checkpoints.map(cp => ({
          name: cp.name, 
          qrCodeData: cp.qrCodeData || null
        })),
        alertDuration: parseInt(formData.alertDuration) || 30,
        jobDescription: formData.jobDescription,
        jobDuration: formData.jobDuration,
        jobStatus: "open", 
        companyId: companyId 
      };
      
      console.log("Submitting job data:", apiData);
      
      // Use the new API function instead of direct axios call
      const response = await createJob(apiData, companyId);
      
      console.log("Job created successfully:", response);
      setSubmitSuccess(true);
      setShowSuccessPopup(true);
      
      // Auto-close popup and navigate after delay
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/recents-jobs');
      }, 3000);
    } catch (error) {
      console.error("Error creating job:", error);
      
      // Detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clicking outside of time pickers to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click is outside any time picker modal
      const timePickerModals = document.querySelectorAll('.absolute.top-full');
      let clickedOutside = true;
      
      timePickerModals.forEach(modal => {
        if (modal.contains(event.target)) {
          clickedOutside = false;
        }
      });
      
      if (clickedOutside) {
        setShowStartTimePicker(false);
        setShowEndTimePicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 
  useEffect(() => {
    function handleClickOutside(event) {
      if (pointDropdownRef.current && !pointDropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pointDropdownRef]);
  
  
  const handleTimeSelect = (timeType, hour, minute) => {
    const formattedTime = `${hour}:${minute}`;
    
    setFormData((prevData) => ({
      ...prevData,
      [timeType]: formattedTime,
    }));
    
    if (timeType === 'startTime') {
      setShowStartTimePicker(false);
    } else {
      setShowEndTimePicker(false);
    }
  };

  
  const generateTimeOptions = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    
    return { hours, minutes };
  };

  // Improved function to open scanner for a specific checkpoint
  const openScannerForCheckpoint = (index) => {
    setCurrentScanningIndex(index);
    
    // Create a temporary div to render the PopupButton5 component
    const container = document.createElement('div');
    container.id = 'qr-scanner-container';
    document.body.appendChild(container);
    
    // Create a callback function to handle when QR code is scanned
    const handleQRScan = (qrData) => {
      if (qrData) {
        // Update the form data with the scanned QR code
        setFormData(prevData => {
          const newCheckpoints = [...prevData.checkpoints];
          newCheckpoints[index].qrCodeData = qrData;
          return {
            ...prevData,
            checkpoints: newCheckpoints
          };
        });
      }
    };
    
    // Use dynamic import to load both components
    Promise.all([
      import('../../user/popupModel/PopupButton5'),
      import('react-dom/client')
    ]).then(([{ default: PopupButton5 }, ReactDOMClient]) => {
      let root = null;
      try {
        // Use React 18's createRoot API
        root = ReactDOMClient.createRoot(container);
        
        const cleanup = () => {
          try {
            // Use a try-catch for each cleanup operation
            if (root) {
              try {
                root.unmount();
              } catch (unmountError) {
                console.error("Error unmounting component:", unmountError);
              }
            }
            
            if (document.body.contains(container)) {
              try {
                document.body.removeChild(container);
              } catch (removeError) {
                console.error("Error removing container:", removeError);
              }
            }
          } catch (cleanupError) {
            console.error("Error during cleanup:", cleanupError);
          }
        };
        
        root.render(
          <PopupButton5 
            onClose5={cleanup}
            onQRScanned={handleQRScan}
            useQROnly={true}
          />
        );
      } catch (err) {
        console.error("Error rendering QR scanner:", err);
        if (root) {
          try {
            root.unmount();
          } catch (unmountError) {
            console.error("Error unmounting on error:", unmountError);
          }
        }
        if (document.body.contains(container)) {
          try {
            document.body.removeChild(container);
          } catch (removeError) {
            console.error("Error removing container on error:", removeError);
          }
        }
      }
    }).catch(err => {
      console.error("Error loading QR scanner:", err);
      if (document.body.contains(container)) {
        try {
          document.body.removeChild(container);
        } catch (removeError) {
          console.error("Error removing container on load error:", removeError);
        }
      }
    });
  };

  // Handle adding a new checkpoint
  const addCheckpoint = () => {
    // Find the first unused point ID
    const unusedPointId = availablePoints.find(point => !isPointUsed(point));
    
    if (unusedPointId) {
      setFormData(prevData => ({
        ...prevData,
        checkpoints: [...prevData.checkpoints, { 
          name: `Location ${unusedPointId}`, // Update to "Location X" format
          qrCodeData: "" 
        }]
      }));
    } else {
      alert("Maximum 10 checkpoints allowed (A-J)");
    }
  };
  
  // Handle checkpoint QR code value change
  const handleCheckpointChange = (index, value) => {
    setFormData(prevData => {
      const newCheckpoints = [...prevData.checkpoints];
      newCheckpoints[index].qrCodeData = value;
      return {
        ...prevData,
        checkpoints: newCheckpoints
      };
    });
  };

  // Remove a checkpoint
  const removeCheckpoint = (indexToRemove) => {
    if (formData.checkpoints.length > 1) {
      setFormData(prevData => ({
        ...prevData,
        checkpoints: prevData.checkpoints.filter((_, index) => index !== indexToRemove)
      }));
    }
  };

  // Function to change checkpoint ID
  const handlePointChange = (index, newPointId) => {
    setFormData(prevData => {
      const newCheckpoints = [...prevData.checkpoints];
      newCheckpoints[index] = { 
        ...newCheckpoints[index], 
        name: `Location ${newPointId}` // Update to "Location X" format
      };
      return {
        ...prevData,
        checkpoints: newCheckpoints
      };
    });
    setActiveDropdownIndex(null);
  };

  // Check if a point is already used
  const isPointUsed = (pointId) => {
    return formData.checkpoints.some(checkpoint => 
      checkpoint.name === `Location ${pointId}`
    );
  };

  return (
    <div className="flex flex-row min-h-screen">
    

      <div className="flex flex-col flex-1 p-6">
        

        <div className="rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Post a Job</h1>
          
          {/* Show error message if there's an error */}
          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}
          
          <form className="space-y-6 w-full lg:w-[992px]" onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                name="jobTitle"
                placeholder="Enter job title"
                className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                name="pricePerHour"
                placeholder="Enter rate per hour"
                className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                name="jobLocation"
                placeholder="Click to choose location from map"
                className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none cursor-pointer"
                value={formData.jobLocation}
                onClick={handleLocationClick}
                readOnly
                required
              />
            </div>

            {/* Added Date input field with visible calendar icon */}
            <div className="relative w-full mb-6">
              <input
                type="date"
                name="workDate"
                placeholder="Select Job Date"
                className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none pr-10 cursor-pointer appearance-none"
                value={formData.workDate}
                onChange={handleChange}
                onClick={(e) => {
                  // This helps ensure the date picker opens on some browsers
                  e.target.showPicker && e.target.showPicker();
                }}
                required
              />
              <FaCalendarAlt 
                className="absolute top-[22px] right-3 transform -translate-y-1/2 text-xl text-gray-800 cursor-pointer" 
                onClick={() => {
                  // Find the date input and programmatically click it to open calendar
                  const dateInput = document.querySelector('input[name="workDate"]');
                  if (dateInput) {
                    dateInput.focus();
                    dateInput.click();
                    dateInput.showPicker && dateInput.showPicker();
                  }
                }}
              />
            </div>

            {/* Days Schedule Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Work Days Schedule</h3>
              
              <div className="space-y-4">
                {formData.days.map((daySchedule, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                    {/* Day Selection */}
                    <div className="w-32">
                      <select
                        value={daySchedule.day}
                        onChange={(e) => handleDayChange(index, 'day', e.target.value)}
                        className="w-full h-[45px] bg-white p-3 border rounded-lg outline-none"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </div>

                    {/* Start Time */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Start Time (e.g., 9:00 AM)"
                        className="w-full h-[45px] bg-white p-3 border rounded-lg outline-none cursor-pointer"
                        value={(() => {
                          if (!daySchedule.startTime) return '';
                          const [hourStr, minute] = daySchedule.startTime.split(':');
                          const hour24 = parseInt(hourStr);
                          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                          const ampm = hour24 < 12 ? 'AM' : 'PM';
                          return `${hour12}:${minute} ${ampm}`;
                        })()}
                        onClick={() => setShowStartTimePicker(`start-${index}`)}
                        readOnly
                      />
                      <IoIosTimer className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      
                      {/* Start Time Picker Modal */}
                      {showStartTimePicker === `start-${index}` && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 w-full">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Select Start Time</h4>
                              <button
                                type="button"
                                onClick={() => setShowStartTimePicker(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Hour</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const hour12 = parseInt(e.target.value);
                                    const currentTime = daySchedule.startTime;
                                    const currentHour24 = currentTime ? parseInt(currentTime.split(':')[0]) : 0;
                                    const isPM = currentHour24 >= 12;
                                    const hour24 = hour12 === 12 ? (isPM ? 12 : 0) : (isPM ? hour12 + 12 : hour12);
                                    const minute = daySchedule.startTime.split(':')[1] || '00';
                                    handleDayChange(index, 'startTime', `${hour24.toString().padStart(2, '0')}:${minute}`);
                                  }}
                                  value={(() => {
                                    const hour24 = parseInt(daySchedule.startTime.split(':')[0]) || 0;
                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                    return hour12.toString();
                                  })()}
                                >
                                  <option value="">Hr</option>
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={(i + 1).toString()}>
                                      {(i + 1).toString()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Minute</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const hour = daySchedule.startTime.split(':')[0] || '00';
                                    const minute = e.target.value.padStart(2, '0');
                                    handleDayChange(index, 'startTime', `${hour}:${minute}`);
                                  }}
                                  value={daySchedule.startTime.split(':')[1] || ''}
                                >
                                  <option value="">Min</option>
                                  {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                      {i.toString().padStart(2, '0')}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">AM/PM</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const currentTime = daySchedule.startTime;
                                    if (!currentTime) return;
                                    
                                    const [hourStr, minute] = currentTime.split(':');
                                    const currentHour24 = parseInt(hourStr);
                                    const hour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
                                    
                                    let newHour24;
                                    if (e.target.value === 'AM') {
                                      newHour24 = hour12 === 12 ? 0 : hour12;
                                    } else {
                                      newHour24 = hour12 === 12 ? 12 : hour12 + 12;
                                    }
                                    
                                    handleDayChange(index, 'startTime', `${newHour24.toString().padStart(2, '0')}:${minute}`);
                                  }}
                                  value={(() => {
                                    const hour24 = parseInt(daySchedule.startTime.split(':')[0]) || 0;
                                    return hour24 < 12 ? 'AM' : 'PM';
                                  })()}
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button
                                type="button"
                                onClick={() => setShowStartTimePicker(false)}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowStartTimePicker(false)}
                                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* End Time */}
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="End Time (e.g., 5:00 PM)"
                        className="w-full h-[45px] bg-white p-3 border rounded-lg outline-none cursor-pointer"
                        value={(() => {
                          if (!daySchedule.endTime) return '';
                          const [hourStr, minute] = daySchedule.endTime.split(':');
                          const hour24 = parseInt(hourStr);
                          const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                          const ampm = hour24 < 12 ? 'AM' : 'PM';
                          return `${hour12}:${minute} ${ampm}`;
                        })()}
                        onClick={() => setShowEndTimePicker(`end-${index}`)}
                        readOnly
                      />
                      <IoIosTimer className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      
                      {/* End Time Picker Modal */}
                      {showEndTimePicker === `end-${index}` && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 w-full">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Select End Time</h4>
                              <button
                                type="button"
                                onClick={() => setShowEndTimePicker(false)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                ×
                              </button>
                            </div>
                            <div className="flex space-x-2">
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Hour</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const hour12 = parseInt(e.target.value);
                                    const currentTime = daySchedule.endTime;
                                    const currentHour24 = currentTime ? parseInt(currentTime.split(':')[0]) : 0;
                                    const isPM = currentHour24 >= 12;
                                    const hour24 = hour12 === 12 ? (isPM ? 12 : 0) : (isPM ? hour12 + 12 : hour12);
                                    const minute = daySchedule.endTime.split(':')[1] || '00';
                                    handleDayChange(index, 'endTime', `${hour24.toString().padStart(2, '0')}:${minute}`);
                                  }}
                                  value={(() => {
                                    const hour24 = parseInt(daySchedule.endTime.split(':')[0]) || 0;
                                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                    return hour12.toString();
                                  })()}
                                >
                                  <option value="">Hr</option>
                                  {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={(i + 1).toString()}>
                                      {(i + 1).toString()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">Minute</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const hour = daySchedule.endTime.split(':')[0] || '00';
                                    const minute = e.target.value.padStart(2, '0');
                                    handleDayChange(index, 'endTime', `${hour}:${minute}`);
                                  }}
                                  value={daySchedule.endTime.split(':')[1] || ''}
                                >
                                  <option value="">Min</option>
                                  {Array.from({ length: 60 }, (_, i) => (
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                      {i.toString().padStart(2, '0')}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">AM/PM</label>
                                <select
                                  className="w-full p-2 border rounded"
                                  onChange={(e) => {
                                    const currentTime = daySchedule.endTime;
                                    if (!currentTime) return;
                                    
                                    const [hourStr, minute] = currentTime.split(':');
                                    const currentHour24 = parseInt(hourStr);
                                    const hour12 = currentHour24 === 0 ? 12 : currentHour24 > 12 ? currentHour24 - 12 : currentHour24;
                                    
                                    let newHour24;
                                    if (e.target.value === 'AM') {
                                      newHour24 = hour12 === 12 ? 0 : hour12;
                                    } else {
                                      newHour24 = hour12 === 12 ? 12 : hour12 + 12;
                                    }
                                    
                                    handleDayChange(index, 'endTime', `${newHour24.toString().padStart(2, '0')}:${minute}`);
                                  }}
                                  value={(() => {
                                    const hour24 = parseInt(daySchedule.endTime.split(':')[0]) || 0;
                                    return hour24 < 12 ? 'AM' : 'PM';
                                  })()}
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button
                                type="button"
                                onClick={() => setShowEndTimePicker(false)}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowEndTimePicker(false)}
                                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Remove Day Button */}
                    {formData.days.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDaySchedule(index)}
                        className="h-[45px] px-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addDaySchedule}
                  className="flex items-center text-[#171A1F] hover:text-orange-500 transition duration-200"
                >
                  <span className="text-3xl font-semibold mr-2">+</span>
                  <span className="font-medium">Add Another Day</span>
                </button>
              </div>
            </div>

            <div className="flex flex-row justify-between mb-6">
              <label className="block text-xl font-bold">
                Create Job Pin
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-black font-medium">Generate Auto</span>
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${isToggled ? "bg-[#00263D]" : "bg-gray-300"}`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${isToggled ? "translate-x-7" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Job PIN inputs */}
            <div className="mb-8">
              <div className="flex space-x-4 justify-center md:justify-start">
                {[...Array(4)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-[67px] h-[63px] outline-none p-2 border border-gray-400 rounded text-center text-xl font-bold"
                    value={formData.jobPin[index]}
                    onChange={(e) => handleJobPinChange(index, e.target.value)}
                    readOnly={isToggled}
                  />
                ))}
              </div>
            </div>

            {/* Job Duration dropdown - updated to match design */}
            <div className="relative w-full mb-8">
              <label className="block mb-3 text-lg font-medium text-black">Job Duration</label>
              <div className="relative">
                <select
                  name="jobDuration"
                  className="w-full h-[56px] bg-gray-100 px-6 border border-gray-200 rounded-full outline-none pr-12 appearance-none cursor-pointer text-gray-700"
                  value={formData.jobDuration}
                  onChange={handleChange}
                  required
                >
                  <option value="1 Day">1 Day</option>
                  <option value="2 Days">2 Days</option>
                  <option value="3 Days">3 Days</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-8">
              <div className="flex flex-row justify-between mb-4">
                <label className="block text-xl font-bold">
                  Create Check-in Points
                </label>
              </div>
              
              <div className="flex flex-col space-y-4 mb-6">
                {formData.checkpoints.map((checkpoint, index) => (
                  <div 
                    key={index} 
                    className="flex flex-row items-center space-x-3"
                    onMouseEnter={() => setHoveredCheckpoint(index)}
                    onMouseLeave={() => setHoveredCheckpoint(null)}
                  >
                    <div className="w-32 relative">
                      <div 
                        className="w-full h-[50px] bg-[#3950801A] border rounded-full px-4 flex items-center justify-center cursor-pointer hover:bg-[#3950801F]"
                        onClick={() => setActiveDropdownIndex(activeDropdownIndex === index ? null : index)}
                      >
                        <span className="font-medium">{checkpoint.name}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {activeDropdownIndex === index && (
                        <div 
                          ref={pointDropdownRef}
                          className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto">
                            {availablePoints.map(point => (
                              <button
                                key={point}
                                type="button"
                                className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                                  isPointUsed(point) && checkpoint.name !== `Location ${point}` ? 'text-gray-400 cursor-not-allowed' : ''
                                }`}
                                onClick={() => handlePointChange(index, point)}
                                disabled={isPointUsed(point) && checkpoint.name !== `Location ${point}`}
                              >
                                Location {point}
                                {isPointUsed(point) && checkpoint.name === `Location ${point}` && (
                                  <span className="ml-2 text-green-500">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="QR Code Value / ID"
                        className="w-full h-[50px] bg-[#3950801A] p-4 pl-4 pr-12 border rounded-full outline-none cursor-pointer"
                        value={checkpoint.qrCodeData}
                        onChange={(e) => handleCheckpointChange(index, e.target.value)}
                        onClick={() => openScannerForCheckpoint(index)}
                      />
                      <button
                        type="button"
                        onClick={() => openScannerForCheckpoint(index)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-gray-700"
                      >
                        <FaQrcode className="text-xl" />
                      </button>
                    </div>
                    
                    {formData.checkpoints.length > 1 && hoveredCheckpoint === index && (
                      <button
                        type="button"
                        onClick={() => removeCheckpoint(index)}
                        className="h-[50px] px-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mb-8">
                <button
                  type="button"
                  onClick={addCheckpoint}
                  className="flex items-center text-[#171A1F] hover:text-orange-500 transition duration-200"
                >
                  <span className="text-3xl font-semibold mr-2">+</span>
                  <span className="font-medium">Add Checkpoint</span>
                </button>
              </div>
              
              <div className="mb-8">
                <label className="block mb-3 text-lg font-medium">Alert Duration</label>
                <select
                  name="alertDuration"
                  className="w-full h-[50px] bg-[#3950801A] outline-none border rounded-full px-4"
                  value={formData.alertDuration}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-white text-gray-500">Choose alert duration</option>
                  <option value="15" className="bg-white text-gray-500">15 Minutes</option>
                  <option value="30" className="bg-white text-gray-500">30 Minutes</option>
                  <option value="60" className="bg-white text-gray-500">1 Hour</option>
                  <option value="120" className="bg-white text-gray-500">2 Hours</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <textarea
                name="jobDescription"
                placeholder="Enter job description"
                className="w-full h-[150px] bg-[#3950801A] p-5 border rounded-md outline-none"
                rows="3"
                value={formData.jobDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end mt-8">
              <CompanyProfileCompletionCheck>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-orange-500 w-full md:w-[305px] h-[56px] rounded-full text-white p-2 flex items-center justify-center font-medium text-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting Job...
                    </>
                  ) : (
                    <>Post Job →</>
                  )}
                </button>
              </CompanyProfileCompletionCheck>
            </div>
          </form>
        </div>
      </div>

      {/* Map Modal with Search Functionality */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Select Location</h2>
              <button 
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="h-[500px] w-full relative">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false} // Move zoom control to not overlap with search
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <div className="leaflet-top leaflet-right" style={{ top: "60px" }}>
                  <div className="leaflet-control leaflet-bar">
                    {/* Add custom zoom controls if needed */}
                  </div>
                </div>
                <LocationSearch 
                  setPosition={setPosition} 
                  setLocationName={setLocationName}
                  setSearching={setIsSearching}
                />
                <CurrentLocationMarker 
                  setPosition={setPosition}
                  setLocationName={setLocationName}
                />
                <ClickableMap onMapClick={handleMapClick} />
                {position && (
                  <Marker position={position}>
                    <Popup>
                      <strong>Selected Location</strong><br />
                      {locationName}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            
            <div className="p-4 border-t">
              <div className="mb-2">
                {isSearching ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading location details...</span>
                  </div>
                ) : (
                  <>
                    <strong>Selected Location:</strong> {locationName || "No location selected"}
                    {position && (
                      <div className="text-sm text-gray-600 mt-1">
                        <div>Latitude: {position.lat.toFixed(6)}</div>
                        <div>Longitude: {position.lng.toFixed(6)}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowMap(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSelectLocation}
                  className="px-4 py-2 bg-orange-500 rounded text-white hover:bg-orange-600"
                  disabled={!locationName || isSearching}
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Posting Success Popup */}
      {showSuccessPopup && (
        <ProfileSuccessPopup
          message="Job posted successfully! You will be redirected to the recent jobs page."
          onClose={handleCloseSuccessPopup}
        />
      )}
    </div>
  );
};

export default JobPosting;