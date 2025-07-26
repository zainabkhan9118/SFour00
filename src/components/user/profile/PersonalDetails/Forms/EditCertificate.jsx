import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import axios from "axios";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";
import { ThemeContext } from "../../../../../context/ThemeContext";
import { BiErrorCircle } from "react-icons/bi";
import ProgressTracker from "../../../../common/ProgressTracker";
import useProfileSteps from "../../../../../hooks/useProfileSteps";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditCertificate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSuccess, showError } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const { profileSteps, getNextStep } = useProfileSteps(); // Use the custom hook with getNextStep
  const [issueDate, setIssueDate] = React.useState("");
  const [organization, setOrganization] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [certificateId, setCertificateId] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [redirectPath, setRedirectPath] = React.useState("");
  const [formErrors, setFormErrors] = React.useState({});
  const [showErrorPopup, setShowErrorPopup] = React.useState(false);

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
    
    // Form validation
    const errors = {};
    if (!issueDate) errors.issueDate = "Issue date is required";
    if (!organization) errors.organization = "Organization name is required";
    if (!selectedFile && !certificateId) errors.file = "Certificate document is required";
    
    // If there are errors, show them and don't proceed
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowErrorPopup(true);
      return;
    }
    
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
            checkProfileCompletion();
            // Find the current step and navigate to the next step in the sequence
            const currentStepId = 4; // Certificate is step 4 in the new sequence
            const nextStep = getNextStep(currentStepId);
            if (nextStep) {
              navigate(nextStep.path);
            } else {
              navigate('/User-PersonalDetails');
            }
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
        checkProfileCompletion();
        // Find the current step and navigate to the next step in the sequence
        const currentStepId = 4; // Certificate is step 4 in the new sequence
        const nextStep = getNextStep(currentStepId);
        if (nextStep) {
          navigate(nextStep.path);
        } else {
          navigate('/User-PersonalDetails');
        }
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
    // Navigate to license form next
    navigate('/edit-license');
  };
  
  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };
  
  // Error Popup Component
  const ErrorPopup = ({ errors, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
          <div className="flex items-center mb-4 text-red-500">
            <BiErrorCircle className="text-2xl mr-2" />
            <h3 className="text-lg font-semibold">Form Validation Errors</h3>
          </div>
          
          <div className="mb-4">
            <ul className="list-disc pl-5 space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index} className="text-red-500">{error}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate("/User-PersonalDetails")} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black dark:text-white">
                {certificateId ? "Edit Certificate" : "Add Certificate"}
              </span>
            </button>
            {certificateId && (
              <button
                onClick={handleAddNew}
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Add New Certificate
              </button>
            )}
          </div>
          
          {/* Use the reusable Progress Tracker component */}
          <ProgressTracker steps={profileSteps} />
          
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
              <div className="space-y-2">
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => {
                    setIssueDate(e.target.value);
                    setFormErrors({...formErrors, issueDate: null});
                  }}
                  className={`w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formErrors.issueDate ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Select Issue Date"
                  required
                  aria-describedby="issueDateHelp"
                />
                <p id="issueDateHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The date when the certificate was issued
                </p>
                {formErrors.issueDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.issueDate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value);
                    setFormErrors({...formErrors, organization: null});
                  }}
                  className={`w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                    formErrors.organization ? 'border-2 border-red-500' : ''
                  }`}
                  placeholder="Enter Organization Name"
                  required
                  aria-describedby="organizationHelp"
                />
                <p id="organizationHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The institution or organization that issued the certificate
                </p>
                {formErrors.organization && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.organization}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Certificate Document <span className="text-red-500">*</span>
                </label>
                <div 
                  className={`border-2 ${
                    formErrors.file ? 'border-red-500' : 'border-dashed border-orange-300 dark:border-orange-700'
                  } rounded-lg p-8 bg-orange-50 dark:bg-gray-800 cursor-pointer flex flex-col items-center justify-center h-40`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-orange-100', 'dark:bg-gray-700');
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-orange-100', 'dark:bg-gray-700');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-orange-100', 'dark:bg-gray-700');
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setSelectedFile(e.dataTransfer.files[0]);
                      setFormErrors({...formErrors, file: null});
                    }
                  }}
                  aria-describedby="certificateFileHelp"
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="text-orange-500 dark:text-orange-400 font-medium mb-2">
                        {selectedFile instanceof File ? selectedFile.name : selectedFile.name}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Click to change file
                      </span>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="h-8 w-8 text-orange-500 dark:text-orange-400 mb-2" />
                      <span className="text-center text-gray-600 dark:text-gray-300">
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
                    onChange={(e) => {
                      handleFileChange(e);
                      setFormErrors({...formErrors, file: null});
                    }}
                    aria-label="Upload certificate document"
                  />
                </div>
                <p id="certificateFileHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a scan or photo of your certificate (PDF, Word, or image formats)
                </p>
                {formErrors.file && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>
                )}
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
      
      {showErrorPopup && (
        <ErrorPopup 
          errors={formErrors}
          onClose={closeErrorPopup}
        />
      )}
    </div>
  );
};

export default EditCertificate;