import React, { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaQrcode } from "react-icons/fa";
import { QrReader } from "@blackbox-vision/react-qr-reader";

import insta from "../../../assets/images/insta.svg";
import salary from "../../../assets/images/salary.png";
import time from "../../../assets/images/time.png";
import PopupButton6 from "./PopupButton6"; // Import PopupButton6

const PopupButton5 = ({ onClose, onClose5 }) => {
  const [showPopup6, setShowPopup6] = useState(false); // State to control PopupButton6 visibility
  const buttonRef = useRef();
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState(null);

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      closeCameraAndPopup();
    }
  };

  const handleScanResult = (result, error) => {
    if (!!result) {
      console.log("Scanned QR Code:", result?.text);
      setQrData(result?.text);
      setShowScanner(false);
      stopCamera();
  
      // Add a short delay before stopping the camera
      setTimeout(() => {
        const videoElement = document.querySelector("video");
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject;
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          videoElement.srcObject = null;
        }
      }, 500); // Wait 500ms before stopping camera
    }
  
    if (!!error) {
      console.warn("QR Scan Error:", error);
    }
  };
  

  const closeCameraAndPopup = () => {
    setShowScanner(false);

    // Stop the camera stream if it's active
    const videoElement = document.querySelector("video");
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Stop all tracks
      videoElement.srcObject = null; // Clear the video source
    }

    onClose5(); // Close PopupButton5
  };

  const handleBookOnClick = () => {
    if (qrData) {
      onClose(); // Transition to PopupButton6
    }
  };

  return (
    <>
      {!showPopup6 ? (
        <div
          ref={buttonRef}
          onClick={closeModel}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        >
          <div
            className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px] flex items-center justify-center">
              <button
                onClick={closeCameraAndPopup}
                className="text-gray-500 focus:outline-none"
              >
                <IoCloseCircleOutline className="text-4xl text-orange-400" />
              </button>
            </div>

            {showScanner ? (
              <div className="flex flex-col justify-center items-center w-[600px] h-[400px]">
                <div className="w-full flex justify-center">
                  <QrReader
                    constraints={{ facingMode: "environment" }}
                    onResult={handleScanResult}
                    containerStyle={{ width: "300px", height: "300px" }}
                    videoStyle={{ width: "100%" }}
                  />
                </div>
                <span className="mt-4 text-gray-500 text-sm">Scanning...</span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex mt-7 flex-wrap justify-center md:justify-start">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r mb-4">
                    <img
                      src={insta}
                      alt="Instagram Logo"
                      className="w-20 h-200"
                    />
                  </div>
                  <div className="flex flex-col text-center md:text-left md:ml-4">
                    <h2 className="text-2xl font-bold text-gray-700">
                      Senior UX Designer
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mt-2">
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                        2 Miles Away
                      </div>
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                        New York City
                      </div>
                      <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                        ID: 7878
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary and Timings */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 mt-4 space-y-4 md:space-y-0">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300">
                      <img src={salary} alt="Salary Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Salary
                      </span>
                      <span className="font-bold text-gray-700 text-sm">
                        $15/hr
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-300">
                      <img src={time} alt="Time Icon" className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">
                        Timings
                      </span>
                      <span className="font-bold text-gray-700 text-sm block">
                        Start: 5 NOV 2024 9:00AM
                      </span>
                      <span className="font-bold text-gray-700 text-sm block">
                        End: 5 NOV 2024 4:00PM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Selfie and Scan QR Code */}
                <div className="flex flex-col space-y-4 mt-6 w-full px-4">
                  <div
                    className="flex items-center justify-between border border-dashed rounded-full border-gray-300 px-4 py-3 cursor-pointer"
                    onClick={() => setShowScanner(true)}
                  >
                    {qrData ? (
                      <div className="w-full text-sm text-green-600 text-center">
                        Scanned Data: {qrData}
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm">
                          Scan QR Code
                        </span>
                        <FaQrcode className="text-gray-400 text-xl" />
                      </>
                    )}
                  </div>
                </div>

                {/* Book On Button */}
                {qrData ? ( // Conditionally render the button based on qrData
                  <button
                    onClick={handleBookOnClick} // Transition to PopupButton6
                    className="mt-6 px-6 py-3 w-full md:w-auto bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 transition duration-200"
                  >
                    Book On
                  </button>
                ) : (
                  <button
                    disabled
                    className="mt-6 px-6 py-3 w-full md:w-auto bg-gray-400 text-white rounded-full cursor-not-allowed"
                  >
                    Book On
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <PopupButton6
          onClose={() => {
            setShowPopup6(false); // Close PopupButton6
          }}
        />
      )}
    </>
  );
};

export default PopupButton5;