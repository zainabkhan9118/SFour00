import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { getAuth } from "firebase/auth";
import { getEducation, addEducation, updateEducation, deleteEducation } from "../../../../../api/educationApi";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";

const EditEducation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { showSuccess, showError, showInfo } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [formData, setFormData] = useState({
    educations: [
      { 
        id: null,
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        currentlyStudying: false,
        __v: 0
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
    const fetchEducations = async () => {
      setIsLoading(true);
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!jobSeekerId || !currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getEducation(currentUser.uid, jobSeekerId);

        console.log("Fetched education data:", response);

        if (response && response.data) {
          const educations = response.data.map(edu => ({
            id: edu._id,
            degree: edu.degreeName,
            institution: edu.institute,
            startDate: edu.startDate.split('T')[0],
            endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
            currentlyStudying: edu.currentlyEnrolled,
            certificate: edu.certificate,
            __v: edu.__v
          }));

          setFormData({ educations: educations.length > 0 ? educations : formData.educations });
        }
      } catch (error) {
        console.error("Error fetching educations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const handleChange = (index, field, value) => {
    const newEducations = [...formData.educations];
    newEducations[index][field] = value;

    if (field === "currentlyStudying" && value === true) {
      newEducations[index].endDate = "";
    }

    setFormData(prev => ({
      ...prev,
      educations: newEducations
    }));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newEducations = [...formData.educations];
      newEducations[index].certificate = file;
      setFormData(prev => ({
        ...prev,
        educations: newEducations
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!jobSeekerId || !currentUser) {
      console.error("Authentication required");
      showError("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    const firebaseId = currentUser.uid;

    try {
      const newEducations = [];
      const updateEducations = [];

      formData.educations.forEach(education => {
        if (!education.degree || !education.institution) {
          return;
        }

        const educationData = {
          degreeName: education.degree,
          institute: education.institution,
          startDate: new Date(education.startDate).toISOString(),
          endDate: education.currentlyStudying ? null : education.endDate ? new Date(education.endDate).toISOString() : null,
          currentlyEnrolled: education.currentlyStudying || false
        };

        if (education.id) {
          updateEducations.push({ ...educationData, _id: education.id });
        } else {
          newEducations.push(educationData);
        }
      });

      if (newEducations.length > 0) {
        try {
          console.log('Creating new educations:', newEducations);
          const createResponse = await addEducation(firebaseId, jobSeekerId, newEducations);
          console.log('New educations created:', createResponse);
        } catch (error) {
          console.error('Error creating new educations:', error);
          throw error;
        }
      }

      for (const education of updateEducations) {
        try {
          console.log('Updating education:', education._id);
          console.log('Using jobSeekerId:', jobSeekerId); // Debug log
          
          const updateData = {
            degreeName: education.degreeName,
            institute: education.institute,
            startDate: education.startDate,
            endDate: education.endDate,
            currentlyEnrolled: education.currentlyEnrolled
          };
          
          // Pass jobSeekerId as the fourth parameter to updateEducation
          const updateResponse = await updateEducation(education._id, firebaseId, updateData, jobSeekerId);
          console.log('Education updated:', updateResponse);
        } catch (error) {
          console.error('Error updating education:', error);
          throw error;
        }
      }

      try {
        const refreshResponse = await getEducation(firebaseId, jobSeekerId);

        if (refreshResponse && refreshResponse.data) {
          const educations = refreshResponse.data.map(edu => ({
            id: edu._id,
            degree: edu.degreeName,
            institution: edu.institute,
            startDate: edu.startDate.split('T')[0],
            endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
            currentlyStudying: edu.currentlyEnrolled,
            certificate: edu.certificate,
            jobSeeker_id: edu.jobSeeker_id,
            __v: edu.__v
          }));

          setFormData({ educations: educations.length > 0 ? educations : formData.educations });
        }
      } catch (refreshError) {
        console.error("Error refreshing education data:", refreshError);
      }

      // Show success message
      showSuccess("Education details saved successfully!");
      setSuccessMessage("Education details saved successfully!");
      setRedirectPath("/User-PersonalDetails");
      setShowSuccessPopup(true);

      // Check profile completion status
      await checkProfileCompletion();
    } catch (error) {
      console.error("Error saving educations:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showError(error.response?.data?.message || error.message || "Failed to save education details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (formData.educations.length <= 1) {
      console.log("Preventing deletion of last education entry");
      showInfo("At least one education entry is required");
      return;
    }

    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const education = formData.educations[index];

    try {
      console.log("Attempting to delete education:", {
        index,
        educationId: education.id,
        hasJobSeekerId: !!jobSeekerId
      });

      if (education.id && currentUser) {
        const response = await deleteEducation(education.id, currentUser.uid, jobSeekerId);
        console.log('Education deleted successfully:', {
          status: response.status,
          data: response
        });
        showSuccess("Education entry deleted successfully");
      } else {
        console.log('No API call needed - education entry was not yet saved');
      }

      setFormData(prev => ({
        ...prev,
        educations: prev.educations.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error("Error deleting education:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showError("Failed to delete education entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleAddNew = () => {
    const newEducation = {
      id: null,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      __v: 0
    };
    
    setFormData(prev => ({
      ...prev,
      educations: [...prev.educations, newEducation]
    }));
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
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
              <span className="font-medium text-black">Education</span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              <div className="space-y-4">
                {formData.educations.map((education, index) => (
                  <div key={education.id || index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      {formData.educations.length > 1 && (
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
                        <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700">
                          Degree / Qualification
                        </label>
                        <input
                          id={`degree-${index}`}
                          type="text"
                          value={education.degree}
                          onChange={(e) => handleChange(index, "degree", e.target.value)}
                          className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="e.g., Bachelor of Science, Certificate in Security"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <input
                          id={`institution-${index}`}
                          type="text"
                          value={education.institution}
                          onChange={(e) => handleChange(index, "institution", e.target.value)}
                          className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="School, college or university name"
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
                            value={education.startDate}
                            onChange={(e) => handleChange(index, "startDate", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                            required
                            aria-describedby={`start-date-help-${index}`}
                          />
                          <p id={`start-date-help-${index}`} className="text-xs text-gray-500 mt-1">
                            When did you start this education?
                          </p>
                        </div>

                        <div className="relative space-y-1">
                          <label htmlFor={`end-date-${index}`} className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            id={`end-date-${index}`}
                            type="date"
                            value={education.endDate}
                            onChange={(e) => handleChange(index, "endDate", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                            disabled={education.currentlyStudying}
                            required={!education.currentlyStudying}
                            aria-describedby={`end-date-help-${index}`}
                          />
                          <p id={`end-date-help-${index}`} className="text-xs text-gray-500 mt-1">
                            {education.currentlyStudying ? "End date not required for current studies" : "When did you complete this education?"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id={`currently-studying-${index}`}
                          type="checkbox"
                          checked={education.currentlyStudying}
                          onChange={(e) => handleChange(index, "currentlyStudying", e.target.checked)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                          aria-describedby={`currently-studying-help-${index}`}
                        />
                        <label htmlFor={`currently-studying-${index}`} className="ml-2 text-sm text-gray-600">
                          Currently Studying
                        </label>
                      </div>
                      <p id={`currently-studying-help-${index}`} className="text-xs text-gray-500 mt-1">
                        Check this box if you are still enrolled in this program
                      </p>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddNew}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                >
                  + Add Another Education
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
    </div>
  );
};

export default EditEducation;