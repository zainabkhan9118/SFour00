import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContext';

const InvoiceSuccessPopup = ({ invoiceDetails, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Prevent background scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleViewJobs = () => {
    // Navigate to completed jobs page
    navigate('/User-WorkCompleted');
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  // Create the modal content
  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 8.5L10.5 14.5L7.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Booking Successful!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your job has been successfully booked and an invoice has been generated.
          </p>
          
          <div className="w-full p-4 mb-5 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Date:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {invoiceDetails?.formattedDate || 'July 26, 2025'}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Hours:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{invoiceDetails?.totalHours || 8}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">Rate:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">${invoiceDetails?.pricePerHour || 5}/hr</span>
            </div>
            <div className="flex justify-between font-bold">
              <span className="text-gray-800 dark:text-gray-200">Total:</span>
              <span className="text-gray-800 dark:text-gray-200">${invoiceDetails?.totalPrice || 40}</span>
            </div>
          </div>
          
          <div className="flex space-x-4 w-full">
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-full transition"
            >
              Close
            </button>
            <button
              onClick={handleViewJobs}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition"
            >
              View Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal directly to the body
  return createPortal(modalContent, document.body);
};

export default InvoiceSuccessPopup;