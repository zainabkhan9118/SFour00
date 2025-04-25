import { useState, useEffect, useContext } from "react";
import { FaFacebook, FaGoogle, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay";
import { toast } from "react-toastify";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { BASEURL, setRole, setUser, setSessionData } = useContext(AppContext);

    // Check for session validity
    useEffect(() => {
        const sessionData = JSON.parse(localStorage.getItem("sessionData"));
        if (sessionData) {
            const { token, timestamp } = sessionData;
            const currentTime = Date.now();

            if (currentTime - timestamp < 3600000) {
                console.log("Session is valid, redirecting...");
                navigate(sessionData.role === "Job Seeker" ? "/User-UserProfile" : "/company-profile");
            } else {
                // Session expired
                console.log("Session expired, clearing session data.");
                localStorage.removeItem("sessionData");
                localStorage.removeItem("jobSeekerId");
                navigate("/login");
            }
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const storeUserData = async (firebaseId, userData) => {
        console.log("Storing user data, role:", userData.role);
        console.log("Full user data:", userData);
        
        // Store the basic user data
        setUser(userData);
        setRole(userData.role);
        
        // The backend returns userId instead of _id in the login response
        const jobSeekerId = userData.userId || userData._id;
        
        // If there's a userId in the userData, directly store it as jobSeekerId for Job Seekers
        if (userData.role === "Job Seeker" && jobSeekerId) {
            localStorage.setItem("jobSeekerId", jobSeekerId);
            console.log("✅ Job seeker ID stored directly from login response:", jobSeekerId);
        }
        
        // Create session data
        const sessionData = {
            firebaseId: firebaseId,
            role: userData.role,
            timestamp: Date.now(),
            userId: jobSeekerId
        };
        
        setSessionData(sessionData);
        localStorage.setItem("sessionData", JSON.stringify(sessionData));
        
        // As a fallback, try to get job seeker details - but only if we didn't already store the ID
        if (userData.role === "Job Seeker" && !jobSeekerId) {
            try {
                console.log("No jobSeekerId found in login response, attempting fallback fetch...");
                
                // Make a direct API call to get job seeker details
                const userResponse = await axios.get(`${BASEURL}/job-seeker`, {
                    headers: {
                        "firebase-id": firebaseId,
                    },
                });
                
                console.log("Job seeker API response:", userResponse.data);
                
                if (userResponse.data?.data?._id) {
                    const apiJobSeekerId = userResponse.data.data._id;
                    localStorage.setItem("jobSeekerId", apiJobSeekerId);
                    console.log("✅ Job seeker ID stored successfully from API:", apiJobSeekerId);
                } else {
                    console.warn("⚠️ Job seeker ID not found in API response");
                }
            } catch (error) {
                console.error("Error in fallback job seeker ID fetch:", error.response?.data || error);
            }
        }
        
        return userData.role;
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const firebaseId = await user.getIdToken(true);
            console.log("Firebase ID Token:", firebaseId);
            
            // Login with backend
            const response = await axios.post(`${BASEURL}/auth/login`, {
                idToken: firebaseId,
            });

            console.log("Backend login response:", response.data);

            if ((response.status === 200 || response.status === 201) && response.data?.data) {
                const userData = response.data.data;
                
                // Store user data and get role
                const role = await storeUserData(firebaseId, userData);
                
                toast("Login successful!");
                
                // Navigate based on role
                if (role === "Job Seeker") {
                    navigate("/User-PersonalDetails");
                } else if (role === "Company") {
                    navigate("/company-profile");
                }
            } else {
                toast.error("No user found in backend.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            if (error.response) {
                toast.error("Backend Error: " + (error.response.data?.message || "Unknown error"));
            } else {
                toast.error("Login failed: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();
            
            // Login with backend
            const response = await axios.post(`${BASEURL}/auth/login`, {
                idToken: idToken,
            });

            console.log("Google Backend response:", response.data);

            if ((response.status === 200 || response.status === 201) && response.data?.data) {
                const userData = response.data.data;
                
                // Store user data and get role
                const role = await storeUserData(idToken, userData);
                
                toast("Google login successful!");
                
                // Navigate based on role
                if (role === "Job Seeker") {
                    navigate("/User-PersonalDetails");
                } else if (role === "Company") {
                    navigate("/company-profile");
                }
            } else {
                toast.error("No user found in backend.");
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google login failed: " + error.message);
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

            {/* Right Section */}
            <JobStatsDisplay />
        </div>
    );
}