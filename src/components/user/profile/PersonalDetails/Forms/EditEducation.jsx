import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import LoadingSpinner from "../../../../common/LoadingSpinner";

const EditEducation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchEducations = async () => {
      setIsLoading(true);
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      if (!jobSeekerId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/education', {
          headers: {
            'jobseekerid': jobSeekerId,
            'Content-Type': 'application/json'
          }
        });

        console.log("Fetched education data:", response.data);

        if (response.data && response.data.data) {
          const educations = response.data.data.map(edu => ({
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

    if (!jobSeekerId) {
      console.error("JobSeekerId missing");
      alert("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      const newEducations = [];
      const updateEducations = [];

      // Separate new and existing education entries
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

      // Create new education entries (if any)
      if (newEducations.length > 0) {
        try {
          console.log('Creating new educations:', newEducations);
          const createResponse = await axios.post(
            '/api/education',
            newEducations,
            { 
              headers: {
                'jobseekerId': jobSeekerId,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('New educations created:', createResponse.data);
        } catch (error) {
          console.error('Error creating new educations:', error);
          throw error;
        }
      }

      // Update existing education entries (if any)
      for (const education of updateEducations) {
        try {
          console.log('Updating education:', education._id);
          const updateResponse = await axios.patch(
            `/api/education/${education._id}`,
            {
              degreeName: education.degreeName,
              institute: education.institute,
              startDate: education.startDate,
              endDate: education.endDate,
              currentlyEnrolled: education.currentlyEnrolled
            },
            {
              headers: {
                'jobseekerId': jobSeekerId,
                'id': education._id,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('Education updated: ................', updateResponse.data);
        } catch (error) {
          console.error('Error updating education:', error);
          throw error;
        }
      }

      alert("Education details saved successfully!");

      // Refresh education data
      try {
        const getResponse = await axios.get('/api/education', {
          headers: {
            'jobseekerId': jobSeekerId,
            'Content-Type': 'application/json'
          }
        });

        if (getResponse.data && getResponse.data.data) {
          const educations = getResponse.data.data.map(edu => ({
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

      navigate(-1);
    } catch (error) {
      console.error("Error saving educations:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(error.response?.data?.message || error.message || "Failed to save education details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (formData.educations.length <= 1) {
      console.log("Preventing deletion of last education entry");
      return;
    }

    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    const education = formData.educations[index];

    try {
      console.log("Attempting to delete education:", {
        index,
        educationId: education.id,
        hasJobSeekerId: !!jobSeekerId
      });

      if (education.id) {
        const response = await axios.delete(`/api/education/${education.id}`, {
          headers: {
            'jobseekerId': jobSeekerId,
            'id': education.id,
            'Content-Type': 'application/json'
          }
        });
        console.log('Education deleted successfully:', {
          status: response.status,
          data: response.data
        });
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

  return (
    <div className="flex min-h-screen overflow-hidden">
      {isLoading && <LoadingSpinner />}
      
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50 h-[100vh] overflow-auto">
              <div className="flex items-center p-4">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">Education</span>
                </button>
              </div>

              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  <div className="space-y-4">
                    {formData.educations.map((education, index) => (
                      <div key={education.id} className="p-4 bg-white rounded-lg border border-gray-200">
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
                          <input
                            type="text"
                            value={education.degree}
                            onChange={(e) => handleChange(index, "degree", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="Degree"
                            required
                          />

                          <input
                            type="text"
                            value={education.institution}
                            onChange={(e) => handleChange(index, "institution", e.target.value)}
                            className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="Institution"
                            required
                          />

                          <div className="flex flex-col space-y-3">
                            <div className="relative">
                              <label className="text-sm text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={education.startDate}
                                onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                required
                              />
                            </div>

                            <div className="relative">
                              <label className="text-sm text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={education.endDate}
                                onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                disabled={education.currentlyStudying}
                                required={!education.currentlyStudying}
                              />
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={education.currentlyStudying}
                              onChange={(e) => handleChange(index, "currentlyStudying", e.target.checked)}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600">Currently Studying</label>
                          </div>

                          
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
        </main>
      </div>
    </div>
  );
};

export default EditEducation;