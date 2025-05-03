import React, { useContext } from "react";
import GridShape from "../../common/GridShape";
import ThemeTogglerTwo from "../../common/ThemeTogglerTwo";
import { ThemeContext } from "../../../context/ThemeContext";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png"; 

const AuthLayout = ({ children }) => {
  // If no children are provided, just render the right side panel
  if (!children) {
    return (
      <div className="hidden lg:block lg:w-1/2 h-full relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#34405f] via-[#5d6b9a] to-[#f6b332] dark:from-[#1d2438] dark:via-[#34405f] dark:to-[#d99b28]">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#f6b332]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#34405f]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Grid Shape overlay */}
          <GridShape />
          
          {/* Centered S4 logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="logo-container">
                <img src={logo} alt="Logo" className="h-[200px] w-[200px] object-contain" />
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md transform rotate-12 animate-float"></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 border border-white/20 rounded-full bg-white/10 backdrop-blur-md animate-float-delay"></div>
        </div>
        
        {/* Theme toggle button */}
        <div className="absolute bottom-6 right-6 z-50">
          <ThemeTogglerTwo />
        </div>
      </div>
    );
  }
  
  // Full layout with left and right sides when children are provided
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 overflow-hidden">
        <div className="lg:w-1/2 w-full relative z-10">
          {/* Animated background elements for the form side */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          
          {/* Children (sign-in/sign-up forms) with enhanced styling */}
          <div className="h-full flex items-center backdrop-blur-sm">
            {children}
          </div>
        </div>
        
        {/* Right side grid and content */}
        <div className="lg:w-1/2 w-full h-full bg-gradient-to-br from-[#34405f] via-[#5d6b9a] to-[#f6b332] dark:from-[#1d2438] dark:via-[#34405f] dark:to-[#d99b28] lg:flex items-center justify-center hidden relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#f6b332]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#34405f]/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Grid Shape overlay */}
          <GridShape />
          
          {/* Central content - logo */}
          <div className="relative z-10">
            <div className="flex flex-col items-center justify-center">
              <div className="logo-container">
                <img src={logo} alt="Logo" className="h-[200px] w-[200px] object-contain" />
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-lg bg-white/10 backdrop-blur-md transform rotate-12 animate-float"></div>
          <div className="absolute bottom-20 right-16 w-16 h-16 border border-white/20 rounded-full bg-white/10 backdrop-blur-md animate-float-delay"></div>
        </div>
        
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(12deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes logo-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(21, 235, 158, 0.7)); }
          50% { filter: drop-shadow(0 0 15px rgba(106, 0, 184, 0.8)); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .logo-container {
          animation: logo-breathe 3s ease-in-out infinite;
        }
        .animate-logo-pulse {
          animation: pulse 2s infinite;
        }
        .logo-text {
          color: white;
          position: relative;
          z-index: 10;
          text-shadow: 
            0 0 10px rgba(21, 235, 158, 0.8),
            0 0 20px rgba(106, 0, 184, 0.8),
            2px 2px 0 #15eb9e,
            -2px -2px 0 #6a00b8;
          letter-spacing: 2px;
          animation: glow-pulse 3s infinite;
        }
        
        .logo-text::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          filter: blur(2px);
          z-index: -1;
        }
        
        .glow-effect {
          box-shadow: 0 0 15px #15eb9e, 0 0 30px #6a00b8;
          animation: glow-pulse 2s infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;