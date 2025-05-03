import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaComments, FaBriefcase, FaBell, FaQrcode, FaSignOutAlt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import logo from "../../assets/images/logo.png";
import LoadingSpinner from "../common/LoadingSpinner";
import LogoutSuccessPopup from "../user/popupModel/LogoutSuccessPopup";
import { ThemeContext } from "../../context/ThemeContext";

export default function Sidebar() {
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Function to check if a route is active
  const isActive = (path) => {
    // For routes, check if current path equals or starts with the route path
    return currentPath === path || currentPath.startsWith(path);
  };

  useEffect(() => {
    // Load routes configuration
    setLoading(true);
    
    // Define routes for the sidebar navigation
    const sidebarRoutes = {
      profile: "/company-profile",
      chat: "/chat",
      work: "/recents-jobs",  
      notifications: "/notification",
      qrCode: "/qr-code"
    };
    
    setRoutes(sidebarRoutes);
    setLoading(false);
  }, []);

  // Handler for logout functionality using structured approach
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Clear local storage first to remove all stored data
      localStorage.clear();
      
      // Sign out from Firebase authentication
      await signOut(auth);
      
      // Show success popup before redirecting
      setShowLogoutPopup(true);
    } catch (error) {
      console.error("Error during logout:", error);
      // Navigate to login page even if there's an error
      navigate("/login");
    }
  };

  // Handle closing the logout popup and navigate to login
  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false);
    // Navigate to login page after closing the popup
    navigate("/login");
  };

  return (
    <div className={`h-screen w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-[#121D34]'} text-gray-400 flex flex-col fixed top-0 left-0 overflow-y-auto`}>
      {/* Logo */}
      <div className="flex justify-center mt-5 mb-10">
        <img src={logo} alt="Logo" className="w-20 h-20" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <nav className="flex flex-col space-y-8 mb-auto">
          <Link to={routes.profile}>
            <div className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8`}>
              <FaUser className="h-5 w-5" />
              <span>Profile</span>
            </div>
          </Link>
          
          <Link to={routes.chat}>
            <div className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8`}>
              <FaComments className="h-5 w-5" />
              <span>Chat</span>
            </div>
          </Link>
          
          <Link to={routes.work}>
            <div className={`flex items-center space-x-3 ${isActive(routes.work) ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8`}>
              <FaBriefcase className="h-5 w-5" />
              <span>Jobs</span>
            </div>
          </Link>
          
          <Link to={routes.notifications}>
            <div className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8`}>
              <FaBell className="h-5 w-5" />
              <span>Notifications</span>
            </div>
          </Link>
          
          <Link to={routes.qrCode}>
            <div className={`flex items-center space-x-3 ${isActive(routes.qrCode) ? 'text-white' : theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8`}>
              <FaQrcode className="h-5 w-5" />
              <span>QR Code</span>
            </div>
          </Link>
        </nav>
      )}

      <Link to="/login" onClick={handleLogout} className="mt-auto">
        <div className={`flex items-center space-x-3 ${theme === 'dark' ? 'text-gray-400' : 'text-[#395080]'} hover:text-white transition-colors ml-8 mb-10`}>
          <FaSignOutAlt className="h-5 w-5" />
          <span>Logout</span>
        </div>
      </Link>

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
      )}
    </div>
  );
}