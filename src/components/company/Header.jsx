import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../api/companyApi";
import logo from "../../assets/images/logo.png";
import profile from "../../assets/images/profileImage.png";
import { FaSearch, FaHome, FaBriefcase, FaBell, FaUsers, FaComments } from "react-icons/fa";
import LoadingSpinner from "../common/LoadingSpinner";
import LazyImage from "../common/LazyImage";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("");

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
              setCompanyProfile(JSON.parse(storedProfile));
            }
            
            // Fetch fresh data from API using the structured API function
            const response = await getCompanyProfile(user.uid);
            if (response && response.data) {
              setCompanyProfile(response.data);
            }
          } catch (error) {
            console.error("Error fetching company profile:", error);
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
    <div className="flex justify-between items-center bg-white px-4 md:px-6 py-3 md:py-4 shadow-sm">
      {/* Title - only shown if there's a title for the current route */}
      {title && (
        <h1 className="text-lg md:text-xl font-bold text-gray-800">{title}</h1>
      )}
      {!title && <div></div>} {/* Empty div to maintain flex layout when no title */}

      {/* User Info */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notification Icon */}

        {/* <button className="relative">
          <FaBell className="text-orange-500 text-xl" />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">

            3
          </span>
        </button> */}

        {/* Company Info */}
        <div className="flex items-center space-x-2">
          <img
            src={companyProfile?.companyLogo || logo}
            alt="Company Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
          />
          <span className="font-medium text-sm md:text-base text-gray-800 max-w-[100px] md:max-w-[200px] truncate">
            {companyProfile?.companyName || "Company Name"}
          </span>
          <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Header;