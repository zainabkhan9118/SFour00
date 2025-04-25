import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { updateUtrData, getUtrData } from "../../../../../api/utr";

const EditUTRNumber = () => {
  const navigate = useNavigate();
  const [utrNumber, setUtrNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
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
      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Failed to update UTR number:", error);
      alert(error.message || "Failed to update UTR number");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex min-h-screen">
      {/* Show loading spinner when loading */}
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
            <div className="p-4 flex-1 bg-gray-50">
              {/* Header with back button */}
              <div className="flex items-center p-4">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">UTR Number</span>
                </button>
              </div>
              
              {/* UTR Number Form */}
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  {/* UTR Number Input */}
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="e.g. KNJ44334433443"
                  />
                  
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
        </main>
      </div>
    </div>
  );
};

export default EditUTRNumber;