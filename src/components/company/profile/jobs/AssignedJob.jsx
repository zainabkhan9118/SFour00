import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import Headerjob from "./Headerjob";
import LoadingSpinner from "../../../common/LoadingSpinner";
import logo1 from "../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../assets/images/EmployersLogo2.png";
import { FaMapMarkerAlt, FaCheck, FaRegBookmark } from "react-icons/fa";
import { JobStatus } from "../../../../constants/enums";

// Sample data for fallback
const sampleJobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Active",
    assignedto: "Jorden Mendaz",
  },
];

const AssignedJob = () => {
  const navigate = useNavigate();
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleJobClick = (jobId) => {
    navigate(`/assign-jobDetail/${jobId}`);
  };

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API with the status parameter from JobStatus enum
        const response = await fetch(`/api/apply/company/${companyId}?status=${JobStatus.ASSIGNED}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          setAssignedJobs(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch assigned jobs:", err);
        setError(err.message);
        // Keep sample data as fallback
        setAssignedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedJobs();
  }, []);

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
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar className="w-full lg:w-1/4" />

      <div className="flex flex-col gap-4 md:gap-6 flex-1 p-3 sm:p-4 md:p-6">
        <Header />
        <Headerjob />

        {loading ? (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg flex justify-center items-center h-64">
            <p className="text-xl text-red-500">Error: {error}</p>
          </div>
        ) : (
          <div className="w-full bg-white p-3 sm:p-4 md:p-6 shadow-md rounded-lg">
            {assignedJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No assigned jobs found</p>
              </div>
            ) : (
              assignedJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between py-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    index === assignedJobs.length - 1 ? "border-none" : "border-gray-200"
                  }`}
                  onClick={() => handleJobClick(job._id)}
                >
                  <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <div className="flex-shrink-0">
                      <img 
                        src={job.companyId?.companyLogo || (index % 2 === 0 ? logo1 : logo2)} 
                        alt={job.jobTitle} 
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded" 
                      />
                    </div>

                    <div className="flex-grow sm:w-[200px] md:w-[300px]">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900">{job.jobTitle}</h2>
                      <div className="flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-2">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-gray-500" />
                          <span>{job.companyId?.address || "Location not specified"}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>${job.pricePerHour || 0}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto gap-2 sm:gap-6 mb-3 sm:mb-0">
                    <div className="text-xs sm:text-sm text-gray-500 w-full sm:w-auto">
                      {formatDate(job.createdAt || job.updatedAt)}
                    </div>
                    <div className="flex items-center text-green-500 font-medium text-xs sm:text-sm">
                      <FaCheck className="mr-1" />
                      {job.jobStatus || "Assigned"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 sm:gap-6">
                    <FaRegBookmark className="text-gray-400 cursor-pointer hover:text-gray-600 text-lg sm:text-xl" />
                    <button className="bg-[#1F2B44] text-white px-4 sm:px-7 py-2 sm:py-4 rounded-full text-xs sm:text-sm font-medium w-full sm:w-auto">
                      <span className="font-semibold">Assigned To: </span>
                      <span className="text-xs sm:text-sm">
                        {job.userJobRel && job.userJobRel.length > 0
                          ? job.userJobRel[0].userId.fullname
                          : "Not assigned"}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedJob;
