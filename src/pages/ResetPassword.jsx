import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from 'react-icons/hi';
import { auth } from "../config/firebaseConfig";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      const user = auth.currentUser;

      if (!user) {
        setError("User is not logged in.");
        setIsLoading(false); // Stop loading
        return;
      }

      // Re-authenticate the user with their old password
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Update the user's password
      await updatePassword(user, newPassword);
      setSuccess("Password has been successfully updated!");

      // Optionally navigate to another page
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 space-y-4 bg-white rounded-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-4 text-center text-[32px] font-bold text-[#1F2B44]">
          Reset Password
        </h2>

        {/* Description */}
        <p className="text-center text-[15px] bold-[400px] text-gray-600 font-poppins">
          Dui luctus interdum metus, ut consectetur ante consectetur sed.
          Suspendisse ultrices viverra massa at amet mollis.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {isLoading ? ( // Show the loader if loading
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm rounded-[120px]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-[14px] text-bold text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full"
                >
                  <span className="flex items-center gap-2">
                    Reset Password
                    <HiArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}