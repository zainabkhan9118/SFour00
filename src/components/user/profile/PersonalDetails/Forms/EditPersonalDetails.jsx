import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AppContext } from "../../../../../context/AppContext";

const EditPersonalDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setProfileName,setProfileDp} = useContext(AppContext)
  const [formData, setFormData] = useState({
    name: "Henry Kanwil",
    addresses: [{ address: "", duration: "", isCurrent: false }],
    bio: "",
  });
  const [profileImage, setProfileImage] = useState("src/assets/images/profile.jpeg");
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [isDataAlreadyPosted, setIsDataAlreadyPosted] = useState(false); 
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
        const response = await axios.get(`api/job-seeker`, {
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

    try {
      if (isDataAlreadyPosted) {
       const response =await axios.patch(`api/job-seeker`, dataToSend, {
          headers: {
            "firebase-id": firebaseId,
            "Content-Type": "application/json",
          },
        });
        const data = response.data.data
        // console.log('fahad',data.name);
        if (setProfileName && setProfileDp) {
          setProfileName(data.fullname || ""); 
          setProfileDp(previewImage || profileImage); 
        }
        console.log("Profile data updated successfully.");
      } else {
        // Otherwise, use POST to create new data
        const response = await axios.post(`api/job-seeker`, dataToSend, {
          headers: {
            "firebase-id": firebaseId,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data._id) {
          localStorage.setItem("jobSeekerId", response.data._id);
          console.log("User ID saved to local storage:", response.data._id);
          if(setProfileName && setProfileDp) {
            setProfileName(formData.name); 
            setProfileDp(previewImage || profileImage);
          }
        }
        console.log("Profile data saved successfully.");
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
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <div>
            <UserSidebar />
            </div>
            
            <div className="p-4 flex-1 bg-gray-50 h-[100vh] overflow-auto">
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