import React, { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import iphone from '../../../assets/images/iphone.svg';
import PopupButton5 from "./PopupButton5"; // Import PopupButton5

const PopupButton4 = ({onClose, onClose4 }) => {
  const [showPopup5, setShowPopup5] = useState(false);
  const buttonRef = useRef();

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
    }
  };

  const handleAccept = () => {
    onClose(); // Close Popup 1
    setTimeout(() => {
      setShowPopup5(true); // Show Popup 2
    }, 100);
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
            className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={onClose4}
                className="text-gray-500 focus:outline-none"
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
            <h2 className="text-2xl font-extrabold text-center text-gray-800">
              Visual Designer
            </h2>
            <p className="text-gray-500 text-center font-medium mt-1 text-base">Soul Tech</p>

            {/* Message */}
            <p className="text-gray-500 text-center mt-4 text-sm">
              Enter your job pin to continue
            </p>

            {/* PIN Input */}
            <h1 className="font-bold text-xl text-gray-900">Enter Pin</h1>
            <div className="flex justify-center space-x-2 mt-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-14 h-14 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleAccept} // Show PopupButton5 on click
              className="mt-6 px-6 py-2 w-full md:w-[140px] h-12 bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <PopupButton5 onClose={() => setShowPopup5(false)} /> // Render PopupButton5
      )}
    </>
  );
};

export default PopupButton4;