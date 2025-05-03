import React, { useContext } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaExclamationTriangle } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

const AlreadyAssignedPopup = ({ message, onClose }) => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-[90%] relative">
        {/* Close Button */}
        <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 focus:outline-none"
          >
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center pt-6">
          <FaExclamationTriangle className="text-5xl text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Job Already Assigned</h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {message || "This job has already been assigned to another job seeker."}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyAssignedPopup;