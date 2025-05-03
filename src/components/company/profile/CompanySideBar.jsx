import React, { useState, useEffect } from "react";
import axios from 'axios';
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

const CompanySideBar = ({ isMobile = false }) => {
  const [companyData, setCompanyData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchCompanyData = async (user) => {
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/company', {
          headers: {
            "firebase-id": user.uid
          }
        });
        if (response.data && response.data.data) {
          setCompanyData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    const auth = getAuth();
    
    // Use Firebase's auth state listener instead of immediately checking currentUser
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompanyData(user);
      } else {
        setIsLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout with proper cleanup
  const handleLogout = async () => {
    try {
      // Clear all data from localStorage
      localStorage.clear();
      
      // Sign out from Firebase
      const auth = getAuth();
      await signOut(auth);
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
        className={`flex items-center p-2 rounded-md ${
          isActive('/recents-jobs') || isActive('/job-posting')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaBriefcase className="text-orange-500 mr-3" size={14} />
        <span>Jobs</span>
      </Link>
      
      <Link
        to="/ResetPassword"
        className={`flex items-center p-2 rounded-md ${
          isActive('/ResetPassword')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <FaKey className="text-orange-500 mr-3" size={14} />
        <span>Reset Password</span>
      </Link>
      
      <Link
        to="/rota-management"
        className={`flex items-center p-2 rounded-md ${
          isActive('/rota-management')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <img src={vector1} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>Rota Management</span>
      </Link>

      <Link
        to="/problems-reported"
        className={`flex items-center p-2 rounded-md ${
          isActive('/problems-reported')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <img src={s4} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>Contact S4 Support</span>
      </Link>
      
      <Link
        to="/faq"
        className={`flex items-center p-2 rounded-md ${
          isActive('/faq')
            ? "bg-orange-100 text-orange-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        <img src={faq} alt="" className="text-orange-500 mr-3 h-3.5 w-3.5" />
        <span>FAQ's</span>
      </Link>
      
    </nav>
  );

  // Mobile version of the sidebar
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden transition-colors duration-200">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <img
              src={companyData?.companyLogo || company}
              alt="Company Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="ml-2 font-medium text-sm text-gray-800 dark:text-white truncate">
              {companyData?.companyName || "Company Name"}
            </span>
          </div>
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
    );
  }

  // Desktop version of the sidebar
  return (
    <div className="h-full bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden transition-colors duration-200">
      {/* Profile quick info - smaller height */}
      <div className="flex items-center p-4 border-b dark:border-gray-700">
        <img
          src={companyData?.companyLogo || company}
          alt="Company Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 font-medium text-sm text-gray-800 dark:text-white truncate">
          {companyData?.companyName || "Company Name"}
        </span>
      </div>
      
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
  );
};

export default CompanySideBar;