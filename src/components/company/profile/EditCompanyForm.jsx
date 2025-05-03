import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import CompanySideBar from "./CompanySideBar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import company from "../../../assets/images/company.png";
import LoadingSpinner from "../../common/LoadingSpinner";
import { getCompanyProfile, updateCompanyProfile, createCompanyProfile } from "../../../api/companyApi";
import { ThemeContext } from "../../../context/ThemeContext";

const EditCompanyForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

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
          const data = response.data;
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          companyLogo: file
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
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('companyContact', formData.companyContact);
      formDataToSend.append('companyEmail', formData.companyEmail);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('bio', formData.bio);
      
      if (formData.companyLogo instanceof File) {
        formDataToSend.append('companyLogo', formData.companyLogo);
      }
      
      formDataToSend.append('manager[managerName]', formData.manager.managerName);
      formDataToSend.append('manager[managerEmail]', formData.manager.managerEmail);
      formDataToSend.append('manager[managerPhone]', formData.manager.managerPhone);
      
      let response;
      if (isDataAlreadyPosted) {
        response = await updateCompanyProfile(currentUser.uid, formDataToSend);
      } else {
        response = await createCompanyProfile(currentUser.uid, formDataToSend);
      }

      console.log(`Company data ${isDataAlreadyPosted ? 'updated' : 'saved'} successfully:`, response);
      
      if (response && response.data) {
        localStorage.setItem('companyProfile', JSON.stringify(response.data));
        localStorage.setItem('companyId', response.data._id);
        console.log('Company profile stored in localStorage with ID:', response.data._id);
      }
      
      navigate(-1);
    } catch (error) {
      console.error("Error saving company data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        {!isMobile && (
          <div className="hidden md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
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
              <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center transition-colors">
                <FaArrowLeft className="mr-2" />
                <span className="font-medium text-gray-900 dark:text-white">Edit Company Details</span>
              </button>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                      Company Logo
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 p-1 rounded-full">
                      <img
                        src={previewImage || company}
                        alt="Company Logo"
                        className="w-24 h-24 rounded-full object-cover cursor-pointer"
                        onClick={handleImageClick}
                      />
                    </div>
                    <input
                      type="file"
                      id="company-logo"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Click to change logo</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-name" className="font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-address" className="font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <input
                    id="company-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                    placeholder="Enter company address"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-bio" className="font-medium text-gray-700 dark:text-gray-300">About Company</label>
                  <textarea
                    id="company-bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg resize-none h-28 focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                    placeholder="Describe your company"
                    rows="4"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-email" className="font-medium text-gray-700 dark:text-gray-300">Company Email</label>
                  <input
                    id="company-email"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => setFormData({...formData, companyEmail: e.target.value})}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                    placeholder="Enter company email"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="company-contact" className="font-medium text-gray-700 dark:text-gray-300">Company Contact</label>
                  <input
                    id="company-contact"
                    type="text"
                    value={formData.companyContact}
                    onChange={(e) => setFormData({...formData, companyContact: e.target.value})}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                    placeholder="Enter company contact number"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 my-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Manager Details</h3>
                  
                  <div className="flex flex-col space-y-1 mt-2">
                    <label htmlFor="manager-name" className="font-medium text-gray-700 dark:text-gray-300">Manager Name</label>
                    <input
                      id="manager-name"
                      type="text"
                      value={formData.manager.managerName}
                      onChange={(e) => setFormData({...formData, manager: {...formData.manager, managerName: e.target.value}})}
                      className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                      placeholder="Enter manager name"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 mt-2">
                    <label htmlFor="manager-email" className="font-medium text-gray-700 dark:text-gray-300">Manager Email</label>
                    <input
                      id="manager-email"
                      type="email"
                      value={formData.manager.managerEmail}
                      onChange={(e) => setFormData({...formData, manager: {...formData.manager, managerEmail: e.target.value}})}
                      className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                      placeholder="Enter manager email"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 mt-2">
                    <label htmlFor="manager-phone" className="font-medium text-gray-700 dark:text-gray-300">Manager Phone</label>
                    <input
                      id="manager-phone"
                      type="text"
                      value={formData.manager.managerPhone}
                      onChange={(e) => setFormData({...formData, manager: {...formData.manager, managerPhone: e.target.value}})}
                      className="w-full p-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none border border-gray-200 dark:border-gray-600"
                      placeholder="Enter manager phone number"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full text-white font-medium p-4 rounded-full transition flex items-center justify-center ${
                    isLoading ? "bg-orange-500 opacity-70" : "bg-orange-500 hover:bg-orange-600"
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
