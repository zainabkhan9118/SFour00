import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import logo from "../../assets/images/logo.png";
import breifcase from "../../assets/images/solar_case-bold-duotone.png";
import profile from "../../assets/images/icons8_user.png";
import chat from "../../assets/images/lets-icons_chat-duotone.png";
import work from "../../assets/images/ic_twotone-work.png";
import notifications from "../../assets/images/icons8_notification.png";
import ProfileCompletionPopup from "../user/popupModel/ProfileCompletionPopup";
import LogoutSuccessPopup from "../user/popupModel/LogoutSuccessPopup";
import { useProfileCompletion } from "../../context/profile/ProfileCompletionContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { isProfileComplete, isLoading, checkProfileCompletion } = useProfileCompletion();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  // Check profile completion status on initial load
  useEffect(() => {
    // If we have a cached result indicating completion, use it
    if (localStorage.getItem("profileComplete") !== "true") {
      checkProfileCompletion();
    }
  }, []);

  // List of routes for easier checking
  const routes = {
    jobs: "/User-Job",  // Updated to match actual route case
    profile: "/User-PersonalDetails",
    chat: "/User-UserChatPage",
    work: "/User-WorkApplied",
    notifications: "/User-UserNotification"
  };

  // Check if current path matches route or is a sub-route
  const isActive = (path) => {
    // Convert current path to lowercase for case-insensitive comparison
    const lowerCurrentPath = currentPath.toLowerCase();
    const lowerPath = path.toLowerCase();
    
    // For profile routes, check if the path starts with User-User or User-Personal
    if (path === routes.profile) {
      return currentPath === path || 
             currentPath.startsWith("/User-Personal") || 
             currentPath.startsWith("/User-Bank") ||
             currentPath.startsWith("/User-FAQSection");
    }
    // For jobs route, also check if on job details page
    if (path === routes.jobs) {
      return lowerCurrentPath === lowerPath || 
             lowerCurrentPath.startsWith("/user-jobdetails/");
    }
    //For My Work route, also check if on work details page
    if (path === routes.work) {
      return currentPath === path || 
             currentPath.startsWith("/User-MyWorkAssignedPage") ||
             currentPath.startsWith("/User-workInprogess") ||
             currentPath.startsWith("/User-WorkCompleted") ;

    }
    // For other routes, exact match
    return lowerCurrentPath === lowerPath;
  };

  // Toggle menu visibility on mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for protected route navigation - now an async function
  const handleProtectedNavigation = async (e, path) => {
    // Allow navigation to profile section regardless of completion status
    if (path === routes.profile) return;
    
    // Use cached result if available
    if (localStorage.getItem("profileComplete") === "true") {
      return; // Allow navigation
    }
    
    // If context says we're complete and not loading, allow navigation
    if (isProfileComplete && !isLoading) {
      return;
    }
    
    // Otherwise check profile completion
    e.preventDefault();
    
    // Wait for the profile check to complete
    const isComplete = await checkProfileCompletion(true);
    
    // If profile is complete, navigate to the intended path
    if (isComplete) {
      navigate(path);
    } else {
      // Otherwise show popup
      setShowProfilePopup(true);
    }
  };

  // Handler for logout functionality
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Clear local storage
      localStorage.clear();
      // Sign out from Firebase
      await signOut(auth);
      // Show success popup instead of redirecting immediately
      setShowLogoutPopup(true);
    } catch (error) {
      console.error("Error during logout:", error);
      // Still navigate to login page if there's an error
      navigate("/login");
    }
  };

  // Handle closing the logout popup
  const handleCloseLogoutPopup = () => {
    setShowLogoutPopup(false);
    // Navigate to login page after closing the popup
    navigate("/login");
  };

  // Determine if we should disable options based on profile completion
  // Use cached result when available
  const shouldDisableOptions = () => {
    if (localStorage.getItem("profileComplete") === "true") {
      return false;
    }
    return !isLoading && !isProfileComplete;
  };

  const disabledStatus = shouldDisableOptions();

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

      {/* Sidebar component */}
      <div 
        className={`fixed md:static md:translate-x-0 min-h-screen z-20 bg-[#121D34] dark:bg-gray-900 text-gray-400 flex flex-col p-5 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:min-h-screen w-64 md:w-auto md:flex-shrink-0 rounded-tr-[30px] rounded-br-[30px]`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-4" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-8 mb-auto">
          <Link 
            to={routes.jobs}
            onClick={(e) => handleProtectedNavigation(e, routes.jobs)}
            className={disabledStatus ? "cursor-not-allowed" : ""}
          >
            <div className={`flex items-center space-x-3 ${isActive(routes.jobs) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8`}>
              <img src={breifcase} alt="Logo" className="h-6 w-6" />
              <span>Jobs</span>
            </div>
          </Link>

          <Link to={routes.profile}>
            <div className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8`}>
              <img src={profile} alt="profile" className="h-6 w-6" />
              <span>Profile</span>
            </div>
          </Link>

          <Link 
            to={routes.chat}
            onClick={(e) => handleProtectedNavigation(e, routes.chat)}
            className={disabledStatus ? "cursor-not-allowed" : ""}
          >
            <div className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8`}>
              <img src={chat} alt="chat" className="h-7 w-7" />
              <span>Chat</span>
            </div>
          </Link>

          <Link 
            to={routes.work}
            onClick={(e) => handleProtectedNavigation(e, routes.work)}
            className={disabledStatus ? "cursor-not-allowed" : ""}
          >
            <div className={`flex items-center space-x-3 ${isActive(routes.work) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8`}>
              <img src={work} alt="work" className="h-6 w-6" />
              <span>My Work</span>
            </div>
          </Link>

          <Link 
            to={routes.notifications}
            onClick={(e) => handleProtectedNavigation(e, routes.notifications)}
            className={disabledStatus ? "cursor-not-allowed" : ""}
          >
            <div className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8`}>
              <img src={notifications} alt="work" className="h-6 w-6" />
              <span>Notifications</span>
            </div>
          </Link>
        </nav>

        <Link to="/login" onClick={handleLogout}>
          <div className="flex items-center space-x-3 text-[#395080] dark:text-gray-400 hover:text-white ml-8 mt-8">
            <p className="text-3xl"> →</p>
            <span>Logout</span>
          </div>
        </Link>
      </div>

      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup onClose={() => setShowProfilePopup(false)} />
      )}

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
      )}
    </>
  );
};

export default Sidebar;