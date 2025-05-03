import React, { useRef, useState, useContext } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCheckCircle, FaQrcode } from "react-icons/fa";
import { QrReader } from "@blackbox-vision/react-qr-reader";
import { ThemeContext } from "../../../../context/ThemeContext";

const PopupInprogess = ({ onClose }) => {
  const buttonRef = useRef();
  const [showScanner, setShowScanner] = useState(null); // State to control QR scanner visibility and identify which QR is being scanned
  const [qrData, setQrData] = useState({
    pointA: null,
    pointB: null,
    pointC: null,
  }); // State to store scanned QR data for each point
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
    }
  };

  const handleScanResult = (result, error) => {
    if (!!result && result?.text) {
        console.log(`Scanned QR Code for ${showScanner}:`, result?.text);
        setQrData((prev) => ({
            ...prev,
            [showScanner]: result?.text, 
        }));
        stopCamera();
        setShowScanner(null); // Close the scanner UI
    } else if (!!error) {
        console.warn("QR Scan Error:", error);
    } else {
        console.log("No valid QR code detected yet.");
    }
  };

  const stopCamera = () => {
      // Stop the camera stream if it's active
      const videoElement = document.querySelector("video");
      if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // Stop all tracks
          videoElement.srcObject = null; // Clear the video source
      }
  };

  const closeScanner = () => {
      stopCamera(); // Ensure camera stops when scanner closes
      setShowScanner(null); // Properly set the scanner state to null
  };

  return (
    <div
      ref={buttonRef}
      onClick={closeModel}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full h-screen"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <div className="w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 absolute top-[-20px] right-[-3px] flex items-center justify-center">
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 focus:outline-none"
          >
            <IoCloseCircleOutline className="text-4xl text-orange-400" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-800 dark:text-gray-200">
          Security Alert!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center font-medium mt-1 text-base">
          Enter Job PIN
        </p>

        {/* PIN Input */}
        <div className="flex justify-center space-x-2 mt-4">
          {Array(4)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-14 h-14 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 dark:text-gray-200"
              />
            ))}
        </div>

        {/* QR Code Scanning Section */}
        <div className="mt-6 w-full">
          {/* QR Code A */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Scan point A QR Code:</span>
            {qrData.pointA ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                onClick={() => {
                  console.log("QR Code A clicked");
                  setShowScanner("pointA"); // Open scanner for point A
                }}
              />
            )}
          </div>

          {/* QR Code B */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Scan point B QR Code:</span>
            {qrData.pointB ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                onClick={() => {
                  console.log("QR Code B clicked");
                  setShowScanner("pointB"); // Open scanner for point B
                }}
              />
            )}
          </div>

          {/* QR Code C */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Scan point C QR Code:</span>
            {qrData.pointC ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                onClick={() => {
                  console.log("QR Code C clicked");
                  setShowScanner("pointC"); // Open scanner for point C
                }}
              />
            )}
          </div>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="fixed inset-0 bg-black w-full h-screen bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-[90%] max-w-[500px] h-auto md:h-[435px] flex flex-col items-center relative">
              <QrReader
               key={showScanner}
                constraints={{ facingMode: "environment" }}
                onResult={handleScanResult}
                containerStyle={{ width: "400px", height: "400px" }}
                videoStyle={{ width: "100%" }}
              />
              {/* Close Button */}
              <div
                className="absolute top-[-20px] right-[-20px] sm:top-[-15px] sm:right-[-15px] md:top-[-20px] md:right-[-20px] lg:top-[-20px] lg:right-[-20px] w-12 h-12 rounded-full bg-[#E7F0FA] dark:bg-gray-700 flex items-center justify-center"
              >
                <button
                  onClick={closeScanner}
                  className="text-gray-500 dark:text-gray-300 focus:outline-none"
                >
                  <IoCloseCircleOutline className="text-4xl text-orange-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
        onClick={onClose}
          className="mt-6 px-6 py-2 w-full md:w-[140px] h-12 bg-[#1F2B44] text-white rounded-full hover:bg-gray-900 transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PopupInprogess;