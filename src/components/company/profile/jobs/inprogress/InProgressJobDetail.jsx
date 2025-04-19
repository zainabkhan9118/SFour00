import React from "react";
import insta from "../../../../../assets/images/insta.png";
import salary from "../../../../../assets/images/salary.png";
import time from "../../../../../assets/images/time.png";
import qr from "../../../../../assets/images/qr-code.png";
import Sidebar from "../../../Sidebar";
import Header from "../../../Header";

const InProgressJobDetail = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="w-full lg:w-1/4" />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-end px-4 sm:px-6 md:px-8">
          <p className="text-sm sm:text-base text-gray-400 mt-4 sm:mt-6">
            Find Job / Graphics & Design / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 sm:px-6 md:px-8 gap-4">
          <div className="flex flex-col md:flex-row justify-between mt-4 sm:mt-8">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 mb-4 md:mb-0">
              <div className="flex-shrink-0">
                <img src={insta} alt="Instagram" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-700 font-semibold">Senior UX Designer</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["2 Miles Away", "New York City", "ID: 7878"].map((item, i) => (
                    <span key={i} className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-500 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 items-start sm:items-center mt-4 md:mt-0">
              {/* Salary Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 sm:w-8 sm:h-8" alt="" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Salary</p>
                  <p className="font-semibold text-sm sm:text-base">$15/hr</p>
                </div>
              </div>

              {/* Timing Section */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 sm:w-8 sm:h-8" alt="" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">Timings</p>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        Start date & Time
                      </p>
                      <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-700">
                        End date & Time:
                      </p>
                      <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Buttons Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img src={qr} alt="QR Code" className="w-20 h-20 sm:w-[90px] sm:h-[90px]" />
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="border-2 border-dashed border-gray-400 px-3 sm:px-4 py-2 rounded-full w-full sm:w-[284px] h-auto sm:h-[48px] text-gray-800">
                  <span className="text-sm sm:text-base font-bold text-gray-700">Assigned To: </span>
                  <span className="text-sm sm:text-base">Jorden Mendaz</span>
                </div>
                <div className="border-2 border-dashed border-[#FD7F00] px-3 sm:px-4 py-2 rounded-full w-auto sm:w-[181px] h-auto sm:h-[48px] text-[#FD7F00]">
                  <span className="text-sm sm:text-base font-semibold">Status: </span>
                  <span className="text-sm sm:text-base">Book On</span>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 self-end sm:self-center sm:ml-4">1 hour ago</span>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
              <button className="bg-[#FD7F00] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-orange-600 transition">
                Track Worker
              </button>
              <button className="bg-[#1F2B44] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition">
                View Selfie
              </button>
              <button className="bg-[#1F2B44] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition">
                View Alert Logs
              </button>
              <button className="bg-[#FD7F00] w-full sm:w-[180px] md:w-[220px] h-[46px] sm:h-[56px] text-white px-4 sm:px-6 py-2 rounded-full text-sm hover:bg-orange-600 transition">
                Message Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InProgressJobDetail;