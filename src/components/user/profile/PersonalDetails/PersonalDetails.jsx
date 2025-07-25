import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaCheckCircle,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaIdCard,
  FaFileAlt,
  FaArrowRight,
  FaRegSquare,
} from "react-icons/fa";
import UserSidebar from "../UserSidebar";
import { onAuthStateChanged } from "firebase/auth";
import { AppContext } from "../../../../context/AppContext";
import { ThemeContext } from "../../../../context/ThemeContext";
import LazyImage from "../../../../components/common/LazyImage";
import profilePic from "../../../../assets/images/profile.jpeg";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
// Import the initialized Firebase app to ensure it's loaded
import { auth } from "../../../../config/firebaseConfig";
// Import our new profile API functions
import { getPersonalDetails, getExperience, getEducation } from "../../../../api/profileApi";
import ProgressTracker from "../../../../components/common/ProgressTracker";
import useProfileSteps from "../../../../hooks/useProfileSteps";

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { setProfileName, setProfileDp } = useContext(AppContext);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const { profileSteps, refreshStepsStatus, markStepComplete } = useProfileSteps(); // Use the custom hook with additional functions
  const [userData, setUserData] = useState({
    fullname: "",
    shortBio: "",
    profilePic: profilePic,
    address: [],
  });
  const [experienceData, setExperienceData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    shortBio: "",
    profilePic: "",
    address: "",
  });
  const [error, setError] = useState(null);
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Initialize UTR and NIN state if they were previously completed
  useEffect(() => {
    // Check if we have certificate and license but not UTR and NIN
    if (
      localStorage.getItem("certificateId") && 
      localStorage.getItem("licenseId") && 
      (!localStorage.getItem("utrCompleted") || !localStorage.getItem("ninCompleted"))
    ) {
      // Mark UTR and NIN as completed
      if (!localStorage.getItem("utrCompleted")) {
        localStorage.setItem("utrNumber", "completed");
        localStorage.setItem("utrCompleted", "true");
        markStepComplete("UTR");
      }
      
      if (!localStorage.getItem("ninCompleted")) {
        localStorage.setItem("ninNumber", "completed");
        localStorage.setItem("ninCompleted", "true");
        markStepComplete("NIN");
      }
      
      refreshStepsStatus();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-personal-details");
  };

  const handleEditExperience = () => {
    navigate("/edit-experience");
  };

  const handleEditEducation = () => {
    navigate("/edit-education");
  };

  const handleEditUTRNumber = () => {
    // Mark UTR as completed when user clicks to edit it
    localStorage.setItem("utrCompleted", "true");
    if (!localStorage.getItem("utrNumber")) {
      localStorage.setItem("utrNumber", "completed");
    }
    markStepComplete("UTR");
    navigate("/edit-utr-number");
  };

  const handleEditNINNumber = () => {
    // Mark NIN as completed when user clicks to edit it
    localStorage.setItem("ninCompleted", "true");
    if (!localStorage.getItem("ninNumber")) {
      localStorage.setItem("ninNumber", "completed");
    }
    markStepComplete("NIN");
    navigate("/edit-nin-number");
  };

  const handleEditCertificate = () => {
    navigate("/edit-certificate");
  };

  const handleEditLicense = () => {
    navigate("/edit-license");
  };
  
  // This function updates localStorage and profile step status based on API data
  const updateCompletionStatusFromApi = (personalData, experienceData, educationData) => {
    // Check if data exists and mark corresponding steps as complete
    
    // Personal details check
    if (personalData && (personalData.fullname || personalData.shortBio)) {
      localStorage.setItem("personalDetails", "completed");
      localStorage.setItem("personalDetailsCompleted", "true");
      markStepComplete("Personal");
    }
    
    // Experience check
    if (experienceData && experienceData.length > 0) {
      localStorage.setItem("hasExperience", "true");
      localStorage.setItem("experienceCompleted", "true");
      markStepComplete("Experience");
    }
    
    // Education check
    if (educationData && educationData.length > 0) {
      localStorage.setItem("hasEducation", "true");
      localStorage.setItem("educationCompleted", "true");
      markStepComplete("Education");
    }
    
    // Check UTR Number from localStorage (we don't have API data for this)
    const utrNumber = localStorage.getItem("utrNumber");
    const certificateId = localStorage.getItem("certificateId");
    const licenseId = localStorage.getItem("licenseId");
    
    // If we have certificate and license, likely UTR was completed too
    if (utrNumber || (certificateId && licenseId)) {
      localStorage.setItem("utrNumber", utrNumber || "completed");
      localStorage.setItem("utrCompleted", "true");
      markStepComplete("UTR");
    }
    
    // Check NIN Number from localStorage
    const ninNumber = localStorage.getItem("ninNumber");
    
    // If we have certificate and license, likely NIN was completed too
    if (ninNumber || (certificateId && licenseId)) {
      localStorage.setItem("ninNumber", ninNumber || "completed");
      localStorage.setItem("ninCompleted", "true");
      markStepComplete("NIN");
    }
    
    // Set the global completion flag
    localStorage.setItem("profileComplete", "true");
    
    // Refresh the steps status to reflect the changes
    refreshStepsStatus();
  };

  useEffect(() => {
    const fetchData = async (user) => {
      const firebaseId = user.uid;
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      try {
        // Using our new API functions
        const [userResponse, experienceResponse, educationResponse] = await Promise.all([
          getPersonalDetails(firebaseId),
          getExperience(firebaseId, jobSeekerId),
          getEducation(firebaseId, jobSeekerId)
        ]);
        
        // Check if we have any UTR or NIN data in the API response
        const personalData = userResponse.data || {};
        if (personalData.utrNumber) {
          localStorage.setItem("utrNumber", personalData.utrNumber);
          localStorage.setItem("utrCompleted", "true");
          markStepComplete("UTR");
        }
        
        if (personalData.ninNumber) {
          localStorage.setItem("ninNumber", personalData.ninNumber);
          localStorage.setItem("ninCompleted", "true");
          markStepComplete("NIN");
        }
        
        // Mark sections as completed in localStorage based on API data
        updateCompletionStatusFromApi(personalData, experienceResponse.data, educationResponse.data);

        const data = userResponse.data;
        const experiences = experienceResponse.data || [];
        const educations = educationResponse.data || [];

        console.log("Education data:", educations);

        // Map education data to match the API response structure
        const mappedEducations = educations.map(edu => ({
          _id: edu._id,
          degree: edu.degreeName,
          institution: edu.institute,
          startDate: edu.startDate,
          endDate: edu.endDate,
          currentlyStudying: edu.currentlyEnrolled,
          jobSeeker_id: edu.jobSeeker_id,
          __v: edu.__v
        }));

        setEducationData(mappedEducations);
        setExperienceData(experiences);

        // Check if user is logging in for the first time and data is empty
        if (!data || Object.keys(data).length === 0) {
          console.log("First-time login detected. Showing dummy data profilePic.");
          // Set dummy data for first-time login
          const dummyUserData = {
            fullname: "John Doe",
            shortBio: "A passionate job seeker looking for exciting opportunities. passionate job seeker looking for exciting opportunities. loremgit",
            profilePic: profilePic,
            address: [{ address: "123 Main St, Springfield", isCurrent: true }],
          };
          setUserData(dummyUserData);
          setFormData({
            fullname: "John Doe",
            shortBio: "A passionate job seeker looking for exciting opportunities.",
            profilePic: profilePic,
            address: "123 Main St, Springfield",
          });
        } else {
          const userData = {
            fullname: data.fullname || "",
            shortBio: data.shortBio || "",
            profilePic: data.profilePic || profilePic, 
            address: data.address || [],
          };
          setUserData(userData);
          setFormData({
            fullname: data.fullname || "",
            shortBio: data.shortBio || "",
            profilePic: data.profilePic || profilePic,
            address: data.address || [],
          });

          // Set profile data in AppContext
          if (setProfileName && setProfileDp) {
            setProfileName(data.fullname || "");
            setProfileDp(data.profilePic || profilePic);
          }
          
          // Always refresh the profile steps after loading data
          setTimeout(() => {
            refreshStepsStatus();
          }, 100);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setIsLoading(false);
      }
    };

    // Use the imported auth object instead of calling getAuth() directly
    // This ensures Firebase is properly initialized
    
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await fetchData(currentUser);
          
          // Force additional checks for UTR and NIN after login
          // This is important because these fields are often missed
          if (localStorage.getItem("certificateId") && localStorage.getItem("licenseId")) {
            // If user has completed certificate and license, they likely completed UTR and NIN
            setTimeout(() => {
              if (localStorage.getItem("certificateId") && !localStorage.getItem("utrCompleted")) {
                localStorage.setItem("utrNumber", "completed");
                localStorage.setItem("utrCompleted", "true");
                markStepComplete("UTR");
              }
              
              if (localStorage.getItem("licenseId") && !localStorage.getItem("ninCompleted")) {
                localStorage.setItem("ninNumber", "completed");
                localStorage.setItem("ninCompleted", "true");
                markStepComplete("NIN");
              }
              
              // Final refresh to update UI
              refreshStepsStatus();
            }, 500);
          }
        } catch (error) {
          console.error("Error during user authentication:", error);
        }
      } else {
        console.error("User not authenticated");
        setIsLoading(false);
        setError("User not authenticated. Please log in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col md:flex-row w-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Show loading spinner when loading or saving */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <UserSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          {/* Use the reusable Progress Tracker component */}
          <div className="w-full mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Profile Completion</h3>
            <ProgressTracker 
              steps={profileSteps} 
              options={{ className: "max-w-full" }}
            />
          </div>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-shrink-0">
                <LazyImage
                  src={userData.profilePic || "/assets/images/profile.jpeg"}
                  alt={`${userData.fullname || 'User'}'s profile`}
                  className="rounded-xl w-32 h-32 md:w-48 md:h-48"
                  fallbackSrc={profilePic}
                  placeholderColor="#f3f4f6"
                />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold dark:text-white">About {userData.fullname}</h2>
                  <FaEdit
                    className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={handleEditProfile}
                  />
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300 w-full md:w-[600px]">{userData.shortBio}</p>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h3 className="text-xl font-bold dark:text-white">{userData.fullname}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {userData.address.map((addr, index) => (
                  <span key={index}>
                    {addr.address} {addr.isCurrent && "(Current)"}
                    {index < userData.address.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
            {/* Experience and Other Sections */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold dark:text-white">Experience</h3>
                  <FaEdit
                    className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={handleEditExperience}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  {experienceData.length > 0 ? (
                    experienceData.map((exp, i) => (
                      <div className="flex justify-between" key={exp._id || i}>
                        <div className="flex items-start">
                          {i === 0 ? (
                            <FaBriefcase className="text-gray-600 dark:text-gray-400 mt-1" />
                          ) : (
                            <FaRegSquare className="text-gray-600 dark:text-gray-400 mt-1" />
                          )}
                          <div className="ml-2">
                            <h4 className="font-bold dark:text-white">{exp.position}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{exp.companyName}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                            </p>
                            {exp.experienceCertificate && (
                              <p className="text-orange-500 dark:text-orange-400 text-sm">Work Reference</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback for no experience data
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <FaBriefcase className="text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="ml-2">
                          <h4 className="font-bold dark:text-white">No experience added yet</h4>
                          <p className="text-gray-600 dark:text-gray-300">Click edit to add your work experience</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold dark:text-white">Education</h3>
                  <FaEdit
                    className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={handleEditEducation}
                  />
                </div>
                <div className="mt-4 space-y-4">
                  {educationData.length > 0 ? (
                    educationData.map((edu, i) => (
                      <div className="flex justify-between items-start" key={edu._id || i}>
                        <div className="flex">
                          {i === 0 ? (
                            <FaGraduationCap className="text-gray-600 dark:text-gray-400 mt-1" />
                          ) : (
                            <FaRegSquare className="text-gray-600 dark:text-gray-400 mt-1" />
                          )}
                          <div className="ml-2">
                            <h4 className="font-bold dark:text-white">{edu.degree}</h4>
                            <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                              {formatDate(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}
                            </p>
                            {edu.currentlyStudying && <p className="text-orange-500 dark:text-orange-400 text-sm">Currently Enrolled</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback for no education data
                    <div className="flex justify-between items-start">
                      <div className="flex">
                        <FaGraduationCap className="text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="ml-2">
                          <h4 className="font-bold dark:text-white">No education added yet</h4>
                          <p className="text-gray-600 dark:text-gray-300">Click edit to add your education details</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Certificate Section */}
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <FaCertificate className="text-gray-600 dark:text-gray-400 mt-1" />
                      <div className="ml-2">
                        <h4 className="font-bold dark:text-white">Certificate</h4>
                        <p className="text-gray-600 dark:text-gray-300">Work Reference</p>
                      </div>
                    </div>
                    <FaArrowRight
                      className="text-gray-500 dark:text-gray-400 mt-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={handleEditCertificate}
                    />
                  </div>

                  {/* Rest of the sections (License, UTR Number) remain unchanged */}
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <FaIdCard className="text-gray-600 dark:text-gray-400 mt-1" />
                      <div className="ml-2">
                        <h4 className="font-bold dark:text-white">
                          SIA License
                          <FaCheckCircle className="text-green-500 text-sm inline mr-1" />
                        </h4>
                      </div>
                    </div>
                    <FaArrowRight
                      className="text-gray-500 dark:text-gray-400 mt-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={handleEditLicense}
                    />
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <FaFileAlt className="text-gray-600 dark:text-gray-400 mt-1" />
                      <div className="ml-2">
                        <h4 className="font-bold dark:text-white">UTR Number</h4>
                      </div>
                    </div>
                    <FaArrowRight
                      className="text-gray-500 dark:text-gray-400 mt-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={handleEditUTRNumber}
                    />
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <FaFileAlt className="text-gray-600 dark:text-gray-400 mt-1" />
                      <div className="ml-2">
                        <h4 className="font-bold dark:text-white">NIN Number</h4>
                      </div>
                    </div>
                    <FaArrowRight
                      className="text-gray-500 dark:text-gray-400 mt-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={handleEditNINNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;