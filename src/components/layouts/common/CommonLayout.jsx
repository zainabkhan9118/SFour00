import { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * A responsive layout component for common routes like login, signup, home, etc.
 * This layout adapts to mobile and desktop screens without a sidebar.
 */
const CommonLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header for mobile devices (optional) */}
      {isMobile && (
        <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/src/assets/images/logo.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
          </div>
        </header>
      )}

      {/* Main Content without extra padding */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
};

CommonLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CommonLayout;