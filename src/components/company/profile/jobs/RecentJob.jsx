import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headerjob from "./Headerjob";
import LoadingSpinner from "../../../common/LoadingSpinner";
import logo1 from "../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../assets/images/EmployersLogo2.png";

import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";

// Sample data as fallback
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
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get companyId from localStorage or context - adjust as needed
  const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e"; // Default ID for testing

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/company/${companyId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          setCompanyJobs(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError(err.message);
        // Use sample data as fallback
        setCompanyJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  const handleJobClick = (jobId) => {
    navigate(`/job-detail/${jobId}`);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) + " " + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        
        <div className="flex flex-col gap-4 lg:gap-6 flex-1 p-4 lg:p-6">
        
          <Headerjob />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      

      <div className="flex flex-col gap-4 lg:gap-6 flex-1 p-4 lg:p-6">
        
        <Headerjob />

        <div className="w-full bg-white p-4 lg:p-6 shadow-md rounded-lg">
          {companyJobs.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No jobs found</p>
          ) : (
            companyJobs.map((job, index) => (
              <div
                key={job._id}
                className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-6 border-b cursor-pointer ${
                  index === companyJobs.length - 1 ? "border-none" : "border-gray-200"
                }`}
                onClick={() => handleJobClick(job._id)}
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="flex-shrink-0">
                    <img 
                      src={job.companyId?.companyLogo || (index % 2 === 0 ? logo1 : logo2)} 
                      alt={job.jobTitle} 
                      className="w-12 h-12 object-cover rounded" 
                    />
                  </div>

                  <div className="flex-grow sm:w-[300px]">
                    <h2 className="text-lg font-semibold text-gray-900">{job.jobTitle}</h2>
                    <div className="flex flex-wrap items-center text-gray-600 text-sm gap-2">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-500 mr-1" />
                        <span>{job.companyId?.address || "Location not specified"}</span>
                      </div>
                      <span>• ${job.pricePerHour}/hr</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-4 sm:gap-6">
                  <div className="text-sm text-gray-500 w-full sm:w-auto">
                    {formatDate(job.createdAt)}
                  </div>
                  <div className="flex items-center text-green-500 font-medium text-sm">
                    <FaCheck className="mr-1" />
                    {job.jobStatus === "open" ? "Active" : job.jobStatus}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                  <FaRegBookmark className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
                    {job.noOfApplicants || 0} Applications
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentJob;