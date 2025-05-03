import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineHome, MdWork, MdLogout } from "react-icons/md";
import { FaChartPie, FaUsers } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getCompanyProfile } from "../../../api/companyApi";
import logo from "../../../assets/images/logo.png";
import profile from "../../../assets/images/profile.jpeg";
import LoadingSpinner from "../../common/LoadingSpinner";
import LazyImage from "../../common/LazyImage";

const CompanySideBar = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user and company data using the structured API approach
  useEffect(() => {
    const auth = getAuth();
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Try to get profile from localStorage first for quick loading
          const storedProfile = localStorage.getItem('companyProfile');
          if (storedProfile) {
            setCompanyProfile(JSON.parse(storedProfile));
            setLoading(false);
          }
          
          // Then fetch latest data from API
          const response = await getCompanyProfile(currentUser.uid);
          if (response && response.data) {
            setCompanyProfile(response.data);
          }
        } catch (error) {
          console.error("Error fetching company profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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

  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
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
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          className={`flex items-center p-2 rounded-md ${
            isActive(link.path)
              ? "bg-orange-100 text-orange-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => isMobile && setIsOpen(false)}
        >
          {link.icon}
          <span className="ml-3">{link.name}</span>
        </Link>
      ))}
    </nav>
  );

  // Mobile version of the sidebar
  if (isMobile) {
    return (
      <div className="bg-white w-full">
        {/* Mobile header with menu button */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <LazyImage
              src={companyProfile?.companyLogo || profile}
              alt="Company Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="ml-2 font-medium text-sm text-gray-800 truncate">
              {companyProfile?.companyName || "Company Name"}
            </span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none"
          >
            {isOpen ? <MdLogout size={20} /> : <MdOutlineHome size={20} />}
          </button>
        </div>

        {/* Mobile menu - conditionally rendered */}
        {isOpen && (
          <div className="px-4 py-2">
            <NavigationLinks />
            
            {/* Footer text */}
            <div className="mt-6 text-xs text-gray-500 px-2">
              <p>Terms and conditions of use:</p>
              <div className="flex space-x-1">
                <a href="#" className="text-blue-500 hover:underline">Privacy policy</a>
                <span>,</span>
                <a href="#" className="text-blue-500 hover:underline">Cookie policy</a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version of the sidebar (original implementation)
  return (
    <div className="h-full bg-white py-4 px-3">
      {/* Profile quick info - smaller height */}
      <div className="flex items-center mb-6 px-2">
        <LazyImage
          src={companyProfile?.companyLogo || profile}
          alt="Company Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-2 font-medium text-sm text-gray-800 truncate">
          {companyProfile?.companyName || "Company Name"}
        </span>
      </div>
      
      {/* Navigation links - more compact */}
      <NavigationLinks />
      
      {/* Footer text - more compact */}
      <div className="mt-6 text-xs text-gray-500 px-2">
        <p>Terms and conditions of use:</p>
        <div className="flex space-x-1">
          <a href="#" className="text-blue-500 hover:underline">Privacy policy</a>
          <span>,</span>
          <a href="#" className="text-blue-500 hover:underline">Cookie policy</a>
        </div>
      </div>
    </div>
  );
};

export default CompanySideBar;