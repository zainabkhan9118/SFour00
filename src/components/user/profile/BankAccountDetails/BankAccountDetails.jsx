import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { getBankDetails, updateBankDetails, createBankDetails } from "../../../../api/bankDetail";

const BankAccountDetails = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetailId, setBankDetailId] = useState(null);
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountType: "",
    accountNumber: "",
    ibanNumber: "",
  });

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
        alert("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (bankDetailId) {
        response = await updateBankDetails(bankDetailId, formData);
        console.log("Bank details updated successfully");
      } else {
        response = await createBankDetails(formData);
        console.log("Bank details created successfully");
        if (response.data && response.data._id) {
          localStorage.setItem("bankDetailId", response.data._id);
          setBankDetailId(response.data._id);
        }
      }
      
      setIsEditing(false);
      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Error saving bank details:", error);
      alert(error.response?.data?.message || "Failed to save bank details");
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

  return (
    <div className="flex min-h-screen">
      {isLoading && <LoadingSpinner />}
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
     
        <main className="flex-3"> 
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="w-[60vw] ml-3 mx-auto p-6">
              <h1 className="text-2xl font-bold mb-4">Bank Account Details</h1>
              <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
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
                    className="p-4 border rounded-3xl  bg-gray-200 w-full"
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
                    className="p-4 border rounded-3xl bg-gray-200 w-full col-span-2"
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
        </main>
      </div>
    </div>
  );
};

export default BankAccountDetails;
