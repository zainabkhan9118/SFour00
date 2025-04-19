import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";

const EditCertificate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [issueDate, setIssueDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleIssueDate = (e) => {
    setIssueDate(e.target.value);
  };
  
  const handleOrganization = (e) => {
    setOrganization(e.target.value);
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    
    // Here you would typically save the data to your backend
    console.log("Saving Certificate Data:", {
      issueDate,
      organization,
      certificate: selectedFile
    });
    
    // Navigate back to the profile page
    navigate("/User-PersonalDetails");
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
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
  
  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-orange-100');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-orange-100');
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-orange-100');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      console.log("File dropped:", file.name);
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
                  <span className="font-medium text-black">Add Certificate</span>
                </button>
              </div>
              
              {/* Certificate Form */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  {/* Issue Date */}
                  <div className="relative">
                    <input
                      type="date"
                      value={issueDate}
                      onChange={handleIssueDate}
                      className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Select Issue Date"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Organization Name */}
                  <input
                    type="text"
                    value={organization}
                    onChange={handleOrganization}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter Organization Name"
                  />
                  
                  {/* Certificate Upload Area */}
                  <div 
                    className={`border-2 border-dashed border-orange-300 rounded-lg p-8 bg-orange-50 cursor-pointer flex flex-col items-center justify-center h-40`}
                    onClick={handleFileUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="text-orange-500 font-medium mb-2">
                          {selectedFile.name}
                        </div>
                        <span className="text-sm text-gray-500">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="h-8 w-8 text-orange-500 mb-2" />
                        <span className="text-center text-gray-600">
                          Upload Certificate
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
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

export default EditCertificate;