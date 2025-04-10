import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { FaMapMarkerAlt, FaEye, FaRegSquare } from "react-icons/fa";
import { MdOutlineWorkOutline } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import profileImage from "../../../assets/images/profileImage.png";
import security from "../../../assets/images/security.png";
import lisence from "../../../assets/images/lisence.png";
import urt from "../../../assets/images/urt.png";
import rectangle from "../../../assets/images/rectangle.png";

const ApplicantProfile = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <div className="flex flex-col  md:flex-row rounded-xl p-6 md:p-8 gap-6 max-w-4xl ">
          {/* Image & Info */}
          <div className="flex-shrink-0">
            <img
              src={profileImage}
              alt="Dany Danial"
              className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover shadow-md"
            />
            <h3 className="text-2xl font-bold mt-4">Dany Danial</h3>
            <p className="text-gray-400 text-base">23 years | Australia</p>

            <div className="flex items-center text-gray-600 mt-2 bg-gray-100 px-3 py-2 rounded-full w-full md:w-[308px] h-[28px]">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <span className="text-sm">
                1789 North Street, San Antonio, TX 78201
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold">About Dany</h2>
            <p className="text-gray-600 mt-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 p-6 max-w-4xl">
          {/* Experience Section */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>

            <div className="flex items-start gap-3 mb-4">
              <img src={security} className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Security Supervisor</h3>
                <p className="text-gray-500">SoftShift</p>
                <p className="text-gray-400 text-sm">June 2020 - Present</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <img src={rectangle} className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Assistant Manager</h3>
                <p className="text-gray-500">Tech Solutions</p>
                <p className="text-gray-400 text-sm">Jan 2018 - May 2020</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <img src={rectangle} className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">Intern</h3>
                <p className="text-gray-500">XYZ Corporation</p>
                <p className="text-gray-400 text-sm">Jul 2017 - Dec 2017</p>
                <p className="text-orange-500 text-sm flex items-center gap-1 mt-1">
                  <MdOutlineWorkOutline /> Work Reference
                </p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">Education</h2>

            <div className="flex items-start gap-3 mb-4">
              <img src={security} className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">BS Social Science</h3>
                <p className="text-gray-500">ABC University</p>
                <p className="text-gray-400 text-sm">Oct 2017 - Nov 7 2021</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" />
                <div className="flex flex-col">
                  <h3 className="font-bold">Certificate</h3>
                  <p className="text-gray-400 text-sm">Work Reference</p>
                </div>
              </div>
              <div>
              <FaEye className="text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={lisence} className="w-8 h-8" />
                <div className="flex flex-row gap-4 items-center">
                  <h3 className="font-bold">License</h3>
                  <AiFillCheckCircle className="text-green-500" />
                </div>
              </div>
              <FaEye className="text-gray-500 cursor-pointer" />
            </div>

            <div className="flex items-start gap-3">
              <img src={urt} className="w-8 h-8" />
              <div>
                <h3 className="font-bold">UTR Number</h3>
                <p className="text-gray-400 text-sm">MZB12345678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;