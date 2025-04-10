import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaFileInvoice, FaHeadset, FaQuestionCircle, FaSignOutAlt, FaUniversity } from "react-icons/fa";

const UserSidebar = () => {
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
          <Link to="/User-PersonalDetails" className="flex items-center space-x-3 font-semibold text-black">
            <FaUser className="text-gray-600" />
            <span>Personal Details</span>
          </Link>
        </li>
        <li>
          <Link to="/User-BankDetails" className="flex items-center space-x-3">
            <FaUniversity className="text-orange-500" />
            <span>Bank Details</span>
          </Link>
        </li>
        <li>
          <Link to="/reset-password" className="flex items-center space-x-3">
            <FaLock className="text-orange-500" />
            <span>Reset Password</span>
          </Link>
        </li>
        <li>
          <Link to="/User-InvoiceList" className="flex items-center space-x-3">
            <FaFileInvoice className="text-orange-500" />
            <span>My Invoices</span>
          </Link>
        </li>
        <li>
          <Link to="/contact-support" className="flex items-center space-x-3">
            <FaHeadset className="text-orange-500" />
            <span>Contact S4 Support</span>
          </Link>
        </li>
        <li>
          <Link to="/User-FAQSection" className="flex items-center space-x-3">
            <FaQuestionCircle className="text-orange-500" />
            <span>FAQ’s</span>
          </Link>
        </li>
        <li>
          <Link to="/logout" className="flex items-center space-x-3 text-red-500">
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
