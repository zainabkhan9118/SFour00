import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";
import LoadingSpinner from "../../common/LoadingSpinner";

const EditManagerForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);
  
  // Manager information state
  const [managerData, setManagerData] = useState({
    managerName: '',
    managerEmail: '',
    managerPhone: ''
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      setIsLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('api/company', {
          headers: {
            "firebase-id": currentUser.uid,
          },
        });

        if (response.data && response.data.data) {
          const companyData = response.data.data;
          
          // Check if manager data exists in the response
          if (companyData.manager) {
            setManagerData({
              managerName: companyData.manager.managerName || '',
              managerEmail: companyData.manager.managerEmail || '',
              managerPhone: companyData.manager.managerPhone || ''
            });
          }
          
          setIsDataAlreadyPosted(true);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
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
      const endpoint = 'api/company';
      const method = isDataAlreadyPosted ? 'patch' : 'post';
      
      // Prepare the data with manager object structure that matches the API
      const requestData = {
        manager: {
          managerName: managerData.managerName,
          managerEmail: managerData.managerEmail,
          managerPhone: managerData.managerPhone
        }
      };
      
      const response = await axios[method](endpoint, 
        requestData,
        {
          headers: {
            "firebase-id": currentUser.uid,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Manager information updated successfully");
        navigate(-1);
      }
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
      <div className="flex min-h-screen overflow-hidden">
        <Sidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          
          <main className="flex-3">
            <div className="flex flex-row flex-1">
              <div>
                <CompanySideBar />
              </div>
              
              <div className="p-4 flex-1 bg-gray-50 h-[100vh] overflow-auto">
                <div className="flex items-center p-4">
                  <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                    <FaArrowLeft className="mr-2" />
                    <span className="font-medium text-black">Edit Manager Information</span>
                  </button>
                </div>

                <div className="w-full max-w-2xl mx-auto mt-8">
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-6 p-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Manager Name</label>
                      <input
                        type="text"
                        name="managerName"
                        value={managerData.managerName}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Manager Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Manager Email</label>
                      <input
                        type="email"
                        name="managerEmail"
                        value={managerData.managerEmail}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Manager Email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Manager Phone</label>
                      <input
                        type="tel"
                        name="managerPhone"
                        value={managerData.managerPhone}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
          </main>
        </div>
      </div>
    </>
  );
};

export default EditManagerForm;