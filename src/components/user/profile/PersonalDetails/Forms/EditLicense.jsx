import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import axios from "axios";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";
import ProfileErrorPopup from "../../../../user/popupModel/ProfileErrorPopup";
import { ThemeContext } from "../../../../../context/ThemeContext";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditLicense = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showSuccess } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const [licenseNumber, setLicenseNumber] = useState("");
  const [dateOfExpiry, setDateOfExpiry] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const storedLicenseId = localStorage.getItem("licenseId");
  const [licenseId, setLicenseId] = useState(storedLicenseId === "null" ? null : storedLicenseId);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [originalValues, setOriginalValues] = useState({
    licenseNumber: "",
    dateOfExpiry: "",
    licensePicPdf: null
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [hasVehicle, setHasVehicle] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchLicense = async () => {
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      if (!jobSeekerId || !licenseId) {
        console.log("Missing required IDs for license fetch:", { jobSeekerId, licenseId });
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Fetching license with ID ${licenseId} for jobSeeker ${jobSeekerId}`);

        const response = await axios.get(`${BASEURL}/license/${licenseId}`, {
          headers: {
            'jobSeekerId': jobSeekerId
          }
        });
        console.log("API Response:", response.data);

        if (response.data && response.data.data) {
          const license = response.data.data;
          setLicenseNumber(license.licenseNumber);
          setDateOfExpiry(license.dateOfExpiry ? new Date(license.dateOfExpiry).toISOString().split('T')[0] : "");
          setHasVehicle(license.hasVehicle || false);

          setOriginalValues({
            licenseNumber: license.licenseNumber,
            dateOfExpiry: license.dateOfExpiry ? new Date(license.dateOfExpiry).toISOString().split('T')[0] : "",
            licensePicPdf: license.licensePicPdf
          });

          if (license.licensePicPdf) {
            setSelectedFile({
              name: license.licensePicPdf.split('/').pop(),
              url: license.licensePicPdf,
              isExisting: true
            });
          }
        }
      } catch (error) {
        console.error("API Error:", error.response?.data || error);
        if (error.response?.status === 404) {
          console.log("License not found, resetting licenseId");
          localStorage.removeItem("licenseId");
          setLicenseId(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (licenseId) {
      fetchLicense();
    }
  }, [licenseId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      setErrorMessage("Please ensure you are logged in");
      setShowErrorPopup(true);
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append('licenseNumber', licenseNumber);
      formData.append('dateOfExpiry', new Date(dateOfExpiry).toISOString());
      formData.append('hasVehicle', hasVehicle);
      if (selectedFile instanceof File) {
        formData.append('licensePicPdf', selectedFile);
      }

      let response;

      if (licenseId) {
        console.log(`Updating license ${licenseId} with jobSeekerId: ${jobSeekerId}`);

        response = await axios.patch(
          `${BASEURL}/license/${licenseId}`,
          formData,
          {
            headers: {
              'jobSeekerId': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        console.log("License update response:", response.data);
        showSuccess("License updated successfully!");
        setSuccessMessage("License updated successfully!");
        setRedirectPath("/User-PersonalDetails");
        setShowSuccessPopup(true);
      } else {
        console.log(`Creating new license for jobSeekerId: ${jobSeekerId}`);

        response = await axios.post(
          `${BASEURL}/license`,
          formData,
          {
            headers: {
              'jobSeekerId': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        console.log("License creation response:", response.data);

        if (response.data && response.data.data && response.data.data._id) {
          const newLicenseId = response.data.data._id;
          setLicenseId(newLicenseId);
          localStorage.setItem("licenseId", newLicenseId);
          showSuccess("License added successfully!");
          setSuccessMessage("License added successfully!");
          setRedirectPath("/User-PersonalDetails");
          setShowSuccessPopup(true);
        }
      }
      
      checkProfileCompletion();
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "Failed to save license");
      setShowErrorPopup(true);
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

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    // Navigate to UTR number form next
    navigate('/edit-utr-number');
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
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
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate("/User-PersonalDetails")} 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black dark:text-white">
                {licenseId ? "Edit License" : "Add License"}
              </span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              <div className="space-y-2">
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  License Number
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Add License Number"
                  required
                  aria-describedby="licenseNumberHelp"
                />
                <p id="licenseNumberHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Enter your security license identification number
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfExpiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Expiry
                </label>
                <div className="relative">
                  <input
                    id="dateOfExpiry"
                    type="date"
                    value={dateOfExpiry}
                    onChange={(e) => setDateOfExpiry(e.target.value)}
                    className="w-full p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter Date of Expiry"
                    required
                    aria-describedby="expiryDateHelp"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p id="expiryDateHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The date when your license will expire
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="licensePicPdf" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  License Document
                </label>
                <div 
                  className="border-2 border-dashed border-orange-300 rounded-lg p-6 bg-orange-50 dark:bg-gray-800 dark:border-orange-700 cursor-pointer flex flex-col items-center justify-center h-32"
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
                    }
                  }}
                  aria-describedby="licenseFileHelp"
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
                    <div className="flex items-center">
                      <FiUpload className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Upload License</span>
                    </div>
                  )}
                  <input 
                    id="licensePicPdf"
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    aria-label="Upload license document"
                  />
                </div>
                <p id="licenseFileHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Upload a scan or photo of your security license document
                </p>
              </div>

              {/* Has a car checkbox */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="hasVehicle"
                    type="checkbox"
                    className="h-5 w-5 text-orange-500 rounded focus:ring-orange-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={hasVehicle}
                    onChange={(e) => setHasVehicle(e.target.checked)}
                    aria-describedby="hasVehicleHelp"
                  />
                  <label htmlFor="hasVehicle" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    I have a car
                  </label>
                </div>
                <p id="hasVehicleHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Check this box if you have a car available for work transportation
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                aria-label={licenseId ? "Update license information" : "Submit license for verification"}
              >
                <span>{licenseId ? "Update License" : "Submit For Verification"}</span>
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
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
        <ProfileErrorPopup
          message={errorMessage}
          onClose={handleCloseErrorPopup}
        />
      )}
    </div>
  );
};

export default EditLicense;