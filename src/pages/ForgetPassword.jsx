import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay"; 

export default function ForgetPassword() {
  const navigate = useNavigate();
    
  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-10 text-center md:text-left">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="h-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Forget Password</h2>
        <p className="text-gray-500">Go back to <span className="text-orange-500 cursor-pointer" onClick={() => navigate("/login")}>Sign In</span></p>
        <p className="text-gray-500">Don't have an account? <span className="text-orange-500 cursor-pointer" onClick={() => navigate("/CreateAccount")}>Create Account</span></p>
        
        <div className="w-full mt-6 max-w-md">
          <input type="email" placeholder="Email address" className="w-full border px-4 py-2 rounded-full mb-4" />
          <button 
            className="w-full bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition" 
            onClick={() => navigate("/ResetPassword")}
          >
            Reset Password
          </button>
        </div>
        
        <p className="text-gray-500 my-4">or</p>
        
        <div className="flex flex-col md:flex-row gap-3 w-full max-w-md">
          <button className="flex items-center justify-center px-4 py-2 border rounded-full w-full text-sm md:text-base">
            <FaFacebook className="text-blue-600 mr-2" /> Sign in with Facebook
          </button>
          <button className="flex items-center justify-center px-4 py-2 border rounded-full w-full text-sm md:text-base">
            <FaGoogle className="text-red-500 mr-2" /> Sign in with Google
          </button>
        </div>
      </div>
      
      {/* Right Section */}
      <JobStatsDisplay />
    </div>
  );
}
