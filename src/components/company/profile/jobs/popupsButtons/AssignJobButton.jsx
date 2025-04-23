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
    <div ref={buttonRef} onClick={closeModel} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4 ">
      <div className="bg-white flex flex-col justify-center items-center p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md h-auto md:w-[561px] md:h-[333px] relative rounded-xl">
        {/* Close Button */}
        <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E7F0FA] absolute top-[-15px] sm:top-[-20px] right-[-10px] sm:right-[-3px] '>
          <button className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-gray-500">
            <IoCloseCircleOutline onClick={onClose} className='text-3xl sm:text-4xl text-orange-400' />
          </button>
        </div>

        {/* Modal Content */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">Alert !</h2>
        <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[421px] h-auto md:h-[52px] text-base sm:text-lg px-2">
          Are you sure you want to assign this job to <span className='font-bold text-base sm:text-lg text-gray-400'>Jordan Mendez?</span>?
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6 w-full px-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 w-full sm:w-32 h-10 sm:h-12 md:w-[154px] md:h-[48px] bg-[#E7F0FA] text-[#FD7F00] rounded-full hover:bg-gray-400 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleNavigate}
            className="px-4 sm:px-6 py-2 w-full sm:w-32 h-10 sm:h-12 md:w-[154px] md:h-[48px] bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 text-sm sm:text-base"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignJobButton;