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
        <p className="text-gray-500 text-center mb-6 font-bold">
        Find Your Dream Security Job Now
        </p>
        <p className="text-gray-500 text-center mb-6 mt-16 ">
        Are you looking for a job in the security industry? Our system links you to best employment prospects in loss prevention, cybersecurity, and physical security. Begin your safe future right now!
        </p>

        {/* Job Seekers Button */}
        <button
          className="w-[400px] flex items-center p-4 mb-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
          onClick={() => navigateToLogin("user")}
        >
          <FaUserTie className="text-blue-500 text-5xl mr-3" />
          <div className="text-left">
            <h3 className="text-lg font-semibold">JOB SEEKERS</h3>
            <p className="text-gray-500 text-sm"> <div className="font-bold">Secure your future in security.</div>
 Explore jobs tailored to your skills. Quick. Easy. Reliable.
</p>
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
            <p className="text-gray-500 text-sm"> <div className="font-bold">Hire qualified security professionals fast.</div>
Please post jobs, review applications, and recruit top candidates with ease. 
</p>
          </div>
        </button>
      </div>

      <JobStatsDisplay />
    </div>
  );
};

export default Home;