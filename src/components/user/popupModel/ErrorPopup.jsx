import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { ThemeContext } from '../../../context/ThemeContext';

const ErrorPopup = ({ message, onClose }) => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // Determine if the message is actually a success message
  const isActuallySuccess = message && 
    (message.toLowerCase().includes('success') || 
     message.toLowerCase().includes('created') ||
     message.toLowerCase().includes('completed'));

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
  };

  // Create the modal content
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          {isActuallySuccess ? (
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <FiCheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
              <FiXCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>
          )}
          
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {isActuallySuccess ? "Success" : "Error"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message || "An error occurred. Please try again."}</p>
          
          <button
            onClick={handleClose}
            className={`w-full py-3 ${isActuallySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'} text-white font-medium rounded-full transition`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal directly to the body
  return createPortal(modalContent, document.body);
};

export default ErrorPopup;