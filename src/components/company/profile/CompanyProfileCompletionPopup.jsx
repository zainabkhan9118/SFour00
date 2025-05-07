import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContext';

const CompanyProfileCompletionPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCompleteProfile = () => {
    navigate('/company-profile');
    if (onClose) onClose();
  };

  // Create the modal content
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn">
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4">Complete Your Company Profile</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You need to complete your company profile before accessing this feature. 
              A complete profile helps job seekers understand your company better and 
              increases the likelihood of receiving quality applications.
            </p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex space-x-3">
          <button
            type="button"
            className="inline-flex justify-center w-1/2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
            onClick={onClose}
          >
            Later
          </button>
          <button
            type="button"
            className="inline-flex justify-center w-1/2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-gray-800"
            onClick={handleCompleteProfile}
          >
            Complete Now
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal directly to the body
  return createPortal(modalContent, document.body);
};

export default CompanyProfileCompletionPopup;