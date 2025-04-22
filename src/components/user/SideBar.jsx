import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import breifcase from "../../assets/images/solar_case-bold-duotone.png";
import profile from "../../assets/images/icons8_user.png";
import chat from "../../assets/images/lets-icons_chat-duotone.png";
import work from "../../assets/images/ic_twotone-work.png";
import notifications from "../../assets/images/icons8_notification.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  // List of routes for easier checking
  const routes = {
    jobs: "/user-Job",
    profile: "/User-UserProfile",
    chat: "/User-UserChatPage",
    work: "/User-WorkApplied",
    notifications: "/User-UserNotification"
  };

  // Check if current path matches route or is a sub-route
  const isActive = (path) => {
    // For profile routes, check if the path starts with User-User or User-Personal
    if (path === routes.profile) {
      return currentPath === path || 
             currentPath.startsWith("/User-Personal") || 
             currentPath.startsWith("/User-Bank") ||
             currentPath.startsWith("/User-FAQSection");
    }
    // For jobs route, also check if on job details page
    if (path === routes.jobs) {
      return currentPath === path || 
             currentPath.toLowerCase().startsWith("/user-jobdetails/") ||
             currentPath.startsWith("/User-JobDetails/");
    }
    // For other routes, exact match
    return currentPath === path;
  };

  // Toggle menu visibility on mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button - only visible on small screens */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-[#121D34] rounded-md text-white"
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
        className={`fixed md:static md:translate-x-0 min-h-screen z-20  bg-[#121D34] text-gray-400 flex flex-col p-5 border rounded-lg transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:min-h-screen md:w-64 w-64 rounded-tr-[30px] rounded-br-[30px]`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Logo" className="w-24 mb-4" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-8 mb-auto">
          <Link to={routes.jobs}>
            <div className={`flex items-center space-x-3 ${isActive(routes.jobs) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={breifcase} alt="Logo" className="h-6 w-6" />
              <span>Jobs</span>
            </div>
          </Link>

          <Link to={routes.profile}>
            <div className={`flex items-center space-x-3 ${isActive(routes.profile) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={profile} alt="profile" className="h-6 w-6" />
              <span>Profile</span>
            </div>
          </Link>

          <Link to={routes.chat}>
            <div className={`flex items-center space-x-3 ${isActive(routes.chat) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={chat} alt="chat" className="h-7 w-7" />
              <span>Chat</span>
            </div>
          </Link>

          <Link to={routes.work}>
            <div className={`flex items-center space-x-3 ${isActive(routes.work) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={work} alt="work" className="h-6 w-6" />
              <span>My Work</span>
            </div>
          </Link>

          <Link to={routes.notifications}>
            <div className={`flex items-center space-x-3 ${isActive(routes.notifications) ? 'text-white' : 'text-[#395080]'} hover:text-white ml-8`}>
              <img src={notifications} alt="work" className="h-6 w-6" />
              <span>Notifications</span>
            </div>
          </Link>
        </nav>

        <Link to="/login" onClick={() => { /* Optional: Add logout logic here */ }}>
          <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8 mt-8">
            <p className="text-3xl"> →</p>
            <span>Logout</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Sidebar;