import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";
import Sidebar from "../../../Sidebar";
import Header from "../../../Header";
import Headerjob from "../Headerjob";

const jobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
];

const Inprogess = () => {
  const navigate = useNavigate();
  const handleJobClick = () => {
    navigate('/inProgress-jobDetail');
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="w-full lg:w-1/4" />

      <div className="flex flex-col gap-4 sm:gap-6 flex-1 p-3 sm:p-4 md:p-6">
        <Header />
        <Headerjob />

        <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                index === jobs.length - 1 ? "border-none" : "border-gray-200"
              }`}
              onClick={() => handleJobClick()}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                <div className="flex-shrink-0">
                  <img src={job.logo} alt={job.title} className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>

                <div className="flex-grow sm:w-[200px] md:w-[300px]">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{job.title}</h2>
                  <div className="flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-2">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <span>•</span>
                    <span>{job.rate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-3 mt-3 sm:mt-0">
                <div className="flex items-center text-green-500 font-medium text-xs sm:text-sm">
                  <FaCheck className="mr-1" />
                  <span className="whitespace-nowrap">{job.status}</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <FaRegBookmark className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg sm:text-xl" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick();
                    }}
                    className="bg-[#1F2B44] text-white px-4 sm:px-7 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
                  >
                    <span className="font-semibold">Assigned To: </span>
                    <span>{job.assignedto}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inprogess