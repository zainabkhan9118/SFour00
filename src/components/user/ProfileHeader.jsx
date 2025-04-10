import React from "react";

const ProfileHeader = () => {
  return (
    <div className="flex justify-between items-center border-b py-4 px-6 bg-white shadow-sm">
      {/* Left Section */}
      <h2 className="text-lg font-semibold text-gray-700">Profile</h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <span className="relative">
          <i className="fas fa-bell text-orange-500 text-lg"></i>
        </span>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/men/10.jpg"
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
          <p className="text-gray-700 font-medium">Dani Danial</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
