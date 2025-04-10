import React from "react";
import { FaBell } from "react-icons/fa";
import Avatar from "../../assets/images/logo.png";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4  md:mb-4 lg:mb-0">
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800">Notifications</h1>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="relative">
          <FaBell className="text-orange-500 text-xl" />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          <img
            src={Avatar} // Replace with the correct path to the user avatar
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold text-gray-800">Dani Danial</span>
          {/* Online Status */}
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;