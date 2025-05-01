import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AppContext } from "../../../../../context/AppContext";
import LoadingSpinner from "../../../../common/LoadingSpinner";
// Import our specialized profile creation function
import { createNewJobSeekerProfile, updatePersonalDetails } from "../../../../../api/profileApi";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setProfileName, setProfileDp } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "Henry Kanwil",
    addresses: [{ address: "", duration: "", isCurrent: false }],
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("src/assets/images/profile.jpeg");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      setIsLoading(false);
      return;
    }
    const firebaseId = currentUser.uid;

    try {
      // Prepare the form data
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

      if (profileImage instanceof File) {
        formDataToSend.append("profilePic", profileImage);
      }

      // Use different functions based on whether this is a new profile or an update
      if (isDataAlreadyPosted) {
        // For existing profiles, use the update function
        const response = await updatePersonalDetails(firebaseId, formDataToSend);
        console.log("Profile updated successfully:", response);
        
        const data = response.data;
        if (setProfileName && setProfileDp) {
          setProfileName(data.fullname || "");
          setProfileDp(previewImage || profileImage);
        }
      } else {
        // For new profiles, use our specialized creation function
        console.log("Creating new profile with data:", {
          fullname: formData.name,
          shortBio: formData.bio,
          addresses: formData.addresses,
          hasProfileImage: profileImage instanceof File
        });
        
        const response = await createNewJobSeekerProfile(firebaseId, {
          fullname: formData.name,
          shortBio: formData.bio,
          address: formData.addresses,
          profilePic: profileImage instanceof File ? profileImage : undefined
        });
        
        console.log("Profile creation response:", response);

        // Even with mixed 201+500 response, we should have success flag set in our function
        if (response.success) {
          // *** IMPORTANT: Always fetch the jobSeekerId regardless of whether it was in the response ***
          // This ensures we always get the jobSeekerId even if the creation API didn't return it
          try {
            console.log("Fetching jobSeekerId after profile creation...");
            const profileResponse = await axios.get(`${BASEURL}/job-seeker`, {
              headers: {
                "firebase-id": firebaseId,
                "Content-Type": "application/json"
              }
            });
            
            console.log("Profile fetch response:", profileResponse.data);
            
            if (profileResponse.data && profileResponse.data.data && profileResponse.data.data._id) {
              const jobSeekerId = profileResponse.data.data._id;
              localStorage.setItem("jobSeekerId", jobSeekerId);
              console.log("JobSeekerId fetched and stored:", jobSeekerId);
              
              // Also store other useful IDs if available
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
        } else {
          throw new Error("Failed to create profile");
        }
      }

      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Error saving profile data:", error);
      // Even with an error, if it's the "201+500" case, we might want to consider it a success
      // and still try to fetch the jobSeekerId
      if (error.response && error.response.status === 201) {
        console.log("Got 201 status code with error, treating as success");
        
        // Try to fetch the jobSeekerId even after an error
        try {
          const profileResponse = await axios.get(`${BASEURL}/job-seeker`, {
            headers: {
              "firebase-id": firebaseId,
              "Content-Type": "application/json"
            }
          });
          
          if (profileResponse.data && profileResponse.data.data && profileResponse.data.data._id) {
            localStorage.setItem("jobSeekerId", profileResponse.data.data._id);
            console.log("JobSeekerId fetched and stored after error recovery:", profileResponse.data.data._id);
          }
        } catch (fetchError) {
          console.error("Failed to fetch jobSeekerId during error recovery:", fetchError);
        }
        
        navigate("/User-PersonalDetails");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
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
              <span className="font-medium text-black">Edit Personal Details</span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <img
                    src={previewImage || profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover cursor-pointer"
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Full Name"
              />

              <div className="space-y-4">
                {formData.addresses.map((addressItem, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Address {index + 1}</h3>
                      {formData.addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddress(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={addressItem.address}
                        onChange={(e) => handleAddressChange(index, "address", e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Address"
                      />
                      <input
                        type="text"
                        value={addressItem.duration}
                        onChange={(e) => handleAddressChange(index, "duration", e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="Duration (e.g., 2020-2022)"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={addressItem.isCurrent}
                          onChange={(e) => handleAddressChange(index, "isCurrent", e.target.checked)}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-600">Current Address</label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAddress}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                >
                  + Add Another Address
                </button>
              </div>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-4 bg-gray-100 rounded-lg resize-none h-28 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Small bio"
              ></textarea>

              <button
                type="submit"
                className={`w-full text-white font-medium p-4 rounded-full transition flex items-center justify-center ${
                  isLoading ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"
                }`}
                disabled={isLoading}
              >
                <span>{isLoading ? "Loading..." : "Save Edits"}</span>
                {!isLoading && <FiArrowRight className="ml-2" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPersonalDetails;