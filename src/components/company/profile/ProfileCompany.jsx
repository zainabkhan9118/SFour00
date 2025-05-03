import React, { useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../../api/companyApi"; // Import the API function

import company from "../../../assets/images/company.png";
import LoadingSpinner from "../../common/LoadingSpinner";
import LazyImage from "../../common/LazyImage";

import { MdEdit } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import CompanySideBar from "./CompanySideBar";
import { ThemeContext } from "../../../context/ThemeContext";

const ProfileCompany = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCompanyData = async (user) => {
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        // Use the imported API function instead of direct axios call
        const response = await getCompanyProfile(user.uid);
        if (response && response.data) {
          setCompanyData(response.data);
          
          // Store company profile in localStorage for use across the application
          localStorage.setItem('companyProfile', JSON.stringify(response.data));
          localStorage.setItem('companyId', response.data._id);
          console.log('Company profile stored in localStorage with ID:', response.data._id);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    const auth = getAuth();
    
    // Use Firebase's auth state listener instead of immediately checking currentUser
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompanyData(user);
      } else {
        console.error("User not authenticated");
        setIsLoading(false);
      }
    });

    // Clean up the auth state listener on component unmount
    return () => unsubscribe();
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

  const handleEditManager = () => {
    navigate('/edit-company-manager');
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
          {/* Desktop Sidebar - Hidden on Mobile - No border or margin causing gap */}
          {!isMobile && (
            <div className="hidden md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-800">
              <CompanySideBar />
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            {/* Mobile Header with Sidebar - Shown only on Mobile */}
            {isMobile && (
              <div className="md:hidden">
                <CompanySideBar isMobile={true} />
              </div>
            )}
            
            <div className="p-4 md:p-6 overflow-auto">
              <div className="max-w-3xl">
                {/* Company Logo */}
                <div className="w-[246px] h-[198px] rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm">
                  <LazyImage
                    src={companyData?.companyLogo || company}
                    alt={`${companyData?.companyName || 'Company'} Logo`}
                    className="w-full h-full object-contain p-4"
                    fallbackSrc={company}
                    placeholderColor="#f3f4f6"
                  />
                </div>

                {/* Company Name and Edit Button */}
                <div className="flex items-center gap-4 mt-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{companyData?.companyName || "Company Name"}</h2>
                  <button 
                    onClick={handleEdit}
                    className="w-8 h-8 bg-[#1F2B44] dark:bg-orange-500 rounded flex items-center justify-center hover:bg-opacity-90 transition-colors">
                    <MdEdit className="text-white text-lg" />
                  </button>
                </div>

                {/* Company Address */}
                <div className="mt-3 flex items-center bg-[#3950804D] dark:bg-gray-700 px-4 py-2 rounded-full w-fit">
                  <MdOutlineHome className="text-gray-600 dark:text-gray-300" />
                  <p className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    {companyData?.address || "No address provided"}
                  </p>
                </div>

                {/* Company Bio Section */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About Company</h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                    {companyData?.bio || "No company description available"}
                  </p>
                </div>

                {/* Company Contact Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Company Contact</h3>
                    <button 
                      onClick={handleEditContact}
                      className="w-8 h-8 bg-[#1F2B44] dark:bg-orange-500 rounded flex items-center justify-center hover:bg-opacity-90 transition-colors">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                    {companyData?.companyContact || "No contact provided"}
                  </p>
                </div>

                {/* Company Email Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Company Email</h3>
                    <button 
                      onClick={handleEditEmail}
                      className="w-8 h-8 bg-[#1F2B44] dark:bg-orange-500 rounded flex items-center justify-center hover:bg-opacity-90 transition-colors">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
                    {companyData?.companyEmail || "No email provided"}
                  </p>
                </div>

                {/* Manager Information Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Information</h3>
                    <button 
                      onClick={handleEditManager}
                      className="w-8 h-8 bg-[#1F2B44] dark:bg-orange-500 rounded flex items-center justify-center hover:bg-opacity-90 transition-colors">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  
                  <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    {companyData?.manager ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FaUser className="text-gray-500 dark:text-gray-400" />
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Name: </span>
                            {companyData.manager.managerName || "Not provided"}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-gray-500 dark:text-gray-400" />
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Email: </span>
                            {companyData.manager.managerEmail || "Not provided"}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-gray-500 dark:text-gray-400" />
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Phone: </span>
                            {companyData.manager.managerPhone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No manager information available. Click edit to add manager details.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCompany;