import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AppContext } from "../../../../../context/AppContext";
import { ThemeContext } from "../../../../../context/ThemeContext";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { createNewJobSeekerProfile, updatePersonalDetails } from "../../../../../api/profileApi";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../popupModel/ProfileSuccessPopup";
import ProgressTracker from "../../../../common/ProgressTracker";
import useProfileSteps from "../../../../../hooks/useProfileSteps";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setProfileName, setProfileDp } = useContext(AppContext);
  const { showSuccess, showError } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const { profileSteps, getNextStep } = useProfileSteps(); // Use the profile steps hook
  const [formData, setFormData] = useState({
    name: "",
    addresses: [{ address: "", duration: "", isCurrent: false }],
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("src/assets/images/profile.jpeg");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");


  const [isChecked, setIsChecked] = useState(false);


 const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // This useEffect will run when the component mounts to check if license data already exists
  useEffect(() => {
    const fetchLicenseData = async () => {
      if (isDataAlreadyPosted) {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        try {
          const response = await axios.get(`${BASEURL}/job-seeker`, {
            headers: {
              "firebase-id": `${currentUser.uid}`,
            },
          });
          
          if (response.data?.data?.licencseStatue !== undefined) {
            setIsChecked(response.data.data.licencseStatue);
          }
        } catch (error) {
          console.error("Error fetching license data:", error);
        }
      }
    };
    
    fetchLicenseData();
  }, [isDataAlreadyPosted]);

  
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchExistingData = async () => {
      setIsLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      const firebaseId = currentUser.uid;

      try {
        const response = await axios.get(`${BASEURL}/job-seeker`, {
          headers: {
            "firebase-id": `${firebaseId}`,
          },
        });

        if (response.data && response.data.data) {
          const data = response.data.data;
          setFormData({
            name: data.fullname || "",
            addresses: data.address || [{ address: "", duration: "", isCurrent: false }],
            bio: data.shortBio || "",
          });
          setProfileImage(data.profilePic || "src/assets/images/profile.jpeg");
          setIsDataAlreadyPosted(true);
        }
      } catch (error) {
        console.error("Error fetching existing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;

    if (field === "isCurrent" && value === true) {
      newAddresses.forEach((addr, i) => {
        if (i !== index) addr.isCurrent = false;
      });
    }

    setFormData((prev) => ({
      ...prev,
      addresses: newAddresses,
    }));
  };

  const addAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { address: "", duration: "", isCurrent: false }],
    }));
  };

  const removeAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
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
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      showError("User not authenticated. Please log in again.");
      setIsLoading(false);
      return;
    }
    const firebaseId = currentUser.uid;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullname", formData.name);
      formDataToSend.append("shortBio", formData.bio);

      formDataToSend.append(
        "address",
        JSON.stringify(
          formData.addresses.map((addr) => ({
            address: addr.address,
            duration: addr.duration,
            isCurrent: addr.isCurrent,
          }))
        )
      );

      // Add the license checkbox state to the form data
      formDataToSend.append("licencseStatue", isChecked);
      console.log("Sending license status:", isChecked);

      if (profileImage instanceof File) {
        formDataToSend.append("profilePic", profileImage);
      }

      if (isDataAlreadyPosted) {
        // Log the form data for debugging
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        const response = await updatePersonalDetails(firebaseId, formDataToSend);
        console.log("Profile updated successfully:", response);

        const data = response.data;
        if (setProfileName && setProfileDp) {
          setProfileName(data.fullname || "");
          setProfileDp(previewImage || profileImage);
        }

        showSuccess("Profile updated successfully!");
        localStorage.setItem("personalDetails", "completed");
        
        // Find the current step and navigate to the next step in the sequence
        const currentStepId = 1; // Personal Details is step 1 in the sequence
        const nextStep = getNextStep(currentStepId);
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          navigate('/User-PersonalDetails');
        }

        await checkProfileCompletion();
      } else {
        console.log("Creating new profile with data:", {
          fullname: formData.name,
          shortBio: formData.bio,
          addresses: formData.addresses,
          hasProfileImage: profileImage instanceof File,
        });

        const response = await createNewJobSeekerProfile(firebaseId, {
          fullname: formData.name,
          shortBio: formData.bio,
          address: formData.addresses,
          LicenseStatus: isChecked,
          profilePic: profileImage instanceof File ? profileImage : undefined,
        });

        console.log("Profile creation response:", response);

        if (response.success) {
          try {
            console.log("Fetching jobSeekerId after profile creation...");
            const profileResponse = await axios.get(`${BASEURL}/job-seeker`, {
              headers: {
                "firebase-id": firebaseId,
                "Content-Type": "application/json",
              },
            });

            console.log("Profile fetch response:", profileResponse.data);

            if (profileResponse.data && profileResponse.data.data && profileResponse.data.data._id) {
              const jobSeekerId = profileResponse.data.data._id;
              localStorage.setItem("jobSeekerId", jobSeekerId);
              console.log("JobSeekerId fetched and stored:", jobSeekerId);

              if (profileResponse.data.data.certificates && profileResponse.data.data.certificates.length > 0) {
                const certificateId = profileResponse.data.data.certificates[0]?._id;
                if (certificateId) localStorage.setItem("certificateId", certificateId);
              }

              if (profileResponse.data.data.licenses && profileResponse.data.data.licenses.length > 0) {
                const licenseId = profileResponse.data.data.licenses[0]?._id;
                if (licenseId) localStorage.setItem("licenseId", licenseId);
              }
            } else {
              console.error("Could not find jobSeekerId in profile response");
            }
          } catch (fetchError) {
            console.error("Error fetching jobSeekerId after profile creation:", fetchError);
          }

          if (setProfileName && setProfileDp) {
            setProfileName(formData.name);
            setProfileDp(previewImage || profileImage);
          }

          showSuccess("Profile created successfully!");
          setSuccessMessage("Your profile has been created successfully! Let's continue with more details.");
          setRedirectPath("/User-PersonalDetails");
          setShowSuccessPopup(true);

          await checkProfileCompletion();
        } else {
          throw new Error("Failed to create profile");
        }
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      showError("Error saving profile data. Please try again.");
      if (error.response && error.response.status === 201) {
        console.log("Got 201 status code with error, treating as success");

        try {
          const profileResponse = await axios.get(`${BASEURL}/job-seeker`, {
            headers: {
              "firebase-id": firebaseId,
              "Content-Type": "application/json",
            },
          });

          if (profileResponse.data && profileResponse.data.data && profileResponse.data.data._id) {
            localStorage.setItem("jobSeekerId", profileResponse.data.data._id);
            console.log("JobSeekerId fetched and stored after error recovery:", profileResponse.data.data._id);

            showSuccess("Profile saved successfully, but some features may need to be updated later.");
            setSuccessMessage("Your profile has been created successfully!");
            setRedirectPath("/User-PersonalDetails");
            setShowSuccessPopup(true);

            await checkProfileCompletion();
          }
        } catch (fetchError) {
          console.error("Failed to fetch jobSeekerId during error recovery:", fetchError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    // Navigate to education form next
    navigate('/edit-education');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {isLoading && <LoadingSpinner />}

      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
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
            <button onClick={handleBack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black dark:text-white">Edit Personal Details</span>
            </button>
          </div>
          
          {/* Progress Tracker */}
          <ProgressTracker steps={profileSteps} />

          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <img
                    src={previewImage || profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover cursor-pointer"
                    onClick={handleImageClick}
                    aria-label="Click to change profile picture"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    aria-label="Upload profile picture"
                  />
                  <label className="text-xs text-center block mt-2 text-gray-500 dark:text-gray-400">
                    Click to update photo
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address Information
                </label>
                {formData.addresses.map((addressItem, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium dark:text-white">Address {index + 1}</h3>
                      {formData.addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(index)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          aria-label={`Remove address ${index + 1}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label htmlFor={`address-${index}`} className="block text-xs text-gray-600 dark:text-gray-400">
                          Address Line
                        </label>
                        <input
                          id={`address-${index}`}
                          type="text"
                          value={addressItem.address}
                          onChange={(e) => handleAddressChange(index, "address", e.target.value)}
                          className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Enter your address"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor={`duration-${index}`} className="block text-xs text-gray-600 dark:text-gray-400">
                          Duration
                        </label>
                        <input
                          id={`duration-${index}`}
                          type="text"
                          value={addressItem.duration}
                          onChange={(e) => handleAddressChange(index, "duration", e.target.value)}
                          className="w-full p-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          placeholder="Duration (e.g., 2020-2022)"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id={`current-${index}`}
                          type="checkbox"
                          checked={addressItem.isCurrent}
                          onChange={(e) => handleAddressChange(index, "isCurrent", e.target.checked)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Current Address
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                
                              <button
                  type="button"
                  onClick={addAddress}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-orange-500 hover:text-orange-500 dark:hover:text-orange-400 transition"
                  aria-label="Add another address"
                >
                  + Add Another Address
                </button>
              </div>

              <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  id="has-license"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="has-license" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Do you have a license?
                </label>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg resize-none h-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Write a short bio about yourself"
                  aria-describedby="bioHelp"
                ></textarea>
                <p id="bioHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Brief description about yourself that will be visible on your profile
                </p>
              </div>

              <button
                type="submit"
                className={`w-full text-white font-medium p-4 rounded-full transition flex items-center justify-center ${
                  isLoading ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"
                }`}
                disabled={isLoading}
                aria-label="Save profile changes"
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

export default EditPersonalDetails;