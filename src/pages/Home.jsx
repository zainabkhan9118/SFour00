import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import JobStatsDisplay from "../components/common/JobStatsDisplay";

const Home = () => {
  const navigate = useNavigate();

  // Function to navigate to login page with role pre-selected
  const navigateToLogin = (role) => {
    // Navigate to login page
    navigate("/login", { state: { initialRole: role } });
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-10">
        <img src={logo} alt="Logo" className="w-24 mb-4" />
        <h2 className="text-2xl font-bold mb-3">Continue as</h2>
        <p className="text-gray-500 text-center mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>

        {/* Job Seekers Button */}
        <button
          className="w-[400px] flex items-center p-4 mb-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
          onClick={() => navigateToLogin("user")}
        >
          <FaUserTie className="text-blue-500 text-5xl mr-3" />
          <div className="text-left">
            <h3 className="text-lg font-semibold">JOB SEEKERS</h3>
            <p className="text-gray-500 text-sm">Finding a job here never been easier than before</p>
          </div>
        </button>

        {/* Company Button */}
        <button
          className="w-[400px] flex items-center p-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
          onClick={() => navigateToLogin("company")}
        >
          <FaBuilding className="text-green-500 text-5xl mr-3" />
          <div className="text-left">
            <h3 className="text-lg font-semibold">COMPANY</h3>
            <p className="text-gray-500 text-sm">Let's recruit your great candidate faster here</p>
          </div>
        </button>
      </div>

      <JobStatsDisplay />
    </div>
  );
};

export default Home;