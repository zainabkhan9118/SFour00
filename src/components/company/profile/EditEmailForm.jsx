import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import LoadingSpinner from "../../common/LoadingSpinner";
import { getCompanyProfile, updateCompanyEmail } from "../../../api/companyApi";
import { ThemeContext } from "../../../context/ThemeContext";

const EditEmailForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchExistingData = async (user) => {
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCompanyProfile(user.uid);
        console.log("Company data fetched:", response);

        if (response && response.data) {
          setEmail(response.data.companyEmail || '');
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
      const response = await updateCompanyEmail(currentUser.uid, email);
      console.log("Company email updated successfully:", response);
      navigate(-1);
    } catch (error) {
      console.error("Error updating company email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
        {!isMobile && (
          <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
            <CompanySideBar />
          </div>
        )}

        <div className="flex flex-col flex-1">
          {isMobile && (
            <div className="md:hidden">
              <CompanySideBar isMobile={true} />
            </div>
          )}

          <div className="p-4 md:p-6 overflow-auto dark:bg-gray-900">
            <div className="flex items-center mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-6"
              >
                <FaArrowLeft className="mr-2" />
                <span className="font-medium text-black dark:text-white">Back</span>
              </button>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Update Company Email</h1>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-700/10">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Company Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="company@example.com"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-[#1F2B44] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>Save Changes</span>
                    <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmailForm;
