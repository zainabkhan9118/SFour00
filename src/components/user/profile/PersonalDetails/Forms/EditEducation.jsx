import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";

const EditEducation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    degree: "BS Social Science",
    institution: "ABC University",
    startDate: "2017-10-01",
    endDate: "2021-11-07",
    currentlyStudying: false,
    certificate: null
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [educations, setEducations] = useState([
    { 
      id: 1, 
      degree: "BS Social Science", 
      institution: "ABC University",
      startDate: "2017-10-01",
      endDate: "2021-11-07",
      currentlyStudying: false,
      certificate: null 
    }
  ]);
  const [currentEducationId, setCurrentEducationId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update the current education in the educations array
    const updatedEducations = educations.map(edu => 
      edu.id === currentEducationId 
        ? { ...formData, id: currentEducationId, certificate: selectedFile } 
        : edu
    );
    
    setEducations(updatedEducations);
    console.log("Saving education data:", formData);
    console.log("Updated educations array:", updatedEducations);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsLoading(false);
      // Navigate back to the profile page
      navigate("/User-PersonalDetails");
    }, 1000);
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleAddNew = () => {
    // Generate a new ID
    const newId = Math.max(...educations.map(edu => edu.id)) + 1;
    
    // Add new blank education entry
    const newEducation = {
      id: newId,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      certificate: null
    };
    
    setEducations([...educations, newEducation]);
    setCurrentEducationId(newId);
    setFormData(newEducation);
    setSelectedFile(null);
    
    console.log("Added new education entry with ID:", newId);
  };
  
  const handleDelete = () => {
    // Don't allow deleting if there's only one education
    if (educations.length <= 1) {
      alert("You must have at least one education entry.");
      return;
    }
    
    // Remove the current education
    const updatedEducations = educations.filter(edu => edu.id !== currentEducationId);
    setEducations(updatedEducations);
    
    // Set the form data to the first remaining education
    const nextEducation = updatedEducations[0];
    setCurrentEducationId(nextEducation.id);
    setFormData(nextEducation);
    setSelectedFile(nextEducation.certificate);
    
    console.log("Deleted education with ID:", currentEducationId);
    console.log("Updated to education with ID:", nextEducation.id);
  };
  
  const handleFileUpload = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Show loading spinner when loading */}
      {isLoading && <LoadingSpinner />}
      
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
                  <span className="font-medium text-black">Education</span>
                </button>
              </div>
              
              {/* Education Section */}
              <div className="w-full max-w-2xl">

                {/* Delete option at top of form */}
                <div className="flex justify-end mb-2">
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className="text-black hover:text-black flex items-center"
                  >
                    <FaTrash className="mr-1" /> 
                    <span>Delete</span>
                  </button>
                </div>
                
                {/* Edit Form */}
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  {/* Degree */}
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Degree/Certification"
                  />
                  
                  {/* Institution */}
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Institution/University"
                  />
                  
                  {/* Date Range */}
                  <div className="flex flex-col space-y-4">
                    {/* Start Date */}
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Start Date"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* End Date */}
                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="End Date"
                        disabled={formData.currentlyStudying}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Currently Studying Checkbox */}
                  <div className="flex items-center">
                    <input
                      id="currentlyStudying"
                      type="checkbox"
                      name="currentlyStudying"
                      checked={formData.currentlyStudying}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="currentlyStudying" className="ml-2 text-sm text-gray-700">
                      Currently Studying
                    </label>
                  </div>
                  
                  {/* Certificate Upload */}
                  <div 
                    className="border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50 cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {selectedFile ? selectedFile.name : "Upload Certificate (Optional)"}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Add New button in top right */}
                <div className="flex justify-end mb-4">
                  <button 
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center text-orange-500 font-medium bg-white rounded-full py-1 px-3 shadow-sm"
                  >
                    <span className="text-xl mr-1">+</span> Add New
                  </button>
                </div>
                
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

export default EditEducation;