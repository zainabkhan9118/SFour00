import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import { ThemeContext } from '../../../context/ThemeContext';

const ProfileErrorPopup = ({ message, redirectPath, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleContinue = () => {
    if (onClose) {
      onClose();
    } else if (redirectPath) {
      navigate(redirectPath);
    }
  };

  // Create the modal content
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <FiXCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Error</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message || "An error occurred. Please try again."}</p>
          
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal directly to the body
  return createPortal(modalContent, document.body);
};

export default ProfileErrorPopup;