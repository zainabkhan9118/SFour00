import { useState, useEffect } from "react";
import Sidebar from "../company/Sidebar";
import Header from "../company/Header";
import PropTypes from "prop-types";

const CompanyLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle menu state for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile Menu Toggle Button - Only visible on mobile, hidden in layout */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-[#121D34] dark:bg-[#0c1628] rounded-md text-white md:hidden"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      )}

      {/* Overlay for Mobile */}
      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main Sidebar - positioned to eliminate gap with header */}
      <div
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 h-screen transition-all duration-300 ease-in-out 
          ${isMobile && !isMenuOpen ? "-translate-x-full" : "translate-x-0"} 
          md:translate-x-0 md:flex md:flex-shrink-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content - with Header and content area */}
      <div className="flex-1 flex flex-col md:ml-0 transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 overflow-auto dark:bg-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

CompanyLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CompanyLayout;