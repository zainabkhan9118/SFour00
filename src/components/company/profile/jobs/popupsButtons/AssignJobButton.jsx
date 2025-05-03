import React, { useState, useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { assignJob } from "../../../../../api/jobsApi";
import { ThemeContext } from "../../../../../context/ThemeContext";

const AssignJobButton = ({ onClose, applicant, job }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const handleAssignJob = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      // Call the API function to assign the job
      const result = await assignJob(job._id, applicant._id);

      if (result.statusCode === 200) {
        setSuccess(true);
        // Automatically close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error(result.message || "Failed to assign job");
      }
    } catch (err) {
      console.error("Error assigning job:", err);
      setError(err.message || "An error occurred while assigning the job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Assign Job</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Job Assigned Successfully!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The job has been assigned to {applicant?.fullname}. They will be notified.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to assign this job to <span className="font-semibold">{applicant?.fullname}</span>?
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Once assigned, the applicant will be notified and other applicants will be informed that the position has been filled.
              </p>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignJob}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Assigning..." : "Assign Job"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignJobButton;