import React, { useRef, useState } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import PopupButton2 from './PopupButton2';

const PopupButton1 = ({ onClose, onClose1 }) => {
  const [showPopup2, setShowPopup2] = useState(false);
  const buttonRef = useRef();

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose1(); // Close the popup when clicking outside
    }
  };

  const handleAccept = () => {
    onClose(); // Close Popup 1
    setTimeout(() => {
      setShowPopup2(true); // Show Popup 2
    }, 100);
  };

  return (
    <>
      {!showPopup2 && (
        <div
          ref={buttonRef}
          onClick={closeModel}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        >
          <div
            className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] md:h-auto lg:w-[561px] lg:h-[333px] relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={onClose}
                className="text-gray-500 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Alert!
            </h2>

            {/* Message */}
            <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[400px] lg:w-[421px] h-auto text-lg">
              Are you sure you want to accept this job?
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-6 w-full">
              <button
                onClick={onClose1}
                className="px-6 py-2 w-full md:w-[140px] h-12 md:h-[48px] bg-[#E7F0FA] text-[#FD7F00] rounded-full hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 w-full md:w-[140px] h-12 md:h-[48px] bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup2 && (
        <PopupButton2
          onClose={() => setShowPopup2(false)}
          onNext={() => {
            setShowPopup2(false);
          }}
        />
      )}
    </>
  );
};

export default PopupButton1;