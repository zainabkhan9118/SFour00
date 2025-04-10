import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen  px-4">
      <div className=" p-8 rounded-lg  w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">
          Dui luctus interdum metus, ut consectetur ante consectetur sed. 
          Suspendisse ultrices viverra massa at amet mollis.
        </p>
        
        <div className="relative mb-4">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="New Password" 
            className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <div className="relative mb-6">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Confirm Password" 
            className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <button className="w-full bg-orange-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition flex justify-center items-center gap-2">
          Reset Password <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
}
