import React, { useRef } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AssignJobButton = ({ onClose }) => {
  const buttonRef = useRef();

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
        onClose();
    }
  };

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/applicant-profile');
  };

  return (
    <div ref={buttonRef} onClick={closeModel} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg flex flex-col justify-center items-center p-6 w-full max-w-md h-auto md:w-[561px] md:h-[333px] relative">
        {/* Close Button */}
        <div className='w-12 h-12 rounded-full bg-[#E7F0FA] absolute top-[-20px] right-[-3px]'>
          <button className="absolute top-1.5 right-1 text-gray-500">
            <IoCloseCircleOutline onClick={onClose} className='text-4xl text-orange-400' />
          </button>
        </div>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold text-center text-gray-900">Alert !</h2>
        <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[421px] h-auto md:h-[52px] text-lg">
          Are you sure you want to assign this job to <span className='font-bold text-lg text-gray-400'>Jordan Mendez?</span>?
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 w-32 h-12 md:w-[154px] md:h-[48px] bg-[#E7F0FA] text-[#FD7F00] rounded-full hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleNavigate}
            className="px-6 py-2 w-32 h-12 md:w-[154px] md:h-[48px] bg-[#FD7F00] text-white rounded-full hover:bg-orange-600"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignJobButton;