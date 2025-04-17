import React from 'react'
import { useState } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import HeaderWork from "../HeaderWork";
import PopupModelJobCompleted from '../popupModel/popupModel-Inprogress/PopupModelJobCompleted';


const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const jobs = [
  {
    id: 1,
    title: "Networking Engineer",
    location: "Washington",
    salary: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
  },
  {
    id: 2,
    title: "Product Designer",
    location: "Dhaka",
    salary: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111632.png",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    location: "Brazil",
    salary: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733609.png",
  },
  {
    id: 4,
    title: "Visual Designer",
    location: "Wisconsin",
    salary: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
  },
  {
    id: 5,
    title: "Marketing Officer",
    location: "United States",
    salary: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Active",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  },
];

const UserCompleted = () => {
    const [showPopup, setShowPopup] = useState(false);
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
      <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
        {/* Tabs */}
        <HeaderWork />

        {/* Job List */}
        <div className="">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white mb-4"
            >
              {/* Job Icon and Details */}
              <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                <img
                  src={job.icon}
                  alt={job.title}
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="font-medium text-lg">{job.title}</h3>
                  <div className="text-sm text-gray-500 flex items-center flex-wrap">
                    <span>{job.location}</span>
                    <span className="mx-2 hidden sm:inline">•</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>

              {/* Job Date and Status */}
              <div className="flex flex-col sm:flex-col lg:flex-row items-start md:items-center justify-between col-span-1 sm:col-span-1 md:col-span-1 space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="text-sm font-medium text-gray-400">{job.date}</div>
                <div className="flex items-center font-medium text-xs text-green-500">
                  <CheckIcon />
                  <span className="ml-1 text-sm">{job.status}</span>
                </div>
                
              </div>

              {/* Action Buttons */}
              <div className="flex  justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
              <button className="text-gray-400 hover:text-gray-600">
                  <BookmarkIcon  />
                </button>
                <button
                onClick={() => setShowPopup(true)}
                  className="bg-[#FD7F00] text-white w-full sm:w-[110px] h-[40px] text-sm font-normal rounded-full"
                >
                  Completed
                </button>

                {
                    showPopup && (
                        <PopupModelJobCompleted onClose = {()=>setShowPopup(false)}/>
                    )
                }
              
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserCompleted
