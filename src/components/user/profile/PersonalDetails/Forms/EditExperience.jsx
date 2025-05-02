import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import axios from "axios";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";
import ProfileErrorPopup from "../../../../user/popupModel/ProfileErrorPopup";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditExperience = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { showSuccess, showError, showInfo } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [formData, setFormData] = useState({
    experiences: [
      { 
        id: 1,
        position: "",
        companyName: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        experienceCertificate: null,
        _id: null 
      }
    ]
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      if (!jobSeekerId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASEURL}/experience`, {
          headers: {
            'jobseekerId': jobSeekerId
          }
        });

        if (response.data && response.data.data) {
          const experiences = response.data.data.map(exp => ({
            id: exp._id, 
            _id: exp._id,
            position: exp.position,
            companyName: exp.companyName,
            startDate: exp.startDate.split('T')[0],
            endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
            currentlyWorking: exp.currentlyWorking,
            experienceCertificate: exp.experienceCertificate
          }));

          setFormData({ experiences: experiences.length > 0 ? experiences : formData.experiences });
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleChange = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;

    if (field === "currentlyWorking" && value === true) {
      newExperiences[index].endDate = "";
    }

    setFormData(prev => ({
      ...prev,
      experiences: newExperiences
    }));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newExperiences = [...formData.experiences];
      newExperiences[index].experienceCertificate = file;
      setFormData(prev => ({
        ...prev,
        experiences: newExperiences
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const jobSeekerId = localStorage.getItem("jobSeekerId");

    if (!jobSeekerId) {
      console.error("JobSeekerId not found");
      setErrorMessage("Please ensure you are logged in and try again");
      setShowErrorPopup(true);
      setIsLoading(false);
      return;
    }

    try {
      const successfulExperiences = [];

      for (const experience of formData.experiences) {
        try {
          const dataToSend = {
            position: experience.position,
            companyName: experience.companyName,
            startDate: new Date(experience.startDate).toISOString(),
            currentlyWorking: experience.currentlyWorking,
            ...(experience.currentlyWorking ? {} : { 
              endDate: experience.endDate ? new Date(experience.endDate).toISOString() : null 
            })
          };

          console.log('Sending experience data:', dataToSend);

          const formDataToSend = new FormData();
          Object.keys(dataToSend).forEach(key => {
            if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
              formDataToSend.append(key, dataToSend[key]);
            }
          });

          if (experience.experienceCertificate instanceof File) {
            formDataToSend.append('experienceCertificate', experience.experienceCertificate);
          }

          let response;
          
          if (experience._id) {
            console.log('Updating existing experience:', experience._id);
          
            const dataToSendForPatch = {
              position: experience.position,
              companyName: experience.companyName,
              startDate: new Date(experience.startDate).toISOString(),
              currentlyWorking: experience.currentlyWorking,
              ...(experience.currentlyWorking ? {} : { 
                endDate: experience.endDate ? new Date(experience.endDate).toISOString() : null 
              }),
            };
          
            // Only include the file if it exists
            if (experience.experienceCertificate instanceof File) {
              const patchFormData = new FormData();
              Object.keys(dataToSendForPatch).forEach(key => {
                patchFormData.append(key, dataToSendForPatch[key]);
              });
              patchFormData.append('experienceCertificate', experience.experienceCertificate);
          
              response = await axios.patch(
                `${BASEURL}/experience/${experience._id}`,
                patchFormData,
                {
                  headers: {
                    'jobseekerId': jobSeekerId,
                    'id': experience._id,
                    'Content-Type': 'multipart/form-data'
                  }
                }
              );
            } else {
              response = await axios.patch(
                `${BASEURL}/experience/${experience._id}`,
                dataToSendForPatch,
                {
                  headers: {
                    'jobseekerId': jobSeekerId,
                    'id': experience._id,
                    'Content-Type': 'application/json'
                  }
                }
              );
            }
          } else {
            console.log('Creating new experience');
            response = await axios.post(`${BASEURL}/experience`, 
              formDataToSend,
              { 
                headers: {
                  'jobseekerId': jobSeekerId
                }
              }
            );
          }

          console.log('Experience saved successfully:', response.data);
          successfulExperiences.push(response.data);
        } catch (expError) {
          console.error('Error saving individual experience:', expError);
          if (expError.response) {
            console.error('Error details:', expError.response.data);
          }
        }
      }

      if (successfulExperiences.length > 0) {
        console.log('Successfully saved experiences:', successfulExperiences);
        setSuccessMessage("Experiences saved successfully!");
        setRedirectPath("/User-PersonalDetails");
        setShowSuccessPopup(true);
        checkProfileCompletion();
      } else {
        setErrorMessage("Failed to save any experiences. Please try again.");
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Error in save operation:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      setErrorMessage(error.response?.data?.message || "Failed to save experiences. Please try again.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (formData.experiences.length <= 1) {
      setErrorMessage("You must have at least one experience entry.");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    const experience = formData.experiences[index];

    try {
      if (experience._id) {
        await axios.delete(`${BASEURL}/experience/${experience._id}`, {
          headers: {
            'jobseekerId': jobSeekerId,
          }
        });
        console.log('Experience deleted successfully');
      }

      setFormData(prev => ({
        ...prev,
        experiences: prev.experiences.filter((_, i) => i !== index)
      }));
      setSuccessMessage("Experience deleted successfully!");
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error deleting experience:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete experience. Please try again.");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleAddNew = () => {
    const newId = Math.max(...formData.experiences.map(exp => exp.id)) + 1;
    
    const newExperience = {
      id: newId,
      position: "",
      companyName: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      experienceCertificate: null,
      _id: null 
    };
    
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
      {isLoading && <LoadingSpinner />}
      
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200">
          <UserSidebar />
        </div>
      )}

      <div className="flex flex-col flex-1">
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          <div className="flex items-center mb-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black">Experience</span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              <div className="space-y-4">
                {formData.experiences.map((experience, index) => (
                  <div key={experience.id} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      {formData.experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-700">
                          Position
                        </label>
                        <input
                          id={`position-${index}`}
                          type="text"
                          value={experience.position}
                          onChange={(e) => handleChange(index, "position", e.target.value)}
                          className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Job title"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <input
                          id={`company-${index}`}
                          type="text"
                          value={experience.companyName}
                          onChange={(e) => handleChange(index, "companyName", e.target.value)}
                          className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Company Name"
                          required
                        />
                      </div>

                      <div className="flex flex-col space-y-3">
                        <div className="relative space-y-1">
                          <label htmlFor={`start-date-${index}`} className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            id={`start-date-${index}`}
                            type="date"
                            value={experience.startDate}
                            onChange={(e) => handleChange(index, "startDate", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                            required
                          />
                        </div>

                        <div className="relative space-y-1">
                          <label htmlFor={`end-date-${index}`} className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            id={`end-date-${index}`}
                            type="date"
                            value={experience.endDate}
                            onChange={(e) => handleChange(index, "endDate", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                            disabled={experience.currentlyWorking}
                            required={!experience.currentlyWorking}
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id={`currently-working-${index}`}
                          type="checkbox"
                          checked={experience.currentlyWorking}
                          onChange={(e) => handleChange(index, "currentlyWorking", e.target.checked)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`currently-working-${index}`} className="ml-2 text-sm text-gray-600">
                          Currently Working
                        </label>
                      </div>

                      <div className="relative space-y-1">
                        <label htmlFor={`certificate-${index}`} className="block text-sm font-medium text-gray-700">
                          Experience Certificate
                        </label>
                        <div 
                          className="border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50 cursor-pointer"
                          onClick={() => document.getElementById(`certificate-${index}`).click()}
                        >
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">
                              {experience.experienceCertificate instanceof File 
                                ? experience.experienceCertificate.name 
                                : experience.experienceCertificate
                                ? experience.experienceCertificate.split('/').pop()
                                : "Upload Experience Certificate"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Upload work reference document (optional)
                          </p>
                        </div>
                        <input
                          id={`certificate-${index}`}
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, index)}
                          aria-label="Upload experience certificate"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddNew}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                >
                  + Add Another Experience
                </button>
              </div>

              <button 
                type="submit"
                className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                disabled={isLoading}
              >
                <span>{isLoading ? "Loading..." : "Save Edits"}</span>
                {!isLoading && <FiArrowRight className="ml-2" />}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {showSuccessPopup && (
        <ProfileSuccessPopup
          message={successMessage}
          redirectPath={redirectPath}
          onClose={handleCloseSuccessPopup}
        />
      )}

      {showErrorPopup && (
        <ProfileErrorPopup
          message={errorMessage}
          onClose={handleCloseErrorPopup}
        />
      )}
    </div>
  );
};

export default EditExperience;