import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

const EditContactForm = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);

  useEffect(() => {
    const fetchExistingData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }

      try {
        const response = await axios.get('api/company', {
          headers: {
            "firebase-id": currentUser.uid,
          },
        });

        if (response.data && response.data.data) {
          setContact(response.data.data.companyContact || '');
          setIsDataAlreadyPosted(true);
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      }
    };

    fetchExistingData();
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
      const endpoint = 'api/company';
      const method = isDataAlreadyPosted ? 'patch' : 'post';
      
      const response = await axios[method](endpoint, 
        { companyContact: contact },
        {
          headers: {
            "firebase-id": currentUser.uid,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Company contact updated successfully");
        navigate(-1);
      }
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
                  <span className="font-medium text-black">Edit Company Contact</span>
                </button>
              </div>

              <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="w-full max-w-2xl">
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Company Contact Number"
                    />

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
        </main>
      </div>
    </div>
  );
};

export default EditContactForm;
