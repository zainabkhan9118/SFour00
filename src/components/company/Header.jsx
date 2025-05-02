import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import defaultLogo from "../../assets/images/company.png";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [companyName, setCompanyName] = useState("Company Name");
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    // Get company info from localStorage
    try {
      const companyProfileData = localStorage.getItem('companyProfile');
      if (companyProfileData) {
        const profileData = JSON.parse(companyProfileData);
        if (profileData) {
          if (profileData.companyName) {
            setCompanyName(profileData.companyName);
          }
          if (profileData.companyLogo) {
            setCompanyLogo(profileData.companyLogo);
          }
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
      case "/recents-jobs":
        return "Recent Jobs";
      case "/job-assigned":
        return "Assigned Jobs";
      case "/in-progress":
        return "In-Progress Jobs";
      case "/completed-job":
        return "Completed Jobs";
      default:
        return null; // Don't display a title if route isn't recognized
    }
  };

  const title = getPageTitle();

  return (
    <div className="flex justify-between items-center bg-white px-4 md:px-6 py-3 md:py-4 md:mb-4 shadow-sm">
      {/* Title - only shown if there's a title for the current route */}
      {title && (
        <h1 className="text-lg md:text-xl font-bold text-gray-800">{title}</h1>
      )}
      {!title && <div></div>} {/* Empty div to maintain flex layout when no title */}

      {/* User Info */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notification Icon */}
        <button className="relative">
          <FaBell className="text-orange-500 text-lg md:text-xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Company Info */}
        <div className="flex items-center space-x-2">
          <img
            src={companyLogo || defaultLogo}
            alt="Company Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
          />
          <span className="font-medium text-sm md:text-base text-gray-800 max-w-[100px] md:max-w-[200px] truncate">
            {companyName}
          </span>
          <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;