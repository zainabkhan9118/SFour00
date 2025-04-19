import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaCheckCircle,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaIdCard,
  FaFileAlt,
  FaArrowRight,
  FaRegSquare,
} from "react-icons/fa";
import Header from "../../Header";
import Sidebar from "../../SideBar";
import UserSidebar from "../UserSidebar";

const PersonalDetails = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-personal-details");
  };

  const handleEditExperience = () => {
    navigate("/edit-experience");
  };

  const handleEditEducation = () => {
    navigate("/edit-education");
  };

  const handleEditUTRNumber = () => {
    navigate("/edit-utr-number");
  };

  const handleEditCertificate = () => {
    navigate("/edit-certificate");
  };

  const handleEditLicense = () => {
    navigate("/edit-license");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar  />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header />

        <main className="flex-3  mt-3">
          <div className="flex flex-row flex-1">
           <div className="">
           <UserSidebar className='overflow-hidden'/>
           </div>
            <div className="p-4 h-screen overflow-auto">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="relative flex-shrink-0">
                    <img
                      src="src/assets/images/profile.jpeg"
                      alt="Portrait of Dany Danial"
                      className="rounded-xl w-32 h-32 md:w-48 md:h-48"
                    />
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold">About Dany</h2>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditProfile}
                      />
                    </div>
                    <p className="mt-2 text-gray-600">
                      Lorem Ipsum is simply dummy text of the printing and typesetting
                      industry. Lorem Ipsum has been the industry's standard dummy text
                      ever since the 1500s, when an unknown printer took a galley of type
                      and scrambled.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold">Dany Danial</h3>
                  <p className="text-gray-600">23 years | Australia</p>
                  <div className="flex items-center mt-2 gap-2">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <p className="bg-slate-400 px-2 py-1 rounded-xl text-sm text-white">
                      1789 North Street, San Antonio, TX 78201
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Experience */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Experience</h3>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditExperience}
                      />
                    </div>
                    <div className="mt-4 space-y-4">
                      {[0, 1, 2].map((i) => (
                        <div className="flex justify-between" key={i}>
                          <div className="flex items-start">
                            {i === 0 ? (
                              <FaBriefcase className="text-gray-600 mt-1" />
                            ) : (
                              <FaRegSquare className="text-gray-600 mt-1" />
                            )}
                            <div className="ml-2">
                              <h4 className="font-bold">Security Supervisor</h4>
                              <p className="text-gray-600">SoftShift</p>
                              <p className="text-gray-600">June 2020 - Present</p>
                              {i === 2 && (
                                <p className="text-orange-500 text-sm">Work Reference</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Education</h3>
                      <FaEdit
                        className="text-gray-500 cursor-pointer"
                        onClick={handleEditEducation}
                      />
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaGraduationCap className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">BS Social Science</h4>
                            <p className="text-gray-600">ABC University</p>
                            <p className="text-gray-600">Oct 2017 - Nov 7 2021</p>
                          </div>
                        </div>
                        <FaArrowRight className="text-gray-500 mt-2" onClick={handleEditEducation}/>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaCertificate className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">Certificate</h4>
                            <p className="text-gray-600">Work Reference</p>
                          </div>
                        </div>
                        <FaArrowRight 
                          className="text-gray-500 mt-2 cursor-pointer" 
                          onClick={handleEditCertificate}
                        />
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaIdCard className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">
                              License
                              <FaCheckCircle className="text-green-500 text-sm inline mr-1" />
                            </h4>
                          </div>
                        </div>
                        <FaArrowRight 
                          className="text-gray-500 mt-2 cursor-pointer" 
                          onClick={handleEditLicense}
                        />
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="flex">
                          <FaFileAlt className="text-gray-600 mt-1" />
                          <div className="ml-2">
                            <h4 className="font-bold">UTR Number</h4>
                          </div>
                        </div>
                        <FaArrowRight 
                          className="text-gray-500 mt-2 cursor-pointer" 
                          onClick={handleEditUTRNumber}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalDetails;
