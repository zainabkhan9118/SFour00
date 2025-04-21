import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import axios from "axios";

// Define your API base URL

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "Henry Kanwil",
    addresses: [{ address: "", duration: "", isCurrent: false }],
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("src/assets/images/profile.jpeg");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state added

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
      // Uncheck other addresses if this one is marked as current
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when saving starts

    // Get Firebase ID from the authenticated user
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      setIsLoading(false); // Reset loading state
      return;
    }
    const firebaseId = currentUser.uid;
    console.log('firebase id',firebaseId);
    
    // Prepare the data to send
    const dataToSend = {
      fullname: formData.name,
      address: formData.addresses.map((addr) => ({
        address: addr.address,
        duration: addr.duration,
        isCurrent: addr.isCurrent,
      })),
      shortBio: formData.bio,
      profilePic: previewImage || profileImage,
    };
    console.log('fahd', dataToSend);

    try {
      const response = await axios.post(
        `api/job-seeker`, // API endpoint
        dataToSend,
        {
          headers: {
            "firebase-id": `${firebaseId}`,
           "Content-Type": "multipart/form-data",

          },
        }
      );
      console.log("Profile data saved successfully", response.data);
      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Error saving profile data:", error);
    } finally {
      setIsLoading(false); // Reset loading state after request completes
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        <main className="flex-3 overflow-auto">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50">
              {/* Header with back button */}
              <div className="flex items-center p-4">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">Edit Personal Details</span>
                </button>
              </div>

              {/* Edit Form */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  {/* Profile Picture */}
                  <div className="flex justify-center mb-2">
                    <div className="relative">
                      <img
                        src={previewImage || profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover cursor-pointer"
                        onClick={handleImageClick}
                      />
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-blue-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Full Name"
                  />

                  {/* Addresses Section */}
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

                  {/* Save Button */}
                  <button
                    type="submit"
                    className={`w-full text-white font-medium p-4 rounded-full transition flex items-center justify-center ${
                      isLoading ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    disabled={isLoading} // Disable button during loading
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

export default EditPersonalDetails;