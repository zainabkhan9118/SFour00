import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay";
import { AppContext } from "../context/AppContext";
import { auth } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../config/firebaseConfig"; // Import Firestore configuration
import { toast } from "react-toastify"; 

export default function CreateAccount() {
  const { BASEURL, setUser, setRole } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("company");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialRole) {
      setUserType(location.state.initialRole); 
    }
  }, [location.state]);

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password || !confirmPassword || !phone) {
    toast.warn("Please fill in all required fields.", { autoClose: 3000 });
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.", { autoClose: 3000 });
    return;
  }

  setLoading(true);
  try {
    // 1. Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;
    const firebaseId = firebaseUser.uid;

    const userData =
      userType === "jobseeker"
        ? {
            email,
            phone,
            role: "Job Seeker",
            firebaseId,
          }
        : {
            email,
            phone,
            role: "Company",
            firebaseId,
          };

    
  

    const userDoc = doc(db, "Users", firebaseId); 
    await setDoc(userDoc, userData); 

    // 3. Send to backend
    const response = await axios.post(`${BASEURL}/user`, userData);
    console.log(response.data);
    
    // 4. If backend is successful
    if (response.data && response.status === 201) {
      setUser(response.data);

      localStorage.setItem("userEmail", email);
      toast.success("Account created successfully!", { autoClose: 3000 });
      navigate("/login");
    } else {
      throw new Error("Backend user creation failed");
    }
  } catch (error) {
    console.error("Error during sign-up:", error);

    // If Firebase user was created but backend failed, delete Firebase user
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await currentUser.delete();
        console.error("Firebase user deleted due to backend failure.");
      } catch (deleteError) {
        console.error("Failed to delete Firebase user:", deleteError);
      }
    }

    toast.error("Signup failed. Please try again.", { autoClose: 3000 });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-white flex justify-center items-center px-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <div className="flex flex-row items-center space-x-10">
            <div>
              <h2 className="text-3xl font-semibold">Create account.</h2>
              <p className="text-sm text-gray-500 mt-1">
                Already have an account?{" "}
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => navigate("/user-login")}
                >
                  Log In
                </span>
              </p>
            </div>
            <div>
              <select
                className="border px-4 py-2 rounded-[50px] text-sm focus:ring-2 focus:ring-gray-500"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mt-6 space-y-4">
            {userType === "jobseeker" ? (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            ) : (
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone #"
              className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center">
            <input type="checkbox" id="terms" className="mr-2" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree with your{" "}
              <span className="text-orange-500 cursor-pointer">
                Terms of Services
              </span>
            </label>
          </div>

          <button
            className="w-full bg-orange-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition mt-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">or</div>
          <div className="flex justify-center gap-4 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
              <FaFacebook className="text-blue-600" /> Facebook
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100">
              <FcGoogle /> Google
            </button>
          </div>
        </div>
      </div>

      <JobStatsDisplay />
    </div>
  );
}