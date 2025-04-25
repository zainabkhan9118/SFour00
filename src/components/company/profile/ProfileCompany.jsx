import React, { useState, useEffect } from "react";
import axios from 'axios';
import { getAuth } from "firebase/auth";
import Header from "../Header";
import company from "../../../assets/images/company.png";

import { MdEdit } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";

import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

const ProfileCompany = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          
          // Store company profile in localStorage for use across the application
          localStorage.setItem('companyProfile', JSON.stringify(response.data.data));
          localStorage.setItem('companyId', response.data.data._id);
          console.log('Company profile stored in localStorage with ID:', response.data.data._id);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleEdit = () => {
    navigate('/edit-company-profile');
  };

  const handleEditContact = () => {
    navigate('/edit-company-contact');
  };

  const handleEditEmail = () => {
    navigate('/edit-company-email');
  };

  return (
      
      <div className="flex flex-col flex-1 overflow-hidden">

    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Header */}

        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div className="w-64 bg-white border-r">
              <CompanySideBar />
            </div>
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-3xl">
                {/* Company Logo */}
                <div className="w-[246px] h-[198px] rounded-lg flex items-center justify-center">
                  <img
                    src={companyData?.companyLogo || company}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Company Name and Edit Button */}
                <div className="flex items-center gap-4 mt-6">
                  <h2 className="text-2xl font-bold">{companyData?.companyName || "Company Name"}</h2>
                  <button 
                    onClick={handleEdit}
                    className="w-8 h-8 bg-[#1F2B44] rounded flex items-center justify-center">
                    <MdEdit className="text-white text-lg" />
                  </button>
                </div>

                {/* Company Address */}
                <div className="mt-3 flex items-center bg-[#3950804D] px-4 py-2 rounded-full w-fit">
                  <MdOutlineHome className="text-gray-600" />
                  <p className="ml-2 text-sm text-gray-600">
                    {companyData?.address || "No address provided"}
                  </p>
                </div>


                 {/* Company Bio Section */}
                 <div className="mt-12">
                  <h3 className="text-2xl font-bold">About Company</h3>
                  <p className="mt-4 text-gray-600 max-w-xl leading-relaxed">
                    {companyData?.bio || "No company description available"}
                  </p>
                </div>

                {/* Company Contact Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold">Company Contact</h3>
                    <button 
                      onClick={handleEditContact}
                      className="w-8 h-8 bg-[#1F2B44] rounded flex items-center justify-center">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 max-w-xl leading-relaxed">
                    {companyData?.companyContact || "No contact provided"}
                  </p>
                </div>

                {/* Company Email Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold">Company Email</h3>
                    <button 
                      onClick={handleEditEmail}
                      className="w-8 h-8 bg-[#1F2B44] rounded flex items-center justify-center">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 max-w-xl leading-relaxed">
                    {companyData?.companyEmail || "No email provided"}
                  </p>
                </div>

               
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>

  );
};

export default ProfileCompany;