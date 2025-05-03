import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo1 from "../../../../../assets/images/EmployersLogo1.png";
import logo2 from "../../../../../assets/images/EmployersLogo2.png";
import {FaClock } from "react-icons/fa";

import Headerjob from "../Headerjob";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import { JobStatus } from "../../../../../constants/enums";
import { getJobsByStatus } from "../../../../../api/jobsApi";

// Sample data for fallback if needed
const sampleJobs = [
  {
    id: 1,
    logo: logo1,
    title: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 2,
    logo: logo2,
    title: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 3,
    logo: logo1,
    title: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 4,
    logo: logo2,
    title: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
  {
    id: 5,
    logo: logo2,
    title: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    status: "Accepted 1 hour ago",
    assignedto: "Jorden Mendaz",
  },
];

const Inprogess = () => {
  const navigate = useNavigate();
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const handleJobClick = (jobId) => {
    navigate(`/inProgress-jobDetail/${jobId}`);
  };

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get company ID from localStorage or use a default for testing
        const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
        
        // Call the API with the status parameter from JobStatus enum using our new API function
        const result = await getJobsByStatus(companyId, JobStatus.IN_PROGRESS);
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          console.log("In-progress jobs data:", result.data);
          
          // Map the data for consistent access
          const processedJobs = result.data.map(job => {
            // Make sure to access the job information correctly
            const jobData = job.jobId || job;
            const companyData = jobData.companyId || {};
            
            return {
              _id: job._id,
              jobTitle: jobData.jobTitle || "Untitled Job", 
              pricePerHour: jobData.pricePerHour || "300.0",
              startTime: job.startTime || job.updatedAt,
              userJobRel: job.userJobRel || [],
              companyLogo: companyData.companyLogo || null
            };
          });
          
          setInProgressJobs(processedJobs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch in-progress jobs:", err);
        setError(err.message);
        // Use sample data as fallback for testing
        setInProgressJobs(sampleJobs.map((job, index) => ({
          _id: `sample-${index}`,
          jobTitle: job.title,
          pricePerHour: job.rate.replace('$', '').replace('/hr', ''),
          updatedAt: new Date().toISOString(),
          userJobRel: [{ userId: { fullname: job.assignedto } }],
          companyLogo: job.logo
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressJobs();
  }, []);

  // Format time from date string (e.g., "12:00 PM")
  const formatTime = (dateString) => {
    if (!dateString) return "12:00 PM";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
     

      <div className="flex flex-col gap-4 sm:gap-6 flex-1 p-3 sm:p-4 md:p-6">
        
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
            {inProgressJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No in-progress jobs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inProgressJobs.map((job, index) => {
                  console.log(`Job ${index}:`, job);
                  
                  // Set a default logo or alternate between the two sample logos
                  const companyLogo = job.companyLogo || (index % 2 === 0 ? logo1 : logo2);
                  
                  return (
                    <div
                      key={job._id || index}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleJobClick(job._id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-12 h-12 mr-4 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                            <img 
                              src={companyLogo} 
                              alt="Company Logo" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = index % 2 === 0 ? logo1 : logo2;
                              }}
                            />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                              {job.jobTitle || "Untitled Job"}
                            </h2>
                            <p className="text-teal-700 font-semibold">${job.pricePerHour || "300.0"}/hr</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FaClock className="mr-1" />
                            <span>Accepted {formatTime(job.startTime || job.updatedAt)}</span>
                          </div>
                          <div className="bg-teal-900 text-white px-3 py-1 rounded-full text-sm mt-1">
                            Accepted By: {job.userJobRel && job.userJobRel.length > 0 && job.userJobRel[0].userId
                              ? job.userJobRel[0].userId.fullname
                              : "Successggg"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inprogess;