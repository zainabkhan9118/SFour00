import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../common/LoadingSpinner";
import { FaMapMarkerAlt, FaEye, FaRegSquare, FaExternalLinkAlt, FaIdCard, FaTimes, FaGraduationCap } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import profileImage from "../../../assets/images/profileImage.png";
import security from "../../../assets/images/security.png";
import lisence from "../../../assets/images/lisence.png";
import urt from "../../../assets/images/urt.png";
import rectangle from "../../../assets/images/rectangle.png";
import { useLocation, useParams } from "react-router-dom";
import { getPersonalDetails, getEducation, getExperience, getCertificate, getLicense } from "../../../api/profileApi";
import { getJobById } from "../../../api/jobsApi";

const ApplicantProfile = () => {
  const location = useLocation();
  const { applicantId, jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicant, setApplicant] = useState(location.state?.applicant || {});
  const [job, setJob] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [jobSeekerDetails, setJobSeekerDetails] = useState(null);
  
  // State for document popups
  const [showDocumentPopup, setShowDocumentPopup] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState("");

  // Function to open document in popup
  const openDocumentPopup = (url, type) => {
    setDocumentUrl(url);
    setDocumentType(type);
    setShowDocumentPopup(true);
  };

  // Function to close document popup
  const closeDocumentPopup = () => {
    setShowDocumentPopup(false);
    setDocumentUrl("");
    setDocumentType("");
  };

  // Document Popup Component
  const DocumentPopup = () => {
    if (!showDocumentPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">
              {documentType === "certificate" ? "Certificate" : "License"} View
            </h3>
            <button
              onClick={closeDocumentPopup}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {documentUrl.endsWith(".pdf") ? (
              <iframe
                src={`${documentUrl}#toolbar=0`}
                className="w-full h-full"
                title={documentType}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={documentUrl}
                  alt={documentType}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
          <div className="p-4 border-t flex justify-end">
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FD7F00] text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchApplicantData = async () => {
      // If we already have applicant data from location state and no applicantId param, use that
      if (Object.keys(applicant).length > 0 && !applicantId) {
        // Still perform additional data fetching for complete information
        const id = applicant._id || applicant.jobSeekerId;
        if (id) {
          try {
            await fetchAdditionalData(id);
          } catch (err) {
            console.error("Error fetching additional data:", err);
          }
        }
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Use the applicantId from URL params if available
        const id = applicantId || applicant._id || applicant.jobSeekerId;
        
        if (!id) {
          throw new Error("No applicant ID available");
        }
        
        // Fetch applicant data using the profileApi function
        const result = await getPersonalDetails(id);
        
        if (result.statusCode === 200 && result.data) {
          setApplicant(result.data);
          setJobSeekerDetails(result.data);
          
          // If we have education records in the response data, set them directly
          if (result.data.educationRecords && result.data.educationRecords.length > 0) {
            setEducation(result.data.educationRecords);
          }
          
          // Fetch additional data using the applicant's ID
          await fetchAdditionalData(id);
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

    // Helper function to fetch all additional data
    const fetchAdditionalData = async (jobSeekerId) => {
      try {
        // Get the firebase ID if available (needed for some APIs)
        const firebaseId = applicant.user?.firebaseId || '';
        
        // Fetch education, experience, certificates, and licenses in parallel
        const [eduResult, expResult, certResult, licResult] = await Promise.allSettled([
          getEducation(firebaseId, jobSeekerId),
          getExperience(firebaseId, jobSeekerId),
          getCertificate(firebaseId, jobSeekerId),
          getLicense(firebaseId, jobSeekerId)
        ]);
        
        // Process education data
        if (eduResult.status === 'fulfilled' && eduResult.value?.statusCode === 200) {
          setEducation(eduResult.value.data || []);
        }
        
        // Process experience data
        if (expResult.status === 'fulfilled' && expResult.value?.statusCode === 200) {
          setExperience(expResult.value.data || []);
        }
        
        // Process certificate data
        if (certResult.status === 'fulfilled' && certResult.value?.statusCode === 200) {
          setCertificates(certResult.value.data || []);
        }
        
        // Process license data
        if (licResult.status === 'fulfilled' && licResult.value?.statusCode === 200) {
          setLicenses(licResult.value.data || []);
        }
      } catch (err) {
        console.error("Error fetching additional applicant data:", err);
        // Don't fail completely, just log the error
      }
    };

    const fetchJobData = async () => {
      if (!jobId) return;
      
      try {
        const companyId = localStorage.getItem('companyId');
        
        // Use the jobsApi function to get job details
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

  // Helper function to format a date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

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

  // Use the separately fetched data if available, otherwise fall back to the data in the applicant object
  const educationData = education.length > 0 ? education : (applicant.educationRecords || []);
  const experienceData = experience.length > 0 ? experience : (applicant.experiences || []);
  const certificateData = certificates.length > 0 ? certificates : (applicant.certificates || []);
  const licenseData = licenses.length > 0 ? licenses : (applicant.licenses || []);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row rounded-xl p-6 md:p-8 gap-6 max-w-4xl">
        {/* Image & Info */}
        <div className="flex-shrink-0">
          <img
            src={applicant.profilePic || profileImage}
            alt={applicant.fullname || "Applicant"}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-md"
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

          {experienceData.length > 0 ? (
            experienceData.map((exp, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <img src={index % 2 === 0 ? security : rectangle} className="w-8 h-8" alt="" />
                <div>
                  <h3 className="font-bold text-lg">{exp.position || "Position"}</h3>
                  <p className="text-gray-500">{exp.companyName || "Company"}</p>
                  <p className="text-gray-400 text-sm">
                    {exp.startDate ? formatDate(exp.startDate) : ""}
                    {" - "}
                    {exp.currentlyWorking ? "Present" : (exp.endDate ? formatDate(exp.endDate) : "")}
                  </p>
                  {exp.experienceCertificate && (
                    <div className="flex items-center mt-1">
                      <a 
                        href={exp.experienceCertificate} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-500 text-sm flex items-center gap-1 hover:underline"
                      >
                        <MdOutlineWorkOutline /> View Work Reference
                        <FaExternalLinkAlt className="ml-1 text-xs" />
                      </a>
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

          {educationData.length > 0 ? (
            educationData.map((edu, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <FaGraduationCap className="w-8 h-8 text-gray-500" />
                <div>
                  <h3 className="font-bold text-lg">{edu.degreeName || edu.qualification || "Degree"}</h3>
                  <p className="text-gray-500">{edu.institute || edu.institution || "Institution"}</p>
                  <p className="text-gray-400 text-sm">
                    {edu.startDate ? formatDate(edu.startDate) : ""}
                    {" - "}
                    {edu.currentlyEnrolled ? "Present" : (edu.endDate ? formatDate(edu.endDate) : "")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education information available</p>
          )}

          {/* Certificates Section */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Certificates</h2>
          {certificateData.length > 0 ? (
            certificateData.map((cert, index) => (
              <div key={index} className="flex items-center justify-between mb-5 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <img src={lisence} className="w-8 h-8" alt="" />
                  <div className="flex flex-col">
                    <h3 className="font-bold">{cert.name || cert.organizationName || "Certificate"}</h3>
                    <p className="text-gray-400 text-sm">
                      {cert.issuedBy || cert.organizationName ? `Issued by: ${cert.issuedBy || cert.organizationName}` : "Work Reference"}
                      {cert.issueDate ? ` - ${formatDate(cert.issueDate)}` : ""}
                    </p>
                  </div>
                </div>
                {(cert.certificateUrl || cert.certificatePicPdf) && (
                  <button 
                    onClick={() => openDocumentPopup(cert.certificateUrl || cert.certificatePicPdf, "certificate")}
                    className="flex items-center text-[#FD7F00] hover:text-orange-600 font-medium transition-colors"
                  >
                    <FaEye className="mr-1" />
                    <span className="hidden md:inline">View Certificate</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between mb-5 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" alt="" />
                <div className="flex flex-col">
                  <h3 className="font-bold">No Certificates</h3>
                  <p className="text-gray-400 text-sm">This applicant has not uploaded any certificates</p>
                </div>
              </div>
            </div>
          )}

          {/* Licenses Section */}
          <h2 className="text-2xl font-bold mt-8 mb-4">Licenses</h2>
          {licenseData.length > 0 ? (
            licenseData.map((license, index) => (
              <div key={index} className="flex items-center justify-between mb-5 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <img src={lisence} className="w-8 h-8" alt="" />
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-4 items-center">
                      <h3 className="font-bold">{license.name || license.licenseNumber || "License"}</h3>
                      <AiFillCheckCircle className="text-green-500" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      {`License Number: ${license.licenseNumber || "N/A"}`}
                      {license.dateOfExpiry ? ` - Expires: ${formatDate(license.dateOfExpiry)}` : ""}
                    </p>
                  </div>
                </div>
                {(license.licenseUrl || license.licensePicPdf) && (
                  <button 
                    onClick={() => openDocumentPopup(license.licenseUrl || license.licensePicPdf, "license")}
                    className="flex items-center text-[#FD7F00] hover:text-orange-600 font-medium transition-colors"
                  >
                    <FaEye className="mr-1" />
                    <span className="hidden md:inline">View License</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between mb-5 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" alt="" />
                <div className="flex flex-col">
                  <h3 className="font-bold">No Licenses</h3>
                  <p className="text-gray-400 text-sm">This applicant has not uploaded any licenses</p>
                </div>
              </div>
            </div>
          )}

          {applicant.utrNumber && (
            <div className="flex items-start gap-3 mt-8">
              <img src={urt} className="w-8 h-8" alt="" />
              <div>
                <h3 className="font-bold">UTR Number</h3>
                <p className="text-gray-400 text-sm">{applicant.utrNumber}</p>
              </div>
            </div>
          )}

          {applicant.NINumber && (
            <div className="flex items-start gap-3 mt-4">
              <FaIdCard className="w-8 h-8 text-gray-500" />
              <div>
                <h3 className="font-bold">National Insurance Number</h3>
                <p className="text-gray-400 text-sm">{applicant.NINumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <DocumentPopup />
    </div>
  );
};

export default ApplicantProfile;