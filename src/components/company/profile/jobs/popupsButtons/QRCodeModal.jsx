import React, { useRef } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiDownload, FiXCircle } from "react-icons/fi";

const QRCodeModal = ({ onClose }) => {
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const qrCodes = [
    "Job QR Code",
    "Point A QR Code",
    "Point B QR Code",
    "Point C QR Code",
  ];

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30"
    >
      <div className="bg-white rounded-lg flex flex-col  p-6 w-full max-w-md h-auto md:w-[561px] md:h-[333px] relative">
        {/* Close Button */}
      <div className='w-12 h-12 rounded-full justify-between bg-[#E7F0FA] absolute top-[-20px] right-[-3px]'>
                <button className="absolute top-1.5 right-1 text-gray-500">
                  <IoCloseCircleOutline onClick={onClose} className='text-4xl text-orange-400' />
                </button>
              </div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add QR Code</h2>
          <button className="text-[#FD7F00] text-lg flex items-center">
            Add QR Code <span className="ml-1">+</span>
          </button>
        </div>

        {/* QR Code List */}
        <ul className="mt-4 space-y-8">
          {qrCodes.map((qr, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{qr}</span>
              <div className="flex space-x-3">
                {/* Download Icon */}
                <button className="text-orange-500 hover:text-orange-700">
                  <FiDownload size={20} />
                </button>
                {/* Delete Icon */}
                <button className="text-orange-500 hover:text-orange-700">
                  <FiXCircle size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QRCodeModal;
