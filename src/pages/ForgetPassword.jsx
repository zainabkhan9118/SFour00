import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import AuthLayout from "../components/layouts/common/AuthLayout";
import { ThemeContext } from "../context/ThemeContext";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email address.");
      } else {
        toast.error("Failed to send reset email. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900 px-8 md:px-16 lg:px-20 py-10">
        <div className="mb-8 mt-6 justify-center items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-[70px] w-[70px] object-fill"
          />
        </div>

        <h2 className="text-[32px] md:text-2xl font-bold mb-3 text-[#1F2B44] dark:text-white">
          Forgot Password?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={resetPassword} className="w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-full mb-4 text-sm md:text-base focus:outline-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-full text-sm md:text-base hover:bg-orange-600 transition font-medium"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-orange-500 hover:text-orange-700"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <AuthLayout />
    </div>
  );
}
