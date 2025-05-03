import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function LoadingSpinner() {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-70">
      <div className="relative h-20 w-20">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#f6b332]"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-l-4 border-r-4 border-[#34405f] dark:border-[#f6b332] animate-[spin_1.5s_linear_infinite]" style={{ animationDirection: 'reverse' }}></div>
      </div>
    </div>
  );
}