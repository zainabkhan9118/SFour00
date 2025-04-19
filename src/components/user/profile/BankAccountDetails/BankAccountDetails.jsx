import React, { useState } from "react";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";

const BankAccountDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountType: "",
    accountNumber: "",
    ibanNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen">
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
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-900 text-white px-8 py-2 rounded-2xl"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
          { (
            <button className="bg-orange-500 text-white px-8 py-2 rounded-2xl">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
    </div>

</main>
</div></div>
  );
};

export default BankAccountDetails;
