import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import axios from 'axios';
import { getAuth } from "firebase/auth";
import company from "../../../assets/images/company.png";
import LoadingSpinner from "../../common/LoadingSpinner";

const EditCompanyForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyContact: '',
    companyEmail: '',
    address: '',
    bio: '',
    companyLogo: null,
    jobPosts: [],
    manager: {
      managerName: '',
      managerEmail: '',
      managerPhone: ''
    }
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const response = await axios.get(`api/company`, {
          headers: {
            "firebase-id": currentUser.uid,
          },
        });

        if (response.data && response.data.data) {
          const data = response.data.data;
          setFormData({
            companyName: data.companyName || '',
            companyContact: data.companyContact || '',
            companyEmail: data.companyEmail || '',
            address: data.address || '',
            bio: data.bio || '',
            companyLogo: data.companyLogo || null,
            jobPosts: data.jobPosts || [],
            manager: {
              managerName: data.manager?.managerName || '',
              managerEmail: data.manager?.managerEmail || '',
              managerPhone: data.manager?.managerPhone || ''
            }
          });
          setPreviewImage(data.companyLogo);
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // For preview only - don't store base64 in state
        setPreviewImage(reader.result);
        
        // Send raw file to backend for S3 upload
        setFormData(prev => ({
          ...prev,
          companyLogo: file // Send raw file instead of base64
        }));
      };
      reader.readAsDataURL(file);
    }
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

      // Create FormData to send file
      const formDataToSend = new FormData();
      
      // Handle flat fields
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('companyContact', formData.companyContact);
      formDataToSend.append('companyEmail', formData.companyEmail);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('bio', formData.bio);
      
      // Handle file field
      if (formData.companyLogo instanceof File) {
        formDataToSend.append('companyLogo', formData.companyLogo);
      }
      
      // Handle manager nested object
      formDataToSend.append('manager[managerName]', formData.manager.managerName);
      formDataToSend.append('manager[managerEmail]', formData.manager.managerEmail);
      formDataToSend.append('manager[managerPhone]', formData.manager.managerPhone);
      
      const response = await axios[method](endpoint, formDataToSend, {
        headers: {
          "firebase-id": currentUser.uid,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        console.log(`Company data ${isDataAlreadyPosted ? 'updated' : 'saved'} successfully`);
        
        // Store company profile data in localStorage, including _id
        if (response.data.data) {
          localStorage.setItem('companyProfile', JSON.stringify(response.data.data));
          localStorage.setItem('companyId', response.data.data._id);
          console.log('Company profile stored in localStorage with ID:', response.data.data._id);
        }
        
        navigate(-1);
      }
    } catch (error) {
      console.error("Error saving company data:", error);
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
      <div className="flex flex-col md:flex-row w-full">
        {/* Desktop Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200">
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
            <div className="flex items-center mb-6">
              <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 flex items-center">
                <FaArrowLeft className="mr-2" />
                <span className="font-medium text-black">Edit Company Details</span>
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <img
                      src={previewImage || company}
                      alt="Company Logo"
                      className="w-24 h-24 rounded-full object-cover cursor-pointer"
                      onClick={handleImageClick}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Company Name"
                />

                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Address"
                />

                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-4 bg-gray-100 rounded-lg resize-none h-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="About Company"
                  rows="4"
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
    </>
  );
};

export default EditCompanyForm;
