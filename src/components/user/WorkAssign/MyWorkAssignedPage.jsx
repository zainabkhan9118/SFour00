import { useState, useEffect, useContext } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import HeaderWork from "../HeaderWork";
import PopupButton1 from "../popupModel/PopupButton1";
import PopupButton2 from "../popupModel/PopupButton2";
import PopupButton3 from "../popupModel/PopupButton3";
import PopupButton4 from "../popupModel/PopupButton4";
import PopupButton5 from "../popupModel/PopupButton5";
import PopupButton6 from "../popupModel/PopupButton6";
import { getAssignedJobs } from "../../../api/myWorkApi";
import { assignJobToApplicant } from "../../../api/jobApplicationApi";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
import LoadingSpinner from "../../common/LoadingSpinner";
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
    width="20"
    height="20"
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

const formatLocation = (lat, lng) => {
  if (!lat || !lng) return "Location not specified";
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

export default function MyWorkAssignedPage() {
  const [showButton1, setShowButton1] = useState(false);
  const [showButton2, setShowButton2] = useState(false);
  const [showButton3, setShowButton3] = useState(false);
  const [showButton4, setShowButton4] = useState(false);
  const [showButton5, setShowButton5] = useState(false);
  const [showButton6, setShowButton6] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const [assignableJobs, setAssignableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const { BASEURL } = useContext(AppContext);

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      try {
        let jobSeekerId = localStorage.getItem("jobSeekerId");
        console.log('Initial jobSeekerId from localStorage:', jobSeekerId);

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
          throw new Error("Unable to fetch your assigned jobs. Please try logging out and back in.");
        }

        // Go back to the original API call that was working
        console.log('Fetching applied jobs for jobSeekerId:', jobSeekerId);
        const response = await getAssignedJobs(jobSeekerId);
        console.log('API Response:', response);

        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }

        const jobsData = response.data.data;
        console.log('All applied jobs data:', jobsData);
        
        // Filter for jobs with isAssignable = true (for Accept/Decline buttons)
        const assignableJobs = Array.isArray(jobsData)
          ? jobsData.filter(job => job.isAssignable === true)
          : [];
        console.log('Filtered assignable jobs:', assignableJobs);
        
        // Now also make a separate call to get jobs with status="assigned" (for Book On button)
        console.log('Fetching jobs with status "assigned" (for Book On button)');
        const assignedResponse = await axios.get(`${BASEURL}/apply/${jobSeekerId}`, {
          params: { status: "assigned" }
        });
        console.log('Assigned jobs API Response:', assignedResponse);
        
        const assignedJobsData = assignedResponse?.data?.data || [];
        const bookOnJobs = Array.isArray(assignedJobsData)
          ? assignedJobsData.filter(job => job.status === "assigned")
          : [];
        console.log('Jobs with Book On button:', bookOnJobs);
        
        // Combine both types of jobs - put "Book On" jobs first
        const combinedJobs = [
          // First all jobs with status "assigned" (Book On button)
          ...bookOnJobs,
          // Then jobs with isAssignable true but not already included above
          ...assignableJobs.filter(job => job.status !== "assigned")
        ];
        console.log('Combined jobs to display (Book On jobs first):', combinedJobs);
        
        setAssignableJobs(combinedJobs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.message || "Failed to load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchAssignedJobs();
  }, [BASEURL]);

  const handleAccept = async (applicationId) => {
    console.log("Accepting job application with ID:", applicationId);
    try {
      setLoading(true);
      // Call the API function to assign the job to the applicant
      const response = await assignJobToApplicant(applicationId);
      console.log("Job assignment response:", response);
      
      // If successfully assigned, show the success popup sequence
      if (response && (response.statusCode === 200 || response.statusCode === 201 || response.status === 200)) {
        // Trigger the popup sequence
        setShowButton1(true);
        
        // Refresh the jobs list after assignment
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        
        // Fetch updated job list
        const refreshResponse = await axios.get(`${BASEURL}/apply/${jobSeekerId}`);
        if (refreshResponse?.data?.data) {
          const allJobs = refreshResponse.data.data;
          
          // Get jobs with status "assigned" (for Book On button)
          const bookOnJobs = allJobs.filter(job => job.status === "assigned");
          
          // Get jobs with isAssignable = true and not already assigned
          const assignableJobs = allJobs.filter(job => job.isAssignable === true)
            .filter(job => job.status !== "assigned");
          
          // Combine jobs - Book On jobs first
          const combinedJobs = [...bookOnJobs, ...assignableJobs];
          
          setAssignableJobs(combinedJobs);
        }
      } else {
        throw new Error(response?.message || "Failed to assign job");
      }
    } catch (error) {
      console.error("Error assigning job:", error);
      // You can add toast notification here if you have a toast library
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = (jobId) => {
    console.log("Declining job:", jobId);
    // Add logic to decline the job
  };

  const handleBookOn = (applicationId) => {
    console.log("Booking on for application ID:", applicationId);
    setSelectedApplicationId(applicationId);
    setShowButton4(true);
  };

  const confirmBookJob = async () => {
    if (!selectedApplicationId) return;
    
    try {
      setLoading(true);
      const response = await assignJobToApplicant(selectedApplicationId);
      console.log("Job booking response:", response);
      
      if (response && (response.statusCode === 200 || response.statusCode === 201)) {
        // Refresh jobs after booking
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        
        // Fetch ALL jobs and filter them client-side
        const refreshResponse = await axios.get(`${BASEURL}/apply/${jobSeekerId}`);
        if (refreshResponse?.data?.data) {
          const allJobs = refreshResponse.data.data;
          // Filter and combine as before
          const assignableJobs = Array.isArray(allJobs) 
            ? allJobs.filter(job => job.isAssignable === true)
            : [];
          const bookOnJobs = Array.isArray(allJobs)
            ? allJobs.filter(job => job.status === "assigned" && !job.isAssignable)
            : [];
          setAssignableJobs([...assignableJobs, ...bookOnJobs]);
        }
        
        setShowButton5(true);
      } else {
        throw new Error(response?.message || "Failed to book job");
      }
    } catch (error) {
      console.error("Error booking job:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
          {/* Tabs */}
          <HeaderWork />

          {/* Job List */}
          <div className="">
            {error ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : assignableJobs.length > 0 ? (
              assignableJobs.map((application) => {
                const job = application.jobId || {};
                return (
                  <div
                    key={application._id}
                    className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white mb-4"
                  >
                    {/* Job Icon and Details */}
                    <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                      <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-gray-100">
                        <img
                          src={job.companyLogo || companyImage}
                          alt={job.jobTitle || "Company"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{job.jobTitle || "No Title Available"}</h3>
                        <div className="text-sm text-gray-500 flex items-center flex-wrap">
                          <span>{formatLocation(job.latitude, job.longitude)}</span>
                          <span className="mx-2 hidden sm:inline">•</span>
                          <span>£{job.pricePerHour || "Rate not specified"} per hour</span>
                        </div>
                      </div>
                    </div>

                    {/* Job Date and Status */}
                    <div className="flex flex-col sm:flex-col lg:flex-row items-start md:items-center justify-between col-span-1 sm:col-span-1 md:col-span-1 space-y-2 sm:space-y-0 sm:space-x-6">
                      <div className="text-sm font-medium text-gray-400">
                        {job.workDate ? new Date(job.workDate).toLocaleDateString() : "Date not available"}
                      </div>
                      <div className="flex items-center text-green-500">
                        <CheckIcon />
                        <span className="ml-1 text-sm font-medium">
                          {application.status || "Available"}
                        </span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <BookmarkIcon />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap sm:flx-col items-center justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
                      {application.status === "assigned" ? (
                        <button
                          onClick={() => handleBookOn(application._id)}
                          className="bg-orange-500 text-white w-full font-semibold sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-orange-400"
                        >
                          Book On
                        </button>
                      ) : application.isAssignable ? (
                        <>
                          <button 
                            onClick={() => handleDecline(job._id)} 
                            className="bg-gray-800 text-white font-semibold w-full sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-gray-700"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAccept(application._id)}
                            className="bg-orange-500 text-white w-full font-semibold sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-orange-400"
                          >
                            Accept
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">No assignable jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Popup sequence */}
      {showButton1 && (
        <PopupButton1
          onClose={() => {
            setShowButton1(false);
            setShowButton2(true); 
          }}
          onClose1 = {() => setShowButton1(false)}
        />
      )}

      {showButton2 && (
        <PopupButton2
          onClose={() => {
            setShowButton2(false);
            setShowButton3(true);
          }}
          onClose2 = {() => setShowButton2(false)}
        />
      )}
      
      {showButton3 && (
        <PopupButton3
          onClose={() => {
            setShowButton3(false);
          }}
        />
      )}

      {showButton4 && (
        <PopupButton4
          onClose={() => {
            setShowButton4(false);
            confirmBookJob();
          }}
          onClose4={() => setShowButton4(false)}
        />
      )}

      {showButton5 && (
        <PopupButton5
          onClose={() => {
            setShowButton5(false);
            setShowButton6(true);
          }}
          onClose5={() => setShowButton5(false)}
        />
      )}
      
      {showButton6 && (
        <PopupButton6
          onClose={() => {
            setShowButton6(false);
          }}
        />
      )}
    </div>
  );
}