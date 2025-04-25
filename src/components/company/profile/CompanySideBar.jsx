import React, { useState, useEffect } from "react";
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import vector1 from "../../../assets/images/vector1.png";
import s4 from "../../../assets/images/s4.png";
import logout from "../.././../assets/images/logout.png";
import faq from "../.././../assets/images/faq.png";
import company from "../../../assets/images/company.png";


import { FaUser, FaBriefcase, FaKey, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";

const CompanySideBar = () => {
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();
   const handleLogout = async () => {
      try {
          localStorage.removeItem("sessionData");
          await signOut(auth);
          toast.success("Logged out successfully!");
          navigate("/login");
      } catch (error) {
          console.error("Error during logout:", error);
          toast.error("Failed to log out. Please try again.");
      }
  };
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkStyle = (path) => {
    return currentPath === path 
      ? "flex items-center space-x-3 font-semibold text-black "
      : "flex items-center space-x-3";
  };

  const getIconStyle = (path) => {
    return currentPath === path ? "text-gray-600" : "text-orange-500";
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      try {
        const response = await axios.get('api/company', {
          headers: {
            "firebase-id": currentUser.uid
          }
        });
        if (response.data && response.data.data) {
          setCompanyData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="w-64 bg-white p-4 shadow-xl min-h-screen">
      <div className="flex items-center space-x-3 pb-4">
        <img
          src={companyData?.companyLogo || company}
          alt="Company Logo"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-lg">{companyData?.companyName || "Company Name"}</span>
      </div>

      <ul className="mt-4 space-y-8 text-gray-700">
        <li>
          <Link to="/company-profile" className={getLinkStyle('/company-details')}>
            <FaUser className={getIconStyle('/company-details')} />
            <span>Company Details</span>
          </Link>
        </li>
        <li>
          <Link to="/recents-jobs" className={getLinkStyle('/job-posting')}>
            <FaBriefcase className={getIconStyle('/job-posting')} />
            <span>Jobs</span>
          </Link>
        </li>
        <li>
          <Link to="/ResetPassword" className={getLinkStyle('/ResetPassword')}>
            <FaKey className={getIconStyle('/ResetPassword')} />
            <span>Reset Password</span>
          </Link>
        </li>
        <li>
          <Link to="/problems-reported" className={getLinkStyle('/problems-reported')}>
            <FaExclamationTriangle className={getIconStyle('/problems-reported')} />
            <span>Problems Reported</span>
          </Link>
        </li>
        <li>
          <Link to="/rota-management" className={getLinkStyle('/rota-management')}>
            <img src={vector1} alt="" className="h-5 w-5" />
            <span>Rota Management</span>
          </Link>
        </li>
        <li>
          <Link to="/chat-support" className={getLinkStyle('/chat-support')}>
            <img src={s4} alt="" className="h-5 w-5" />
            <span>Contact S4 Support</span>
          </Link>
        </li>
        <li>
          <Link to="/faq" className={getLinkStyle('/faq')}>
            <img src={faq} className="h-5 w-5" alt="" />
            <span>FAQ's</span>
          </Link>
        </li>
        <li>
          <Link onClick={handleLogout} className={getLinkStyle('/logout')}>
            <img src={logout} alt="" className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </li>
      </ul>

      <div className="mt-6 text-xs text-gray-500">
        <p>Terms and conditions of use:</p>
        <p>
          <a href="#" >Privacy policy</a>,
          <a href="#" > Cookie policy</a>
        </p>
      </div>
    </div>
  );
};

export default CompanySideBar;