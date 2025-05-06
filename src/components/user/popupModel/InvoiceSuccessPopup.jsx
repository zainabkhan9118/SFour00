import React, { useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
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

  const handleViewInvoice = () => {
    // Navigate to invoice detail page if available, or work history
    navigate('/User-workInprogess');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Booking Successful!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your job has been successfully booked and an invoice has been generated.</p>
          
          {invoiceDetails && (
            <div className="w-full p-4 mb-5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Date:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{invoiceDetails.workDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Hours:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{invoiceDetails.totalHours}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Rate:</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">${invoiceDetails.pricePerHour}/hr</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-800 dark:text-gray-200">Total:</span>
                <span className="text-gray-800 dark:text-gray-200">${invoiceDetails.totalPrice}</span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-4 w-full">
            <button
              onClick={handleClose}
              className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-full transition"
            >
              Close
            </button>
            <button
              onClick={handleViewInvoice}
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