import React from "react";
import Header from "../Header";
import company from "../../../assets/images/company.png";

import { MdEdit } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";

import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

const ProfileCompany = () => {
  return (

    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">

    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Header */}

        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div className="w-64 bg-white border-r">
              <CompanySideBar />
            </div>
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-3xl">
                {/* Company Logo */}
                <div className="w-[246px] h-[198px] rounded-lg flex items-center justify-center">
                  <img
                    src={company}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Company Name and Edit Button */}
                <div className="flex items-center gap-4 mt-6">
                  <h2 className="text-2xl font-bold">Company Name</h2>
                  <button className="w-8 h-8 bg-[#1F2B44] rounded flex items-center justify-center">
                    <MdEdit className="text-white text-lg" />
                  </button>
                </div>

                {/* Company Address */}
                <div className="mt-3 flex items-center bg-[#3950804D] px-4 py-2 rounded-full w-fit">
                  <MdOutlineHome className="text-gray-600" />
                  <p className="ml-2 text-sm text-gray-600">
                    1789 North Street, San Antonio, TX 78230
                  </p>
                </div>

                {/* About Company Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold">About Company</h3>
                    <button className="w-8 h-8 bg-[#1F2B44] rounded flex items-center justify-center">
                      <MdEdit className="text-white text-lg" />
                    </button>
                  </div>
                  <p className="mt-4 text-gray-600 max-w-xl leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileCompany;