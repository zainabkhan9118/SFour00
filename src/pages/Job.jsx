import React from "react";
import Sidebar from "../components/user/SideBar";
import logo from "../assets/images/Ellipse.png";
import { FaBell } from "react-icons/fa";

const Job = () => {
  const products = [
    {
      title: "Networking Engineer",
      location: "Washington",
      price: "$12/hr",
      status: "Active",
    },
    {
      title: "Product Designer",
      location: "Dhaka",
      price: "$12/hr",
      status: "Active",
    },
    {
      title: "Junior Graphic Designer",
      location: "Brazil",
      price: "$12/hr",
      status: "Active",
    },
    {
      title: "Visual Designer",
      location: "Wisconsin",
      price: "$12/hr",
      status: "Active",
    },
    {
      title: "Marketing Officer",
      location: "United States",
      price: "$12/hr",
      status: "Active",
    },
  ];
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-100 p-6">
        {/* profile */}
        <div className="flex items-center space-x-4 justify-end">
          <div className="relative">
          <FaBell className="text-orange-500 absolute top-3 right-14 text-xl" />
            <img
              src={logo}
              alt="Profile"
              className="w-10 h-10 rounded-full "
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <span className="text-lg font-normal text-[#1F2B44]">
            Dani Danial
          </span>
        </div>
      </div>
    </div>
  );
};

export default Job;
