import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import profile from "../../assets/images/icons8_user.png";
import chat from "../../assets/images/lets-icons_chat-duotone.png";
import work from "../../assets/images/ic_twotone-work.png";
import notifications from "../../assets/images/icons8_notification.png";
import { FaUser, FaComments, FaBriefcase, FaBell, FaSignOutAlt, FaQrcode } from "react-icons/fa";

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
    notifications: "/notification",
    qrCode: "/qr-code"
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
        className={`fixed md:static md:translate-x-0 min-h-screen z-20 bg-[#121D34] text-gray-400 flex flex-col p-5 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:min-h-screen md:w-64 w-64 rounded-tr-[30px] rounded-br-[30px]`}
      >
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="w-24 mb-4" />
        </div>

        <nav className="w-full">
          <ul className="space-y-6">
            <li>
              <Link to={routes.profile} className={`flex items-center px-6 py-2 text-lg font-semibold ${isActive(routes.profile) ? 'text-white' : 'text-gray-400'} hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer`}>
                <FaUser className="mr-3 text-xl" /> Profile
              </Link>
            </li>
            <li>
              <Link to={routes.chat} className={`flex items-center px-6 py-2 text-lg ${isActive(routes.chat) ? 'text-white' : 'text-gray-400'} hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer`}>
                <FaComments className="mr-3 text-xl" /> Chat
              </Link>
            </li>
            <li>
              <Link to={routes.work} className={`flex items-center px-6 py-2 text-lg ${isActive(routes.work) ? 'text-white' : 'text-gray-400'} hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer`}>
                <FaBriefcase className="mr-3 text-xl" /> My Work
              </Link>
            </li>
            <li>
              <Link to={routes.notifications} className={`flex items-center px-6 py-2 text-lg ${isActive(routes.notifications) ? 'text-white' : 'text-gray-400'} hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer`}>
                <FaBell className="mr-3 text-xl" /> Notifications
              </Link>
            </li>
            <li>
              <Link to={routes.qrCode} className={`flex items-center px-6 py-2 text-lg ${isActive(routes.qrCode) ? 'text-white' : 'text-gray-400'} hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer`}>
                <FaQrcode className="mr-3 text-xl" /> QR Code
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          <Link to="/login">
            <div className="flex items-center px-6 py-2 text-lg text-gray-400 hover:bg-[#1F2A48] hover:text-white rounded-lg cursor-pointer">
              <FaSignOutAlt className="mr-3 text-xl" /> Logout
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}