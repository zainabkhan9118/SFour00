import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

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
import Header from "../../Header";
import Sidebar from "../../SideBar";
import UserSidebar from "../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";

const PersonalDetails = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullname: "",
    shortBio: "",
    profilePic: "/assets/images/profile.jpeg",
    address: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    shortBio: "",
    profilePic: "",
    address: "",
  });
  async function compressImage(profilePic) {
    try {
      const options = {
        maxSizeMB: 1, // Maximum size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true, // Use web workers for better performance
      };
  
      const compressedFile = await imageCompression(profilePic, options);
      console.log("Original File Size:", (profilePic.size / 1024 / 1024).toFixed(2), "MB");
      console.log("Compressed File Size:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
      
      return compressedFile;
    } catch (error) {
      console.error("Error compressing the image:", error);
    }
  }
  

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
    const fetchData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      const firebaseId = currentUser.uid;
      console.log("firebaseId", firebaseId);

      try {
        const response = await axios.get(`api/job-seeker`, {
          headers: {
            "firebase-id": `${firebaseId}`,
            "Content-Type": "application/json",
          },
        });

        console.log("response", response.data);

        const data = response.data.data;
        setUserData({
          fullname: data.fullname || "",
          shortBio: data.shortBio || "",
          profilePic: data.profilePic || "/assets/images/profile.jpeg",
          address: data.address || [],
        });
        setFormData({
          fullname: data.fullname || "",
          shortBio: data.shortBio || "",
          profilePic: data.profilePic || "/assets/images/profile.jpeg",
          address: data.address || [],
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />
        <main className="flex-3 mt-3">
          <div className="flex flex-row flex-1">
            <div>
              <UserSidebar  />
            </div>
            <div className="p-4 h-screen overflow-auto">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row">
                  <div className="relative flex-shrink-0">
                    <img
                      src={userData.profilePic}
                      alt="Profile"
                      className="rounded-xl w-32 h-32 md:w-48 md:h-48"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold">About {userData.fullname}</h2>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditProfile}
                      />
                    </div>
                    <p className="mt-2 text-gray-600 w-[600px]">{userData.shortBio}</p>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold">{userData.fullname}</h3>
                  <p className="text-gray-600">
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
                      <h3 className="text-xl font-bold">Experience</h3>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditExperience}
                      />
                    </div>
                    <div className="mt-4 space-y-4">
                      {[0, 1, 2].map((i) => (
                        <div className="flex justify-between" key={i}>
                          <div className="flex items-start">
                            {i === 0 ? (
                              <FaBriefcase className="text-gray-600 mt-1" />
                            ) : (
                              <FaRegSquare className="text-gray-600 mt-1" />
                            )}
                            <div className="ml-2">
                              <h4 className="font-bold">Security Supervisor</h4>
                              <p className="text-gray-600">SoftShift</p>
                              <p className="text-gray-600">June 2020 - Present</p>
                              {i === 2 && (
                                <p className="text-orange-500 text-sm">Work Reference</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Education</h3>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditEducation}
                      />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaGraduationCap className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">BS Social Science</h4>
                            <p className="text-gray-600">ABC University</p>
                            <p className="text-gray-600">Oct 2017 - Nov 7 2021</p>
                          </div>
                        </div>
                        <FaArrowRight
                          className="text-gray-500 mt-2"
                          onClick={handleEditEducation}
                        />
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaCertificate className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">Certificate</h4>
                            <p className="text-gray-600">Work Reference</p>
                          </div>
                        </div>
                        <FaArrowRight
                          className="text-gray-500 mt-2 cursor-pointer"
                          onClick={handleEditCertificate}
                        />
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaIdCard className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">
                              License
                              <FaCheckCircle className="text-green-500 text-sm inline mr-1" />
                            </h4>
                          </div>
                        </div>
                        <FaArrowRight
                          className="text-gray-500 mt-2 cursor-pointer"
                          onClick={handleEditLicense}
                        />
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaFileAlt className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">UTR Number</h4>
                          </div>
                        </div>
                        <FaArrowRight
                          className="text-gray-500 mt-2 cursor-pointer"
                          onClick={handleEditUTRNumber}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalDetails;