import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import axios from "axios";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditCertificate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const [issueDate, setIssueDate] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [certificateId, setCertificateId] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [redirectPath, setRedirectPath] = React.useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const storedCertId = localStorage.getItem("certificateId");
    if (storedCertId) {
      const fetchCertificate = async () => {
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        if (!jobSeekerId) return;

        setIsLoading(true);
        try {
          const response = await axios.get(`${BASEURL}/certificate/${storedCertId}`, {
            headers: {
              'jobseekerid': jobSeekerId
            }
          });

          if (response.data && response.data.data) {
            const certificate = response.data.data;
            const issueDateValue = new Date(certificate.issueDate).toISOString().split('T')[0];
            
            setIssueDate(issueDateValue);
            setOrganization(certificate.organizationName);
            setCertificateId(storedCertId);
            
            if (certificate.certificatePicPdf) {
              setSelectedFile({
                name: certificate.certificatePicPdf.split('/').pop(),
                url: certificate.certificatePicPdf,
                isExisting: true
              });
            }
          }
        } catch (error) {
          if (error.response?.status === 404) {
            localStorage.removeItem("certificateId");
            setCertificateId(null);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchCertificate();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      showError("Please ensure you are logged in");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('organizationName', organization);
      formData.append('issueDate', new Date(issueDate).toISOString());
      
      if (selectedFile instanceof File) {
        formData.append('certificatePicPdf', selectedFile);
      }

      if (!certificateId) {
        const response = await axios.post(
          `${BASEURL}/certificate`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data && response.data.data) {
          const certId = response.data.data._id;
          if (certId) {
            localStorage.setItem("certificateId", certId);
            showSuccess("Certificate added successfully!");
            setSuccessMessage("Certificate added successfully!");
            setRedirectPath("/User-PersonalDetails");
            setShowSuccessPopup(true);
            checkProfileCompletion();
          }
        }
      } else {
        await axios.patch(
          `${BASEURL}/certificate/${certificateId}`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        showSuccess("Certificate updated successfully!");
        setSuccessMessage("Certificate updated successfully!");
        setRedirectPath("/User-PersonalDetails");
        setShowSuccessPopup(true);
        checkProfileCompletion();
      }
    } catch (error) {
      console.error('API Error:', error.response || error);
      showError(error.response?.data?.message || "Failed to save certificate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAddNew = () => {
    localStorage.removeItem("certificateId");
    setCertificateId(null);
    setIssueDate("");
    setOrganization("");
    setSelectedFile(null);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
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
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate("/User-PersonalDetails")} className="text-gray-600 hover:text-gray-800 flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black">
                {certificateId ? "Edit Certificate" : "Add Certificate"}
              </span>
            </button>
            {certificateId && (
              <button
                onClick={handleAddNew}
                className="text-orange-500 hover:text-orange-600"
              >
                Add New Certificate
              </button>
            )}
          </div>
          
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
              <div className="space-y-2">
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                  Issue Date
                </label>
                <input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Select Issue Date"
                  required
                  aria-describedby="issueDateHelp"
                />
                <p id="issueDateHelp" className="text-xs text-gray-500">
                  The date when the certificate was issued
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter Organization Name"
                  required
                  aria-describedby="organizationHelp"
                />
                <p id="organizationHelp" className="text-xs text-gray-500">
                  The institution or organization that issued the certificate
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700">
                  Certificate Document
                </label>
                <div 
                  className="border-2 border-dashed border-orange-300 rounded-lg p-8 bg-orange-50 cursor-pointer flex flex-col items-center justify-center h-40"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-orange-100');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-orange-100');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-orange-100');
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                    }
                  }}
                  aria-describedby="certificateFileHelp"
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="text-orange-500 font-medium mb-2">
                        {selectedFile instanceof File ? selectedFile.name : selectedFile.name}
                      </div>
                      <span className="text-sm text-gray-500">
                        Click to change file
                      </span>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="h-8 w-8 text-orange-500 mb-2" />
                      <span className="text-center text-gray-600">
                        Upload Certificate
                      </span>
                    </>
                  )}
                  <input 
                    id="certificateFile"
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    aria-label="Upload certificate document"
                  />
                </div>
                <p id="certificateFileHelp" className="text-xs text-gray-500">
                  Upload a scan or photo of your certificate (PDF, Word, or image formats)
                </p>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                aria-label={certificateId ? "Update certificate details" : "Save new certificate"}
              >
                <span>{certificateId ? "Update Certificate" : "Save Certificate"}</span>
                <FiArrowRight className="ml-2" />
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

export default EditCertificate;