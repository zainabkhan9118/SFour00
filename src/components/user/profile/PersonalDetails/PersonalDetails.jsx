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

const PersonalDetails = () => {
  const navigate = useNavigate();
  const { setProfileName, setProfileDp } = useContext(AppContext);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
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
    navigate("/edit-utr-number");
  };

  const handleEditCertificate = () => {
    navigate("/edit-certificate");
  };

  const handleEditLicense = () => {
    navigate("/edit-license");
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
          setUserData({
            fullname: "John Doe",
            shortBio: "A passionate job seeker looking for exciting opportunities. passionate job seeker looking for exciting opportunities. loremgit",
            profilePic: profilePic,
            address: [{ address: "123 Main St, Springfield", isCurrent: true }],
          });
          setFormData({
            fullname: "John Doe",
            shortBio: "A passionate job seeker looking for exciting opportunities.",
            profilePic: profilePic,
            address: "123 Main St, Springfield",
          });
        } else {
          setUserData({
            fullname: data.fullname || "",
            shortBio: data.shortBio || "",
            profilePic: data.profilePic || profilePic, 
            address: data.address || [],
          });
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
                          License
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