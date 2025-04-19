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
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <div className="flex flex-row p-6 bg-[#FFFFFF]">
          <div className="flex w-full md:w-1/4 mb-6 md:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between w-full">
              <div>
              

                <CompanySideBar/>
              </div>

            </div>
          </div>

          <div className="flex flex-1">
            <div className="p-6 rounded-lg w-full md:w-auto">
              {/* Company Logo */}
              <img
                src={company}
                alt="Company Logo"
                className="w-full md:w-[246px] h-auto md:h-[198px] rounded-lg"
              />

              {/* Company Name and Edit Button */}
              <div className="flex items-center gap-9 mt-4 mb-6">
                <h2 className="text-3xl font-bold">Company Name</h2>
                <button className="w-[30px] h-[30px] bg-[#1F2B44]">
                  <MdEdit className="h-6 w-6 mx-auto text-white" />
                </button>
              </div>

              {/* Company Address */}
              <div className="mt-2 flex items-center bg-[#3950804D] p-2 rounded-full w-full md:w-[288px] h-auto md:h-[28px]">
                <MdOutlineHome className="h-6 w-6" />
                <p className="ml-2 text-xs text-gray-600">
                  1789 North Street, San Antonio, TX 78230
                </p>
              </div>

              {/* About Company Section */}
              <div className="mt-16">
                <div className="flex items-center gap-8">
                  <h3 className="text-3xl font-bold">About Company</h3>
                  <button className="w-[30px] h-[30px] bg-[#1F2B44]">
                    <MdEdit className="h-6 w-6 mx-auto text-white" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2 w-full md:w-[472px]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompany;