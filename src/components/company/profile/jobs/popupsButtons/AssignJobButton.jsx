import React, { useRef, useState } from 'react';
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../../../../common/LoadingSpinner";

const AssignJobButton = ({ onClose, applicant, job }) => {
  const buttonRef = useRef();
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(false);
  
  const navigate = useNavigate();

  const closeModel = (e) => {
    if (buttonRef.current === e.target) {
        onClose();
    }
  };

  const handleNavigate = () => {
    navigate('/job-assigned');
  };
  
  const handleAssignJob = async () => {
    if (!job || !job._id || !applicant || !applicant._id) {
      setAssignError("Missing job or applicant information");
      return;
    }
    
    try {
      setAssigning(true);
      setAssignError(null);
      
      // Making API call with the correct PATCH method
      const response = await fetch(`/api/apply/${job._id}/enable-assignment`, {
        method: 'PATCH', // Using PATCH as specified by the API
        headers: {
          'jobSeekerId': applicant._id,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          isAssignable: true
        })
      });
      
      const data = await response.json();
      console.log("Assign job response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign job');
      }
      
      setAssignSuccess(true);
      
      // Navigate to assigned jobs page after a short delay
      setTimeout(() => {
        handleNavigate();
      }, 1500);
      
    } catch (error) {
      console.error("Error assigning job:", error);
      setAssignError(error.message || 'An error occurred while assigning the job');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div ref={buttonRef} onClick={closeModel} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
      {assigning && <LoadingSpinner />}
      <div className="bg-white flex flex-col justify-center items-center p-4 sm:p-6 w-full max-w-[95%] sm:max-w-md h-auto md:w-[561px] md:h-[333px] relative rounded-xl">
        {/* Close Button */}
        <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E7F0FA] absolute top-[-15px] sm:top-[-20px] right-[-10px] sm:right-[-3px] '>
          <button className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 text-gray-500">
            <IoCloseCircleOutline onClick={onClose} className='text-3xl sm:text-4xl text-orange-400' />
          </button>
        </div>

        {/* Modal Content */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900">Alert!</h2>
        
        {assignSuccess ? (
          <p className="text-green-500 text-center mt-2 w-full max-w-xs md:w-[421px] h-auto md:h-[52px] text-base sm:text-lg px-2">
            Job successfully assigned to {applicant?.fullname || "the applicant"}. Redirecting...
          </p>
        ) : (
          <p className="text-gray-500 text-center mt-2 w-full max-w-xs md:w-[421px] h-auto md:h-[52px] text-base sm:text-lg px-2">
            Are you sure you want to assign this job to <span className='font-bold text-base sm:text-lg text-gray-400'>{applicant?.fullname || "this applicant"}</span>?
          </p>
        )}
        
        {assignError && (
          <p className="text-red-500 text-center mt-2 text-sm">
            {assignError}
          </p>
        )}

        {/* Buttons */}
        {!assignSuccess && (
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6 w-full px-4">
            <button
              onClick={onClose}
              disabled={assigning}
              className="px-4 sm:px-6 py-2 w-full sm:w-32 h-10 sm:h-12 md:w-[154px] md:h-[48px] bg-[#E7F0FA] text-[#FD7F00] rounded-full hover:bg-gray-400 text-sm sm:text-base disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignJob}
              disabled={assigning}
              className="px-4 sm:px-6 py-2 w-full sm:w-32 h-10 sm:h-12 md:w-[154px] md:h-[48px] bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center"
            >
              {assigning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </>
              ) : (
                "Assign"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignJobButton;