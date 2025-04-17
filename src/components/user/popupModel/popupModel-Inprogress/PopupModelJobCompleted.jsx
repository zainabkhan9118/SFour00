import React, { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const PopupModelJobCompleted = ({ onClose }) => {
  const buttonRef = useRef();
  const [rating, setRating] = useState(0);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
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
            onClick={onClose}
            className="text-gray-500 focus:outline-none"
          >
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Job Completed!
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-center mt-2 text-lg">
          Invoice sent to company
        </p>

        {/* Rating Section */}
        <div className="mt-6">
          <p className="text-gray-700 font-medium text-center mb-2">
            Rate Company
          </p>
          <div className="flex justify-center space-x-2">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-3xl cursor-pointer ${
                    index < rating ? "text-orange-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="mt-6 px-6 py-2 w-full md:w-[140px] h-12 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition duration-200"
          onClick={onClose}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PopupModelJobCompleted;