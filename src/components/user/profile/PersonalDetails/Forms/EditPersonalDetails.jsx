import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AppContext } from "../../../../../context/AppContext";
import LoadingSpinner from "../../../../common/LoadingSpinner";

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

      if (isDataAlreadyPosted) {
        const response = await axios.patch(`${BASEURL}/job-seeker`, formDataToSend, {
          headers: {
            "firebase-id": firebaseId,
            "Content-Type": "multipart/form-data",
          },
        });
        const data = response.data.data;
        if (setProfileName && setProfileDp) {
          setProfileName(data.fullname || "");
          setProfileDp(previewImage || profileImage);
        }
      } else {
        const response = await axios.post(`${BASEURL}/job-seeker`, formDataToSend, {
          headers: {
            "firebase-id": firebaseId,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.data && response.data.data._id) {
          localStorage.setItem("jobSeekerId", response.data.data._id);
          if (setProfileName && setProfileDp) {
            setProfileName(formData.name);
            setProfileDp(previewImage || profileImage);
          }
        }
      }

      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Error saving profile data:", error);
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