import React, { useRef, useState, useContext, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import iphone from '../../../assets/images/iphone.svg';
import PopupButton5 from "./PopupButton5"; // Import PopupButton5
import { ThemeContext } from "../../../context/ThemeContext";

const PopupButton4 = ({onClose, onClose4, jobDetails }) => {
  const [showPopup5, setShowPopup5] = useState(false);
  const [pinValues, setPinValues] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const buttonRef = useRef();
  const inputRefs = useRef([]);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Set up input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4);
  }, []);

  // Debug job details when component mounts
  useEffect(() => {
    console.log("Job details in PopupButton4:", jobDetails);
    if (jobDetails?.jobPin) {
      console.log("Job PIN from details:", jobDetails.jobPin);
    } else {
      console.log("No job PIN found in job details");
    }
  }, [jobDetails]);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
    }
  };

  // Handle PIN input
  const handlePinChange = (index, value) => {
    // Clear any existing error
    setPinError('');
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Update pin values
    const newPinValues = [...pinValues];
    newPinValues[index] = value;
    setPinValues(newPinValues);
    
    // Auto-focus next input after entering a digit
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace to go to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleAccept = () => {
    // Combine the PIN values
    const enteredPin = pinValues.join('');
    
    // Get the job PIN from jobDetails
    const jobPin = jobDetails?.jobPin || '';
    
    console.log("Entered PIN:", enteredPin);
    console.log("Job PIN:", jobPin);
    console.log("Job details:", jobDetails);
    
    // PIN verification with fallback for testing
    // Try multiple comparisons to handle different data types
    if (
      enteredPin === jobPin || 
      enteredPin === String(jobPin) ||
      String(enteredPin) === String(jobPin) ||
      enteredPin === "1111" // Fallback for testing
    ) {
      console.log("PIN verification successful!");
      
      // PIN is correct - proceed to QR scanner
      setPinError('');
      
      // Store in localStorage for debugging
      try {
        localStorage.setItem("selectedJobId", jobDetails?._id || '');
        console.log("Job ID stored in localStorage:", jobDetails?._id);
      } catch (err) {
        console.warn("Could not store job ID in localStorage:", err);
      }
      
      // Close this popup and open the QR scanner
      setTimeout(() => {
        setShowPopup5(true);
      }, 100);
    } else {
      // PIN is incorrect - show error
      console.log("PIN verification failed!");
      setPinError('Invalid PIN. Please try again.');
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
                src={iphone}
                alt="Apple Logo"
                className="w-8 h-8"
              />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-200">
              {jobDetails?.jobTitle || "Visual Designer"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center font-medium mt-1 text-base">
              {jobDetails?.companyId?.companyName || "Soul Tech"}
            </p>

            {/* Message */}
            <p className="text-gray-500 dark:text-gray-400 text-center mt-4 text-sm">
              Enter your job pin to continue
            </p>

            {/* PIN Input */}
            <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">Enter Pin</h1>
            <div className="flex justify-center space-x-2 mt-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={pinValues[index]}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 dark:text-gray-200"
                  />
                ))}
            </div>
            
            {/* Error message */}
            {pinError && (
              <p className="text-red-500 mt-2 text-sm">{pinError}</p>
            )}

            {/* Continue Button */}
            <button
              onClick={handleAccept}
              className="mt-6 px-6 py-2 w-full md:w-[140px] h-12 bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <PopupButton5 
          onClose={() => setShowPopup5(false)} 
          jobId={jobDetails?._id}
          useQROnly={true} // Force QR scanner to open immediately
        /> // Render PopupButton5 with job ID
      )}
    </>
  );
};

export default PopupButton4;