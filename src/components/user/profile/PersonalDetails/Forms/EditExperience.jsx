import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";

const EditExperience = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    jobTitle: "Chief Security Officer",
    companyName: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    workReference: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [experiences, setExperiences] = useState([
    { 
      id: 1, 
      jobTitle: "Chief Security Officer", 
      companyName: "SoftShift",
      startDate: "2020-06-01",
      endDate: "",
      currentlyWorking: true,
      workReference: null 
    }
  ]);
  const [currentExperienceId, setCurrentExperienceId] = useState(1);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    // Update the current experience in the experiences array
    const updatedExperiences = experiences.map(exp => 
      exp.id === currentExperienceId 
        ? { ...formData, id: currentExperienceId, workReference: selectedFile } 
        : exp
    );
    
    setExperiences(updatedExperiences);
    console.log("Saving experience data:", formData);
    console.log("Updated experiences array:", updatedExperiences);
    // Navigate back to the profile page
    navigate("/User-PersonalDetails");
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleAddNew = () => {
    // Generate a new ID
    const newId = Math.max(...experiences.map(exp => exp.id)) + 1;
    
    // Add new blank experience entry
    const newExperience = {
      id: newId,
      jobTitle: "",
      companyName: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workReference: null
    };
    
    setExperiences([...experiences, newExperience]);
    setCurrentExperienceId(newId);
    setFormData(newExperience);
    setSelectedFile(null);
    
    console.log("Added new experience entry with ID:", newId);
  };
  
  const handleDelete = () => {
    // Don't allow deleting if there's only one experience
    if (experiences.length <= 1) {
      alert("You must have at least one experience entry.");
      return;
    }
    
    // Remove the current experience
    const updatedExperiences = experiences.filter(exp => exp.id !== currentExperienceId);
    setExperiences(updatedExperiences);
    
    // Set the form data to the first remaining experience
    const nextExperience = updatedExperiences[0];
    setCurrentExperienceId(nextExperience.id);
    setFormData(nextExperience);
    setSelectedFile(nextExperience.workReference);
    
    console.log("Deleted experience with ID:", currentExperienceId);
    console.log("Updated to experience with ID:", nextExperience.id);
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
                  <span className="font-medium text-black">Experience</span>
                </button>
              </div>
              
              {/* Experience Section */}
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
                  {/* Job Title */}
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Job Title"
                  />
                  
                  {/* Company Name */}
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Company Name"
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
                        disabled={formData.currentlyWorking}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Currently Working Checkbox */}
                  <div className="flex items-center">
                    <input
                      id="currentlyWorking"
                      type="checkbox"
                      name="currentlyWorking"
                      checked={formData.currentlyWorking}
                      onChange={handleChange}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="currentlyWorking" className="ml-2 text-sm text-gray-700">
                      Currently Working
                    </label>
                  </div>
                  
                  {/* Work Reference */}
                  <div 
                    className="border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50 cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">
                        {selectedFile ? selectedFile.name : "Upload Work Reference (Optional)"}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx" 
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

export default EditExperience;