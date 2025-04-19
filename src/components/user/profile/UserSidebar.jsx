import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaFileInvoice, FaHeadset, FaQuestionCircle, FaSignOutAlt, FaUniversity } from "react-icons/fa";

const UserSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to check if the link is active
  const isActive = (path) => {
    // For personal details, highlight for both the main page and edit page
    if (path === "/User-PersonalDetails") {
      return currentPath === "/User-PersonalDetails" || currentPath === "/edit-personal-details " || currentPath === "/edit-experience" || currentPath === "/edit-education" || currentPath === "/edit-certificate" || currentPath === "/edit-license" || currentPath === "/edit-utr-number";
    }
    return currentPath === path;
  };

  return (
    <div className="w-64 bg-white p-4 shadow-xl min-h-screen">
      <div className="flex items-center space-x-3 pb-4">
        <img
          src="src\assets\images\profile.jpeg" // Replace with actual image URL
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-lg">Dany Danial</span>
      </div>
      <ul className="mt-4 space-y-8 text-gray-700">
        <li>
          <Link 
            to="/User-PersonalDetails" 
            className={`flex items-center space-x-3 ${isActive("/User-PersonalDetails") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaUser className={`${isActive("/User-PersonalDetails") ? "text-orange-500" : "text-gray-600"}`} />
            <span>Personal Details</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/User-BankDetails" 
            className={`flex items-center space-x-3 ${isActive("/User-BankDetails") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaUniversity className={`${isActive("/User-BankDetails") ? "text-orange-500" : "text-orange-500"}`} />
            <span>Bank Details</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/ResetPassword" 
            className={`flex items-center space-x-3 ${isActive("/ResetPassword") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaLock className="text-orange-500" />
            <span>Reset Password</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/User-InvoiceList" 
            className={`flex items-center space-x-3 ${isActive("/User-InvoiceList") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaFileInvoice className="text-orange-500" />
            <span>My Invoices</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/User-ContactSupport" 
            className={`flex items-center space-x-3 ${isActive("/User-ContactSupport") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaHeadset className="text-orange-500" />
            <span>Contact S4 Support</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/User-FAQSection" 
            className={`flex items-center space-x-3 ${isActive("/User-FAQSection") ? "bg-orange-100 p-2 rounded-md font-semibold text-black" : ""}`}
          >
            <FaQuestionCircle className="text-orange-500" />
            <span>FAQ's</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/logout" 
            className={`flex items-center space-x-3 text-red-500 ${isActive("/logout") ? "bg-orange-100 p-2 rounded-md font-semibold" : ""}`}
          >
            <FaSignOutAlt className="text-orange-500" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
      <div className="mt-6 text-xs text-gray-500">
        <p>Terms and conditions of use:</p>
        <p>
          <a href="#" className="text-blue-500 underline">Privacy policy</a>,
          <a href="#" className="text-blue-500 underline"> Cookie policy</a>
        </p>
      </div>
    </div>
  );
};

export default UserSidebar;
