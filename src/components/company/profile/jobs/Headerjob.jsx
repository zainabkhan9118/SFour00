import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const Headerjob = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <button
            onClick={() => navigate('/company-profile')}
            className="flex items-center text-[#023047] hover:text-[#FD7F00] font-semibold text-base md:text-lg focus:outline-none"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/job-posting"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition duration-300"
          >
            Post a Job
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 py-4">
        <Link
          to="/recents-jobs"
          className={`relative text-base sm:text-lg font-medium transition duration-300 ${
            activeTab === "/recents-jobs"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-100 hover:text-orange-500"
          }`}
        >
          Recent
          {activeTab === "/recents-jobs" && (
            <span className="absolute left-0 top-[25px] sm:top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/job-assigned"
          className={`relative text-base sm:text-lg font-medium transition duration-300 ${
            activeTab === "/job-assigned"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-100 hover:text-orange-500"
          }`}
        >
          Assigned
          {activeTab === "/job-assigned" && (
            <span className="absolute left-0 top-[25px] sm:top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/in-progress"
          className={`relative text-base sm:text-lg font-medium transition duration-300 ${
            activeTab === "/in-progress"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-100 hover:text-orange-500"
          }`}
        >
          In-Progress
          {activeTab === "/in-progress" && (
            <span className="absolute left-0 top-[25px] sm:top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/completed-job"
          className={`relative text-base sm:text-lg font-medium transition duration-300 ${
            activeTab === "/completed-job"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-100 hover:text-orange-500"
          }`}
        >
          Completed
          {activeTab === "/completed-job" && (
            <span className="absolute left-0 top-[25px] sm:top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Headerjob;