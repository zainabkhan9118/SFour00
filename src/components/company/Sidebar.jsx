import { useState } from "react";
import { FaUser, FaComments, FaBriefcase, FaBell, FaSignOutAlt, FaBars, FaQrcode } from "react-icons/fa";
import logo from "./.././../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex">
      {/* Hamburger Icon */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#16213E] text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars className="text-2xl" />
      </button>
    
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-[#16213E] text-white flex flex-col items-center py-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex`}
      >
        {/* Logo */}
        <div className="mb-8 mt-[70px]">
          <img src={logo} alt="Logo" className="h-16 md:h-20" />
        </div>

        {/* Menu Items */}
        <nav className="w-full">
          <ul className="space-y-6">
            <li>
              <Link to='/company-profile' className="flex items-center px-6 py-2 text-lg font-semibold hover:bg-[#1F2A48] rounded-lg cursor-pointer">
                <FaUser className="mr-3 text-xl" /> Profile
              </Link>
            </li>
            <li>
              <Link to='/chat' className="flex items-center px-6 py-2 text-lg text-gray-500 cursor-not-allowed cursor-pointer">
                <FaComments className="mr-3 text-xl" /> Chat
              </Link>
            </li>
            <li>
              <Link to='/my-work' className="flex items-center px-6 py-2 text-lg text-gray-500 cursor-not-allowed cursor-pointer">
                <FaBriefcase className="mr-3 text-xl" /> My Work
              </Link>
            </li>
            <li>
              <Link to='/notification' className="flex items-center px-6 py-2 text-lg text-gray-500 cursor-not-allowed cursor-pointer">
                <FaBell className="mr-3 text-xl" /> Notifications
              </Link>
            </li>
            {/* QR Code Menu Item */}
            <li>
              <Link to='/qr-code' className="flex items-center px-6 py-2 text-lg text-gray-500 cursor-not-allowed cursor-pointer">
                <FaQrcode className="mr-3 text-xl" /> QR Code
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto mb-6 w-full">
          <Link to='/logout' className="flex items-center px-6 py-2 w-full text-lg text-gray-300 hover:text-white hover:bg-[#1F2A48] rounded-lg cursor-pointer">
            <FaSignOutAlt className="mr-3 text-xl" /> Logout
          </Link>
        </div>
      </div>
    </div>
  );
}