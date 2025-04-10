import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import Headerjob from "./Headerjob";
import logo1 from "../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../assets/images/EmployersLogo2.png";

import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";

const jobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    assignedto: "Jorden Mendaz",

  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
];
const AssignedJob = () => {
      const navigate = useNavigate();
    
      const handleJobClick = () => {
        navigate(`/assign-jobDetail`);
      };
  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
    <Sidebar className="hidden lg:block w-full lg:w-1/4" />

    <div className="flex flex-col gap-6 flex-1 p-6">
      <Header />
      <Headerjob />

      <div className="w-full bg-white p-6 shadow-md rounded-lg">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className={`flex flex-row flex-wrap items-center justify-between py-4 border-b cursor-pointer ${
              index === jobs.length - 1 ? "border-none" : "border-gray-200"
            }`}
            onClick={() => handleJobClick()}
          >
            <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
              <div className="flex items-center justify-center rounded-full">
                <img src={job.logo} alt={job.title} className="w-14 h-14 md:w-14 md:h-14" />
              </div>

              <div className="w-full md:w-[300px]">
                <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                <div className="flex items-center text-gray-600 text-sm space-x-2">
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span>{job.location}</span>
                  <span>• {job.rate}</span>
                </div>
              </div>
            </div>

            {/* Middle Section (Date & Status) */}
            <div className="flex flex-col md:flex-row items-center w-full md:w-auto justify-between space-y-2 md:space-y-0 md:space-x-6">
              <div className="text-sm text-gray-500 min-w-[140px] text-left md:text-right">
                {job.date}
              </div>
              <div className="flex items-center text-green-500 font-medium text-sm min-w-[80px] text-left md:text-right">
                <FaCheck className="mr-1" />
                {job.status}
              </div>
            </div>

            {/* Right Section (Bookmark & Applications Button) */}
            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
              <FaRegBookmark className="text-gray-400 cursor-pointer hover:text-gray-600" />
              <button className="bg-[#1F2B44] text-white px-7 py-4 rounded-full text-sm font-medium">
                <span className="text-base font-semibold">Assigned To : </span><span className="text-sm">{job.assignedto}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default AssignedJob
