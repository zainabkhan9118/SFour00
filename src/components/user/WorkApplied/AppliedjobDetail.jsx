import React from 'react'
import { ArrowRight, X, Upload, Bookmark } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import Header from "../Header";
import salary from "../../../assets/images/salary.png";
import { AiOutlineInfoCircle } from "react-icons/ai"; 
import PopupInprogess from '../popupModel/popupModel-Inprogress/PopupInprogess';

const AppliedjobDetail = () => {
    const [isInProgressOpen, setIsInProgressOpen] = useState(false); 
    const [isMessageOpen, setIsMessageOpen] = useState(false); 
    const [isViewMapOpen, setIsViewMapOpen] = useState(false); 
    
  return (
    <div className="flex flex-row min-h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
      <div className="min-h-screen mx-auto py-4 px-5 md:p-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 text-right">
          <span>Find Job</span> / <span>Graphics & Design</span> /{" "}
          <span className="text-gray-700 ">Job Details</span>
        </div>

        <div className="mb-4">
          {/* Header with logo, title, and apply button */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex gap-4">
              {/* Company logo */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                  ></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>

              {/* Job title and tags */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  Senior UX Designer
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-3 py-1 rounded-full border w-[110px] h-[30px] border-gray-300 text-gray-700">
                    3 Jobs Active
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border w-[110px] h-[30px] border-gray-300 text-gray-700">
                    New York City
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border w-[70px] h-[30px] border-gray-300 text-gray-700">
                    WFH
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-end">
              <div className="text-left text-sm">
                <p className="text-black w-full md:w-[235px]">
                  Use this PIN code to confirm your booking and respond to the
                  alert.
                </p>
                <div className="mt-2 flex items-center justify-center w-full rounded-xl md:w-[235px] h-[48px] bg-gray-300 px-4 py-2 font-semibold tracking-widest">
                  8 1 1 4 4 6
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="flex flex-col md:flex-row justify-end gap-8 my-8">
            {/* Salary card */}
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                  <img src={salary} className="w-8 h-8" alt="" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Salary</p>
                  <p className="font-semibold text-gray-600">$15/hr</p>
                </div>
              </div>
            </div>

            {/* Timings card */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Timings</div>
                <div className="font-bold text-gray-700">
                  Fixed date & time
                </div>
                <div className="text-xs text-gray-500">Mon-Fri, 9am-5pm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <h2 className="text-2xl md:text-3xl text-gray-800 font-bold mb-4">
            Job Description
          </h2>
          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
            <p>
              Integer aliquet pretium consequat. Donec et sapien id leo
              accumsan pellentesque eget maximus felis. Duis et est ac leo
              rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam.
              Pellentesque quis justo sit amet arcu commodo sollicitudin.
            </p>
            <p>
              Integer ligula blandit condimentum. Vivamus sit amet ligula
              ultricorper, pulvinar ante id, tristique erat. Quisque sit amet
              aliquet urna. Maecenas blandit felis id massa sodales finibus.
              Integer bibendum eu nulla eu sollicitudin. Sed lobortis diam
              tincidunt accumsan faucibus. Quisque blandit augue quis turpis
              auctor, egestas auctor ante ultrices. Ut non felis lacinia
              turpis feugiat euismod at id magna. Sed ut orci arcu.
              Suspendisse sollicitudin faucibus eleifend.
            </p>
            <p>
              Nam dapibus consectetur arcu id eget urna augue mollis venenatis
              augue sed porttitor aliquet nibh. Sed tristique dictum
              elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in
              neque sit amet orci interdum tincidunt.
            </p>
          </div>
        </div>

        {/* Share */}
        <div className="mt-8 pt-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-sm font-medium">Share this job:</span>
            <div className="flex gap-3">
              <button className="flex items-center gap-1 text-blue-600 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Facebook
              </button>
              <button className="flex items-center gap-1 text-blue-400 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                Twitter
              </button>
              <button className="flex items-center gap-1 text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0a12 12 0 0 0-3.8 23.4c-.1-1.1-.2-2.7 0-3.9.2-1.1 1.4-7 1.4-7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.2.6 2.1 1.7 2.1 2 0 3.6-2.1 3.6-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-5 2.3-5 4.7 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.2 1.1-.3 1.3-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.8-7.2 7.9-7.2 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.7 2.9-.3 1-1 2.3-1.5 3.1 1.1.3 2.3.5 3.5.5 8.3 0 15-6.7 15-15S20.3 0 12 0z"></path>
                </svg>
                Pinterest
              </button>
            </div>
           
          </div>
          <div className="flex flex-row justify-end mt-10">
              {/* Buttons Section */}
              <div className="flex  space-x-4">
                <button onClick={()=>setIsInProgressOpen(true)} className="w-[200px] h-[50px] bg-[#FD7F00] text-white font-semibold rounded-full hover:bg-orange-600 transition duration-200">
                  Book Off
                </button>
                
                <button className="w-[200px] h-[50px] px-6 py-2 bg-[#1F2B44] text-white font-semibold rounded-full hover:bg-gray-900 transition duration-200">
                  Message
                </button>
                <button className="w-[200px] h-[50px] px-6 py-2 bg-[#FD7F00] text-white font-semibold rounded-full hover:bg-orange-600 transition duration-200">
                  View Map
                </button>
              </div>
              {/* Report a Problem Section */}
            </div>
            <div className="flex justify-end items-center gap-1 text-base text-gray-500 hover:text-gray-700 cursor-pointer mt-3 mr-3">
                <AiOutlineInfoCircle className="text-gray-400 text-lg " />{" "}
                <a href="">Report a Problem</a>
              </div>
        </div>
        {isInProgressOpen && (
            <PopupInprogess onClose={() => setIsInProgressOpen(false)} />
          )}
      </div>
    </div>
  </div>
  )
}

export default AppliedjobDetail
