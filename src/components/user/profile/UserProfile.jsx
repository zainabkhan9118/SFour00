import React, { useEffect } from "react";
import { User } from "lucide-react";
import UserSidebar from "./UserSidebar";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const jobSeekerId = localStorage.getItem("jobSeekerId");

  useEffect(() => {
    if (jobSeekerId) {
      navigate("/User-PersonalDetails");
    }
  }, [jobSeekerId, navigate]);

  const handleCompleteProfile = () => {
    navigate("User-UserProfile");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <main className="flex overflow-auto">
          <div className="flex flex-col flex-1">
            <UserSidebar />
          </div>
          
          {!jobSeekerId && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold text-center mb-4">Please Complete Your Profile</h2>
              <button
                onClick={handleCompleteProfile}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition duration-300"
              >
                Complete Profile
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;

