// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import signinPic from "../../assets/images/signinpic.png";
// import logo from "../../assets/images/logo.png";
// export default function CompanyLogin() {
//    const navigate = useNavigate();
    
//     return (
//       <div className="flex flex-col md:flex-row h-screen w-full">
//         {/* Left Section */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6 md:px-10 py-10">
//           <div className="mb-6">
//             <img src={logo} alt="Logo" className="h-16 md:h-20" />
//           </div>
//           <h2 className="text-xl md:text-2xl font-semibold mb-2">Sign in</h2>
//           <p className="text-gray-500 text-sm md:text-base">Don't have an account? <span className="text-orange-500 cursor-pointer" onClick={() => navigate("/CreateAccount")}>Create Account</span></p>
          
//           <div className="w-full mt-6">
//             <input type="email" placeholder="Email address" className="w-full border px-4 py-2 rounded-md mb-4 text-sm md:text-base" />
//             <input type="password" placeholder="Password" className="w-full border px-4 py-2 rounded-md mb-4 text-sm md:text-base" />
            
//             <div className="flex justify-between items-center mb-4 text-sm md:text-base">
//               <label className="flex items-center">
//                 <input type="checkbox" className="mr-2" /> Remember Me
//               </label>
//               <span className="text-orange-500 cursor-pointer"  onClick={() => navigate("/ForgetPassword")}>Forgot password</span>
//             </div>
            
//             <button className="w-full bg-orange-500 text-white py-2 rounded-md text-sm md:text-base">Sign In</button>
//           </div>
          
//           <p className="text-gray-500 my-4 text-sm md:text-base">or</p>
          
//           <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full">
//             <button className="flex items-center justify-center px-4 py-2 border rounded-md w-full text-sm md:text-base">
//               <FaFacebook className="text-blue-600 mr-2" /> Sign in with Facebook
//             </button>
//             <button className="flex items-center justify-center px-4 py-2 border rounded-md w-full text-sm md:text-base">
//               <FaGoogle className="text-red-500 mr-2" /> Sign in with Google
//             </button>
//           </div>
//         </div>
        
//         {/* Right Section */}
//         <div className="hidden md:flex w-1/2 justify-center items-center bg-cover bg-center p-6" style={{ backgroundImage: `url(${signinPic})` }}>
//           <div className="text-white text-center px-6 md:px-9">
//             <h2 className="text-lg md:text-2xl font-semibold">Over 1,75,324 candidates waiting for good employees.</h2>
//             <div className="flex justify-center space-x-6 md:space-x-10 mt-6">
//               <div className="text-center">
//                 <p className="text-lg md:text-2xl font-bold">1,75,324</p>
//                 <p className="text-xs md:text-sm">Live Job</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-lg md:text-2xl font-bold">97,354</p>
//                 <p className="text-xs md:text-sm">Companies</p>
//               </div>
//               <div className="text-center">
//                 <p className="text-lg md:text-2xl font-bold">7,532</p>
//                 <p className="text-xs md:text-sm">New Jobs</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import signinPic from "../../assets/images/signinpic.png";
import logo from "../../assets/images/logo.png";

export default function CompanyLogin() {
  const navigate = useNavigate();  // Initialize navigate function
    
  const handleLogin = () => {
    // Perform authentication logic here (if required)
    navigate("/dashboard");  // Redirect to dashboard
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white px-6 md:px-10 py-10">
        <div className="mb-6">
          <img src={logo} alt="Logo" className="h-16 md:h-20" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2">Sign in</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Don't have an account? <span className="text-orange-500 cursor-pointer" onClick={() => navigate("/CreateAccount")}>Create Account</span>
        </p>
        
        <div className="w-full mt-6">
          <input type="email" placeholder="Email address" className="w-full border px-4 py-2 rounded-md mb-4 text-sm md:text-base" />
          <input type="password" placeholder="Password" className="w-full border px-4 py-2 rounded-md mb-4 text-sm md:text-base" />
          
          <div className="flex justify-between items-center mb-4 text-sm md:text-base">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <span className="text-orange-500 cursor-pointer"  onClick={() => navigate("/ForgetPassword")}>Forgot password</span>
          </div>
          
          {/* Login Button (Redirects to Dashboard) */}
          <button onClick={handleLogin} className="w-full bg-orange-500 text-white py-2 rounded-md text-sm md:text-base">
            Sign In
          </button>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="hidden md:flex w-1/2 justify-center items-center bg-cover bg-center p-6" style={{ backgroundImage: `url(${signinPic})` }}>
        <div className="text-white text-center px-6 md:px-9">
          <h2 className="text-lg md:text-2xl font-semibold">Over 1,75,324 candidates waiting for good employees.</h2>
        </div>
      </div>
    </div>
  );
}
