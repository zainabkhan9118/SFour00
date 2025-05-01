import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../UserSidebar";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { getBankDetails, updateBankDetails, createBankDetails } from "../../../../api/bankDetail";
import { useToast } from "../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../user/popupModel/ProfileSuccessPopup";
import ProfileErrorPopup from "../../../user/popupModel/ProfileErrorPopup";

const BankAccountDetails = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetailId, setBankDetailId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { showSuccess } = useToast();
  const { checkProfileCompletion } = useProfileCompletion();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountType: "",
    accountNumber: "",
    ibanNumber: "",
  });

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initial fetch of bank details
  useEffect(() => {
    const fetchInitialBankDetails = async () => {
      setIsLoading(true);
      try {
        const storedBankDetailId = localStorage.getItem("bankDetailId");
        if (storedBankDetailId) {
          const response = await getBankDetails(storedBankDetailId);
          if (response && response.data) {
            setBankDetailId(storedBankDetailId);
            setFormData({
              accountName: response.data.accountName || "",
              bankName: response.data.bankName || "",
              accountType: response.data.accountType || "",
              accountNumber: response.data.accountNumber || "",
              ibanNumber: response.data.ibanNumber || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching initial bank details:", error);
        if (error.response?.status === 404) {
          localStorage.removeItem("bankDetailId");
          setBankDetailId(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialBankDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let response;
      
      if (!formData.accountName || !formData.bankName || !formData.accountNumber) {
        setErrorMessage("Please fill in all required fields");
        setShowErrorPopup(true);
        setIsLoading(false);
        return;
      }

      if (bankDetailId) {
        response = await updateBankDetails(bankDetailId, formData);
        showSuccess("Bank details updated successfully");
        setSuccessMessage("Bank details updated successfully!");
        setRedirectPath("/User-PersonalDetails");
        setShowSuccessPopup(true);
      } else {
        response = await createBankDetails(formData);
        showSuccess("Bank details created successfully");
        setSuccessMessage("Bank details created successfully!");
        setRedirectPath("/User-PersonalDetails");
        setShowSuccessPopup(true);
        if (response.data && response.data._id) {
          localStorage.setItem("bankDetailId", response.data._id);
          setBankDetailId(response.data._id);
        }
      }
      
      setIsEditing(false);
      checkProfileCompletion();
    } catch (error) {
      console.error("Error saving bank details:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save bank details");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      // If canceling, reset to original data if we have bankDetailId
      if (bankDetailId) {
        const fetchBankDetails = async () => {
          setIsLoading(true);
          try {
            const response = await getBankDetails(bankDetailId);
            if (response && response.data) {
              setFormData({
                accountName: response.data.accountName || "",
                bankName: response.data.bankName || "",
                accountType: response.data.accountType || "",
                accountNumber: response.data.accountNumber || "",
                ibanNumber: response.data.ibanNumber || "",
              });
            }
          } catch (error) {
            console.error("Error fetching bank details:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchBankDetails();
      } else {
        // Reset form data when canceling new entry
        setFormData({
          accountName: "",
          bankName: "",
          accountType: "",
          accountNumber: "",
          ibanNumber: "",
        });
      }
      setIsEditing(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
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
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Bank Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Account Name"
                className="p-4 border rounded-3xl bg-gray-200 w-full"
                disabled={!isEditing}
              />
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
                className="p-4 border rounded-3xl bg-gray-200 w-full"
                disabled={!isEditing}
              />
              <input
                type="text"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                placeholder="Account Type"
                className="p-4 border rounded-3xl bg-gray-200 w-full"
                disabled={!isEditing}
              />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Account Number"
                className="p-4 border rounded-3xl bg-gray-200 w-full"
                disabled={!isEditing}
              />
              <input
                type="text"
                name="ibanNumber"
                value={formData.ibanNumber}
                onChange={handleChange}
                placeholder="IBAN Number"
                className="p-4 border rounded-3xl bg-gray-200 w-full md:col-span-2"
                disabled={!isEditing}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleEdit}
                className="bg-gray-900 text-white px-8 py-2 rounded-2xl"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="bg-orange-500 text-white px-8 py-2 rounded-2xl"
                >
                  Save
                </button>
              )}
            </div>
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

export default BankAccountDetails;
