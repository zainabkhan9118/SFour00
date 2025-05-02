import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import LoadingSpinner from "../../common/LoadingSpinner";

const EditEmailForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);

  useEffect(() => {
    const fetchExistingData = async (user) => {
      if (!user) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/company', {
          headers: {
            "firebase-id": user.uid,
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

    setIsLoading(true);
    const auth = getAuth();
    
    // Use Firebase's auth state listener instead of immediately checking currentUser
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchExistingData(user);
      } else {
        console.error("User not authenticated");
        setIsLoading(false);
      }
    });

    // Clean up the auth state listener on component unmount
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
      const endpoint = '/api/company';
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
      <div className="flex min-h-screen overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-3">
            <div className="flex flex-row flex-1">
              {/* CompanySideBar now handles its own responsiveness */}
              <CompanySideBar />
              
              <div className="p-4 flex-1 bg-gray-50 h-[100vh] overflow-auto md:ml-64">
                <div className="flex items-center p-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                  >
                    <FaArrowLeft className="mr-2" />
                    <span>Back</span>
                  </button>
                </div>
                <div className="max-w-3xl">
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
          </main>
        </div>
      </div>
    </>
  );
};

export default EditEmailForm;
