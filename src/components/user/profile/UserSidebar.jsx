import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaFileInvoice,
  FaHeadset,
  FaQuestionCircle,
  FaUniversity,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { AppContext } from "../../../context/AppContext";
import { ThemeContext } from "../../../context/ThemeContext";

const UserSidebar = ({ isMobile = false }) => {
  const { profileName, profileDp } = useContext(AppContext);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fallback values for profile data
  const fallbackProfileName = "John Doe";
  const fallbackProfileDp = "src/assets/images/profile.jpeg";

  // Check if current path matches route or is a sub-route
  const isActive = (path) => {
    if (path === "/User-PersonalDetails") {
      return (
        currentPath === "/User-PersonalDetails" ||
        currentPath === "/edit-personal-details" ||
        currentPath === "/edit-experience" ||
        currentPath === "/edit-education" ||
        currentPath === "/edit-certificate" ||
        currentPath === "/edit-license" ||
        currentPath === "/edit-utr-number"
      );
    }
    return currentPath === path;
  };

  // Navigation links component - reused in both desktop and mobile views
  const NavigationLinks = () => (
    <nav className="flex flex-col space-y-4 text-sm">
      <Link
        to="/User-PersonalDetails"
        className={`flex items-center p-2 rounded-md ${
          isActive("/User-PersonalDetails")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaUser className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>Personal Details</span>
      </Link>
      
      <Link
        to="/User-BankDetails"
        className={`flex items-center p-2 rounded-md ${
          isActive("/User-BankDetails")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaUniversity className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>Bank Details</span>
      </Link>
      
      <Link
        to="/ResetPassword"
        className={`flex items-center p-2 rounded-md ${
          isActive("/ResetPassword")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaLock className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>Reset Password</span>
      </Link>
      
      <Link
        to="/User-InvoiceList"
        className={`flex items-center p-2 rounded-md ${
          isActive("/User-InvoiceList")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaFileInvoice className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>My Invoices</span>
      </Link>
      
      <Link
        to="/User-ContactSupport"
        className={`flex items-center p-2 rounded-md ${
          isActive("/User-ContactSupport")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaHeadset className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>Contact S4 Support</span>
      </Link>
      
      <Link
        to="/User-FAQSection"
        className={`flex items-center p-2 rounded-md ${
          isActive("/User-FAQSection")
            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaQuestionCircle className="text-orange-500 dark:text-orange-400 mr-3" size={14} />
        <span>FAQ's</span>
      </Link>
    </nav>
  );

  // Mobile version of the sidebar
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-800 w-full transition-colors duration-200">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <img
              src={profileDp || fallbackProfileDp}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="ml-2 font-medium text-sm text-gray-800 dark:text-white truncate">
              {profileName?.trim() ? profileName : fallbackProfileName}
            </span>
          </div>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile menu - conditionally rendered */}
        {isMenuOpen && (
          <div className="px-4 py-2">
            <NavigationLinks />
            
            {/* Footer text */}
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 px-2">
              <p>Terms and conditions of use:</p>
              <div className="flex space-x-1">
                <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Privacy policy</a>
                <span>,</span>
                <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Cookie policy</a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version of the sidebar (original implementation)
  return (
    <div className="h-full bg-white dark:bg-gray-800 py-4 px-3 transition-colors duration-200">
      {/* Profile quick info - smaller height */}
      <div className="flex items-center mb-6 px-2">
        <img
          src={profileDp || fallbackProfileDp}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 font-medium text-sm text-gray-800 dark:text-white truncate">
          {profileName?.trim() ? profileName : fallbackProfileName}
        </span>
      </div>
      
      {/* Navigation links - more compact */}
      <NavigationLinks />
      
      {/* Footer text - more compact */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 px-2">
        <p>Terms and conditions of use:</p>
        <div className="flex space-x-1">
          <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Privacy policy</a>
          <span>,</span>
          <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Cookie policy</a>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;