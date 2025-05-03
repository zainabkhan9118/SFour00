import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import LoadingSpinner from "../../common/LoadingSpinner";
import { getCompanyProfile, updateCompanyManager } from "../../../api/companyApi";
import { ThemeContext } from "../../../context/ThemeContext";

const EditManagerForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // Manager information state
  const [managerData, setManagerData] = useState({
    managerName: '',
    managerEmail: '',
    managerPhone: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchExistingData = async (user) => {
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        // Use the imported API function
        const response = await getCompanyProfile(user.uid);
        console.log("Company data fetched:", response);

        if (response && response.data) {
          const companyData = response.data;
          
          // Check if manager data exists in the response
          if (companyData.manager) {
            setManagerData({
              managerName: companyData.manager.managerName || '',
              managerEmail: companyData.manager.managerEmail || '',
              managerPhone: companyData.manager.managerPhone || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchExistingData(user);
      } else {
        console.error("User not authenticated");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      // Use the imported API function
      const response = await updateCompanyManager(currentUser.uid, managerData);
      console.log("Manager information updated successfully:", response);
      navigate(-1);
    } catch (error) {
      console.error("Error updating manager information:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
        {/* Desktop Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
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
          
          <div className="p-4 md:p-6 overflow-auto dark:bg-gray-900">
            <div className="flex items-center mb-6">
              <button onClick={handleBack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
                <FaArrowLeft className="mr-2" />
                <span className="font-medium text-black dark:text-white">Edit Manager Information</span>
              </button>
            </div>

            <div className="w-full max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-700/10">
                <div>
                  <label htmlFor="manager-name" className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Manager Name</label>
                  <input
                    id="manager-name"
                    type="text"
                    name="managerName"
                    value={managerData.managerName}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 dark:text-white border border-transparent dark:border-gray-600"
                    placeholder="Manager Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="manager-email" className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Manager Email</label>
                  <input
                    id="manager-email"
                    type="email"
                    name="managerEmail"
                    value={managerData.managerEmail}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 dark:text-white border border-transparent dark:border-gray-600"
                    placeholder="Manager Email"
                  />
                </div>
                
                <div>
                  <label htmlFor="manager-phone" className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">Manager Phone</label>
                  <input
                    id="manager-phone"
                    type="tel"
                    name="managerPhone"
                    value={managerData.managerPhone}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 dark:text-white border border-transparent dark:border-gray-600"
                    placeholder="Manager Phone"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full text-white font-medium p-4 rounded-full transition flex items-center justify-center ${
                    isLoading ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Loading..." : "Save Changes"}</span>
                  {!isLoading && <FiArrowRight className="ml-2" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditManagerForm;