import React from "react";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import AssignJobButton from "./popupsButtons/AssignJobButton";
import { useState } from "react";

const applicants = [
  {
    id: 1,
    name: "Jordan Mendez",
    address: "1789 North Street, San Antonio, TX 78201",
  },
  {
    id: 2,
    name: "Jordan Mendez",
    address: "1789 North Street, San Antonio, TX 78201",
  },
  {
    id: 3,
    name: "Jordan Mendez",
    address: "1789 North Street, San Antonio, TX 78201",
  },
  {
    id: 4,
    name: "Jordan Mendez",
    address: "1789 North Street, San Antonio, TX 78201",
  },
  {
    id: 5,
    name: "Jordan Mendez",
    address: "1789 North Street, San Antonio, TX 78201",
  },
];

const ViewApplicant = () => {
    const [showButton, setShowButton] = useState(false);
  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar className="w-full h-screen md:w-1/4 min-h-screen" />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-end px-4 md:px-8">
          <p className="text-gray-400 mt-6">Find Job / Graphics & Design / Job Details</p>
        </div>

        <div className="flex flex-col px-4 md:px-8">
          <div className="flex flex-col md:flex-row p-6 justify-between rounded-lg w-full">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="flex items-center justify-center rounded-full">
                <img src={insta} alt="Instagram" className="w-16 h-16 md:w-20 md:h-20" />
              </div>
              <div>
                <h2 className="text-2xl text-gray-700 font-semibold">Senior UX Designer</h2>
                <div className="flex space-x-2 mt-2 text-sm flex-wrap">
                  {["2 Miles Away", "New York City", "ID: 7878"].map((item, i) => (
                    <span key={i} className="px-3 py-1 border border-gray-500 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-left text-sm">
              <p className="text-black w-full md:w-[235px]">Use this PIN code to confirm your booking and respond to the alert.</p>
              <div className="mt-2 flex items-center justify-center w-full md:w-[235px] h-[48px] bg-gray-300 px-4 py-2 rounded-lg font-semibold tracking-widest">
                8 1 1 4 4 6
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end md:flex-row  items-center space-x-0 md:space-x-20 p-4 rounded-lg w-full mt-2">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                <img src={salary} className="w-9 h-9" alt="Salary icon" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Salary</p>
                <p className="font-semibold">$15/hr</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:mb-0">
              <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                <img src={time} className="w-8 h-8" alt="Time icon" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">Timings</p>
                <div className="flex flex-col gap-1 md:gap-3">
                  <div className="flex flex-col flex-wrap">
                    <p className="text-sm font-medium text-gray-700">Start date & Time</p>
                    <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                  </div>
                  <div className="flex flex-col flex-wrap">
                    <p className="text-sm font-medium text-gray-700">End date & Time:</p>
                    <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">05 Applicant(s):</h1>
            <div className="flex">
              <div className="w-full p-6">
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="flex flex-col md:flex-row justify-between items-center p-2 rounded-lg">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-11 h-11 bg-[#023047] rounded-full flex items-center justify-center">
                          <CiUser className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{applicant.name}</p>
                          <p className="text-gray-600 text-sm flex items-center">
                            <FaMapMarkerAlt className="text-gray-500 mr-1" />
                            {applicant.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="bg-[#023047] w-full md:w-[174px] h-[44px] text-white px-4 py-2 rounded-full">
                          View Applicant
                        </button>
                        <button 
                        onClick={() => setShowButton(true)}
                        className="bg-[#FD7F00] w-full md:w-[174px] h-[44px] text-white px-4 py-2 rounded-full">
                          Assign Job
                        </button>
                     {showButton && <AssignJobButton onClose={()=>setShowButton(false)} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewApplicant;