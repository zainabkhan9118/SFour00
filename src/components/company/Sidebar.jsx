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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

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
      work: "/my-work", 
      notifications: "/notification",
      qrCode: "/qr-code"
    };
    
    setRoutes(sidebarRoutes);
    setLoading(false);
  }, []);

  // Toggle menu visibility on mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    <>
      {/* Mobile Menu Button - only visible on small screens */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-[#121D34] dark:bg-gray-800 rounded-md text-white"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay that appears behind the sidebar on mobile */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar component - updated to eliminate gap with header */}
      <div 
        className={`fixed md:sticky top-0 left-0 h-full z-20 bg-[#121D34] dark:bg-gray-900 text-gray-400 flex flex-col transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:h-screen w-64 md:flex-shrink-0 md:rounded-r-[30px]`}
      >
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
              <div className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white transition-colors ml-8`}>
                <FaUser className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>
            
            <Link to={routes.chat}>
              <div className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white transition-colors ml-8`}>
                <FaComments className="h-5 w-5" />
                <span>Chat</span>
              </div>
            </Link>
            
            <Link to={routes.notifications}>
              <div className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white transition-colors ml-8`}>
                <FaBell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
            </Link>
            
            <Link to={routes.qrCode}>
              <div className={`flex items-center space-x-3 ${isActive(routes.qrCode) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white transition-colors ml-8`}>
                <FaQrcode className="h-5 w-5" />
                <span>QR Code</span>
              </div>
            </Link>
          </nav>
        )}

        <Link to="/login" onClick={handleLogout}>
          <div className="flex items-center space-x-3 text-[#395080] dark:text-gray-400 hover:text-white transition-colors ml-8 mt-8 mb-10">
            <FaSignOutAlt className="h-5 w-5" />
            <span>Logout</span>
          </div>
        </Link>
      </div>

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
      )}
    </>
  );
}