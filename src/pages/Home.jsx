import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaBuilding } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import signinPic from "../assets/images/signinpic.png";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-10">
      <img src={logo} alt="Logo" className="w-24 mb-4" /> {/* Logo import fixed */}
        <h2 className="text-2xl font-bold mb-3">Continue as</h2>
        <p className="text-gray-500 text-center mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>

        {/* Job Seekers Button */}
        <button
          className="w-[400px] flex items-center p-4 mb-4 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition"
          onClick={() => navigate("/user-login")}
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
          onClick={() => navigate("/company-login")}
        >
          <FaBuilding className="text-green-500 text-5xl mr-3" />
          <div className="text-left">
            <h3 className="text-lg font-semibold">COMPANY</h3>
            <p className="text-gray-500 text-sm">Let's recruit your great candidate faster here</p>
          </div>
        </button>
      </div>

      <div className="hidden md:flex w-1/2 justify-center items-center bg-cover bg-center p-6" style={{ backgroundImage: `url(${signinPic})` }}>
               <div className="text-white text-center px-6 md:px-9">
                 <h2 className="text-lg md:text-2xl font-semibold">Over 1,75,324 candidates waiting for good employees.</h2>
                 <div className="flex justify-center space-x-6 md:space-x-10 mt-6">
                   <div className="text-center">
                     <p className="text-lg md:text-2xl font-bold">1,75,324</p>
                     <p className="text-xs md:text-sm">Live Job</p>
                   </div>
                   <div className="text-center">
                     <p className="text-lg md:text-2xl font-bold">97,354</p>
                     <p className="text-xs md:text-sm">Companies</p>
                   </div>
                   <div className="text-center">
                     <p className="text-lg md:text-2xl font-bold">7,532</p>
                     <p className="text-xs md:text-sm">New Jobs</p>
                   </div>
                 </div>
               </div>
             </div>
    </div>
  );
};

export default Home;
