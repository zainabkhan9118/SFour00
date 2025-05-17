import React, { useState, useEffect, useContext } from "react";
import { getCompanyProfile } from "../../../api/companyApi";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import vector1 from "../../../assets/images/vector1.png";
import s4 from "../../../assets/images/s4.png";
import faq from "../../../assets/images/faq.png";
import company from "../../../assets/images/company.png";
import { FaUser, FaBriefcase, FaKey, FaExclamationTriangle, FaSignOutAlt, FaBars, FaTimes, FaUsers, FaChartPie } from "react-icons/fa";
import { MdOutlineHome, MdWork, MdLogout } from "react-icons/md";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import { useCompanyProfileCompletion } from "../../../context/profile/CompanyProfileCompletionContext";
import CompanyProfileCompletionPopup from "./CompanyProfileCompletionPopup";
import LogoutSuccessPopup from "../../user/popupModel/LogoutSuccessPopup";
import { ThemeContext } from "../../../context/ThemeContext";

const CompanyProfileSkeleton = () => (
  <div className="flex items-center p-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    <div className="ml-2 h-4 w-24 bg-gray-200 rounded"></div>
  </div>
);

const CompanySideBar = ({ isMobile = false }) => {
  const [companyData, setCompanyData] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { isProfileComplete, isLoading: profileLoading, checkProfileCompletion } = useCompanyProfileCompletion();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Fetch user and company data using the structured API approach
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  // Check if current path matches route or is a sub-route
  const isActive = (path) => {
    return currentPath === path || currentPath.startsWith(path);
  };

  // Check profile completion status on initial load
  useEffect(() => {
    // If we have a cached result indicating completion, use it
    if (localStorage.getItem("companyProfileComplete") !== "true") {
      checkProfileCompletion();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCompanyData = async (user) => {
      if (!user || !isMounted) {
        console.error("User not authenticated or component unmounted");
        setIsLoading(false);
        return;
      }

      try {
        // Try to get data from localStorage first
        const cachedData = localStorage.getItem('companyData');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCompanyData(parsedData);
          setIsLoading(false);
        }

        // Fetch fresh data from the API using getCompanyProfile
        const response = await getCompanyProfile(user.uid);
        
        if (response?.data && isMounted) {
          setCompanyData(response.data);
          // Cache the fresh data
          localStorage.setItem('companyData', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    const auth = getAuth();
    
    // Use Firebase's auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isMounted) {
        fetchCompanyData(user);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for protected route navigation - now an async function
  const handleProtectedNavigation = async (e, path) => {
    // Allow navigation to profile section regardless of completion status
    if (path === "/company-profile" || path === "/company-details") {
      return;
    }
    
    // Use cached result if available
    if (localStorage.getItem("companyProfileComplete") === "true") {
      return; // Allow navigation
    }
    
    // If context says we're complete and not loading, allow navigation
    if (isProfileComplete && !profileLoading) {
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

  // Handle logout with proper cleanup
  const handleLogout = async () => {
    try {
      // Clear all data from localStorage
      localStorage.clear();
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Show success popup
      setShowLogoutPopup(true);
    } catch (error) {
      console.error("Error logging out:", error);
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
  const shouldDisableOptions = () => {
    if (localStorage.getItem("companyProfileComplete") === "true") {
      return false;
    }
    return !profileLoading && !isProfileComplete;
  };

  const disabledStatus = shouldDisableOptions();

  // Define navigation links
  const navLinks = [
    {
      name: "Dashboard",
      icon: <MdOutlineHome className="text-xl" />,
      path: "/dashboard-company",
    },
    {
      name: "My Profile",
      icon: <FaUsers className="text-xl" />,
      path: "/company-profile",
    },
    {
      name: "Jobs",
      icon: <MdWork className="text-xl" />,
      path: "/recents-jobs",
    },
    {
      name: "Statistics",
      icon: <FaChartPie className="text-xl" />,
      path: "/statistics",
    },
  ];

  // Navigation links component - reused in both desktop and mobile views
  const NavigationLinks = () => (
    <nav className="flex flex-col space-y-4 text-sm">
      <Link
        to="/company-profile"
        className={`flex items-center p-2 rounded-md ${
          isActive('/company-profile') || isActive('/company-details')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaUser className="text-orange-500 mr-3" size={14} />
        <span>Company Details</span>
      </Link>
      
      <Link
        to="/recents-jobs"
        className={`${disabledStatus ? "cursor-not-allowed" : ""} flex items-center p-2 rounded-md ${
          isActive('/recents-jobs') || isActive('/job-posting')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={(e) => {
          if (isMobile) setIsMenuOpen(false);
          handleProtectedNavigation(e, "/recents-jobs");
        }}
      >
        <FaBriefcase className="text-orange-500 mr-3" size={14} />
        <span>Jobs</span>
      </Link>
      
      <Link
        to="/ResetPassword"
        className={`${disabledStatus ? "cursor-not-allowed" : ""} flex items-center p-2 rounded-md ${
          isActive('/ResetPassword')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={(e) => {
          if (isMobile) setIsMenuOpen(false);
          handleProtectedNavigation(e, "/ResetPassword");
        }}
      >
        <FaKey className="text-orange-500 mr-3" size={14} />
        <span>Reset Password</span>
      </Link>
      
      <Link
        to="/rota-management"
        className={`${disabledStatus ? "cursor-not-allowed" : ""} flex items-center p-2 rounded-md ${
          isActive('/rota-management')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={(e) => {
          if (isMobile) setIsMenuOpen(false);
          handleProtectedNavigation(e, "/rota-management");
        }}
      >
        <img src={vector1} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>Rota Management</span>
      </Link>

      <Link
        to="/problems-reported"
        className={`${disabledStatus ? "cursor-not-allowed" : ""} flex items-center p-2 rounded-md ${
          isActive('/problems-reported')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={(e) => {
          if (isMobile) setIsMenuOpen(false);
          handleProtectedNavigation(e, "/problems-reported");
        }}
      >
        <img src={s4} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>Contact S4 Support</span>
      </Link>
      
      <Link
        to="/faq"
        className={`${disabledStatus ? "cursor-not-allowed" : ""} flex items-center p-2 rounded-md ${
          isActive('/faq')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={(e) => {
          if (isMobile) setIsMenuOpen(false);
          handleProtectedNavigation(e, "/faq");
        }}
      >
        <img src={faq} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>FAQ's</span>
      </Link>
      
      <div 
        className="flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          if (isMobile) setIsMenuOpen(false);
          handleLogout();
        }}
      >
        <FaSignOutAlt className="text-orange-500 mr-3" size={14} />
        <span>Logout</span>
      </div>
    </nav>
  );

  // Profile info component - reused in both mobile and desktop versions
  const CompanyProfileInfo = () => (
    <div className="flex items-center p-4 border-b dark:border-gray-700">
      {isLoading ? (
        <CompanyProfileSkeleton />
      ) : (
        <>
          <img
            src={!imageError ? (companyData?.companyLogo || company) : company}
            alt="Company Logo"
            className="w-8 h-8 rounded-full object-cover"
            onError={() => setImageError(true)}
          />
          <span className="ml-2 font-medium text-sm text-gray-800 dark:text-white truncate">
            {companyData?.companyName || "Company Name"}
          </span>
        </>
      )}
    </div>
  );

  // Mobile version of the sidebar
  if (isMobile) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden transition-colors duration-200">
          {/* Mobile header with menu button */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <CompanyProfileInfo />
            <button 
              onClick={toggleSidebar}
              className="text-gray-600 dark:text-gray-400 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          {/* Mobile menu - conditionally rendered */}
          {isMenuOpen && (
            <div className="px-4 py-2">
              <NavigationLinks />
              
              {/* Footer text */}
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 px-2">
                <p>Terms and conditions of use:</p>
                <div className="flex space-x-1">
                  <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Privacy policy</a>
                  <span>,</span>
                  <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Cookie policy</a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Completion Popup */}
        {showProfilePopup && (
          <CompanyProfileCompletionPopup onClose={() => setShowProfilePopup(false)} />
        )}

        {/* Logout Success Popup */}
        {showLogoutPopup && (
          <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
        )}
      </>
    );
  }

  // Desktop version of the sidebar
  return (
    <>
      <div className="h-full bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden transition-colors duration-200">
        <CompanyProfileInfo />
        
        {/* Navigation links - more compact */}
        <div className="p-4">
          <NavigationLinks />
        </div>
        
        {/* Footer text - more compact */}
        <div className="mt-auto p-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Terms and conditions of use:</p>
          <div className="flex space-x-1">
            <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Privacy policy</a>
            <span>,</span>
            <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">Cookie policy</a>
          </div>
        </div>
      </div>

      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <CompanyProfileCompletionPopup onClose={() => setShowProfilePopup(false)} />
      )}

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <LogoutSuccessPopup onClose={handleCloseLogoutPopup} />
      )}
    </>
  );
};

export default CompanySideBar;