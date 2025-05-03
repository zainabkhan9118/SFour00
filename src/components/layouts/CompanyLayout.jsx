import { useState, useEffect, useContext } from "react";
import Sidebar from "../company/Sidebar";
import Header from "../company/Header";
import PropTypes from "prop-types";
import { ThemeContext } from "../../context/ThemeContext";

const CompanyLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

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
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar - fixed position on desktop, conditionally showing on mobile */}
      <div 
        className={`${isMobile ? (isMenuOpen ? "block fixed" : "hidden") : "block"} z-30`}
        style={{ height: '100vh' }}
      >
        <Sidebar />
      </div>

      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-[#121D34] dark:bg-gray-800 rounded-md text-white md:hidden"
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

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
        <Header />
        <main className="flex-1 overflow-auto p-4 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
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