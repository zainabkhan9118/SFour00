import React, { useRef, useState, useEffect, useContext } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaQrcode } from "react-icons/fa";
import { updateStatusByQR, updateJobStatus } from "../../../api/myWorkApi";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import jsQR from "jsqr";

import insta from "../../../assets/images/insta.svg";
import salary from "../../../assets/images/salary.png";
import time from "../../../assets/images/time.png";
import PopupButton6 from "./PopupButton6";
 
// QR Scanner component with camera management
const QRScannerComponent = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("initializing"); // Move camera status into component
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    console.log("QR Scanner component mounted");
    let mounted = true;

    const initCamera = async () => {
      console.log("Initializing camera with enhanced settings...");
      try {
        const constraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("Successfully accessed environment camera");
        } catch (envError) {
          console.log("Environment camera failed, trying user camera:", envError);
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
          });
          console.log("Successfully accessed user camera");
        }

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        setCameraStatus("active");

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);
          videoRef.current.setAttribute("autoplay", true);
          
          videoRef.current.onloadedmetadata = () => {
            if (!mounted) return;
            
            videoRef.current.play()
              .then(() => {
                console.log("Camera video playing successfully");                
                scanIntervalRef.current = setInterval(() => {
                  scanQRCode();
                }, 100);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                onScan(null, {
                  name: "PlayError",
                  message: "Could not play camera video: " + err.message
                });
                setCameraStatus("error");
              });
          };
        }
      } catch (err) {
        console.error("Camera initialization error:", err);
        if (mounted) {
          onScan(null, { 
            name: "CameraError", 
            message: err.message || "Failed to initialize camera"
          });
          setCameraStatus("error");
        }
      }
    };

    const scanQRCode = () => {
      if (!mounted || !videoRef.current || !canvasRef.current || cameraStatus !== "active") {
        return;
      }

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { willReadFrequently: true });

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const width = Math.min(video.videoWidth, 1280);
          const height = (video.videoHeight / video.videoWidth) * width;
          
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
          
          const imageData = context.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
            canOverwriteImage: true,
          });

          if (code) {
            console.log("QR code found:", code.data);
            
            if (scanIntervalRef.current) {
              clearInterval(scanIntervalRef.current);
              scanIntervalRef.current = null;
            }
            
            onScan({ text: code.data }, null);
            return;
          }
        }
      } catch (err) {
        console.error("Error in scan loop:", err);
      }
    };

    initCamera();

    return () => {
      mounted = false;
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [onScan, cameraStatus]);

  return (
    <div className="w-full h-full relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-sm px-3 py-1 bg-black bg-opacity-50 rounded-full">
          {cameraStatus === "initializing" ? "Starting camera..." : 
           cameraStatus === "error" ? "Camera error" :
           "Scanning..."}
        </div>
      </div>
    </div>
  );
};

const PopupButton5 = ({ onClose, onClose5, jobId, useQROnly = false, onQRScanned }) => {
  const [showPopup6, setShowPopup6] = useState(false);
  const buttonRef = useRef();
  const [showScanner, setShowScanner] = useState(useQROnly); // Auto-show scanner in QR-only mode
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanningStatus, setScanningStatus] = useState("waiting"); // 'waiting', 'scanning', 'success', 'error'
  const [cameraError, setCameraError] = useState(null);
  const [scanSuccessful, setScanSuccessful] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [cameraStatus, setCameraStatus] = useState("initializing"); // Add camera status state
  const [qrMismatchError, setQrMismatchError] = useState(null); // New state for QR mismatch errors
  const [isQrValid, setIsQrValid] = useState(false); // Track if QR is valid for enabling/disabling Book On button
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  useEffect(() => {
    // Load job details when component mounts
    const fetchJobDetails = async () => {
      try {
        // Get the current job ID from props or from localStorage
        const currentJobId = jobId || localStorage.getItem("selectedJobId");

        if (!currentJobId) {
          setError("Job ID not found. Please try again.");
          return;
        }

        console.log("Fetching job details for job ID:", currentJobId);

        // Use jobSeekerId from localStorage
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        if (!jobSeekerId) {
          setError("User ID not found. Please try logging in again.");
          return;
        }
        

        // Fetch job details - use the assigned jobs endpoint directly as it's more reliable
        const BASE_URL = import.meta.env.VITE_BASE_URL;

        try {
          // Get assigned jobs - this appears to be consistently working based on logs
          const assignedResponse = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
            params: { status: "assigned" }
          });

          if (assignedResponse.data?.data && Array.isArray(assignedResponse.data.data)) {
            // Find the job with matching ID
            const foundJob = assignedResponse.data.data.find(job =>
              (job._id === currentJobId) ||
              (job.jobId && typeof job.jobId === 'object' && job.jobId._id === currentJobId) ||
              (typeof job.jobId === 'string' && job.jobId === currentJobId)
            );

            if (foundJob) {
              // Extract job data - either from nested jobId object or directly from the job
              let jobData;
              if (foundJob.jobId && typeof foundJob.jobId === 'object') {
                jobData = { ...foundJob.jobId };
              } else {
                jobData = { ...foundJob };

                // Try to fetch job details directly as a fallback if jobId is just a string
                if (typeof foundJob.jobId === 'string') {
                  try {
                    const jobResponse = await axios.get(`${BASE_URL}/jobs/${foundJob.jobId}`);
                    if (jobResponse.data?.data) {
                      jobData = { ...jobData, ...jobResponse.data.data };
                    }
                  } catch (err) {
                    console.log("Could not fetch additional job details:", err);
                    // Continue with what we have
                  }
                }
              }

              // Ensure we have company details
              if (foundJob.companyId && (!jobData.companyId || typeof jobData.companyId !== 'object')) {
                jobData.companyId = foundJob.companyId;
              }

              // Make sure we have job location
              if (foundJob.latitude && foundJob.longitude) {
                jobData.latitude = foundJob.latitude;
                jobData.longitude = foundJob.longitude;
              }

              console.log("Job details successfully loaded:", jobData);
              setJobDetails(jobData);
            } else {
              // Try a more general search without status filter if not found in assigned jobs
              const allJobsResponse = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`);

              if (allJobsResponse.data?.data && Array.isArray(allJobsResponse.data.data)) {
                const anyJob = allJobsResponse.data.data.find(job =>
                  (job._id === currentJobId) ||
                  (job.jobId && typeof job.jobId === 'object' && job.jobId._id === currentJobId) ||
                  (typeof job.jobId === 'string' && job.jobId === currentJobId)
                );

                if (anyJob) {
                  const jobData = (anyJob.jobId && typeof anyJob.jobId === 'object') ?
                    { ...anyJob.jobId } : { ...anyJob };

                  console.log("Found job in general job list:", jobData);
                  setJobDetails(jobData);
                } else {
                  throw new Error("Job not found in any list");
                }
              } else {
                throw new Error("Could not fetch job list");
              }
            }
          } else {
            throw new Error("No assigned jobs data returned");
          }
        } catch (err) {
          console.error("Error fetching job details:", err);
          setError("Failed to load job information. Please try again.");
        }
      } catch (err) {
        console.error("Failed to load job details:", err);
        setError("Could not load job information.");
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      closeCameraAndPopup();
    }
  };

  useEffect(() => {
    // Add handler for escape key to close popup
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeCameraAndPopup();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      // Cleanup camera when component unmounts
      stopCameraStream();
    };
  }, []);

  const handleScanResult = async (result, error) => {
    if (result && result.text) {
      console.log("QR Code scanned successfully:", result.text);
      
      // Stop camera first
      stopCameraStream();
      
      // Then update state
      setQrData(result.text);
      setShowScanner(false);
      setScanSuccessful(true);
      
      // Clear previous errors
      setQrMismatchError(null);
      setError(null);

      // Update job status to inProgress immediately after successful scan
      try {
        setLoading(true);
        
        // Get the current job ID
        const currentJobId = jobId || localStorage.getItem("selectedJobId");
        const jobSeekerId = localStorage.getItem("jobSeekerId");

        if (currentJobId && jobSeekerId) {
          // Create the QR data object for status update
          const enhancedQrData = {
            qrCodeData: result.text,
            jobId: currentJobId,
            jobSeekerId: jobSeekerId,
            status: "inProgress" // Explicitly set status to inProgress
          };

          console.log(`🔄 Updating job status to inProgress for job ${currentJobId} with QR data:`, enhancedQrData);

          // Try the QR-specific API first
          let response;
          try {
            response = await updateStatusByQR(currentJobId, enhancedQrData);
            console.log("📡 QR API Response:", response);
            
            // If we get here, the QR was valid and accepted
            setIsQrValid(true);
            setQrMismatchError(null);
            
          } catch (qrError) {
            console.warn("⚠️ QR API failed:", qrError);
            
            // Check if this is a QR mismatch error (400 status)
            if (qrError.response?.status === 400) {
              const errorMessage = qrError.response?.data?.message;
              if (errorMessage && errorMessage.toLowerCase().includes('qr code does not match')) {
                console.error("❌ QR Code mismatch:", errorMessage);
                setQrMismatchError(errorMessage);
                setIsQrValid(false);
                setScanSuccessful(false);
                
                // Show error but don't proceed with status update
                setLoading(false);
                return;
              }
            }
            
            // If it's not a QR mismatch error, try the regular status update API
            try {
              response = await updateJobStatus(currentJobId, { 
                status: "inProgress",
                qrCodeData: result.text,
                timestamp: new Date().toISOString()
              });
              console.log("📡 Regular API Response:", response);
              setIsQrValid(true);
              setQrMismatchError(null);
            } catch (regularError) {
              console.error("❌ Both APIs failed:", regularError);
              
              // Check if regular API also returned QR mismatch
              if (regularError.response?.status === 400) {
                const errorMessage = regularError.response?.data?.message;
                if (errorMessage && errorMessage.toLowerCase().includes('qr code does not match')) {
                  setQrMismatchError(errorMessage);
                  setIsQrValid(false);
                  setScanSuccessful(false);
                  setLoading(false);
                  return;
                }
              }
              
              throw regularError;
            }
          }
          
          console.log("📡 Full API Response:", response);
          
          if (response && response.data) {
            console.log("✅ Job status updated to inProgress successfully:", response.data);
            
            // Verify the status was actually updated by checking the current job status
            try {
              const BASE_URL = import.meta.env.VITE_BASE_URL;
              const verifyResponse = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
                params: { status: "inProgress" }
              });
              console.log("🔍 Verification - Current inProgress jobs:", verifyResponse.data);
              
              // Check if our job is in the response
              const updatedJob = verifyResponse.data?.data?.find(job => 
                job._id === currentJobId || 
                (job.jobId && job.jobId._id === currentJobId)
              );
              
              if (updatedJob) {
                console.log("✅ VERIFIED: Job found in inProgress list:", updatedJob);
              } else {
                console.warn("⚠️ Job not found in inProgress list yet - might need a moment to update");
              }
            } catch (verifyError) {
              console.warn("⚠️ Could not verify status update:", verifyError);
            }
            
            // Clear the cache so fresh data is fetched
            const cacheKey = `in-progress-jobs-${jobSeekerId}`;
            if (window.sessionStorage) {
              window.sessionStorage.removeItem(cacheKey);
            }
            if (window.localStorage) {
              const keys = Object.keys(window.localStorage);
              keys.forEach(key => {
                if (key.includes('in-progress-jobs') || key.includes(cacheKey)) {
                  window.localStorage.removeItem(key);
                }
              });
            }
            console.log("🗑️ Cache cleared for in-progress jobs");
            
          } else {
            console.warn("⚠️ Status update response was unexpected:", response);
          }
        } else {
          console.error("❌ Missing jobId or jobSeekerId for status update", {
            currentJobId,
            jobSeekerId
          });
        }
      } catch (err) {
        console.error("❌ Error updating job status to inProgress:", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        // Check if this is a QR mismatch error
        if (err.response?.status === 400) {
          const errorMessage = err.response?.data?.message;
          if (errorMessage && errorMessage.toLowerCase().includes('qr code does not match')) {
            setQrMismatchError(errorMessage);
            setIsQrValid(false);
            setScanSuccessful(false);
            setLoading(false);
            return;
          }
        }
        
        // For other errors, don't show error to user as the scan was successful
        // The status update failure shouldn't break the flow
      } finally {
        setLoading(false);
      }

      // If we're in QR-only mode, call the callback with the data
      if (useQROnly && onQRScanned) {
        onQRScanned(result.text);
        // Use setTimeout to ensure state updates are processed before closing
        setTimeout(() => {
          closeCameraAndPopup();
        }, 0);
      }
    }

    if (error) {
      console.warn("QR Scan Error:", error);
      setCameraError(error.message || "Failed to scan QR code");
      setScanningStatus("error");

      // Check for specific errors
      if (
        error.name === "NotAllowedError" ||
        error.message?.includes("Permission denied")
      ) {
        setCameraError(
          "Camera access was denied. Please allow camera access in your browser settings to scan QR codes."
        );
      } else if (
        error.name === "NotFoundError" ||
        error.message?.includes("No camera available")
      ) {
        setCameraError(
          "No camera was found on your device. Please try using a device with a camera."
        );
      }
    }
  };

  const stopCameraStream = () => {
    try {
      console.log("Stopping camera streams...");
      
      // Find and stop all video streams
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((video) => {
        if (video && video.srcObject) {
          const stream = video.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
            console.log("Stopped video track:", track.kind);
          });
          video.srcObject = null;
        }
      });

      console.log("Camera stopped successfully");
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  const closeCameraAndPopup = () => {
    try {
      console.log("Closing camera and popup...");
      setShowScanner(false);
      stopCameraStream();
      
      // Delay the onClose5 call to ensure state updates have completed
      setTimeout(() => {
        if (onClose5) {
          onClose5();
        }
      }, 0);
    } catch (err) {
      console.error("Error in closeCameraAndPopup:", err);
    }
  };

  const handleBookOnClick = async () => {
    // For testing, allow using mock QR data if camera isn't working
    const dataToUse = qrData || "TEST-QR-12345";

    setLoading(true);
    setError(null);

    try {
      // Get the current job ID
      const currentJobId = jobId || localStorage.getItem("selectedJobId");

      if (!currentJobId) {
        throw new Error("Job ID not found. Please select a job first.");
      }

      // Get job seeker ID from localStorage
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      
      if (!jobSeekerId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Create an enhanced QR code data object with job details
      // If QR was already scanned, this might be a confirmation or completion step
      const enhancedQrData = {
        qrCodeData: dataToUse,
        jobId: currentJobId,
        jobSeekerId: jobSeekerId,
        status: qrData ? "confirmed" : "inProgress" // Use "confirmed" if QR was already scanned, otherwise "inProgress"
       // jobTitle: jobDetails?.jobTitle || '',
        //companyName: jobDetails?.companyId?.companyName || '',
        //jobDate: jobDetails?.workDate || new Date().toISOString(),
        // Include any other useful job information
        //pricePerHour: jobDetails?.pricePerHour || 0
      };

      console.log(`Calling updateStatusByQR for job ${currentJobId} with enhanced data:`, enhancedQrData);

      // Call the API with the jobId and enhanced QR code data
      const response = await updateStatusByQR(currentJobId, enhancedQrData);

      console.log("API Response:", response);

      // If successful, proceed to the next popup
      if (response && response.data) {
        console.log("Status update successful:", response.data);
        setShowPopup6(true);
      } else {
        throw new Error("Failed to update job status. Please try again.");
      }
    } catch (err) {
      console.error("Error updating job status:", err);
      setError(err.message || "An error occurred. Please try again.");

      // Still proceed to success screen in development for testing
      if (process.env.NODE_ENV !== 'production') {
        console.log("Development mode: proceeding to success screen despite error");
        setTimeout(() => {
          setShowPopup6(true);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Open QR scanner
  const openScanner = () => {
    setShowScanner(true);
    setScanningStatus("scanning");
    setScanSuccessful(false);
    setCameraError(null);
    setQrMismatchError(null); // Clear QR mismatch error when starting new scan
    setIsQrValid(false); // Reset QR validity
    console.log("Scanner opened, camera should initialize now");
  };

  return (
    <>
      {!showPopup6 ? (
        <div
          ref={buttonRef}
          onClick={closeModel}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative ${useQROnly ? 'h-[400px]' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={closeCameraAndPopup}
                className="text-gray-500 dark:text-gray-300 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {showScanner || useQROnly ? (
              <div className="flex flex-col justify-center items-center w-full h-[400px]">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Scan QR Code</h3>

                {scanningStatus === "error" ? (
                  <div className="text-center p-4">
                    <div className="text-red-500 mb-3 text-lg">❌ Camera Error</div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {cameraError || "Could not access camera"}
                    </p>
                    <button
                      onClick={() => useQROnly ? closeCameraAndPopup() : setShowScanner(false)}
                      className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                    >
                      Close
                    </button>
                  </div>
                ) : scanSuccessful && !qrMismatchError ? (
                  <div className="text-center p-4">
                    <div className="text-green-500 mb-3 text-5xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      QR Code successfully scanned and validated!
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 mt-2 break-all">{qrData}</p>
                    {useQROnly && (
                      <button
                        onClick={closeCameraAndPopup}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Use This Value
                      </button>
                    )}
                  </div>
                ) : qrMismatchError ? (
                  <div className="text-center p-4">
                    <div className="text-red-500 mb-3 text-5xl">❌</div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                      QR Code Mismatch!
                    </p>
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3 mb-4">
                      <p className="text-red-600 dark:text-red-300 text-sm">{qrMismatchError}</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      The QR code you scanned doesn't match any checkpoint for this job. Please scan the correct QR code.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={openScanner}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        Scan Again
                      </button>
                      <button
                        onClick={() => useQROnly ? closeCameraAndPopup() : setShowScanner(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : scanSuccessful ? (
                  <div className="text-center p-4">
                    <div className="text-green-500 mb-3 text-5xl">✓</div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      QR Code successfully scanned!
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 mt-2 break-all">{qrData}</p>
                    {useQROnly && (
                      <button
                        onClick={closeCameraAndPopup}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Use This Value
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-[280px] h-[280px] relative overflow-hidden rounded-lg border-4 border-gray-300 dark:border-gray-600">
                      {/* QR Scanner Component */}
                      <QRScannerComponent onScan={handleScanResult} />
                      
                      {/* Scanning Guide Overlay */}
                      <div className="absolute inset-0">
                        {/* Corner Markers for Visual Guide */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500"></div>

                        {/* Dynamic Scanning Animation */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>

                        {/* Scanning Status */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="bg-black bg-opacity-70 text-white text-sm px-4 py-1 rounded-full flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span>
                              {cameraStatus === "initializing" ? "Starting camera..." : 
                               cameraStatus === "error" ? "Camera error" :
                               "Scanning..."}
                            </span>
                          </div>
                        </div>
                        
                        {/* Device Position Guide */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center">
                          <div className="bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
                            Hold device 6-8 inches from QR code
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="mt-4 text-gray-600 dark:text-gray-400 text-sm flex items-center">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      Position QR code in the frame to scan
                    </span>

                    {useQROnly && (
                      <button
                        onClick={() => {
                          const mockQrCode = "MOCK-QR-CODE-" + Math.floor(Math.random() * 10000);
                          if (onQRScanned) {
                            onQRScanned(mockQrCode);
                          }
                          closeCameraAndPopup();
                        }}
                        className="mt-4 text-xs text-blue-500 dark:text-blue-400 underline"
                      >
                        Use test QR code (for demo)
                      </button>
                    )}

                    <button
                      onClick={() => useQROnly ? closeCameraAndPopup() : setShowScanner(false)}
                      className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                    >
                      Cancel Scan
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex mt-7 flex-wrap justify-center md:justify-start">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r mb-4">
                    <img
                      src={jobDetails?.companyId?.companyLogo || jobDetails?.companyLogo || insta}
                      alt="Company Logo"
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        console.log("Image failed to load, using fallback");
                        e.target.src = insta;
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>
                  <div className="flex flex-col text-center md:text-left md:ml-4">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                      {jobDetails?.jobTitle || "Loading job..."}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mt-2">
                      {jobDetails?.companyId?.address && (
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                          {jobDetails.companyId.address}
                        </div>
                      )}
                      {jobDetails?.jobLocation && (
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                          {jobDetails.jobLocation}
                        </div>
                      )}
                      {jobDetails?._id && (
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                          ID: {jobDetails._id.slice(-5)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Salary and Timings */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 mt-4 space-y-4 md:space-y-0">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300 dark:bg-orange-500">
                      <img src={salary} alt="Salary Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">
                        Salary
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                        £{jobDetails?.pricePerHour || "--"}/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300 dark:bg-orange-500">
                      <img src={time} alt="Time Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm block">
                        Timings
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 text-sm block">
                        Start: {jobDetails?.startTime || "--"}
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 text-sm block">
                        End: {jobDetails?.endTime || "--"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Display error message if there is one */}
                {error && (
                  <div className="w-full mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
                    <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* QR Code Scanning Buttons */}
                <div className="flex flex-col space-y-4 mt-6 w-full px-4">
                  <div
                    className="flex items-center justify-between border border-dashed rounded-full border-gray-300 dark:border-gray-600 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={openScanner}
                  >
                    {qrData ? (
                      <div className="w-full text-sm text-green-600 dark:text-green-400 text-center">
                        Scanned Data: {qrData}
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Scan QR Code
                        </span>
                        <FaQrcode className="text-gray-400 dark:text-gray-500 text-xl" />
                      </>
                    )}
                  </div>
                </div>

                {/* For demo/testing purposes - bypass QR scanning if camera isn't working */}
                <div className="w-full px-4 mt-4">
                  <button
                    onClick={() => {
                      setQrData("MOCK-QR-CODE-12345");
                      setIsQrValid(true); // Mark the test QR as valid
                      setQrMismatchError(null); // Clear any mismatch errors
                    }}
                    className="text-xs text-blue-500 dark:text-blue-400 underline w-full text-center"
                  >
                    Use test QR code (for demo)
                  </button>
                </div>

                {/* Book On Button */}
                <button
                  onClick={handleBookOnClick}
                  disabled={loading || !isQrValid || qrMismatchError}
                  className={`mt-6 px-6 py-3 w-full md:w-auto ${
                    loading || !isQrValid || qrMismatchError
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-[#FD7F00] hover:bg-orange-600"
                  } text-white rounded-full transition duration-200`}
                >
                  {loading ? "Processing..." : 
                   !isQrValid || qrMismatchError ? "Scan Valid QR Code First" : 
                   "Book On"}
                </button>

                {/* Show QR mismatch error message below the main form */}
                {qrMismatchError && !showScanner && (
                  <div className="w-full mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 dark:text-red-300 text-sm font-medium">QR Code Mismatch</p>
                        <p className="text-red-600 dark:text-red-300 text-xs">{qrMismatchError}</p>
                      </div>
                      <button
                        onClick={openScanner}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Scan Again
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <PopupButton6
          onClose={() => {
            setShowPopup6(false); // Close PopupButton6
          }}
          onClose5={onClose5} // Pass the parent close function to completely close all popups
        />
      )}
    </>
  );
};

export default PopupButton5;  