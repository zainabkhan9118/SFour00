import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import Headerjob from "./Headerjob";
import logo1 from "../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../assets/images/EmployersLogo2.png";

import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";

const jobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    applications: "05 Applications",
  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    applications: "05 Applications",
  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    applications: "05 Applications",
  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    applications: "05 Applications",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Active",
    applications: "05 Applications",
  },
];

const RecentJob = () => {
  const navigate = useNavigate();

  const handleJobClick = () => {
    navigate(`/job-detail`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="lg:block w-full lg:w-1/4" />

      <div className="flex flex-col gap-4 lg:gap-6 flex-1 p-4 lg:p-6">
        <Header />
        <Headerjob />

        <div className="w-full bg-white p-4 lg:p-6 shadow-md rounded-lg">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-6 border-b cursor-pointer ${
                index === jobs.length - 1 ? "border-none" : "border-gray-200"
              }`}
              onClick={() => handleJobClick()}
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="flex-shrink-0">
                  <img src={job.logo} alt={job.title} className="w-12 h-12" />
                </div>

                <div className="flex-grow sm:w-[300px]">
                  <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                  <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-gray-500 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <span>• {job.rate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-4 sm:gap-6">
                <div className="text-sm text-gray-500 w-full sm:w-auto">
                  {job.date}
                </div>
                <div className="flex items-center text-green-500 font-medium text-sm">
                  <FaCheck className="mr-1" />
                  {job.status}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                <FaRegBookmark className="text-gray-400 cursor-pointer hover:text-gray-600" />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
                  {job.applications}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentJob;