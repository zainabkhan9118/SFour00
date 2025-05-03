import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import LoadingSpinner from "../../common/LoadingSpinner";
import { getCompanyProfile, updateCompanyContact } from "../../../api/companyApi";

const EditContactForm = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
          setContact(response.data.companyContact || '');
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
      const response = await updateCompanyContact(currentUser.uid, contact);
      console.log("Company contact updated successfully:", response);
      navigate(-1);
    } catch (error) {
      console.error("Error updating company contact:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isLoading && <LoadingSpinner />}
      
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200">
          <CompanySideBar />
        </div>
      )}

      <div className="flex flex-col flex-1">
        {isMobile && (
          <div className="md:hidden">
            <CompanySideBar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          <div className="flex items-center mb-6">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black">Edit Company Contact</span>
            </button>
          </div>

          <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-contact" className="font-medium text-gray-700">Company Contact Number</label>
                  <input
                    id="company-contact"
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Company Contact Number"
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
    </div>
  );
};

export default EditContactForm;
