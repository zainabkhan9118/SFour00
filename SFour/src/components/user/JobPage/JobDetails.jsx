import { ArrowRight, X, Upload ,Bookmark} from "lucide-react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import Header from "../Header";
export default function JobDetails() { 
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
    <div className="min-h-screen mx-auto py-4 px-5 md:p-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 text-right">
        <span>Find Job</span> / <span>Graphics & Design</span> / <span className="text-gray-700">Job Details</span>
      </div>

      <div className="mb-8">
        {/* Header with logo, title, and apply button */}
        <div className="flex justify-between items-start">
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
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </div>

            {/* Job title and tags */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Senior UX Designer</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                  3 Jobs Active
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                  New York City
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">WFH</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-end">
            <div className="flex gap-2 mb-2">
              <button className="p-4  bg-gray-100 rounded-[50px]">
                <Bookmark className="w-5 h-5 text-orange-500" />
              </button>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-yellow-400 text-white px-[40px] py-4 rounded-[50px] font-medium">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-600">
              Job expires in <span className="text-orange-500 font-medium">June 30, 2021</span>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="flex justify-end gap-8 my-8">
          {/* Salary card */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
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
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M12 8v8"></path>
                <path d="M16 12H8"></path>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-600">Salary</div>
              <div className="font-bold">$35/hr</div>
            </div>
          </div>

          {/* Timings card */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
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
              <div className="font-bold">Fixed date & time</div>
              <div className="text-xs text-gray-500">Mon-Fri, 9am-5pm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h2 className="text-xl font-bold mb-4">Job Description</h2>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus felis. Duis et
            est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet
            arcu commodo sollicitudin.
          </p>
          <p>
            Integer ligula blandit condimentum. Vivamus sit amet ligula ultricorper, pulvinar ante id, tristique erat.
            Quisque sit amet aliquet urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum eu nulla eu
            sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis turpis auctor,
            egestas auctor ante ultrices. Ut non felis lacinia turpis feugiat euismod at id magna. Sed ut orci arcu.
            Suspendisse sollicitudin faucibus eleifend.
          </p>
          <p>
            Nam dapibus consectetur arcu id eget urna augue mollis venenatis augue sed porttitor aliquet nibh. Sed
            tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci
            interdum tincidunt.
          </p>
        </div>
      </div>

      {/* Share */}
      <div className="mt-8 pt-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Share this job:</span>
          <div className="flex gap-3">
            <button className="flex items-center gap-1 text-blue-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Facebook
            </button>
            <button className="flex items-center gap-1 text-blue-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
              Facebook
            </button>
            <button className="flex items-center gap-1 text-red-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0a12 12 0 0 0-3.8 23.4c-.1-1.1-.2-2.7 0-3.9.2-1.1 1.4-7 1.4-7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.2.6 2.1 1.7 2.1 2 0 3.6-2.1 3.6-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-5 2.3-5 4.7 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.2 1.1-.3 1.3-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.8-7.2 7.9-7.2 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.7 2.9-.3 1-1 2.3-1.5 3.1 1.1.3 2.3.5 3.5.5 8.3 0 15-6.7 15-15S20.3 0 12 0z"></path>
              </svg>
              Pinterest
            </button>
          </div>
        </div>
      </div>
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <button onClick={() => setIsModalOpen(false)} className="text-gray-900  absolute rounded-[50px]    hover:text-gray-500">
               <div className=" text-orange-500 py-2 px-4 rounded-[50px]  text-[20px]  bg-slate-100 mt-[-15px] ml-[420px]" >X</div>  
                </button>
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Apply Job: Senior UX Designer</h3>
              
              </div>

              {/* Modal Body */}
              <form className="space-y-5">
                {/* Resume Upload */}
                <div className="border border-dashed border-gray-300 rounded-[50px] p-4 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Upload className="w-5 h-5 text-blue-500" />
                    <span>Upload Resume</span>
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label htmlFor="name1" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="name1"
                    placeholder="Name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-[50px] focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="name2" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    id="name2"
                    placeholder="Name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-[50px] focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-[50px] focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button onClick={() => navigate("/User-CompanyDetails")}
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
        </div>
  )
}

