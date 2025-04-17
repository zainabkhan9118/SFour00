import React, { useState } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import Avatar from "../../assets/images/logo.png";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to get the title based on current route
  const getPageTitle = () => {
    switch (pathname) {
      case "/User-UserNotification":
        return "Notifications";
      case "/User-JobDetails":
        return "Jobs";
      case "/User-UserProfile":
        return "Profile";
      case "/User-WorkApplied":
        return "Work Applied";
      case "/User-MyWorkAssignedPage":
        return "Assigned Work";
      case "/User-workInprogess":
        return "Work In Progress";
      case "/User-UserChatPage":
        return "Chat";
      case "/User-ContactSupport":
        return "S4 Supports";
      case "/User-CompanyDetails":
        return "Company Details";
      case "/User-BankDetails":
        return "Bank Account Details";
      case "/User-InvoiceList":
        return "Invoices";
      case "/User-FAQSection":
        return "FAQ";
      case "/User-PersonalDetails":
        return "Personal Details";
      default:
        return null; // Don't display a title if route isn't recognized
    }
  };

  const title = getPageTitle();

  return (
    <div className="flex justify-between items-center bg-white px-3 sm:px-6 py-3 sm:py-4 md:mb-4 lg:mb-0 shadow-sm">
      {/* Mobile menu button - only visible on small screens */}
      <div className="block sm:hidden">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-600 focus:outline-none"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>

      {/* Title - only shown if there's a title for the current route */}
      {title && (
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">{title}</h1>
      )}
      {!title && <div className="hidden sm:block"></div>}

      {/* Mobile Title - centered on small screens */}
      {title && (
        <h1 className="text-lg font-bold text-gray-800 absolute left-0 right-0 text-center sm:hidden">{title}</h1>
      )}

      {/* User Info */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notification Icon */}
        <button className="relative">
          <FaBell className="text-orange-500 text-lg sm:text-xl" />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
            <span className="hidden sm:inline">3</span>
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <img
            src={Avatar}
            alt="User Avatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
          />
          <span className="font-semibold text-gray-800 text-sm sm:text-base hidden xs:inline">Dani Danial</span>
          {/* Online Status */}
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>

      {/* Mobile menu - slides in from the side when menuOpen is true */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 sm:hidden">
          <div className="bg-white h-full w-3/4 p-4 shadow-lg transform transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{title || "Menu"}</h2>
              <button onClick={() => setMenuOpen(false)} className="text-gray-600">
                &times;
              </button>
            </div>
            {/* Mobile menu content can go here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;