import React from "react";
import { Link, useLocation } from "react-router-dom";

const Headerjob = () => {
  const location = useLocation();
  const activeTab = location.pathname;

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row px-4 sm:px-6 space-y-4 sm:space-y-0 sm:space-x-8 py-4">
        <Link
          to="/recents-jobs"
          className={`relative text-base sm:text-lg font-medium transition duration-300 ${
            activeTab === "/recents-jobs"
              ? "text-orange-500 font-bold"
              : "text-gray-800 hover:text-orange-500"
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
              : "text-gray-800 hover:text-orange-500"
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
              : "text-gray-800 hover:text-orange-500"
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
              : "text-gray-800 hover:text-orange-500"
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