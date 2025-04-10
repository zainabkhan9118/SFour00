import React from "react";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import qr from "../../../../assets/images/qr-code.png";

const AssignedJobDetail = () => {
  return (
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full h-screen md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        <div className="flex justify-end px-6 md:px-8">
          <p className="text-gray-400 mt-6">
            Find Job / Graphics & Design / Job Details
          </p>
        </div>
        <div className="flex flex-col  px-6 md:px-8 gap-2">
          <div className="flex flex-col md:flex-row justify-between mt-8 ml-3">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="flex items-center justify-center rounded-full">
                <img
                  src={insta}
                  alt="Instagram"
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </div>
              <div>
                <h2 className="text-2xl text-gray-700 font-semibold">
                  Senior UX Designer
                </h2>
                <div className="flex space-x-2 mt-2 text-sm flex-wrap">
                  {["2 Miles Away", "New York City", "ID: 7878"].map(
                    (item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 border border-gray-500 rounded-full"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-3 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                <img src={salary} className="w-8 h-8" alt="" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Salary</p>
                <p className="font-semibold">$15/hr</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-x-3 md:mb-0">
              <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                <img src={time} className="w-8 h-8" alt="" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">Timings</p>
                <div className="flex gap-3">
                  <div className="flex flex-col flex-wrap">
                    <p className="text-sm font-medium text-gray-700">
                      Start date & Time
                    </p>
                    <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                  </div>
                  <div className="flex flex-col flex-wrap">
                    <p className="text-sm font-medium text-gray-700">
                      End date & Time:
                    </p>
                    <p className="text-[12px]">5 NOV 2024 9:00AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {/* QR Code */}
            <img src={qr} alt="QR Code" className="w-[90px] h-[90px]" />

            {/* Right Side - Assigned To & Status */}
            <div className="flex flex-col gap-2 w-full md:w-[284px] h-[48px]">
              {/* Assigned To Section */}
              <div className="border-2 border-dashed border-gray-400 px-4 py-2 rounded-full text-gray-800">
                <span className="font-bold text-gray-700">Assigned To: </span>
                <span className="text-base"> Jorden Mendaz</span>
              </div>

              {/* Status Section */}
              <div className="border-2 border-dashed border-[#FD7F00] px-4 py-2 rounded-full text-[#FD7F00] w-full md:w-[181px] h-[48px]">
                <span className="font-semibold">Status: </span>
                <span className="text-base"> Book On</span>
              </div>
            </div>
          </div>
          <div className="p-6 w-full max-w-[1110px] mx-auto">
            {/* Job Description */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Integer aliquet pretium consequat. Donec et sapien id leo accumsan
              pellentesque eget maximus tellus. Duis et est ac leo rhoncus
              tincidunt vitae vehicula augue. Donec in suscipit diam.
              Pellentesque quis justo sit amet arcu commodo sollicitudin.
              Integer finibus blandit condimentum. Vivamus sit amet ligula
              ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet
              aliquam urna. Maecenas blandit felis id massa sodales finibus.
              Integer bibendum eu nulla eu sollicitudin.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Nam dapibus consectetur erat in euismod. Cras urna augue, mollis
              venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum
              elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in
              neque sit amet orci interdum tincidunt.
            </p>
            <div className="flex flex-col md:flex-row mt-4 gap-3 ml-0">
              <button className="bg-[#FD7F00] w-full md:w-[220px] h-[56px] text-white px-6 py-2 rounded-full font-normal hover:bg-orange-600 transition">
                Track Worker
              </button>
              <button className="bg-[#1F2B44]  w-full md:w-[220px] h-[56px] text-white px-6 py-2 rounded-full font-normal hover:bg-gray-800 transition">
                Message Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedJobDetail;