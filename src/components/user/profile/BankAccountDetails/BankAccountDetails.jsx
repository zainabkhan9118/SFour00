import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../UserSidebar";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { getBankDetails, updateBankDetails, createBankDetails } from "../../../../api/bankDetail";
import { useToast } from "../../../notifications/ToastManager";
import { useProfileCompletion } from "../../../../context/profile/ProfileCompletionContext";
import ProfileSuccessPopup from "../../../user/popupModel/ProfileSuccessPopup";
import ProfileErrorPopup from "../../../user/popupModel/ProfileErrorPopup";
import { ThemeContext } from "../../../../context/ThemeContext";

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
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
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
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {isLoading && <LoadingSpinner />}

      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
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
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Bank Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Name
                </label>
                <input
                  id="accountName"
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Full name on your bank account"
                  className="p-4 border rounded-3xl bg-gray-200 dark:bg-gray-700 dark:text-white w-full"
                  disabled={!isEditing}
                  required
                  aria-describedby="accountNameHelp"
                />
                <p id="accountNameHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The name as it appears on your bank account
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bank Name
                </label>
                <input
                  id="bankName"
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., HSBC, Barclays"
                  className="p-4 border rounded-3xl bg-gray-200 dark:bg-gray-700 dark:text-white w-full"
                  disabled={!isEditing}
                  required
                  aria-describedby="bankNameHelp"
                />
                <p id="bankNameHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The name of your banking institution
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <input
                  id="accountType"
                  type="text"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  placeholder="e.g., Checking, Savings"
                  className="p-4 border rounded-3xl bg-gray-200 dark:bg-gray-700 dark:text-white w-full"
                  disabled={!isEditing}
                  aria-describedby="accountTypeHelp"
                />
                <p id="accountTypeHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  The type of bank account you hold
                </p>
              </div>

              <div className="space-y-1">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Your bank account number"
                  className="p-4 border rounded-3xl bg-gray-200 dark:bg-gray-700 dark:text-white w-full"
                  disabled={!isEditing}
                  required
                  aria-describedby="accountNumberHelp"
                />
                <p id="accountNumberHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  Your account number with the bank
                </p>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label htmlFor="ibanNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  IBAN Number
                </label>
                <input
                  id="ibanNumber"
                  type="text"
                  name="ibanNumber"
                  value={formData.ibanNumber}
                  onChange={handleChange}
                  placeholder="International Bank Account Number"
                  className="p-4 border rounded-3xl bg-gray-200 dark:bg-gray-700 dark:text-white w-full"
                  disabled={!isEditing}
                  aria-describedby="ibanHelp"
                />
                <p id="ibanHelp" className="text-xs text-gray-500 dark:text-gray-400">
                  International Bank Account Number (for international payments)
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleEdit}
                className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-2 rounded-2xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label={isEditing ? "Cancel editing bank details" : "Edit bank details"}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-2xl transition-colors"
                  aria-label="Save bank account details"
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
