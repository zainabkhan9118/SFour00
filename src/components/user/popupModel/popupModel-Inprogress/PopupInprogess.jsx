import React, { useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCheckCircle, FaQrcode } from "react-icons/fa";
import { QrReader } from "@blackbox-vision/react-qr-reader";

const PopupInprogess = ({ onClose }) => {
  const buttonRef = useRef();
  const qrReaderRef = useRef(); // Ref for QrReader component
  const [showScanner, setShowScanner] = useState(null);
  const [qrData, setQrData] = useState({
    pointA: null,
    pointB: null,
    pointC: null,
  });

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
      onClose();
    }
  };

  const closeCamera = () => {
    if (qrReaderRef.current && qrReaderRef.current.videoRef.current) {
      const videoElement = qrReaderRef.current.videoRef.current;
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop(); // Stop each track
        });
        videoElement.srcObject = null; // Clear the video source
      }
    }
    setShowScanner(null); // Reset the scanner state
  };

  const handleScanResult = (result, error) => {
    if (!!result && result?.text) {
      console.log(`Scanned QR Code for ${showScanner}:`, result?.text);
      setQrData((prev) => ({
        ...prev,
        [showScanner]: result?.text,
      }));
      closeCamera(); // Close the camera after a successful scan
    } else if (!!error) {
      console.warn("QR Scan Error:", error);
    }
  };

  return (
    <div
      ref={buttonRef}
      onClick={closeModel}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full h-screen"
    >
      <div
        className="bg-white rounded-xl flex flex-col justify-center items-center p-6 w-[90%] max-w-md h-auto md:w-[500px] lg:w-[561px] relative"
        onClick={(e) => e.stopPropagation()}
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
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          Security Alert!
        </h2>
        <p className="text-gray-500 text-center font-medium mt-1 text-base">
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
                className="w-14 h-14 border border-gray-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ))}
        </div>

        {/* QR Code Scanning Section */}
        <div className="mt-6 w-full">
          {/* QR Code A */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Scan point A QR Code:</span>
            {qrData.pointA ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 text-xl cursor-pointer"
                onClick={() => setShowScanner("pointA")}
              />
            )}
          </div>

          {/* QR Code B */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Scan point B QR Code:</span>
            {qrData.pointB ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 text-xl cursor-pointer"
                onClick={() => setShowScanner("pointB")}
              />
            )}
          </div>

          {/* QR Code C */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700 font-medium">Scan point C QR Code:</span>
            {qrData.pointC ? (
              <FaCheckCircle className="text-green-500 text-xl" />
            ) : (
              <FaQrcode
                className="text-gray-500 text-xl cursor-pointer"
                onClick={() => setShowScanner("pointC")}
              />
            )}
          </div>
        </div>

        {/* QR Scanner */}
        {showScanner && (
          <div className="fixed inset-0 bg-black w-full h-screen bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[500px] h-auto md:h-[435px] flex flex-col items-center relative">
              <QrReader
                ref={qrReaderRef}
                key={showScanner}
                constraints={{
                  facingMode: "environment",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                onResult={handleScanResult}
                containerStyle={{ width: "400px", height: "400px" }}
                videoStyle={{ width: "100%" }}
              />
              {/* Close Button */}
              <div className="absolute top-[-20px] right-[-20px] w-12 h-12 rounded-full bg-[#E7F0FA] flex items-center justify-center">
                <button
                  onClick={closeCamera}
                  className="text-gray-500 focus:outline-none"
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