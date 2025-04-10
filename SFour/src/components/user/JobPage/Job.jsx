import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import Header from "../Header";
const jobs = [
  {
    id: 1,
    title: "Networking Engineer",
    location: "Washington",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732007.png",
    date: "Feb 2, 2019 18:28",
    status: "Active",
  },
  {
    id: 2,
    title: "Product Designer",
    location: "Dhaka",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    date: "Dec 7, 2019 23:26",
    status: "Active",
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    location: "Brazil",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    date: "Feb 2, 2019 18:28",
    status: "Active",
  },
  {
    id: 4,
    title: "Visual Designer",
    location: "Wisconsin",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732026.png",
    date: "Dec 7, 2019 23:26",
    status: "Active",
  },
  {
    id: 5,
    title: "Marketing Officer",
    location: "United States",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733635.png",
    date: "Dec 4, 2019 21:42",
    status: "Active",
  },
];

const Job = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
    <div className="min-h-screen py-2 px-5 ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 rounded-xl to-orange-500 p-6 text-white  ">
        <h1 className="text-2xl mt-8">Hello Dani Danial, Good Day 👋</h1>
        <h2 className="text-3xl font-bold mt-1">Search & Land on your dream job</h2>

        {/* Search Bar */}
        <div className="mt-8 flex space-x-4">
          <input
            type="text"
            placeholder="Search Job"
            className="w-1/2 p-3 rounded-[50px] border focus:ring focus:ring-yellow-400 text-black"
          />
          <input
            type="text"
            placeholder="Location"
            className="w-1/3 p-3  rounded-[50px]  border focus:ring focus:ring-yellow-400 text-black"
          />
          <button className="bg-yellow-500  rounded-[50px]  text-white px-6 py-3 font-semibold shadow-md">
            SEARCH JOB
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="p-6">
        <div className="flex space-x-2 items-center mb-4">
          <h3 className="text-[32px]  ">Recommendation</h3>
          <a href="#" className="text-orange-500 underline font-semibold hover:underline">
            See all
          </a>
        </div>

        <div className="bg-white p-4 rounded-lg ">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-4 border-b last:border-none">
              <div className="flex items-center space-x-4">
                <img src={job.icon} alt={job.title} className="w-10 h-10 rounded-full border" />
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-gray-500">{job.location} • {job.price}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">{job.date}</p>
              <span className="text-green-600 font-medium">✔ {job.status}</span>
              <button onClick={()=> navigate("/user-JobDetails")} className="bg-orange-500 text-white px-6 py-4 rounded-[50px] shadow-md">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Job;
