import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../api/companyApi";
import logo from "../../assets/images/logo.png";
import profile from "../../assets/images/profileImage.png";
import { FaSearch, FaHome, FaBriefcase, FaBell, FaUsers, FaComments } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { ThemeContext } from "../../context/ThemeContext";
import LoadingSpinner from "../common/LoadingSpinner";
import LazyImage from "../common/LazyImage";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [activePage, setActivePage] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext) || { theme: 'light', toggleTheme: () => {} };

  // Fetch user and company data on component mount
  useEffect(() => {
    const fetchUserAndCompanyData = async () => {
      setLoading(true);
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
        } else {
          // If not logged in, redirect to login
          console.log("User not logged in, redirecting to login");
          navigate("/login");
        }
        setLoading(false);
      });
      
      // Cleanup subscription
      return () => unsubscribe();
    };
    
    fetchUserAndCompanyData();
  }, [navigate]);

  // Set active page based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("home")) {
      setActivePage("home");
    } else if (path.includes("job")) {
      setActivePage("jobs");
    } else if (path.includes("chat")) {
      setActivePage("chats");
    } else if (path.includes("notification")) {
      setActivePage("notifications");
    } else if (path.includes("user")) {
      setActivePage("users");
    }
  }, [location]);

  // Handler for profile click
  const handleProfileClick = () => {
    navigate("/company-profile");
  };

  // Function to get the title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/company-profile":
        return "Company Profile";
      case "/job-posting":
        return "Job Posting";
      case "/problems-reported":
        return "Problem Reports";
      case "/rota-management":
        return "Rota Management";
      case "/chat-support":
        return "Chat Support";
      case "/faq":
        return "FAQ's";
      case "/notification":
        return "Notifications";
      case "/chat":
        return "Messages";
      case "/recents-jobs":
        return "Recent Jobs";
      case "/job-assigned":
        return "Assigned Jobs";
      case "/in-progress":
        return "In-Progress Jobs";
      case "/completed-job":
        return "Completed Jobs";
      default:
        return null; // Don't display a title if route isn't recognized
    }
  };

  const title = getPageTitle();

  return (
    <div className={`sticky top-0 z-10 flex justify-between items-center px-4 md:px-6 py-3 md:py-4 shadow-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} transition-colors duration-200`}>

      {/* Title - only shown if there's a title for the current route */}
      {title && (
        <h1 className="text-lg md:text-xl font-bold">{title}</h1>
      )}
      {!title && <div></div>} {/* Empty div to maintain flex layout when no title */}

      {/* User Info */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-xl">
          {theme === 'dark' ? <BsSun className="text-yellow-500" /> : <BsMoon className="text-gray-500" />}
        </button>

        {/* Company Info */}
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="w-8 h-8 md:w-10 md:h-10">
              <LoadingSpinner size="sm" />
            </div>
          ) : hasProfile ? (
            // Show actual company data if profile exists and has name
            <>
              <img
                src={companyProfile?.companyLogo || logo}
                alt="Company Logo"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
              />
              <span className="font-medium text-sm md:text-base max-w-[100px] md:max-w-[200px] truncate">
                {companyProfile?.companyName || "Company Name"}
              </span>
              <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></span>
            </>
          ) : (
            // Show placeholder for new companies without profiles
            <>
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border border-gray-200 cursor-pointer"
                onClick={handleProfileClick}
              >
                <FaUsers className="text-lg" />
              </div>
              <div 
                className="flex flex-col cursor-pointer"
                onClick={handleProfileClick}
              >
                <span className="font-medium text-sm md:text-base text-gray-600 dark:text-gray-300">
                  New Company
                </span>
                <span className="text-xs text-orange-500">
                  Complete Profile
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;