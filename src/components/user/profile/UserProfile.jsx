import React, { useEffect, useState, useContext } from "react";
import { User } from "lucide-react";
import UserSidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const jobSeekerId = localStorage.getItem("jobSeekerId");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (jobSeekerId) {
      navigate("/User-PersonalDetails");
    }
  }, [jobSeekerId, navigate]);

  const handleCompleteProfile = () => {
    navigate("User-UserProfile");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 border-r dark:border-gray-700">
          <UserSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <main className="flex flex-col overflow-auto">
          {!jobSeekerId && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">Please Complete Your Profile</h2>
              <button
                onClick={handleCompleteProfile}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition duration-300"
              >
                Complete Profile
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;

