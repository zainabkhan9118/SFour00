import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../../common/LoadingSpinner";
import { FaMapMarkerAlt, FaEye, FaRegSquare, FaTimes } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import profileImage from "../../../assets/images/profileImage.png";
import security from "../../../assets/images/security.png";
import lisence from "../../../assets/images/lisence.png";
import urt from "../../../assets/images/urt.png";
import rectangle from "../../../assets/images/rectangle.png";
import { useLocation, useParams } from "react-router-dom";
import { getJobById } from "../../../api/jobsApi";
import { ThemeContext } from "../../../context/ThemeContext";


const ApplicantProfile = () => {
  const location = useLocation();
  const { applicantId, jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicant, setApplicant] = useState(location.state?.applicant || {});
  const [job, setJob] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState("");
  const [popupImageTitle, setPopupImageTitle] = useState("");
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Function to handle opening the image popup
  const handleOpenImagePopup = (imageUrl, title) => {
    setPopupImageUrl(imageUrl);
    setPopupImageTitle(title || "Document");
    setShowImagePopup(true);
  };
  
  // Function to handle closing the image popup
  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setPopupImageUrl("");
    setPopupImageTitle("");
  };

  useEffect(() => {
    const fetchApplicantData = async () => {
      if (Object.keys(applicant).length > 0 && !applicantId) {
        setLoading(false);
        return; // If we already have applicant data from location state, no need to fetch
      }
      
      try {
        setLoading(true);
        // Use the applicantId from URL params if available
        const id = applicantId || applicant._id;
        
        if (!id) {
          throw new Error("No applicant ID available");
        }
        
        // Use the generic fetch to get job seeker data by ID
        // Note: We don't have a specific function in the API modules for getting
        // a job seeker by ID different from the current user, so we're using fetch
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${BASE_URL}/job-seeker/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && result.data) {
          setApplicant(result.data);
        } else {
          throw new Error("Invalid response format");
        }
        
      } catch (err) {
        console.error("Failed to fetch applicant data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) {
          console.error("No company ID found");
          return;
        }
        
        // Use the jobsApi module to get job details
        const result = await getJobById(jobId, companyId);
        
        if (result.statusCode === 200) {
          setJob(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch job data:", err);
      }
    };

    fetchApplicantData();
    fetchJobData();
  }, [applicantId, jobId, applicant._id]);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || Object.keys(applicant).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 text-xl">Error loading applicant data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Image Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{popupImageTitle}</h3>
              <button 
                onClick={handleCloseImagePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center">
              {popupImageUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={popupImageUrl} 
                  className="w-full h-full min-h-[60vh]" 
                  title={popupImageTitle}
                ></iframe>
              ) : (
                <img 
                  src={popupImageUrl} 
                  alt={popupImageTitle} 
                  className="max-w-full max-h-[70vh] object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row rounded-xl p-6 md:p-8 gap-6 max-w-4xl">
        {/* Image & Info */}
        <div className="flex-shrink-0">
          <img
            src={applicant.profilePic || profileImage}
            alt={applicant.fullname || "Applicant"}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-md cursor-pointer"
            onClick={() => applicant.profilePic && handleOpenImagePopup(applicant.profilePic, `${applicant.fullname}'s Profile Picture`)}
          />
          <h3 className="text-2xl font-bold mt-4">{applicant.fullname || "Applicant Name"}</h3>
          <p className="text-gray-400 text-base">
            {applicant.age ? `${applicant.age} years` : ""} 
            {applicant.country && ` | ${applicant.country}`}
          </p>

          <div className="flex items-center text-gray-600 mt-2 bg-gray-100 px-3 py-2 rounded-full w-full md:w-[308px] h-auto min-h-[28px]">
            <FaMapMarkerAlt className="text-gray-500 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {applicant.address && applicant.address.length > 0 
                ? applicant.address[0].address 
                : "Address not provided"}
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold">About {applicant.fullname?.split(' ')[0] || "Applicant"}</h2>
          <p className="text-gray-600 mt-2">
            {applicant.about || applicant.shortBio || 
              "This applicant has not provided any additional information about themselves."}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl">
        {/* Experience Section */}
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Experience</h2>

          {applicant.experiences && applicant.experiences.length > 0 ? (
            applicant.experiences.map((exp, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <img src={index % 2 === 0 ? security : rectangle} className="w-8 h-8" alt="" />
                <div>
                  <h3 className="font-bold text-lg">{exp.position || "Position"}</h3>
                  <p className="text-gray-500">{exp.companyName || "Company"}</p>
                  <p className="text-gray-400 text-sm">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ""}
                    {" - "}
                    {exp.currentlyWorking ? "Present" : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "")}
                  </p>
                  {exp.experienceCertificate && (
                    <div className="flex items-center mt-1">
                      <p className="text-orange-500 text-sm flex items-center gap-1">
                        <MdOutlineWorkOutline /> Work Reference
                      </p>
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => handleOpenImagePopup(exp.experienceCertificate, `${exp.position} Certificate`)}
                      >
                        <FaEye />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience information available</p>
          )}
        </div>

        {/* Education Section */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Education</h2>

          {applicant.educationRecords && applicant.educationRecords.length > 0 ? (
            applicant.educationRecords.map((edu, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <img src={security} className="w-8 h-8" alt="" />
                <div>
                  <h3 className="font-bold text-lg">{edu.degreeName || edu.qualification || "Degree"}</h3>
                  <p className="text-gray-500">{edu.institute || edu.institution || "Institution"}</p>
                  <p className="text-gray-400 text-sm">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ""}
                    {" - "}
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                  </p>
                  {edu.degreeCertificate && (
                    <div className="flex items-center mt-1">
                      <p className="text-orange-500 text-sm">View Degree Certificate</p>
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => handleOpenImagePopup(edu.degreeCertificate, `${edu.degreeName} Certificate`)}
                      >
                        <FaEye />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}

          {/* Certificates Section */}
          {applicant.certificates && applicant.certificates.length > 0 ? (
            applicant.certificates.map((cert, index) => (
              <div key={index} className="flex items-center justify-between mb-2 mt-6">
                <div className="flex items-center gap-2">
                  <img src={lisence} className="w-8 h-8" alt="" />
                  <div className="flex flex-col">
                    <h3 className="font-bold">{cert.name || "Certificate"}</h3>
                    <p className="text-gray-400 text-sm">
                      {cert.organizationName ? `Issued by: ${cert.organizationName}` : "Work Reference"}
                      {cert.issueDate ? ` - ${new Date(cert.issueDate).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <div>
                  {cert.certificatePicPdf && (
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleOpenImagePopup(cert.certificatePicPdf, cert.name || "Certificate")}
                    >
                      <FaEye className="text-gray-500 cursor-pointer" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between mb-2 mt-6">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" alt="" />
                <div className="flex flex-col">
                  <h3 className="font-bold">Certificate</h3>
                  <p className="text-gray-400 text-sm">No certificates available</p>
                </div>
              </div>
            </div>
          )}

          {/* Licenses Section */}
          {applicant.licenses && applicant.licenses.length > 0 ? (
            applicant.licenses.map((license, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={lisence} className="w-8 h-8" alt="" />
                  <div className="flex flex-row gap-4 items-center">
                    <h3 className="font-bold">{license.licenseNumber || license.name || "License"}</h3>
                    <AiFillCheckCircle className="text-green-500" />
                  </div>
                </div>
                {license.licensePicPdf && (
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => handleOpenImagePopup(license.licensePicPdf, license.licenseNumber || license.name || "License")}
                  >
                    <FaEye className="text-gray-500 cursor-pointer" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" alt="" />
                <div className="flex flex-row gap-4 items-center">
                  <h3 className="font-bold">License</h3>
                  <p className="text-gray-400 text-sm">No licenses available</p>
                </div>
              </div>
            </div>
          )}

          {applicant.utrNumber && (
            <div className="flex items-start gap-3">
              <img src={urt} className="w-8 h-8" alt="" />
              <div>
                <h3 className="font-bold">UTR Number</h3>
                <p className="text-gray-400 text-sm">{applicant.utrNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;