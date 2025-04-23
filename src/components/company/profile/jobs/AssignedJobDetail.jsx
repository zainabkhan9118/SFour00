import React, { useState } from "react";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import qr from "../../../../assets/images/qr-code.png";
import QRCodeModal from "./popupsButtons/QRCodeModal";



const AssignedJobDetail = () => {
      const [showButton, setShowButton] = useState(false);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />

      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex justify-end px-4 md:px-8">
          <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-base">
            Find Job / Graphics & Design / Job Details
          </p>
        </div>
        <div className="flex flex-col px-4 md:px-8 gap-4 md:gap-2">
          <div className="flex flex-col md:flex-row justify-between mt-4 md:mt-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:flex md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-6 h-6 md:w-8 md:h-8" alt="" />
                </div>
                <div>
                  <p className="text-gray-600 text-xs md:text-sm">Salary</p>
                  <p className="font-semibold text-sm md:text-base">$15/hr</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={time} className="w-6 h-6 md:w-8 md:h-8" alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-900 font-semibold text-xs md:text-sm">Timings</p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm font-medium text-gray-700">Start date & Time</p>
                      <p className="text-[10px] md:text-[12px]">5 NOV 2024 9:00AM</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs md:text-sm font-medium text-gray-700">End date & Time:</p>
                      <p className="text-[10px] md:text-[12px]">5 NOV 2024 9:00AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <img src={qr} alt="QR Code" className="w-[70px] h-[70px] md:w-[90px] md:h-[90px]" />
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="border-2 border-dashed border-gray-400 px-3 md:px-4 py-2 rounded-full text-gray-800 text-sm md:text-base">
                <span className="font-bold text-gray-700">Assigned To: </span>
                <span>Jorden Mendaz</span>
              </div>
              <div className="border-2 border-dashed border-[#FD7F00] px-3 md:px-4 py-2 rounded-full text-[#FD7F00] text-sm md:text-base">
                <span className="font-semibold">Status: </span>
                <span>Book On</span>
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6 w-full max-w-[1110px] mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Job Description
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Integer aliquet pretium consequat. Donec et sapien id leo accumsan
              pellentesque eget maximus tellus. Duis et est ac leo rhoncus
              tincidunt vitae vehicula augue. Donec in suscipit diam.
              Pellentesque quis justo sit amet arcu commodo sollicitudin.
              Integer finibus blandit condimentum. Vivamus sit amet ligula
              ullamcorper, pulvinar ante id, tristique erat. Quisque sit amet
              aliquam urna. Maecenas blandit felis id massa sodales finibus.
              Integer bibendum eu nulla eu sollicitudin.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mt-4">
              Nam dapibus consectetur erat in euismod. Cras urna augue, mollis
              venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum
              elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in
              neque sit amet orci interdum tincidunt.
            </p>
            <div className="flex flex-col sm:flex-row mt-4 gap-3">
              <button
                onClick={() => setShowButton(true)}
              className="bg-[#FD7F00] w-full sm:w-[220px] h-[46px] md:h-[56px] text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-normal hover:bg-orange-600 transition">
                Track Worker
              </button>
              <button className="bg-[#1F2B44] w-full sm:w-[220px] h-[46px] md:h-[56px] text-white px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-normal hover:bg-gray-800 transition">
                Message Worker
              </button>
            </div>
          </div>
        </div>
        {showButton && <QRCodeModal onClose={() => setShowButton(false)} />}
      </div>
    </div>
  );
};

export default AssignedJobDetail;