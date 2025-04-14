import { useState, useContext } from "react";
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import axios from "axios"; 
import { AppContext } from "../context/AppContext"; 
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user"); 
    const [loading, setLoading] = useState(false);

    const { BASEURL, setUser } = useContext(AppContext); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }
    
        setLoading(true);
        try {
            // console.log("Attempting Firebase sign-in...");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // console.log("Firebase sign-in successful:", userCredential);
    
            const user = userCredential.user;
            console.log("user",user);
            
    
            // Get Firebase ID token
            const idToken = await user.getIdToken();
            console.log("🪪 Firebase ID Token:", idToken);    
            const response = await axios.post(`${BASEURL}/auth/login`, {
                idToken: idToken,

            });
    
            console.log("Backend response:", response.data);
    
            if ((response.status === 200 || response.status === 201) && response.data?.data) {
                // console.log("Login successful, user data from backend:", response.data);
                
                setUser(response.data); 
                alert("Login successful!");
                
                const role = response.data.data.role;
                console.log("User Role:", role);
            
                if (role === "Job Seeker") {
                    navigate("/User-UserProfile");
                } else {
                    navigate("/company-profile");
                }
            } else {
                // console.warn("No user found in backend or invalid response");
                alert("No user found in backend.");
            }
    
        } catch (error) {
            if (error.response) {
                alert("Backend Error: " + (error.response.data?.message || "Unknown error"));
            } else {
                // console.error("Firebase/Auth Error:", error.message);
                alert("Login failed: " + error.message);
            }
        } finally {
            setLoading(false);
            // console.log("Login process finished.");
        }
    };
    

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);

            if (role === "jobseeker") {
                console.log("Google user login successful");
                navigate("/User-UserProfile");
            } else {
                console.log("Google company login successful");
                navigate("/company-profile");
            }

        } catch (error) {
            console.error("Google login error:", error);
            alert("Google login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Left Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-start bg-white px-8 md:px-16 lg:px-20 py-10">
                <div className="mb-8 mt-6">
                    <img src={logo} alt="Logo" className="h-[120px] w-[120px] object-fill" />
                </div>

                <h2 className="text-[32px] md:text-2xl font-bold mb-3 text-[#1F2B44]">Sign in</h2>
                <p className="text-gray-500 text-sm md:text-base mb-8">
                    Don't have an account?{" "}
                    <span
                        className="text-orange-500 cursor-pointer font-medium"
                        onClick={() => navigate("/CreateAccount")}
                    >
                        Create Account
                    </span>
                </p>

                <div className="w-full max-w-md">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 px-4 py-3 rounded-full mb-4 text-sm md:text-base focus:outline-orange-500"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-full mb-4 text-sm md:text-base focus:outline-orange-500"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-sm md:text-base">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" /> Remember Me
                        </label>
                        <span
                            className="text-orange-500 cursor-pointer"
                            onClick={() => navigate("/ForgetPassword")}
                        >
                            Forgot password?
                        </span>
                    </div>

                    <button
                        onClick={handleSignIn}
                        className="w-full bg-orange-500 text-white py-3 rounded-full text-sm md:text-base hover:bg-orange-600 transition font-medium relative"
                        disabled={loading}
                    >
                        <div className="flex items-center justify-center">
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <FaArrowRight className="ml-2" />}
                        </div>
                    </button>
                </div>

                <p className="text-gray-500 my-6 text-sm md:text-base text-center w-full max-w-md">or</p>

                <div className="flex flex-col md:flex-row gap-3 w-full max-w-md">
                    <button className="flex items-center justify-center px-4 py-2 border rounded-full w-full text-sm md:text-base">
                        <FaFacebook className="text-blue-600 mr-2" /> Sign in with Facebook
                    </button>
                    <button
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center px-4 py-2 border rounded-full w-full text-sm md:text-base"
                    >
                        <FaGoogle className="text-red-500 mr-2" /> Sign in with Google
                    </button>
                </div>
            </div>

            {/* Right Section - Using our common component */}
            <JobStatsDisplay />
        </div>
    );
}