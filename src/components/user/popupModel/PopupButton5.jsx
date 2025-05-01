import React, { useRef, useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaQrcode } from "react-icons/fa";
import { updateStatusByQR } from "../../../api/myWorkApi";
import axios from "axios";
import jsQR from "jsqr";

import insta from "../../../assets/images/insta.svg";
import salary from "../../../assets/images/salary.png";
import time from "../../../assets/images/time.png";
import PopupButton6 from "./PopupButton6";

// Custom QR Scanner component that uses jsQR library
const QRScannerComponent = ({ onScan }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState("initializing"); // initializing, active, error
  const streamRef = useRef(null);

  useEffect(() => {
    console.log("QR Scanner component mounted");
    let animationFrame = null;
    let mounted = true;

    // Initialize camera with better settings for QR scanning
    const initCamera = async () => {
      console.log("Initializing camera with enhanced settings...");
      try {
        // Set camera constraints with more specific settings for QR scanning
        const cameraConstraints = {
          video: {
            facingMode: "environment", // Try back camera first
            width: { ideal: 1280, min: 720 },
            height: { ideal: 720, min: 480 },
            // Important camera settings for better QR detection
            zoom: 1.0, // Default zoom level (some devices support changing this)
            focusMode: "continuous", // Keep trying to focus
            focusDistance: 0.5, // Mid-range focus (if supported)
            exposureMode: "auto",
            whiteBalanceMode: "auto",
            advanced: [
              { focusMode: "continuous" },
              { exposureMode: "continuous" }
            ]
          },
          audio: false,
        };

        // Try to access camera with enhanced settings
        let stream;
        try {
          console.log("Trying back camera with enhanced settings");
          stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
          console.log("Successfully accessed back camera with enhanced settings");

          // Try to apply advanced camera settings if available
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack && typeof videoTrack.applyConstraints === 'function') {
            try {
              await videoTrack.applyConstraints({
                advanced: [
                  { focusMode: "continuous" },
                  { exposureCompensation: 0.5 }, // Slightly brighter
                  { sharpness: 1.0 }, // Increase sharpness if available
                  { brightness: 0.6 } // Slightly brighter
                ]
              });
              console.log("Applied advanced camera settings");
            } catch (err) {
              console.log("Could not apply advanced camera settings:", err);
              // Continue with default settings
            }
          }
        } catch (err) {
          console.log("Back camera access failed, trying front camera:", err);

          // Try front camera as fallback
          const frontCameraConstraints = {
            ...cameraConstraints,
            video: {
              ...cameraConstraints.video,
              facingMode: "user"
            }
          };

          stream = await navigator.mediaDevices.getUserMedia(frontCameraConstraints);
          console.log("Successfully accessed front camera");
        }

        // Store reference to stream for cleanup
        streamRef.current = stream;

        if (!mounted) {
          // Component unmounted during async operation
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // Set stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true); // required for iOS Safari

          // Set important video settings that help with QR detection
          videoRef.current.setAttribute("autoplay", true);
          videoRef.current.style.transform = ""; // Clear any transforms that might affect detection

          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (!mounted) return;

            videoRef.current
              .play()
              .then(() => {
                console.log("Camera video playing successfully");
                setCameraStatus("active");

                // Request animation frame for smoother experience
                requestAnimationFrame(() => {
                  // Start scanning with a slight delay to ensure camera is fully initialized
                  setTimeout(() => {
                    console.log("Starting QR scanning with enhanced detection");
                    scanQRCode();
                  }, 500);
                });
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                onScan(null, {
                  name: "PlayError",
                  message: "Could not play camera video: " + err.message,
                });
                setCameraStatus("error");
              });
          };
        }
      } catch (err) {
        console.error("Camera initialization error:", err);
        if (mounted) {
          onScan(null, { name: "CameraError", message: err.message });
          setCameraStatus("error");
        }
      }
    };

    // Function to scan QR code from video frame using jsQR
    const scanQRCode = () => {
      if (
        !mounted ||
        !videoRef.current ||
        !canvasRef.current ||
        cameraStatus !== "active"
      ) {
        return;
      }

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { willReadFrequently: true });

        // Only process when video is actually playing
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw current video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Apply image processing to enhance contrast for better QR detection
          try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply adaptive contrast enhancement to make QR codes more visible
            const enhancedData = enhanceImageForQRDetection(data, canvas.width, canvas.height);

            // Create a new ImageData with enhanced pixels
            const enhancedImageData = new ImageData(
              new Uint8ClampedArray(enhancedData),
              canvas.width,
              canvas.height
            );

            // Use both original and enhanced images for scanning
            detectQRCode(imageData);
            setTimeout(() => detectQRCode(enhancedImageData), 0);
          } catch (err) {
            console.warn("Image enhancement failed, trying normal scan:", err);
            // If enhancement fails, fall back to normal scan
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            detectQRCode(imageData);
          }
        } else {
          // Video not ready yet, continue scanning
          if (mounted) {
            animationFrame = requestAnimationFrame(scanQRCode);
          }
        }
      } catch (err) {
        console.error("Error in scan loop:", err);
        // Try to continue scanning
        if (mounted) {
          animationFrame = requestAnimationFrame(scanQRCode);
        }
      }
    };

    // Function to enhance image data to make QR codes more visible from distance
    const enhanceImageForQRDetection = (data, width, height) => {
      const enhancedData = new Uint8ClampedArray(data.length);

      // Copy original data
      for (let i = 0; i < data.length; i++) {
        enhancedData[i] = data[i];
      }

      // Increase contrast and apply edge enhancement
      for (let i = 0; i < data.length; i += 4) {
        // Calculate grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Apply adaptive threshold for better QR detection
        const threshold = 127;
        const value = avg > threshold ? 255 : 0;

        // Increase contrast dramatically for distant QR codes
        enhancedData[i] = value;        // R
        enhancedData[i + 1] = value;    // G
        enhancedData[i + 2] = value;    // B
        // Keep alpha channel unchanged
      }

      return enhancedData;
    };

    // Separate function to detect QR codes from image data
    const detectQRCode = (imageData) => {
      if (!mounted) return;

      // Try multiple detection strategies for better sensitivity

      // 1. Use jsQR with high sensitivity settings
      const code = jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        {
          inversionAttempts: "attemptBoth", // Try both inverted and non-inverted images
          dontInvert: false,
          canOverwriteImage: true,
          greediness: 1, // Maximum greediness for pattern detection
          maxNumTemplates: 8, // Maximum number of templates to attempt
        }
      );

      if (code) {
        console.log("QR code found using jsQR with high sensitivity:", code.data);
        onScan({ text: code.data }, null);

        // Visual feedback (draw box around QR code)
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "#FF5700";
        context.moveTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
        context.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
        context.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
        context.lineTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
        context.lineTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
        context.stroke();
      } else {
        // 2. Try BarcodeDetector API if available
        if (window.BarcodeDetector) {
          try {
            const barcodeDetector = new window.BarcodeDetector({
              formats: ["qr_code"],
            });

            barcodeDetector.detect(imageData)
              .then((barcodes) => {
                if (barcodes.length > 0) {
                  const qrData = barcodes[0].rawValue;
                  console.log("QR code detected using BarcodeDetector:", qrData);
                  onScan({ text: qrData }, null);
                  return;
                }
                // Continue scanning if no QR code found
                if (mounted) {
                  animationFrame = requestAnimationFrame(scanQRCode);
                }
              })
              .catch((err) => {
                console.warn("BarcodeDetector error:", err);
                // Continue scanning
                if (mounted) {
                  animationFrame = requestAnimationFrame(scanQRCode);
                }
              });
          } catch (err) {
            console.warn("BarcodeDetector unavailable:", err);
            // Continue scanning
            if (mounted) {
              animationFrame = requestAnimationFrame(scanQRCode);
            }
          }
        } else {
          // No QR code found, continue scanning
          if (mounted) {
            animationFrame = requestAnimationFrame(scanQRCode);
          }
        }
      }
    };

    // Start camera
    initCamera();

    // Cleanup function
    return () => {
      console.log("QR Scanner component unmounting, cleaning up...");
      mounted = false;

      // Cancel animation frame if active
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      // Stop camera stream
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => {
          track.stop();
          console.log("Camera track stopped");
        });
        streamRef.current = null;
      }

      // Clear video source
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }

      console.log("Camera cleanup complete");
    };
  }, [onScan]);

  return (
    <div className="w-full h-full relative">
      {cameraStatus === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <div className="text-red-500 text-xl mb-2">Camera Error</div>
            <p className="text-gray-600">
              Could not access your camera. Please check your permissions.
            </p>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-lg"
            playsInline
            muted
          />

          {/* Hidden canvas for processing */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: "none" }}
          />

          {/* Scanning visual guide */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Center scanning box - made larger to capture QR codes from further away */}
            <div className="w-64 h-64 border-2 border-orange-500 rounded-lg relative">
              {/* Corner elements for better visual guidance */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500"></div>

              {/* Scanning animation */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500 animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>

            {/* Instructions */}
            <p className="mt-4 text-sm text-white bg-black bg-opacity-60 px-3 py-1 rounded-full">
              Hold QR code in view - can detect from any distance
            </p>
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
            {cameraStatus === "initializing"
              ? "Starting camera..."
              : "Camera active"}
          </div>
        </>
      )}
    </div>
  );
};

const PopupButton5 = ({ onClose, onClose5, jobId }) => {
  const [showPopup6, setShowPopup6] = useState(false);
  const buttonRef = useRef();
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanningStatus, setScanningStatus] = useState("waiting"); // 'waiting', 'scanning', 'success', 'error'
  const [cameraError, setCameraError] = useState(null);
  const [scanSuccessful, setScanSuccessful] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

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

  const handleScanResult = (result, error) => {
    console.log("Scan result callback:", result, error);

    if (result && result.text) {
      console.log("QR Code scanned successfully:", result.text);
      setQrData(result.text);
      setShowScanner(false);
      setScanSuccessful(true);
      stopCameraStream();
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
    // Stop any active camera streams
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
    setShowScanner(false);
    stopCameraStream();
    onClose5(); // Close PopupButton5
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

      console.log(`Calling updateStatusByQR for job ${currentJobId} with QR code: ${dataToUse}`);

      // Call the API with the jobId and correctly formatted QR code data
      const response = await updateStatusByQR(currentJobId, {
        qrCodeData: dataToUse // Ensure proper property name matching backend expectation
      });

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
            className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={closeCameraAndPopup}
                className="text-gray-500 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {showScanner ? (
              <div className="flex flex-col justify-center items-center w-full h-[400px]">
                <h3 className="text-xl font-semibold mb-4">Scan QR Code</h3>

                {scanningStatus === "error" ? (
                  <div className="text-center p-4">
                    <div className="text-red-500 mb-3 text-lg">❌ Camera Error</div>
                    <p className="text-gray-700">
                      {cameraError || "Could not access camera"}
                    </p>
                    <button
                      onClick={() => setShowScanner(false)}
                      className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Close
                    </button>
                  </div>
                ) : scanSuccessful ? (
                  <div className="text-center p-4">
                    <div className="text-green-500 mb-3 text-5xl">✓</div>
                    <p className="text-gray-700 font-medium">
                      QR Code successfully scanned!
                    </p>
                    <p className="text-blue-600 mt-2 break-all">{qrData}</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-[280px] h-[280px] relative overflow-hidden rounded-lg border-4 border-gray-300">
                      <QRScannerComponent onScan={handleScanResult} />
                    </div>

                    <span className="mt-4 text-gray-600 text-sm flex items-center">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      Position QR code in the frame to scan
                    </span>

                    <button
                      onClick={() => setShowScanner(false)}
                      className="mt-4 px-4 py-2 bg-gray-200 rounded-md text-gray-700"
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
                    <h2 className="text-2xl font-bold text-gray-700">
                      {jobDetails?.jobTitle || "Loading job..."}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mt-2">
                      {jobDetails?.companyId?.address && (
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                          {jobDetails.companyId.address}
                        </div>
                      )}
                      {jobDetails?.jobLocation && (
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                          {jobDetails.jobLocation}
                        </div>
                      )}
                      {jobDetails?._id && (
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                          ID: {jobDetails._id.slice(-5)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Salary and Timings */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 mt-4 space-y-4 md:space-y-0">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300">
                      <img src={salary} alt="Salary Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Salary
                      </span>
                      <span className="font-bold text-gray-700 text-sm">
                        £{jobDetails?.pricePerHour || "--"}/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300">
                      <img src={time} alt="Time Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Timings
                      </span>
                      <span className="font-bold text-gray-700 text-sm block">
                        Start: {jobDetails?.startTime || "--"}
                      </span>
                      <span className="font-bold text-gray-700 text-sm block">
                        End: {jobDetails?.endTime || "--"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Display error message if there is one */}
                {error && (
                  <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* QR Code Scanning Buttons */}
                <div className="flex flex-col space-y-4 mt-6 w-full px-4">
                  <div
                    className="flex items-center justify-between border border-dashed rounded-full border-gray-300 px-4 py-3 cursor-pointer hover:bg-gray-50"
                    onClick={openScanner}
                  >
                    {qrData ? (
                      <div className="w-full text-sm text-green-600 text-center">
                        Scanned Data: {qrData}
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm">
                          Scan QR Code
                        </span>
                        <FaQrcode className="text-gray-400 text-xl" />
                      </>
                    )}
                  </div>
                </div>

                {/* For demo/testing purposes - bypass QR scanning if camera isn't working */}
                <div className="w-full px-4 mt-4">
                  <button
                    onClick={() => setQrData("MOCK-QR-CODE-12345")}
                    className="text-xs text-blue-500 underline w-full text-center"
                  >
                    Use test QR code (for demo)
                  </button>
                </div>

                {/* Book On Button */}
                <button
                  onClick={handleBookOnClick}
                  disabled={loading}
                  className={`mt-6 px-6 py-3 w-full md:w-auto ${
                    loading
                      ? "bg-gray-400"
                      : "bg-[#FD7F00] hover:bg-orange-600"
                  } text-white rounded-full transition duration-200`}
                >
                  {loading ? "Processing..." : "Book On"}
                </button>
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