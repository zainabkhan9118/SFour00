import React, { useRef, useState, useContext } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import PopupButton3 from "./PopupButton3";
import { ThemeContext } from "../../../context/ThemeContext";

const PopupButton2 = ({ onClose, onClose2, jobId }) => {
  const [showPopup3, setShowPopup3] = useState(false);
  const buttonRef = useRef();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose(); // Close the popup when clicking outside
    }
  };

  const handleOkay = () => {
    // Close Popup 2 and show Popup 3
    onClose(); // Close Popup 2
    setTimeout(() => {
      setShowPopup3(true); // Show Popup 3 after closing Popup 2
    }, 100);
  };

  return (
    <>
      {!showPopup3 ? (
        <div
          ref={buttonRef}
          onClick={closeModel}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] md:h-auto lg:w-[561px] lg:h-[333px] relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={onClose2}
                className="text-gray-500 dark:text-gray-300 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              Alert!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] h-auto text-base">
              You are required to share your location with the company at least
              1 hour before starting the job.
            </p>

            {/* Okay Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleOkay}
                className="px-6 py-2 w-full md:w-[140px] h-12 md:h-[40px] bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Render PopupButton3 when showPopup3 is true
        <PopupButton3
          onClose={() => setShowPopup3(false)} // Close Popup 3
          jobId={jobId} // Pass jobId to PopupButton3
        />
      )}
    </>
  );
};

export default PopupButton2;