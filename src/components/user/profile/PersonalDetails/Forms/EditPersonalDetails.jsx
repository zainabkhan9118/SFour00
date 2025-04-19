import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "Henry Kanwil",
    location: "",
    bio: ""
  });
  const [profileImage, setProfileImage] = useState("src/assets/images/profile.jpeg");
  const [previewImage, setPreviewImage] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically save the data to your backend
    console.log("Saving profile data:", formData);
    if (previewImage) {
      console.log("New profile image to upload:", previewImage);
      // In a real app, you would upload the image to your server here
    }
    // Navigate back to the profile page
    navigate("/User-PersonalDetails");
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50">
              {/* Header with back button */}
              <div className="flex items-center p-4">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">Edit Personal Details</span>
                </button>
              </div>
              
              {/* Edit Form */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  {/* Profile Picture */}
                  <div className="flex justify-center mb-2">
                    <div className="relative">
                      <img 
                        src={previewImage || profileImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover cursor-pointer"
                        onClick={handleImageClick}
                      />
                      <button 
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-4 h-4 text-blue-500"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                          />
                        </svg>
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  
                  {/* Form Inputs */}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Full Name"
                  />
                  
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Location"
                  />
                  
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg resize-none h-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Small bio"
                  ></textarea>
                  
                  {/* Save Button */}
                  <button 
                    type="submit" 
                    className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                  >
                    <span>Save Edits</span>
                    <FiArrowRight className="ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditPersonalDetails;