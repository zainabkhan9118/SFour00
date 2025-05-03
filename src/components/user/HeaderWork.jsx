import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

const HeaderWork = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-nowrap min-w-max md:min-w-0 px-2 md:px-6 space-x-4 md:space-x-8 py-4">
        <Link
          to="/User-WorkApplied"
          className={`relative text-sm md:text-lg font-medium transition duration-300 whitespace-nowrap ${
            activeTab === "/User-WorkApplied"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
          }`}
        >
          Applied
          {activeTab === "/User-WorkApplied" && (
            <span className="absolute left-0 top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/User-MyWorkAssignedPage"
          className={`relative text-sm md:text-lg font-medium transition duration-300 whitespace-nowrap ${
            activeTab === "/User-MyWorkAssignedPage"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
          }`}
        >
          Assigned
          {activeTab === "/User-MyWorkAssignedPage" && (
            <span className="absolute left-0 top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/User-workInprogess"
          className={`relative text-sm md:text-lg font-medium transition duration-300 whitespace-nowrap ${
            activeTab === "/User-workInprogess"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
          }`}
        >
          In-Progress
          {activeTab === "/User-workInprogess" && (
            <span className="absolute left-0 top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>

        <Link
          to="/User-WorkCompleted"
          className={`relative text-sm md:text-lg font-medium transition duration-300 whitespace-nowrap ${
            activeTab === "/User-WorkCompleted"
              ? "text-orange-500 font-bold"
              : "text-gray-800 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
          }`}
        >
          Completed
          {activeTab === "/User-WorkCompleted" && (
            <span className="absolute left-0 top-[30px] bottom-0 w-full h-[2px] bg-orange-500 transition-all duration-300"></span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default HeaderWork;
