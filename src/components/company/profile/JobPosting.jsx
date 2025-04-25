import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { IoIosTimer } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom"; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickableMap({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
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
  
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    setShowMap(true);
  };
  
  const handleMapClick = async (latlng) => {
    setPosition(latlng);
    try {
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
        longitude: latlng.lng
      }));
    } catch (err) {
      setLocationName('Location fetch failed');
    }
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
      // Request camera permissions with better error handling
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { ideal: "environment" },  // Try environment first but fallback to user
            width: { ideal: 1280 },
            height: { ideal: 720 } 
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

  return (
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/3 lg:w-1/4" />

      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <Header/>

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
          
          <form className="space-y-3 w-full lg:w-[992px]" onSubmit={handleSubmit}>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pricePerHour"
              placeholder="Enter rate per hour"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
              value={formData.pricePerHour}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="jobLocation"
              placeholder="Click to choose location from map"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none cursor-pointer"
              value={formData.jobLocation}
              onClick={handleLocationClick}
              readOnly
              required
            />

            {/* Added Date input field with visible calendar icon */}
            <div className="relative w-full mb-3">
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

            <div className="flex flex-col md:flex-row md:space-x-3 mb-3">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  name="startTime"
                  placeholder="Start Time"
                  className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none pr-10 cursor-pointer"
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
                  className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none pr-10 cursor-pointer"
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

            <div className="flex flex-row justify-between mb-3">
              <label className="block mb-4 md:mb-0 text-xl font-bold">
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
            <div className="">
              <div className="flex space-x-2 mb-3">
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

            {/* Job Duration dropdown */}
            <div className="relative w-full mb-3">
              <select
                name="jobDuration"
                className="w-full h-[50px] bg-[#3950801A] p-4 border rounded-full outline-none pr-12 appearance-none"
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

            <div className="flex flex-col mb-3">
              <div className="flex flex-row justify-between mb-3">
                <label className="block mb-4 md:mb-0 text-xl font-bold">
                  Create Check-in Points
                </label>
              </div>
              
              <div className="flex flex-col space-y-3 mb-3">
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
                        className="w-full h-[50px] bg-[#3950801A] p-4 pl-4 pr-12 border rounded-full outline-none"
                        value={checkpoint.qrCodeData}
                        onChange={(e) => handleCheckpointChange(index, e.target.value)}
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
              
              <div className="mt-2">
                <button
                  type="button"
                  onClick={addCheckpoint}
                  className="flex items-center text-[#171A1F] hover:text-orange-500 transition duration-200"
                >
                  <span className="text-3xl font-semibold mr-2">+</span>
                  <span className="font-medium">Add Checkpoint</span>
                </button>
              </div>
              
              <select
                name="alertDuration"
                className="w-full h-[50px] bg-[#3950801A] outline-none mt-4 mb-3 rounded-full px-4"
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

            <textarea
              name="jobDescription"
              placeholder="Enter job description"
              className="w-full h-[150px] bg-[#3950801A] p-4 mb-3 border rounded-md outline-none"
              rows="3"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            ></textarea>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-orange-500 w-full md:w-[305px] h-[56px] rounded-full text-white p-2 flex items-center justify-center ${
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

      {/* Map Modal */}
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
            
            <div className="h-[500px] w-full">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ClickableMap onMapClick={handleMapClick} />
                {position && (
                  <Marker position={position}>
                    <Popup>
                      <strong>Lat:</strong> {position.lat.toFixed(5)} <br />
                      <strong>Lng:</strong> {position.lng.toFixed(5)} <br />
                      <strong>Location:</strong> {locationName}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            
            <div className="p-4 border-t">
              <div className="mb-2">
                <strong>Selected Location:</strong> {locationName || "No location selected"}
                {position && (
                  <div className="text-sm text-gray-600 mt-1">
                    <div>Latitude: {position.lat.toFixed(6)}</div>
                    <div>Longitude: {position.lng.toFixed(6)}</div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setShowMap(false)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSelectLocation}
                  className="px-4 py-2 bg-orange-500 rounded text-white"
                  disabled={!locationName}
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
                    <QrReader
                      constraints={{ 
                        facingMode: "environment",
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                      }}
                      onResult={(result, error) => handleScanResult(currentScanningIndex, result, error)}
                      containerStyle={{ width: "100%", height: "100%" }}
                      videoStyle={{ objectFit: "cover", width: "100%", height: "100%" }}
                      ViewFinder={() => (
                        <div className="absolute inset-0 border-2 border-dashed border-red-500 m-[40px] rounded-lg pointer-events-none"></div>
                      )}
                      scanDelay={500}
                      ref={scannerRef}
                    />
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