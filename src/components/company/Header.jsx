import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import Avatar from "../../assets/images/logo.png";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [companyName, setCompanyName] = useState("Company Name");

  useEffect(() => {
    // Get company name from localStorage
    try {
      const companyProfileData = localStorage.getItem('companyProfile');
      if (companyProfileData) {
        const profileData = JSON.parse(companyProfileData);
        if (profileData && profileData.companyName) {
          setCompanyName(profileData.companyName);
        }
      }
    } catch (error) {
      console.error("Error parsing company profile data:", error);
    }
  }, []);

  // Function to get the title based on current route
  const getPageTitle = () => {
    switch (pathname) {

      case "/company-profile":
        return "Company Profile";
      case "/job-posting":
        return "Job Posting";
      case "/problems-reported":
        return "Problem Reports";
      case "/rota-management":
        return "Rota Management";
      case "/chat-support":
        return "Chat Support";
      case "/faq":
        return "FAQ's";
      case "/notification":
        return "Notifications";
      case "/chat":
        return "Messages";

      case "/notification":
        return "Notifications";
      case "/company-profile":
        return "Company Profile";
      case "/user-JobDetails":
        return "Job Posting";

      case "/recents-jobs":
        return "Recent Jobs";
      case "/job-assigned":
        return "Assigned Jobs";
      case "/in-progress":
        return "In-Progress Jobs";
      case "/completed-job":
        return "Completed Jobs";


      case "/chat":
        return "Messages";
      case "/rota-management":
        return "Rota Management";
      case "/chat-support":
        return "Chat Support";
      case "/faq":
        return "FAQ";

      default:
        return null; // Don't display a title if route isn't recognized
    }
  };

  const title = getPageTitle();

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4  md:mb-4 lg:mb-0">
      {/* Title - only shown if there's a title for the current route */}
      {title && (
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      )}
      {!title && <div></div>} {/* Empty div to maintain flex layout when no title */}

      {/* User Info */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        {/* <button className="relative">
          <FaBell className="text-orange-500 text-xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button> */}

        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          <img
            src={Avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold text-gray-800">{companyName}</span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;