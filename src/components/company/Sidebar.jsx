
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import breifcase from "../../assets/images/solar_case-bold-duotone.png";
import profile from "../../assets/images/icons8_user.png";
import chat from "../../assets/images/lets-icons_chat-duotone.png";
import work from "../../assets/images/ic_twotone-work.png";
import notifications from "../../assets/images/icons8_notification.png";

import { useState } from "react";
import { FaUser, FaComments, FaBriefcase, FaBell, FaSignOutAlt, FaBars, FaQrcode } from "react-icons/fa";
import logo from "./.././../assets/images/logo.png";
import { Link } from "react-router-dom";


export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  const routes = {
    profile: "/company-profile",
    chat: "/chat",
    work: "/my-work",
    notifications: "/notification"
  };

  const isActive = (path) => currentPath === path;

  return (
    <>
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-[#121D34] rounded-md text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>


      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed md:static md:translate-x-0 min-h-screen z-20 bg-[#121D34] text-gray-400 flex flex-col p-5 border rounded-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:min-h-screen md:w-64 w-64`}

    
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-[#16213E] text-white flex flex-col items-center py-6 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex`}

      >
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="w-24 mb-4" />
        </div>


        <nav className="flex flex-col space-y-8 mb-auto">
          <Link to={routes.profile}>
            <div className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={profile} alt="profile" className="h-6 w-6" />
              <span>Profile</span>
            </div>
          </Link>

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


          <Link to={routes.chat}>
            <div className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={chat} alt="chat" className="h-7 w-7" />
              <span>Chat</span>
            </div>
          </Link>

          <Link to={routes.work}>
            <div className={`flex items-center space-x-3 ${isActive(routes.work) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={work} alt="work" className="h-6 w-6" />
              <span>My Work</span>
            </div>
          </Link>

          <Link to={routes.notifications}>
            <div className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={notifications} alt="work" className="h-6 w-6" />
              <span>Notifications</span>
            </div>
          </Link>
        </nav>

        <Link to="/login">
          <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8 mt-8">
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </div>
        </Link>
      </div>
    </>
  );
}