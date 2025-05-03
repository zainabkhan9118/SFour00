import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../common/LoadingSpinner";
import { FaMapMarkerAlt, FaEye, FaRegSquare } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import profileImage from "../../../assets/images/profileImage.png";
import security from "../../../assets/images/security.png";
import lisence from "../../../assets/images/lisence.png";
import urt from "../../../assets/images/urt.png";
import rectangle from "../../../assets/images/rectangle.png";
import { useLocation, useParams } from "react-router-dom";

const ApplicantProfile = () => {
  const location = useLocation();
  const { applicantId, jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicant, setApplicant] = useState(location.state?.applicant || {});
  const [job, setJob] = useState(null);
  
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
        
        // Fetch applicant data
        const response = await fetch(`/api/users/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
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
        const response = await fetch(`/api/jobs/company/${companyId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          const foundJob = result.data.find(j => j._id === jobId);
          if (foundJob) {
            setJob(foundJob);
          }
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
            {applicant.about || 
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
                    <p className="text-orange-500 text-sm flex items-center gap-1 mt-1">
                      <MdOutlineWorkOutline /> Work Reference
                    </p>
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
                  <h3 className="font-bold text-lg">{edu.qualification || "Degree"}</h3>
                  <p className="text-gray-500">{edu.institution || "Institution"}</p>
                  <p className="text-gray-400 text-sm">
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ""}
                    {" - "}
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ""}
                  </p>
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
                      {cert.issuedBy ? `Issued by: ${cert.issuedBy}` : "Work Reference"}
                      {cert.issueDate ? ` - ${new Date(cert.issueDate).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
                <div>
                  <FaEye className="text-gray-500 cursor-pointer" />
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
                    <h3 className="font-bold">{license.name || "License"}</h3>
                    <AiFillCheckCircle className="text-green-500" />
                  </div>
                </div>
                <FaEye className="text-gray-500 cursor-pointer" />
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