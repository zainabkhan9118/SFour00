import React from "react";

import insta from "../../../assets/images/insta.svg";

const ReportProblem = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col flex-1 relative">

        <div className="flex flex-col h-screen justify-between md:mx-0 p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex mt-7 flex-wrap justify-center md:justify-start">
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r mb-4">
              <img src={insta} alt="Instagram Logo" className="w-16 h-16 rounded-full" />
            </div>
            <div className="flex flex-col text-center md:text-left md:ml-4">
              <h2 className="text-2xl font-bold text-gray-700">
                Senior UX Designer
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mt-2">
                <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                  2 Miles Away
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                  New York City
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-gray-500 text-sm">
                  ID: 7878
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="mt-8">
            {/* Auto-Generated Messages */}
            <div className="flex flex-col space-y-4 items-end">
              <div className="flex items-center space-x-2 justify-end">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500 [transform:rotate(120deg)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                    />
                  </svg>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-600 text-sm">
                  This is Auto-Generated Message!
                </div>
              </div>
              <div className="flex items-center space-x-2 justify-end">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500  [transform:rotate(120deg)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                    />
                  </svg>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-600 text-sm">
                  Tap to send message!
                </div>
              </div>
              <div className="flex items-center space-x-2 justify-end">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500 [transform:rotate(120deg)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                    />
                  </svg>
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-600 text-sm">
                  Lorem Ipsum Dolor Sit Amet
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="mt-6 flex items-center">
              <input
                type="text"
                placeholder="Write a message..."
                className="flex-1 px-4 py-2 border border-orange-300 rounded-full h-[62px] focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button className="ml-4 bg-orange-400 text-orange-600 p-3 rounded-full hover:bg-orange-800 transition duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-500 [transform:rotate(180deg)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                    />
                  </svg>
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;