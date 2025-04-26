import React, { useState, useEffect, useContext } from 'react'
import Sidebar from "../SideBar";
import Header from "../Header";
import HeaderWork from "../HeaderWork";
import { useNavigate } from 'react-router-dom';
import { getInProgressJobs } from "../../../api/jobApplicationApi";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import companyImage from "../../../assets/images/company.png";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const UserWorkInprogess = () => {
  const navigate = useNavigate();
  const [inProgressJobs, setInProgressJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BASEURL } = useContext(AppContext);

  useEffect(() => {
    const fetchInProgressJobs = async () => {
      try {
        let jobSeekerId = localStorage.getItem("jobSeekerId");

        if (!jobSeekerId) {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser) {
            const firebaseId = currentUser.uid;
            try {
              const userResponse = await axios.get(`${BASEURL}/job-seeker`, {
                headers: {
                  "firebase-id": firebaseId,
                },
              });
              if (userResponse.data?.data?._id) {
                jobSeekerId = userResponse.data.data._id;
                localStorage.setItem("jobSeekerId", jobSeekerId);
              }
            } catch (err) {
              console.error("Error fetching user data:", err);
              throw new Error("Unable to fetch user data. Please try logging in again.");
            }
          }
        }

        if (!jobSeekerId) {
          throw new Error("Unable to fetch your in-progress jobs. Please try logging out and back in.");
        }

        const response = await getInProgressJobs(jobSeekerId);
        console.log('API Response:', response);

        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }

        const jobsData = response.data.data;
        setInProgressJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        console.error("Error fetching in-progress jobs:", err);
        setError(err.message || "Failed to load in-progress jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInProgressJobs();
  }, [BASEURL]);

  const handleNavigate = (jobId) => {
    navigate(`/User-AppliedAndAssignedDetail/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
            <HeaderWork />
            <div className="text-center py-4">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
            <HeaderWork />
            <div className="text-center text-red-500 py-4">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
          <HeaderWork />
          <div className="">
            {inProgressJobs.length === 0 ? (
              <div className="text-center py-4">No in-progress jobs found</div>
            ) : (
              inProgressJobs.map((application, index) => {
                const job = application.jobId || {};
                return (
                  <div
                    key={application._id || `job-${index}`}
                    className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white mb-4"
                  >
                    <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                      <img
                        src={job.companyId?.companyLogo || companyImage}
                        alt={job.jobTitle || "Company"}
                        className="w-12 h-12 rounded-full border border-gray-300"
                      />
                      <div>
                        <h3 className="font-medium text-lg">{job.jobTitle || "No Title Available"}</h3>
                        <div className="text-sm text-gray-500 flex items-center flex-wrap">
                          <span>{job.companyId?.address || "Location not specified"}</span>
                          <span className="mx-2 hidden sm:inline">•</span>
                          <span>£{job.pricePerHour || "Rate not specified"} per hour</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-col lg:flex-row items-start md:items-center justify-between col-span-1 sm:col-span-1 md:col-span-1 space-y-2 sm:space-y-0 sm:space-x-6">
                      <div className="text-sm font-medium text-gray-400">
                        {job.workDate ? new Date(job.workDate).toLocaleDateString() : "Date not available"}
                      </div>
                      <div className="flex items-center text-green-500">
                        <CheckIcon />
                        <span className="ml-1 text-sm font-medium">
                          {application.status || "In Progress"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <BookmarkIcon />
                      </button>
                      <button
                        onClick={() => handleNavigate(job._id)}
                        className="bg-[#1F2B44] text-white font-semibold w-full sm:w-[110px] h-[40px] text-sm rounded-full"
                      >
                        Book Off
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserWorkInprogess;
