import { useState, useEffect, useContext } from "react";
import {
  FaFacebook,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
        navigate(
          sessionData.role === "Job Seeker"
            ? "/User-UserProfile"
            : "/company-profile"
        );
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

  // This function exactly mirrors what works in WorkApplied.jsx
  const fetchAndStoreJobSeekerId = async (firebaseId) => {
    console.log(
      "🔍 Using EXACT WorkApplied approach to fetch job seeker ID..."
    );
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("❌ Current user not found");
        return null;
      }

      const uid = currentUser.uid;
      console.log("🔑 Using Firebase UID instead of token:", uid);

      // Fetch job seeker data
      const userResponse = await axios.get(`${BASEURL}/job-seeker`, {
        headers: {
          "firebase-id": uid,
        },
      });

      console.log("🔍 Job seeker API full response:", userResponse);

      if (userResponse.data?.data?._id) {
        const jobSeekerId = userResponse.data.data._id;
        const certificateId =
          userResponse.data.data.certificates[0]?._id || null;
        const lisence = userResponse.data.data.licenses[0]?._id || null;
        // console.log("certificateId",certificateId);
        localStorage.setItem("jobSeekerId", jobSeekerId);
        localStorage.setItem("certificateId", certificateId);
        localStorage.setItem("licenseId", lisence);

        // After getting jobSeekerId, fetch bank details
        try {
          const bankResponse = await axios.get(`${BASEURL}/bank-details`, {
            headers: {
              jobseekerid: jobSeekerId,
            },
          });

          if (bankResponse.data?.data?.length > 0) {
            // Get the bank detail ID
            const bankDetailId = bankResponse.data.data[0]._id;
            localStorage.setItem("bankDetailId", bankDetailId);
            console.log("✅ Bank detail ID restored:", bankDetailId);
          } else {
            console.log("ℹ️ No existing bank details found for the user");
          }
        } catch (bankError) {
          console.error("❌ Error fetching bank details:", bankError);
        }

        return jobSeekerId;
      } else {
        console.warn("⚠️ No job seeker document ID found in API response");

        // Handle case where the user is a job seeker but doesn't have a profile yet
        // We'll store the user ID as a fallback, which will be used until they create a profile
        const userId = localStorage.getItem("userId");
        if (userId) {
          console.log(
            "⚠️ Using user ID as temporary fallback until profile is created:",
            userId
          );
          // Don't actually store this as jobSeekerId - let the profile creation process do that
        }

        return null;
      }
    } catch (err) {
      console.error("❌ Error fetching job seeker data:", err);
      console.warn("⚠️ Unable to fetch job seeker profile - likely new user");

      // Same fallback approach - identify that we need a profile to be created
      const userId = localStorage.getItem("userId");
      if (userId) {
        console.log("⚠️ User needs to create a job seeker profile");
      }

      return null;
    }
  };

  const storeUserData = async (firebaseId, userData) => {
    console.log("Storing user data, role:", userData.role);

    // Store the basic user data
    setUser(userData);
    setRole(userData.role);

    // Store the user ID from login response
    const userId = userData.userId || userData._id;
    if (userId) {
      localStorage.setItem("userId", userId);
      console.log("✅ User ID stored:", userId);
    }

    // Create session data
    const sessionData = {
      firebaseId: firebaseId,
      role: userData.role,
      timestamp: Date.now(),
      userId: userId,
    };

    setSessionData(sessionData);
    localStorage.setItem("sessionData", JSON.stringify(sessionData));

    // For Job Seekers, use the EXACT same approach that works in WorkApplied.jsx
    if (userData.role === "Job Seeker") {
      console.log("Job Seeker detected, fetching job seeker document ID...");
      const jobSeekerId = await fetchAndStoreJobSeekerId(firebaseId);

      if (jobSeekerId) {
        // console.log("✅ Job seeker ID successfully stored: " + jobSeekerId);
        // console.log("⚠️ User ID (login response): " + userId);
        // console.log("⚠️ Job Seeker ID (document _id): " + jobSeekerId);

        if (userId === jobSeekerId) {
          console.error("❌ ERROR: User ID and Job Seeker ID are the same!");
        } else {
          console.log(
            "✅ VERIFIED: User ID and Job Seeker ID are different as expected"
          );
        }
      } else {
        console.warn("⚠️ Could not fetch job seeker document ID");
      }
    }

    return userData.role;
  };

  const handleSignIn = async (values, { setFieldError }) => {
    if (!email || !password) {
    //   toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const firebaseId = await user.getIdToken(true);
      console.log("Firebase ID Token:", firebaseId);

      // Login with backend
      const response = await axios.post(`${BASEURL}/auth/login`, {
        idToken: firebaseId,
      });

      console.log("Backend login response:", response.data);

      if (
        (response.status === 200 || response.status === 201) &&
        response.data?.data
      ) {
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
        setFieldError("password", "Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setFieldError("password", "Invalid email or password");
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

      if (
        (response.status === 200 || response.status === 201) &&
        response.data?.data
      ) {
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

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });


  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start bg-white px-8 md:px-16 lg:px-20 py-10">
        <div className="mb-8 mt-6">
          <img
            src={logo}
            alt="Logo"
            className="h-[120px] w-[120px] object-fill"
          />
        </div>

        <h2 className="text-[32px] md:text-2xl font-bold mb-3 text-[#1F2B44]">
          Sign in
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-8">
          Don't have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer font-medium"
            onClick={() => navigate("/CreateAccount")}
          >
            Create Account
          </span>
        </p>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, formikHelpers) => {
            setEmail(values.email);
            setPassword(values.password);
            await handleSignIn(values, formikHelpers);
          }}
        >
          <Form className="w-full max-w-md">
            <Field
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full border border-gray-300 px-4 py-3 rounded-full mb-4 text-sm md:text-base focus:outline-orange-500"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-xs md:text-sm mb-2"
            />
            <div className="relative">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
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
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-xs md:text-sm mb-2"
            />

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
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-full text-sm md:text-base hover:bg-orange-600 transition font-medium relative"
              disabled={loading}
            >
              <div className="flex items-center justify-center">
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <FaArrowRight className="ml-2" />}
              </div>
            </button>
          </Form>
        </Formik>

        <p className="text-gray-500 my-6 text-sm md:text-base text-center w-full max-w-md">
          or
        </p>

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
