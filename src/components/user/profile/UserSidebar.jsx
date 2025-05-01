import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaFileInvoice,
  FaHeadset,
  FaQuestionCircle,
  FaUniversity,
} from "react-icons/fa";
import { AppContext } from "../../../context/AppContext";

const UserSidebar = () => {
  const { profileName, profileDp } = useContext(AppContext);
  const location = useLocation();
  const currentPath = location.pathname;

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

  return (
    <div className="h-full bg-white py-4 px-3">
      {/* Profile quick info - smaller height */}
      <div className="flex items-center mb-6 px-2">
        <img
          src={profileDp || fallbackProfileDp}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 font-medium text-sm text-gray-800 truncate">
          {profileName?.trim() ? profileName : fallbackProfileName}
        </span>
      </div>
      
      {/* Navigation links - more compact */}
      <nav className="flex flex-col space-y-4 text-sm">
        <Link
          to="/User-PersonalDetails"
          className={`flex items-center p-2 rounded-md ${
            isActive("/User-PersonalDetails")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaUser className="text-orange-500 mr-3" size={14} />
          <span>Personal Details</span>
        </Link>
        
        <Link
          to="/User-BankDetails"
          className={`flex items-center p-2 rounded-md ${
            isActive("/User-BankDetails")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaUniversity className="text-orange-500 mr-3" size={14} />
          <span>Bank Details</span>
        </Link>
        
        <Link
          to="/ResetPassword"
          className={`flex items-center p-2 rounded-md ${
            isActive("/ResetPassword")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaLock className="text-orange-500 mr-3" size={14} />
          <span>Reset Password</span>
        </Link>
        
        <Link
          to="/User-InvoiceList"
          className={`flex items-center p-2 rounded-md ${
            isActive("/User-InvoiceList")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaFileInvoice className="text-orange-500 mr-3" size={14} />
          <span>My Invoices</span>
        </Link>
        
        <Link
          to="/User-ContactSupport"
          className={`flex items-center p-2 rounded-md ${
            isActive("/User-ContactSupport")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaHeadset className="text-orange-500 mr-3" size={14} />
          <span>Contact S4 Support</span>
        </Link>
        
        <Link
          to="/User-FAQSection"
          className={`flex items-center p-2 rounded-md ${
            isActive("/User-FAQSection")
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <FaQuestionCircle className="text-orange-500 mr-3" size={14} />
          <span>FAQ's</span>
        </Link>
      </nav>
      
      {/* Footer text - more compact */}
      <div className="mt-6 text-xs text-gray-500 px-2">
        <p>Terms and conditions of use:</p>
        <div className="flex space-x-1">
          <a href="#" className="text-blue-500 hover:underline">Privacy policy</a>
          <span>,</span>
          <a href="#" className="text-blue-500 hover:underline">Cookie policy</a>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;