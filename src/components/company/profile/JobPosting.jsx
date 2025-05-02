import React, { useState, useEffect, useRef } from "react";
import { IoIosTimer } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa"; 
import { FaSearch, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import LoadingSpinner from "../../common/LoadingSpinner";

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
  
  
  const startTimePickerRef = useRef(null);
  const endTimePickerRef = useRef(null);
  
  
  const [formData, setFormData] = useState({
    jobTitle: "",
    pricePerHour: "", 
    latitude: null,
    longitude: null,
    jobLocation: "", 
    workDate: "", 
    startTime: "",
    endTime: "",
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
  const [scanningStatus, setScanningStatus] = useState('waiting'); // 'waiting', 'scanning', 'success', 'error'
  const [cameraError, setCameraError] = useState(null);
  const [scanSuccessful, setScanSuccessful] = useState(false);
  
  // Refs
  const pointDropdownRef = useRef(null);
  const scannerRef = useRef(null);
  
  
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
  

  const formatTimeForAPI = (time24h) => {
    if (!time24h) return "";
    
    const [hour, minute] = time24h.split(':');
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12; 
    
    return `${hour12.toString().padStart(2, '0')}:${minute} ${period}`;
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
        startTime: formatTimeForAPI(formData.startTime),
        endTime: formatTimeForAPI(formData.endTime),
        jobPin: parseInt(formData.jobPin.join(''), 10) || 0,
        checkpoints: formData.checkpoints.map(cp => ({
          name: cp.name, 
          qrCodeData: cp.qrCodeData || null
        })),
        alertDuration: parseInt(formData.alertDuration) || 30,
        jobDescription: formData.jobDescription,
        noOfApplicants: 0,
        applicantsList: [], 
        jobDuration: formData.jobDuration,
        jobStatus: "open", 
        companyId: companyId 
      };
      
      console.log("Submitting job data:", apiData);
      
      // API call with both companyId as header and in payload for flexibility
      const response = await axios.post('/api/jobs', apiData, {
        headers: {
          'Content-Type': 'application/json',
          'companyId': companyId // Keep the header for backwards compatibility
        }
      });
      
      console.log("Job created successfully:", response.data);
      setSubmitSuccess(true);
      
      
      setTimeout(() => {
        navigate('/recents-jobs');
      }, 1500);
    } catch (error) {
      console.error("Error creating job:", error);
      
  
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
      if (startTimePickerRef.current && !startTimePickerRef.current.contains(event.target)) {
        setShowStartTimePicker(false);
      }
      if (endTimePickerRef.current && !endTimePickerRef.current.contains(event.target)) {
        setShowEndTimePicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [startTimePickerRef, endTimePickerRef]);

 
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
  
  // Improved time picker with AM/PM format option and better UX
  const TimePicker = ({ timeType, onSelect, pickerRef }) => {
    const [view, setView] = useState('hour');
    const [period, setPeriod] = useState('AM');
    const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minuteOptions = ['00', '15', '30', '45'];
    
    const handleHourSelect = (hour) => {
      const hour24 = period === 'PM' && hour !== '12' 
        ? (parseInt(hour, 10) + 12).toString() 
        : (period === 'AM' && hour === '12' ? '00' : hour);
      
      onSelect(timeType, hour24, view === 'minute' ? formData[timeType]?.split(':')[1] || '00' : '00');
      setView('minute');
    };
    
    const handleMinuteSelect = (minute) => {
      const hourPart = formData[timeType]?.split(':')[0] || '00';
      onSelect(timeType, hourPart, minute);
    };
    
    const togglePeriod = () => {
      const newPeriod = period === 'AM' ? 'PM' : 'AM';
      setPeriod(newPeriod);
      
      // Update time if already selected
      if (formData[timeType]) {
        const [hour, minute] = formData[timeType].split(':');
        let hourNum = parseInt(hour, 10);
        
        if (newPeriod === 'PM' && hourNum < 12) {
          hourNum += 12;
        } else if (newPeriod === 'AM' && hourNum >= 12) {
          hourNum -= 12;
        }
        
        onSelect(timeType, hourNum.toString().padStart(2, '0'), minute);
      }
    };
    
    // Format displayed time in 12-hour format
    const formatDisplayTime = () => {
      if (!formData[timeType]) return '--:--';
      
      const [hour, minute] = formData[timeType].split(':');
      const hourNum = parseInt(hour, 10);
      const hour12 = hourNum % 12 || 12;
      const periodStr = hourNum >= 12 ? 'PM' : 'AM';
      
      return `${hour12}:${minute} ${periodStr}`;
    };
    
    return (
      <div
        ref={pickerRef}
        className="absolute transform -translate-y-full -mt-2 left-0 bg-white shadow-xl rounded-lg z-20 border"
        style={{ width: '240px' }}
      >
        <div className="p-3 border-b bg-blue-50 flex justify-between items-center">
          <h3 className="font-medium text-gray-800">{view === 'hour' ? 'Select Hour' : 'Select Minute'}</h3>
          <div className="text-lg font-semibold text-blue-700">{formatDisplayTime()}</div>
        </div>
        
        <div className="p-4">
          {view === 'hour' ? (
            <div>
              <div className="grid grid-cols-3 gap-2">
                {hourOptions.map(hour => (
                  <button
                    key={hour}
                    type="button"
                    className="flex items-center justify-center w-16 h-10 rounded 
                      bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={() => handleHourSelect(hour)}
                  >
                    {hour}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setPeriod('AM')}
                  className={`px-4 py-2 rounded-full font-medium 
                    ${period === 'AM' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'}`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('PM')}
                  className={`px-4 py-2 ml-2 rounded-full font-medium 
                    ${period === 'PM' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'}`}
                >
                  PM
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-3">
                {minuteOptions.map(minute => (
                  <button
                    key={minute}
                    type="button"
                    className="flex items-center justify-center w-full h-12 rounded 
                      bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                    onClick={() => handleMinuteSelect(minute)}
                  >
                    :{minute}
                  </button>
                ))}
              </div>
              
              <div className="mt-3 flex justify-start">
                <button
                  type="button"
                  onClick={() => setView('hour')}
                  className="px-3 py-1 text-sm text-blue-600 hover:underline"
                >
                  ← Back to hours
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t bg-gray-50 flex justify-between">
          <button
            type="button"
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            onClick={() => {
              if (timeType === 'startTime') {
                setShowStartTimePicker(false);
              } else {
                setShowEndTimePicker(false);
              }
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={() => {
              if (timeType === 'startTime') {
                setShowStartTimePicker(false);
              } else {
                setShowEndTimePicker(false);
              }
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  };

  // Improved function to open scanner for a specific checkpoint
  const openScannerForCheckpoint = (index) => {
    setCurrentScanningIndex(index);
    setScanningStatus('scanning');
    setScanSuccessful(false);
    setCameraError(null);
    setShowQRScanner(true);
    
    // Using a slight delay to ensure the QR scanner component mounts properly
    setTimeout(() => {
      // Request camera permissions with better error handling - trying user (front) camera first for laptops
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "user",  // Use front camera for laptops
            width: { ideal: 640 },
            height: { ideal: 480 } 
          },
          audio: false
        })
        .then((stream) => {
          console.log("Camera access granted for QR scanning");
          // Store the stream for proper cleanup later
          window.qrScannerStream = stream;
          setScanningStatus('ready');
        })
        .catch(err => {
          console.error("Camera permission error:", err);
          setCameraError(`Camera access error: ${err.message || 'Unknown error'}`);
          setScanningStatus('error');
        });
      } else {
        setCameraError("Your browser doesn't support camera access");
        setScanningStatus('error');
      }
    }, 300);
  };
  
  // Enhanced QR code scan result handler
  const handleScanResult = (index, result, error) => {
    if (result && result.text) {
      console.log("Scanned QR Code:", result.text);
      
      // Update the form data with the scanned QR code
      setFormData(prevData => {
        const newCheckpoints = [...prevData.checkpoints];
        newCheckpoints[index].qrCodeData = result.text;
        return {
          ...prevData,
          checkpoints: newCheckpoints
        };
      });
      
      // Show success state briefly before closing
      setScanningStatus('success');
      setScanSuccessful(true);
      
      // Close scanner after a short delay
      setTimeout(() => {
        setShowQRScanner(false);
        stopCamera();
      }, 1500);
    }
    
    if (error) {
      // Only log errors but don't change state on every frame error
      console.warn("QR Scan Error:", error);
    }
  };
  
  // Improved function to stop the camera properly
  const stopCamera = () => {
    try {
      // Stop the stored stream if it exists (our global reference)
      if (window.qrScannerStream) {
        const tracks = window.qrScannerStream.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log("Camera track stopped");
        });
        window.qrScannerStream = null;
      }
      
      // Also try to find and stop any active video elements
      const videoElements = document.querySelectorAll('video');
      videoElements.forEach(video => {
        if (video && video.srcObject) {
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          video.srcObject = null;
        }
      });
      
      console.log("Camera stopped successfully");
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  // Close QR scanner and stop camera
  const closeQRScanner = () => {
    setShowQRScanner(false);
    setScanningStatus('waiting');
    stopCamera();
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

  // Create custom video component for direct video access
  const QRScannerComponent = ({ onScan }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [scanning, setScanning] = useState(true);
    const streamRef = useRef(null); // Reference to keep track of the stream

    useEffect(() => {
      let animationFrame = null;
      let mounted = true; // Flag to track component mount state
      
      // Setup camera stream directly
      async function setupCamera() {
        try {
          // Don't proceed if component unmounted during async operation
          if (!mounted) return;
          
          // Get user media with front camera
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
          
          // Store stream in ref for cleanup
          streamRef.current = stream;
          
          // Set video source if component is still mounted and video ref exists
          if (mounted && videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Use event listener to handle play() failures gracefully
            const playPromise = videoRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  if (mounted) {
                    console.log("Camera feed successfully initialized");
                    setHasPermission(true);
                    // Start scanning after video is playing
                    animationFrame = requestAnimationFrame(scanQRCode);
                  }
                })
                .catch(err => {
                  // Handle play() promise rejection - common when component unmounts quickly
                  console.warn("Play promise rejected:", err.message);
                  if (mounted) {
                    setCameraError(`Video play error: ${err.message}`);
                  }
                });
            }
          }
          
          // Save reference for external cleanup
          if (mounted) {
            window.qrScannerStream = stream;
          }
        } catch (err) {
          if (mounted) {
            console.error("Failed to access camera:", err);
            setCameraError(`Camera access error: ${err.message}`);
            setScanningStatus('error');
          }
        }
      }
      
      // Function to scan for QR codes from video stream
      const scanQRCode = async () => {
        if (!mounted || !videoRef.current || !canvasRef.current || !scanning) return;
        
        try {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          // Only process video if it's actually playing
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const context = canvas.getContext('2d');
            
            // Set canvas size to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Draw current video frame to canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Get image data for QR code scanning
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            try {
              // Create a temporary image to test if it contains QR code data (using browser APIs)
              const barcodeDetector = window.BarcodeDetector ? 
                new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
                
              if (barcodeDetector) {
                const barcodes = await barcodeDetector.detect(imageData);
                
                if (barcodes.length > 0) {
                  // QR code detected!
                  setScanning(false);
                  const qrData = barcodes[0].rawValue;
                  console.log("QR code detected:", qrData);
                  
                  // Call the onScan callback with the detected QR data
                  if (mounted) {
                    onScan({ text: qrData });
                  }
                  return; // Stop scanning
                }
              }
            } catch (qrError) {
              console.warn("QR detection error:", qrError);
            }
          }
          
          // If still scanning and component still mounted, continue with next frame
          if (scanning && mounted) {
            animationFrame = requestAnimationFrame(scanQRCode);
          }
        } catch (err) {
          console.error("Error in scan loop:", err);
          // Still try to continue scanning if possible
          if (scanning && mounted) {
            animationFrame = requestAnimationFrame(scanQRCode);
          }
        }
      };

      // Start camera setup process
      setupCamera();

      // Cleanup function
      return () => {
        mounted = false; // Mark component as unmounted
        setScanning(false);
        
        // Cancel animation frame if active
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        
        // Stop all tracks in the stream
        if (streamRef.current) {
          const tracks = streamRef.current.getTracks();
          tracks.forEach(track => {
            track.stop();
            console.log("Camera track stopped in cleanup");
          });
          streamRef.current = null;
        }
        
        // Also clean up global stream reference if it exists
        if (window.qrScannerStream) {
          const globalTracks = window.qrScannerStream.getTracks();
          globalTracks.forEach(track => track.stop());
          window.qrScannerStream = null;
        }
        
        // Clear video source to prevent memory leaks
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject = null;
        }
      };
    }, [onScan]);

    return (
      <div className="w-full h-full relative">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }} // Mirror for selfie mode
        />
        
        {/* Hidden canvas for QR code processing */}
        <canvas 
          ref={canvasRef} 
          style={{ display: 'none' }}
        />
        
        {/* Scanner overlay */}
        <div className="absolute inset-0 border-2 border-dashed border-red-500 m-[40px] rounded-lg pointer-events-none"></div>
        
        {/* Camera status indicator */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
          {hasPermission ? "Camera active" : "Activating camera..."}
        </div>
      </div>
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
          
          {/* Show success message if job was created successfully */}
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Job posted successfully! Redirecting to jobs page...
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

            <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
              <div className="relative w-full md:w-1/2 mb-6 md:mb-0">
                <input
                  type="text"
                  name="startTime"
                  placeholder="Start Time"
                  className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none pr-10 cursor-pointer"
                  value={formData.startTime}
                  onChange={handleChange}
                  onClick={() => setShowStartTimePicker(true)}
                  readOnly
                  required
                />
                <IoIosTimer className="absolute top-[22px] right-3 transform -translate-y-1/2 text-2xl text-gray-800" />
                {showStartTimePicker && (
                  <TimePicker 
                    timeType="startTime" 
                    onSelect={handleTimeSelect} 
                    pickerRef={startTimePickerRef}
                  />
                )}
              </div>
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  name="endTime"
                  placeholder="End Time"
                  className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none pr-10 cursor-pointer"
                  value={formData.endTime}
                  onChange={handleChange}
                  onClick={() => setShowEndTimePicker(true)}
                  readOnly
                  required
                />
                <IoIosTimer className="absolute top-[22px] right-3 transform -translate-y-1/2 text-2xl text-gray-800" />
                {showEndTimePicker && (
                  <TimePicker 
                    timeType="endTime" 
                    onSelect={handleTimeSelect} 
                    pickerRef={endTimePickerRef}
                  />
                )}
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

      {/* Enhanced QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl flex flex-col p-6 w-[90%] max-w-md h-auto relative">
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={closeQRScanner}
                className="text-gray-500 focus:outline-none"
              >
                <span className="text-4xl text-orange-400">&times;</span>
              </button>
            </div>
            
            <div className="flex flex-col justify-center items-center w-full h-[400px]">
              <h3 className="text-xl font-semibold mb-4">
                Scan QR Code for {formData.checkpoints[currentScanningIndex]?.name || ''}
              </h3>
              
              {scanningStatus === 'error' ? (
                <div className="text-center p-4">
                  <div className="text-red-500 mb-3 text-lg">❌ Camera Error</div>
                  <p className="text-gray-700">{cameraError || 'Could not access camera'}</p>
                  <button
                    onClick={closeQRScanner}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              ) : scanSuccessful ? (
                <div className="text-center p-4">
                  <div className="text-green-500 mb-3 text-5xl">✓</div>
                  <p className="text-gray-700 font-medium">QR Code successfully scanned!</p>
                  <p className="text-blue-600 mt-2 break-all">{formData.checkpoints[currentScanningIndex]?.qrCodeData}</p>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-[280px] h-[280px] relative overflow-hidden rounded-lg border-4 border-gray-300">
                    <QRScannerComponent onScan={(result, error) => handleScanResult(currentScanningIndex, result, error)} />
                    
                    {/* Debug info to check camera status */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                      Camera active
                    </div>
                  </div>
                  
                  <span className="mt-4 text-gray-600 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Position QR code in the frame to scan
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosting;