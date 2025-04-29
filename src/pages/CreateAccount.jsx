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
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function CreateAccount() {
  const { BASEURL, setUser, setRole } = useContext(AppContext);
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

          {/* Formik Form */}
          <Formik
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
              fullName: "",
              companyName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="mt-6 space-y-4">
                {userType === "jobseeker" ? (
                  <div>
                    <Field
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                    />
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <Field
                      type="text"
                      name="companyName"
                      placeholder="Company Name"
                      className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                    />
                    <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone #"
                    className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <Field
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="relative">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full border px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <Field type="checkbox" name="terms" className="mr-2" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree with your{" "}
                    <span className="text-orange-500 cursor-pointer">
                      Terms of Services
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition mt-4"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account →"}
                </button>
              </Form>
            )}
          </Formik>

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