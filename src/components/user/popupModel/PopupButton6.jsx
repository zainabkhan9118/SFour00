import React, { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PopupButton6 = ({ onClose, onClose5 }) => {
  const navigate = useNavigate();
  const buttonRef = useRef();

  // Close all popups and navigate to work assigned page
  const handleOkayClick = () => {
    if (onClose5) {
      // First close parent popup (PopupButton5) if the prop exists
      onClose5();
    }
    
    // Then close this popup
    onClose();
    
    // Finally navigate to the work assigned page
    navigate("/User-MyWorkAssignedPage");
  };

  // Close just this popup
  const closeThisPopup = () => {
    onClose();
  };

  // Close when clicking backdrop
  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      closeThisPopup();
    }
  };

  return (
    <div
      ref={buttonRef}
      onClick={closeModel}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
    >
      <div
        className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] lg:h-[400px] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
          <button
            onClick={closeThisPopup}
            className="text-gray-500 focus:outline-none"
          >
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Scanned Successfully!
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] text-lg">
          You are now booked for a job!
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6 w-full">
          <button
            onClick={handleOkayClick} 
            className="px-6 py-2 w-full md:w-[140px] h-12 bg-[#1F2B44] text-white rounded-full"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupButton6;