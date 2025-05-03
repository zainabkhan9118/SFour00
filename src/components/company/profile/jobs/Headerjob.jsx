import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const Headerjob = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 sm:px-6">
        <div>
          {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Recent Job</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View all your recently posted jobs and manage applications
          </p> */}
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