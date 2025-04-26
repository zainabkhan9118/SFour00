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

const EditEmailForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);

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
          setEmail(response.data.data.companyEmail || '');
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
        { companyEmail: email },
        {
          headers: {
            "firebase-id": currentUser.uid,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        console.log("Company email updated successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error updating company email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow">
          <Header />
          <div className="flex min-h-[calc(100vh-64px)]">
            <div className="w-64 bg-white border-r">
              <CompanySideBar />
            </div>
            <div className="flex-grow p-8">
              <div className="max-w-3xl">
                {/* Back button */}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                  <FaArrowLeft className="mr-2" />
                  <span>Back</span>
                </button>

                <h1 className="text-2xl font-bold mb-8">Update Company Email</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
    </>
  );
};

export default EditEmailForm;
