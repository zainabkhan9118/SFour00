import React, { useRef, useState, useContext, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import companyDefaultLogo from '../../../assets/images/companyDefaultLogo.png'; // Default logo
import PopupButton5 from "./PopupButton5"; // Import PopupButton5
import { ThemeContext } from "../../../context/ThemeContext";
import { getJobDetailsById } from "../../../api/jobApplicationApi";
import axios from "axios";

const PopupButton4 = ({onClose, onClose4, jobId }) => {
  const [showPopup5, setShowPopup5] = useState(false);
  const buttonRef = useRef();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // PIN and job-related states
  const [pin, setPin] = useState(['', '', '', '']);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pinError, setPinError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const currentJobId = jobId || localStorage.getItem("selectedJobId");
        const jobSeekerId = localStorage.getItem("jobSeekerId");

        if (!currentJobId) {
          setError("Job ID not found. Please try again.");
          return;
        }

        if (!jobSeekerId) {
          setError("User ID not found. Please try logging in again.");
          return;
        }

        console.log("Fetching job details for PIN validation...", currentJobId);

        // Try getting job details from the job application API first
        try {
          const response = await getJobDetailsById(jobSeekerId, currentJobId);
          
          if (response && response.data) {
            setJobDetails(response.data);
            console.log("Job details loaded:", response.data);
          } else {
            throw new Error("No job data returned");
          }
        } catch (apiError) {
          console.log("Job application API failed, trying direct job lookup...", apiError);
          
          // Fallback: try getting job details directly
          const BASE_URL = import.meta.env.VITE_BASE_URL;
          try {
            // Get assigned jobs to find the job details
            const assignedResponse = await axios.get(`${BASE_URL}/apply/${jobSeekerId}`, {
              params: { status: "assigned" }
            });

            if (assignedResponse.data?.data && Array.isArray(assignedResponse.data.data)) {
              const foundJob = assignedResponse.data.data.find(job =>
                (job._id === currentJobId) ||
                (job.jobId && typeof job.jobId === 'object' && job.jobId._id === currentJobId) ||
                (typeof job.jobId === 'string' && job.jobId === currentJobId)
              );

              if (foundJob) {
                let jobData;
                if (foundJob.jobId && typeof foundJob.jobId === 'object') {
                  jobData = { ...foundJob.jobId };
                } else {
                  jobData = { ...foundJob };
                }

                setJobDetails(jobData);
                console.log("Job details loaded from assigned jobs:", jobData);
              } else {
                throw new Error("Job not found in assigned jobs");
              }
            } else {
              throw new Error("Could not fetch assigned jobs");
            }
          } catch (fallbackError) {
            console.error("Both job detail fetch methods failed:", fallbackError);
            setError("Failed to load job information. Please try again.");
          }
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Could not load job information.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
    }
  };

  // Handle PIN input changes
  const handlePinChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setPinError(null); // Clear error when user types

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[data-pin-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-pin-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // Validate PIN and proceed
  const handleAccept = async () => {
    const enteredPin = pin.join('');
    
    if (enteredPin.length !== 4) {
      setPinError("Please enter all 4 digits of the PIN");
      return;
    }

    if (!jobDetails || !jobDetails.jobPin) {
      setPinError("Job PIN not available. Please try again.");
      return;
    }

    setIsValidating(true);
    setPinError(null);

    try {
      // Convert both to strings for comparison to handle different data types
      const jobPin = String(jobDetails.jobPin);
      const userPin = String(enteredPin);

      console.log("Validating PIN:", { userPin, jobPin, match: userPin === jobPin });

      if (userPin === jobPin) {
        // PIN is correct, proceed to next popup
        console.log("PIN validation successful!");
        setTimeout(() => {
          setShowPopup5(true);
        }, 100);
      } else {
        setPinError("Incorrect PIN. Please check and try again.");
        setPin(['', '', '', '']); // Clear the PIN inputs
        // Focus first input
        const firstInput = document.querySelector(`input[data-pin-index="0"]`);
        if (firstInput) firstInput.focus();
      }
    } catch (err) {
      console.error("Error validating PIN:", err);
      setPinError("An error occurred while validating PIN. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <>
      {!showPopup5 ? (
        <div
          ref={buttonRef}
          onClick={closeModel}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={onClose4}
                className="text-gray-500 dark:text-gray-300 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black mb-4">
              <img
                src={jobDetails?.companyId?. companyLogo || companyDefaultLogo}
                alt="Apple Logo"
                className="w-20 h-20"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-200">
              {jobDetails?.jobTitle || "Loading..."}
            </h2>
            {/* <p className="text-gray-500 dark:text-gray-400 text-center font-medium mt-1 text-base">
              {jobDetails?.companyId?.companyName || jobDetails?.companyName || "Company"}
            </p> */}

            {/* Message */}
            <p className="text-gray-500 dark:text-gray-400 text-center mt-4 text-sm">
              Enter your job pin to continue
            </p>

            {/* Show loading state */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">Loading job details...</span>
              </div>
            )}

            {/* Show error state */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3 my-4">
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* PIN Input - only show when not loading and no error */}
            {!loading && !error && (
              <>
                <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Enter Pin</h1>
                
                {/* PIN Error Message */}
                {pinError && (
                  <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-2 my-2">
                    <p className="text-red-600 dark:text-red-300 text-sm">{pinError}</p>
                  </div>
                )}

                <div className="flex justify-center space-x-2 mt-4">
                  {Array(4)
                    .fill("")
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={pin[index]}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        data-pin-index={index}
                        className={`w-14 h-14 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 dark:text-gray-200 ${
                          pinError ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="•"
                      />
                    ))}
                </div>

                {/* Show expected PIN for debugging */}
                {jobDetails?.jobPin && (
                  <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                    Expected PIN is {jobDetails.jobPin}
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleAccept}
                  disabled={isValidating || loading}
                  className={`mt-6 px-6 py-2 w-full md:w-[140px] h-12 text-white rounded-full transition duration-200 ${
                    isValidating || loading
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-[#FD7F00] hover:bg-orange-600"
                  }`}
                >
                  {isValidating ? "Validating..." : "Continue"}
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <PopupButton5 
          onClose={() => setShowPopup5(false)} 
          onClose5={onClose4}
          jobId={jobId}
        />
      )}
    </>
  );
};

export default PopupButton4;
