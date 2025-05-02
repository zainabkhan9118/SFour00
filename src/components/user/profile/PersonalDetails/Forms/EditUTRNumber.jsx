import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { updateUtrData, getUtrData } from "../../../../../api/utr";
import { useToast } from "../../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../../user/popupModel/ProfileSuccessPopup";

const EditUTRNumber = () => {
  const navigate = useNavigate();
  const [utrNumber, setUtrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  // Add state for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const fetchUtrNumber = async () => {
      setIsLoading(true);
      try {
        const currentUtr = await getUtrData();
        if (currentUtr) {
          setUtrNumber(currentUtr);
        }
      } catch (error) {
        console.error("Failed to fetch UTR number:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtrNumber();
  }, []);
  
  const handleChange = (e) => {
    setUtrNumber(e.target.value);
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUtrData(utrNumber);
      showSuccess("UTR number updated successfully!");
      setSuccessMessage("UTR number updated successfully!");
      setRedirectPath("/User-PersonalDetails");
      setShowSuccessPopup(true);
      checkProfileCompletion();
    } catch (error) {
      console.error("Failed to update UTR number:", error);
      showError(error.message || "Failed to update UTR number");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isLoading && <LoadingSpinner />}

      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200">
          <UserSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          {/* Header with back button */}
          <div className="flex items-center mb-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
              <FaArrowLeft className="mr-2" />
              <span className="font-medium text-black">UTR Number</span>
            </button>
          </div>
          
          {/* UTR Number Form */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
              {/* UTR Number Input */}
              <div className="space-y-2">
                <label htmlFor="utrNumber" className="block text-sm font-medium text-gray-700">
                  UTR Number (Unique Taxpayer Reference)
                </label>
                <input
                  id="utrNumber"
                  type="text"
                  value={utrNumber}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="e.g. KNJ44334433443"
                  aria-describedby="utrNumberHelp"
                />
                <p id="utrNumberHelp" className="text-xs text-gray-500">
                  Your UTR number is a unique 10-digit identifier issued by HMRC.
                </p>
              </div>
              
              {/* Save Button */}
              <button 
                type="submit" 
                className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
              >
                <span>Save Edits</span>
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

export default EditUTRNumber;