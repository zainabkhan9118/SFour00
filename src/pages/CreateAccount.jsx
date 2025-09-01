import { FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import logo from "../assets/images/logo.png";
import AuthLayout from "../components/layouts/common/AuthLayout";
import { AppContext } from "../context/AppContext";
import { ThemeContext } from "../context/ThemeContext";
import { auth } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CreateAccount() {
  const { BASEURL, setUser, setRole } = useContext(AppContext);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("company");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.initialRole) {
      setUserType(location.state.initialRole);
    }
  }, [location.state]);

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    phone: Yup.string().required("Phone number is required"),
    fullName: Yup.string().when("userType", {
      is: "jobseeker",
      then: Yup.string().required("Full Name is required"),
    }),
    companyName: Yup.string().when("userType", {
      is: "company",
      then: Yup.string().required("Company Name is required"),
    }),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const handleSubmit = async (values, { setFieldError }) => {
    const { email, password, phone, fullName, companyName } = values;

    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

      // 4. If backend is successful
      if (response.data && response.status === 201) {
        setUser(response.data);
        localStorage.setItem("userEmail", email);
        navigate("/login");
      } else {
        throw new Error("Backend user creation failed");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);

      // If email already exists
      if (error.code === "auth/email-already-in-use") {
        setFieldError("email", "This email is already registered.");
      }

      // If Firebase user was created but backend failed, delete Firebase user
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          await currentUser.delete();
        } catch (deleteError) {
          console.error("Failed to delete Firebase user:", deleteError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 flex flex-col justify-center items-center px-6 md:px-12 py-8 transition-colors duration-200">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-[80px] md:h-12" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-10 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Create account.</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Already have an account?{" "}
                <span
                  className="text-orange-500 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </span>
              </p>
            </div>
            <div className="self-start md:self-auto">
              <select
                className="border px-3 py-2 md:px-4 md:py-2 rounded-[50px] text-sm focus:ring-2 focus:ring-gray-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              fullName: "",
              companyName: "",
              terms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, isValid }) => (
              <Form className="mt-6 space-y-4">
                {/* Full Name and Company Name fields removed as requested */}

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full border px-4 py-2 md:py-3 rounded-full text-sm focus:outline-orange-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs md:text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone #"
                    className="w-full border px-4 py-2 md:py-3 rounded-full text-sm focus:outline-orange-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs md:text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full border px-4 py-2 md:py-3 rounded-full text-sm focus:outline-orange-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs md:text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full border px-4 py-2 md:py-3 rounded-full text-sm focus:outline-orange-500 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs md:text-sm mt-1"
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <Field type="checkbox" name="terms" className="mr-2 accent-orange-500" />
                  <label htmlFor="terms" className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    I agree with your{" "}
                    <span className="text-orange-500 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400">
                      Terms of Services
                    </span>
                  </label>
                </div>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className="text-red-500 text-xs md:text-sm mt-1"
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 md:py-3 rounded-full text-sm font-semibold hover:bg-orange-600 transition mt-4"
                  disabled={loading || !values.terms}
                >
                  {loading ? "Creating Account..." : "Create Account →"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">or</div>
          <div className="flex flex-col md:flex-row justify-center gap-3 mt-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full text-xs md:text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <FaFacebook className="text-blue-600" /> Sign in with Facebook
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-full text-xs md:text-sm hover:bg-gray-100 dark:hover:bg-gray-800 w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <FcGoogle /> Sign in with Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Section with Job Stats */}
      <AuthLayout />
    </div>
  );
}