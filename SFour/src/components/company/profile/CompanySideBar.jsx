import React from "react";
import vector1 from "../../../assets/images/vector1.png";
import s4 from "../../../assets/images/s4.png";
import logout from "../.././../assets/images/logout.png";
import faq from "../.././../assets/images/faq.png";
import company from "../../../assets/images/company.png";


import { FaUser, FaBriefcase, FaKey, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const CompanySideBar = () => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2 flex-col xl:flex-row md:gap-8 p-4 rounded-lg">
        <img
          src={company}
          alt=""
          className="w-10 h-10 md:w-12 md:h-12 rounded-full"
        />
        <p className="font-medium text-sm md:text-lg">Company Name</p>
      </div>
      <h2 className="text-lg font-semibold flex items-center text-orange-500 hover:text-gray-700">
        <FaUser className="mr-2" /> Company Details
      </h2>

      <ul className="space-y-5 text-gray-600">
        <Link to='/job-posting'>
          <li className="flex items-center gap-2 text-orange-500 hover:text-gray-700 mb-4">
            <FaBriefcase /> Jobs
          </li>
        </Link>

        <Link to='/ResetPassword'>
          <li className="flex items-center gap-2 text-orange-500 hover:text-gray-700 mb-4">
            <FaKey /> Reset Password
          </li>
        </Link>

        <Link to='/rota-management'>
          <li className="flex items-center gap-2 text-orange-500 hover:text-gray-700 mb-4">
            <img src={vector1} alt="" className="h-5 w-5" /> Rota Management
          </li>
        </Link>
        <Link to='/chat-support'>
          <li className="flex items-center gap-2 text-orange-500 hover:text-gray-700 mb-4">
            <img src={s4} alt="" className="h-5 w-5" /> Contact S4 Support
          </li>
        </Link>

        <Link to='/faq'>
          <li className="flex items-center gap-2 text-orange-500 hover:text-gray-700 mb-10">
            <img src={faq} className="h-5 w-5" alt="" /> FAQ's
          </li>
        </Link>
        <li className="flex items-center gap-2">
          <img src={logout} alt="" className="h-5 w-5" /> Logout
        </li>
      </ul>


      <div className="mt-6 text-sm text-gray-500">
        <p>Terms and conditions of use:</p>
        <p className="underline">Privacy policy, Cookie policy</p>
      </div>
    </div>
  );
};

export default CompanySideBar;