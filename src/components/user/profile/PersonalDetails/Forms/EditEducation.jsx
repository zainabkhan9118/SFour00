import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import { useContext} from "react";
import { AppContext } from "../../../../../context/AppContext";

import { getAuth } from "firebase/auth";

const auth = getAuth();
const currentUser = auth.currentUser;



const EditEducation = () => {
  const { BASEURL} = useContext(AppContext);
  const navigate = useNavigate();

  const [educations, setEducations] = useState([
    {
      id: 1,
      degree: "BS Social Science",
      institution: "ABC University",
      startDate: "2017-10-01",
      endDate: "2021-11-07",
      currentlyStudying: false,
    },
  ]);

  const handleChange = (id, e) => {
    const { name, value, type, checked } = e.target;

    const updated = educations.map((edu) =>
      edu.id === id
        ? {
            ...edu,
            [name]: type === "checkbox" ? checked : value,
          }
        : edu
    );
    setEducations(updated);
  };

  const handleAddNew = () => {
    const newId = Math.max(...educations.map((e) => e.id)) + 1;

    const newEducation = {
      id: newId,
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
    };

    setEducations([...educations, newEducation]);
  };

  const handleDelete = (id) => {
    if (educations.length === 1) {
      alert("You must have at least one education entry.");
      return;
    }

    const updated = educations.filter((edu) => edu.id !== id);
    setEducations(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      const firebaseId = currentUser?.uid;
      if (!firebaseId) {
        alert("User not authenticated. Please log in.");
        return;
      }
  
      const response = await fetch(`${BASEURL}/education`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${firebaseId}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          educations.map(({ id, ...edu }) => edu)
        ),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save education records:", errorData);
        alert(`Error: ${errorData.message || "Failed to save education records"}`);
        return;
      }
   
      const data = await response.json();
      console.log("Education records saved successfully:", data);
      alert("Education records saved successfully!");
      navigate("/User-PersonalDetails");
    } catch (error) {
      console.error("Error saving education records:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50">
              <div className="flex items-center p-4">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">Education</span>
                </button>
              </div>

              {/* Render each education section */}
              <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                {educations.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-lg shadow-sm">
                    {/* Delete individual */}
                    <div className="flex justify-end mb-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(edu.id)}
                        className="text-black hover:text-black flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      name="degree"
                      value={edu.degree}
                      onChange={(e) => handleChange(edu.id, e)}
                      className="w-full p-3 mb-3 bg-gray-100 rounded-lg"
                      placeholder="Degree/Certification"
                    />

                    <input
                      type="text"
                      name="institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(edu.id, e)}
                      className="w-full p-3 mb-3 bg-gray-100 rounded-lg"
                      placeholder="Institution/University"
                    />

                    <div className="flex flex-col space-y-4 mb-3">
                      <input
                        type="date"
                        name="startDate"
                        value={edu.startDate}
                        onChange={(e) => handleChange(edu.id, e)}
                        className="w-full p-3 bg-gray-100 rounded-lg"
                        placeholder="Start Date"
                      />

                      <input
                        type="date"
                        name="endDate"
                        value={edu.endDate}
                        onChange={(e) => handleChange(edu.id, e)}
                        className="w-full p-3 bg-gray-100 rounded-lg"
                        placeholder="End Date"
                        disabled={edu.currentlyStudying}
                      />
                    </div>

                    <div className="flex items-center mb-2">
                      <input
                        id={`currentlyStudying-${edu.id}`}
                        type="checkbox"
                        name="currentlyStudying"
                        checked={edu.currentlyStudying}
                        onChange={(e) => handleChange(edu.id, e)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`currentlyStudying-${edu.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        Currently Studying
                      </label>
                    </div>
                  </div>
                ))}

                {/* Add New button */}
                <div className="flex justify-end mb-4">
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="flex items-center text-orange-500 font-medium bg-white rounded-full py-1 px-3 shadow-sm"
                  >
                    <span className="text-xl mr-1">+</span> Add New
                  </button>
                </div>

                {/* Save All Button */}
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
        </main>
      </div>
    </div>
  );
};

export default EditEducation;