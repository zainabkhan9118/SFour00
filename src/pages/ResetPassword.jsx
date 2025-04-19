import {FiEye, FiEyeOff} from "react-icons/fi";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from 'react-icons/hi';

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-4 bg-white rounded-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-4 text-center text-[32px] font-bold text-[#1F2B44]">
          Reset Password
        </h2>

        {/* Description */}
        <p className="text-center text-[15px] bold-[400px] text-gray-600 font-poppins">
          Dui luctus interdum metus, ut consectetur ante consectetur sed. 
          Suspendisse ultrices viverra massa at amet mollis.
        </p>
        
        <form className="mt-8 space-y-6">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="New Password" 
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-[14px] text-bold text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full"
            >
              <span className="flex items-center gap-2">
                Reset Password
                <HiArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}