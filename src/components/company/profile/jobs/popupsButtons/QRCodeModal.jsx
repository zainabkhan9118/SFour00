import React, { useContext } from 'react';
import qrcode from '../../../../../assets/images/qr-code.png';
import { ThemeContext } from "../../../../../context/ThemeContext";

const QRCodeModal = ({ onClose, jobId, jobPin, jobTitle }) => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">QR Code for Job</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <img src={qrcode} alt="QR Code" className="w-64 h-64 mb-6" />
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{jobTitle || "Job"}</h3>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Job PIN</p>
              <p className="text-gray-800 dark:text-gray-200 font-mono text-xl tracking-wider">{jobPin || "******"}</p>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              The worker will need to scan this QR code and enter the PIN to confirm job completion.
            </p>
            
            <button 
              onClick={onClose} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
