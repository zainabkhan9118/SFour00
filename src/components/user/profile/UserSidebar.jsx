import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  FaUser,
  FaLock,
  FaFileInvoice,
  FaHeadset,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { auth } from "../../../config/firebaseConfig";
import { AppContext } from "../../../context/AppContext";

const UserSidebar = () => {
  const navigate = useNavigate();
  const { profileName, profileDp } = useContext(AppContext);
  const location = useLocation();
  const currentPath = location.pathname;

  // Fallback values for profile data
  const fallbackProfileName = "John Doe";
  const fallbackProfileDp = "src/assets/images/profile.jpeg";

  // const handleLogout = async () => {
  //   try {
  //     localStorage.removeItem("sessionData");
  //     await signOut(auth);
  //     toast.success("Logged out successfully!");
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //     toast.error("Failed to log out. Please try again.");
  //   }
  // };

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
    <div className="w-64 bg-white p-4 shadow-xl min-h-screen">
      <div className="flex items-center space-x-3 pb-4">
        <img
          src={profileDp || fallbackProfileDp} // Use fallback image if profileDp is not defined
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold  text-lg">
        {profileName?.trim() ? profileName : fallbackProfileName} {/* Use fallback name if profileName is not defined */}
        </span>
      </div>
      <ul className="mt-4 space-y-8 text-gray-700">
        <li>
          <Link
            to="/User-PersonalDetails"
            className={`flex items-center space-x-3 ${
              isActive("/User-PersonalDetails")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaUser
              className={`${
                isActive("/User-PersonalDetails")
                  ? "text-orange-500"
                  : "text-gray-600"
              }`}
            />
            <span>Personal Details</span>
          </Link>
        </li>
        <li>
          <Link
            to="/User-BankDetails"
            className={`flex items-center space-x-3 ${
              isActive("/User-BankDetails")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaUniversity className="text-orange-500" />
            <span>Bank Details</span>
          </Link>
        </li>
        <li>
          <Link
            to="/ResetPassword"
            className={`flex items-center space-x-3 ${
              isActive("/ResetPassword")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaLock className="text-orange-500" />
            <span>Reset Password</span>
          </Link>
        </li>
        <li>
          <Link
            to="/User-InvoiceList"
            className={`flex items-center space-x-3 ${
              isActive("/User-InvoiceList")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaFileInvoice className="text-orange-500" />
            <span>My Invoices</span>
          </Link>
        </li>
        <li>
          <Link
            to="/User-ContactSupport"
            className={`flex items-center space-x-3 ${
              isActive("/User-ContactSupport")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaHeadset className="text-orange-500" />
            <span>Contact S4 Support</span>
          </Link>
        </li>
        <li>
          <Link
            to="/User-FAQSection"
            className={`flex items-center space-x-3 ${
              isActive("/User-FAQSection")
                ? "bg-orange-100 p-2 rounded-md font-semibold text-black"
                : ""
            }`}
          >
            <FaQuestionCircle className="text-orange-500" />
            <span>FAQ's</span>
          </Link>
        </li>
        {/* <li onClick={handleLogout}>
          <div className="flex items-center space-x-3 text-red-500 cursor-pointer">
            <FaSignOutAlt className="text-orange-500" />
            <span>Logout</span>
          </div>
        </li> */}
      </ul>
      <div className="mt-6 text-xs text-gray-500">
        <p>Terms and conditions of use:</p>
        <p>
          <a href="#" className="text-blue-500 underline">
            Privacy policy
          </a>
          ,
          <a href="#" className="text-blue-500 underline">
            {" "}
            Cookie policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserSidebar;