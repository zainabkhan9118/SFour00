import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaComments, FaBriefcase, FaBell, FaQrcode, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../api/companyApi";
import { ThemeContext } from "../../context/ThemeContext";
import logo from "../../assets/images/logo.png";
// import LoadingSpinner from "../common/LoadingSpinner";
import LogoutSuccessPopup from "../user/popupModel/LogoutSuccessPopup";
import CompanyProfileCompletionPopup from "./profile/CompanyProfileCompletionPopup";
import { useCompanyProfileCompletion } from "../../context/profile/CompanyProfileCompletionContext";

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const { isProfileComplete, isLoading, checkProfileCompletion } = useCompanyProfileCompletion();
  
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  // Function to check if a route is active
  const isActive = (path) => {
    // For routes, check if current path equals or starts with the route path
    return currentPath === path || currentPath.startsWith(path);
  };

  // Fetch user and company data on component mount
  useEffect(() => {
    const fetchUserAndCompanyData = async () => {
      setLogoLoading(true);
      const auth = getAuth();
      
      // Use Firebase's auth state listener
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          
          try {
            // Try to get profile from localStorage first for quick loading
            const storedProfile = localStorage.getItem('companyProfile');
            if (storedProfile) {
              const parsedProfile = JSON.parse(storedProfile);
              
              // Verify this profile belongs to the current user
              if (parsedProfile && parsedProfile.firebaseUID === user.uid) {
                setCompanyProfile(parsedProfile);
                setHasProfile(!!parsedProfile.companyName);
              } else {
                // Clear invalid profile data
                localStorage.removeItem('companyProfile');
              }
            }
            
            // Fetch fresh data from API using the structured API function
            const response = await getCompanyProfile(user.uid);
            
            // Only set the profile if the data belongs to this user and contains required fields
            if (response && response.data) {
              // Check if profile has essential data
              const hasEssentialData = response.data.companyName && 
                                       response.data.companyEmail;
              
              setCompanyProfile(response.data);
              setHasProfile(hasEssentialData);
              
              // Store in localStorage for quick loading next time
              if (hasEssentialData) {
                localStorage.setItem('companyProfile', JSON.stringify(response.data));
              }
            } else {
              // If no valid profile data, ensure we show the placeholder
              setHasProfile(false);
              setCompanyProfile(null);
            }
          } catch (error) {
            console.error("Error fetching company profile:", error);
            setHasProfile(false);
          }
        }
        setLogoLoading(false);
      });
      
      // Cleanup subscription
      return () => unsubscribe();
    };
    
    fetchUserAndCompanyData();
  }, []);

  useEffect(() => {
    // Load routes configuration
    setLoading(true);
    
    // Define routes for the sidebar navigation
    const sidebarRoutes = {
      profile: "/company-profile",
      chat: "/chat", 
      notifications: "/notification",
      qrCode: "/qr-code",
      rota: "/rota-management",
      findWorker: "/find-worker"
    };
    setRoutes(sidebarRoutes);
    setLoading(false);
  }, []);

  // Toggle menu visibility on mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for route navigation with profile check
  const handleNavigation = async (e, path) => {
    // Always allow navigation to profile page
    if (path === routes.profile) {
      navigate(path);
      return;
    }
    
    // Use cached result if available
    if (localStorage.getItem("companyProfileComplete") === "true") {
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
      setShowCompletionPopup(true);
    }
  };

  // Handler for profile click
  const handleProfileClick = () => {
    navigate("/company-profile");
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
  
  // Handle closing the profile completion popup
  const handleCloseCompletionPopup = () => {
    setShowCompletionPopup(false);
  };

  // Determine if we should disable options based on profile completion
  const shouldDisableOptions = () => {
    if (localStorage.getItem("companyProfileComplete") === "true") {
      return false;
    }
    return !isLoading && !isProfileComplete;
  };

  const disabledStatus = shouldDisableOptions();

  return (
    <>
      {/* Mobile Menu Button - only visible on small screens */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-[#121D34] dark:bg-gray-900 rounded-md text-white"
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
        className={`fixed md:static md:translate-x-0 min-h-screen z-20 bg-[#121D34] dark:bg-gray-900 text-gray-400 flex flex-col p-5 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:min-h-screen w-64 md:w-auto md:flex-shrink-0 rounded-tr-[30px] rounded-br-[30px]`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          {logoLoading ? (
            <div className="w-24 h-24 flex items-center justify-center">
              {/* Loading spinner removed */}
            </div>
          ) : hasProfile ? (
            // Show actual company logo if profile exists and has a logo
            <img 
              src={companyProfile?.companyLogo || logo} 
              alt="Company Logo" 
              className="w-24 h-24 object-contain mb-4"
              onClick={handleProfileClick}
            />
          ) : (
            // Show default logo for new companies
            <img src={logo} alt="Logo" className="w-24 mb-4" />
          )}
        </div>

        {loading ? (
          <div className="flex justify-center mt-4">
            {/* Loading spinner removed */}
          </div>
        ) : (
          <nav className="flex flex-col space-y-8 mb-auto">
            <Link to={routes.profile}>
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaUser className="h-5 w-5" />
                <span>Profile</span>
              </div>
            </Link>

            <Link 
              to={routes.chat}
              onClick={(e) => handleNavigation(e, routes.chat)}
              className={disabledStatus ? "cursor-not-allowed" : ""}
            >
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaComments className="h-5 w-5" />
                <span>Chat</span>
              </div>
            </Link>

            <Link 
              to={routes.notifications}
              onClick={(e) => handleNavigation(e, routes.notifications)}
              className={disabledStatus ? "cursor-not-allowed" : ""}
            >
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaBell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
            </Link>

            <Link 
              to={routes.qrCode}
              onClick={(e) => handleNavigation(e, routes.qrCode)}
              className={disabledStatus ? "cursor-not-allowed" : ""}
            >
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.qrCode) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaQrcode className="h-5 w-5" />
                <span>QR Code</span>
              </div>
            </Link>

            {/* Rota Management */}
            <Link 
              to={routes.rota}
              onClick={(e) => handleNavigation(e, routes.rota)}
              className={disabledStatus ? "cursor-not-allowed" : ""}
            >
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.rota) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaBriefcase className="h-5 w-5" />
                <span>Rota Management</span>
              </div>
            </Link>

            {/* Find Worker */}
            <Link 
              to={routes.findWorker}
              onClick={(e) => handleNavigation(e, routes.findWorker)}
              className={disabledStatus ? "cursor-not-allowed" : ""}
            >
              <div 
                className={`flex items-center space-x-3 ${isActive(routes.findWorker) ? 'text-white' : 'text-[#395080] dark:text-gray-400'} hover:text-white ml-8 cursor-pointer`}
              >
                <FaUsers className="h-5 w-5" />
                <span>Find Worker</span>
              </div>
            </Link>
          </nav>
        )}

        <Link to="/login" onClick={handleLogout}>
          <div className="flex items-center space-x-3 text-[#395080] dark:text-gray-400 hover:text-white ml-8 mt-8">
            <FaSignOutAlt className="h-5 w-5" />
            <span>Logout</span>
          </div>
        </Link>
      </div>

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
      )}
      
      {/* Profile Completion Popup */}
      {showCompletionPopup && (
        <CompanyProfileCompletionPopup onClose={handleCloseCompletionPopup} />
      )}
    </>
  );
}