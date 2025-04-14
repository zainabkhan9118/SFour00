import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SideBar";
import Header from "../Header";
import { Bookmark, Search, MapPin } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Networking Engineer",
    location: "Washington",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732007.png",
    date: "Feb 2, 2019 18:28",
    status: "Active",
    bookMarked: false,
  },
  {
    id: 2,
    title: "Product Designer",
    location: "Dhaka",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    bookMarked: false,
  },
  {
    id: 3,
    title: "Junior Graphic Designer",
    location: "Brazil",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    date: "Feb 2, 2019 18:28",
    status: "Active",
    bookMarked: false,
  },
  {
    id: 4,
    title: "Visual Designer",
    location: "Wisconsin",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/732/732026.png",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    bookMarked: false,
  },
  {
    id: 5,
    title: "Marketing Officer",
    location: "United States",
    price: "$12/hr",
    icon: "https://cdn-icons-png.flaticon.com/512/733/733635.png",
    date: "Dec 4, 2019 21:42",
    status: "Active",
    bookMarked: false,
  },
];

const Job = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [activeJobs, setActiveJobs] = useState(jobs);
  
  const toggleBookmark = (id) => {
    setActiveJobs(activeJobs.map(job => 
      job.id === id ? {...job, bookMarked: !job.bookMarked} : job
    ));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        {/* Header */}
        <Header />
        
        <div className="flex-1 py-2 px-3 md:px-5 bg-gray-50">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-orange-500 p-4 md:p-6 text-white rounded-xl">
            <h1 className="text-xl md:text-2xl mt-4 md:mt-8">Hello Dani Danial, Good Day 👋</h1>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Search & Land on your dream job</h2>

            {/* Search Bar - Responsive layout */}
            <div className="mt-4 md:mt-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search Job"
                  className="w-full p-3 rounded-[50px] border focus:ring focus:ring-yellow-400 text-black pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 rounded-[50px] border focus:ring focus:ring-yellow-400 text-black pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="w-full md:w-auto bg-yellow-500 rounded-[50px] text-white px-6 py-3 font-semibold shadow-md hover:bg-yellow-600 transition-colors">
                SEARCH JOB
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-[32px] font-semibold">Recommendation</h3>
              <a href="#" className="text-orange-500 text-sm md:text-base font-semibold hover:underline">
                See all
              </a>
            </div>

            <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
              {activeJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="flex flex-col md:flex-row md:items-center p-3 md:p-4 border-b last:border-none space-y-3 md:space-y-0"
                >
                  {/* Job Info - 30% width on desktop */}
                  <div className="flex items-center space-x-3 md:space-x-4 md:w-[30%]">
                    <img 
                      src={job.icon} 
                      alt={job.title} 
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border" 
                    />
                    <div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-xs md:text-sm text-gray-500">
                        {job.location} • {job.price}
                      </p>
                    </div>
                  </div>
                  
                  {/* Date - 15% width on desktop */}
                  <div className="hidden md:block md:w-[15%]">
                    <p className="text-xs md:text-sm text-gray-400">
                      {job.date}
                    </p>
                  </div>
                  
                  {/* Status and Bookmark - 25% width on desktop */}
                  <div className="flex items-center md:w-[25%] justify-between md:justify-around">
                    <span className="text-green-600 text-xs md:text-sm font-medium">
                      ✔ {job.status}
                    </span>
                    <button 
                      onClick={() => toggleBookmark(job.id)}
                      className="focus:outline-none"
                      aria-label={job.bookMarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark 
                        className={`w-4 h-4 md:w-5 md:h-5 ${job.bookMarked ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                  
                  {/* View Details Button - 30% width on desktop */}
                  <div className="md:w-[30%] flex justify-end">
                    <button 
                      onClick={() => navigate("/user-JobDetails")} 
                      onMouseEnter={() => setHoveredButton(job.id)}
                      onMouseLeave={() => setHoveredButton(null)}
                      className={`w-full md:w-auto ${
                        hoveredButton === job.id 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-white text-gray-700 border border-gray-300'
                      } px-4 py-2 md:px-6 md:py-3 rounded-[50px] text-sm md:text-base shadow-sm transition-colors duration-200 hover:bg-orange-500 hover:text-white hover:border-orange-500`}
                    >
                      View Details
                    </button>
                  </div>
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