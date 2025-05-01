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
import AlreadyAssignedPopup from "../popupModel/AlreadyAssignedPopup";
import { 
  getAssignedJobs, 
  getJobsByStatus, 
  updateJobStatus, 
  updateLocation, 
  updateStatusByQR 
} from "../../../api/myWorkApi";

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
  const [showAlreadyAssignedPopup, setShowAlreadyAssignedPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [assignableJobs, setAssignableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null); 
  const { BASEURL } = useContext(AppContext);

  useEffect(() => {
    const fetchAssignedJobs = async () => {
      try {
        let jobSeekerId = localStorage.getItem("jobSeekerId");
       // console.log('Initial jobSeekerId from localStorage:', jobSeekerId);

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
              //console.error("Error fetching user data:", err);
              throw new Error("Unable to fetch user data. Please try logging in again.");
            }
          }
        }

        if (!jobSeekerId) {
          throw new Error("Unable to fetch your assigned jobs. Please try logging out and back in.");
        }

        // Go back to the original API call that was working
       // console.log('Fetching applied jobs for jobSeekerId:', jobSeekerId);
        const response = await getAssignedJobs(jobSeekerId);
        //console.log('API Response:', response);

        if (!response?.data?.data) {
          throw new Error("Invalid response format from server");
        }

        const jobsData = response.data.data;
        //console.log('All applied jobs data:', jobsData);
        
        // Filter for jobs with isAssignable = true (for Accept/Decline buttons)
        const assignableJobs = Array.isArray(jobsData)
          ? jobsData.filter(job => job.isAssignable === true)
          : [];
        //console.log('Filtered assignable jobs:', assignableJobs);
        
        // Now also make a separate call to get jobs with status="assigned" (for Book On button)
       // console.log('Fetching jobs with status "assigned" (for Book On button)');
        const assignedResponse = await axios.get(`${BASEURL}/apply/${jobSeekerId}`, {
          params: { status: "assigned" }
        });
        //console.log('Assigned jobs API Response:', assignedResponse);
        
        const assignedJobsData = assignedResponse?.data?.data || [];
        const bookOnJobs = Array.isArray(assignedJobsData)
          ? assignedJobsData.filter(job => job.status === "assigned")
          : [];
       // console.log('Jobs with Book On button:', bookOnJobs);
        
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
   // console.log("Accepting job application with ID:", applicationId);
    try {
      setLoading(true);
      
      // Find the application in our already loaded data
      const application = assignableJobs.find(app => app._id === applicationId);
      
      if (!application) {
        console.error("Could not find application in loaded data");
        throw new Error("Application data not found");
      }
      
      //console.log("Found application in local data:", application);
      
      // Extract the job ID from our cached data
      let jobId;
      if (application.jobId?._id) {
        jobId = application.jobId._id;
      } else if (typeof application.jobId === 'string') {
        jobId = application.jobId;
      } else {
        //console.error("Could not extract job ID from application:", application);
        throw new Error("Could not find job ID in application data");
      }
      
      //console.log(`Using jobId ${jobId} from application data`);
      
      // Get jobSeekerId from localStorage
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      if (!jobSeekerId) {
        throw new Error("User not logged in or jobSeekerId not found");
      }
      
      try {
        // Use your existing updateJobStatus API function
        const response = await updateJobStatus(jobId, { 
          status: "assigned", 
          isAssigned: true 
        });
        
        //console.log("Job assignment response:", response.data);
        
        // If the request was successful
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 201)) {
          // Start the popup sequence immediately without asking for location
          setShowButton1(true);
          
          // Refresh the jobs list
          await refreshJobsList(jobSeekerId);
        } else if (response.data && response.data.statusCode === 409) {
          // Direct response with 409 status code
          //console.log("Job is already assigned (409 from direct response)");
          setErrorMessage("This job has already been assigned to another job seeker.");
          setShowAlreadyAssignedPopup(true);
          
          // Remove this job from the list
          setAssignableJobs(prev => prev.filter(job => job._id !== applicationId));
        }
      } catch (error) {
        //console.error("API error:", error);
        
        // Check if this is a 409 Conflict error (job already assigned)
        if (error.response && error.response.status === 409) {
          // Error response with 409 status
          //console.log("Job is already assigned (409 from error response)");
          setErrorMessage(error.response.data?.message || "This job has already been assigned to another job seeker.");
          setShowAlreadyAssignedPopup(true);
          
          // Remove this job from the list
          setAssignableJobs(prev => prev.filter(job => job._id !== applicationId));
        } else if (error.response && error.response.data && error.response.data.message) {
          // Show the specific error message from the API
          setErrorMessage(error.response.data.message);
          setShowAlreadyAssignedPopup(true);
        } else if (error.message && error.message.includes("409")) {
          // Fallback for when status code might be in the error message
          //console.log("Job is already assigned (409 in error message)");
          setErrorMessage("This job has already been assigned to another job seeker.");
          setShowAlreadyAssignedPopup(true);
          
          // Remove this job from the list
          setAssignableJobs(prev => prev.filter(job => job._id !== applicationId));
        } else if (error.message && error.message.includes("already assigned")) {
          // Fallback for when error message contains "already assigned"
          //console.log("Job is already assigned (from error message text)");
          setErrorMessage(error.message);
          setShowAlreadyAssignedPopup(true);
          
          // Remove this job from the list
          setAssignableJobs(prev => prev.filter(job => job._id !== applicationId));
        } else {
          // Generic error message
          setErrorMessage("Failed to assign job. Please try again later.");
          setShowAlreadyAssignedPopup(true);
        }
      }
    } catch (error) {
      console.error("Error in handleAccept:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setShowAlreadyAssignedPopup(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to refresh jobs list
  const refreshJobsList = async (jobSeekerId) => {
    try {
      // Get jobs with status "applied" and isAssignable=true
      const appliedResponse = await getAssignedJobs(jobSeekerId);
      
      // Get jobs with status "assigned"
      const assignedResponse = await getJobsByStatus(jobSeekerId, { status: "assigned" });
      
      if (appliedResponse.data?.data && assignedResponse.data?.data) {
        const appliedJobs = Array.isArray(appliedResponse.data.data) ? 
          appliedResponse.data.data.filter(job => job.isAssignable === true) : [];
          
        const assignedJobs = Array.isArray(assignedResponse.data.data) ?
          assignedResponse.data.data : [];
        
        // Combine jobs, put assigned jobs first
        const combinedJobs = [
          ...assignedJobs,
          ...appliedJobs.filter(job => job.status !== "assigned")
        ];
        
        setAssignableJobs(combinedJobs);
      }
    } catch (error) {
      console.error("Error refreshing jobs list:", error);
    }
  };

  const handleDecline = (jobId) => {
    console.log("Declining job:", jobId);
    // Add logic to decline the job
  };

  const handleBookOn = (applicationId) => {
    console.log("Booking on for application ID:", applicationId);
    // Find the application object
    const application = assignableJobs.find(app => app._id === applicationId);
    
    if (application) {
      // Get the job ID
      let jobId;
      if (application.jobId?._id) {
        jobId = application.jobId._id;
      } else if (typeof application.jobId === 'string') {
        jobId = application.jobId;
      }
      
      if (jobId) {
        // Store it in state and localStorage for persistence
        setSelectedJobId(jobId);
        localStorage.setItem("selectedJobId", jobId);
        console.log(`Setting selected job ID: ${jobId}`);
      }
    }
    
    setSelectedApplicationId(applicationId);
    setShowButton4(true);
  };

  const confirmBookJob = async () => {
    if (!selectedApplicationId) return;
    
    try {
      setLoading(true);
      
      // Find the application in our already loaded data
      const application = assignableJobs.find(app => app._id === selectedApplicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      
      // Extract the job ID
      let jobId;
      if (application.jobId?._id) {
        jobId = application.jobId._id;
      } else if (typeof application.jobId === 'string') {
        jobId = application.jobId;
      } else {
        throw new Error("Could not find job ID in application data");
      }
      
      console.log(`Book On: Using jobId ${jobId}`);
      setSelectedJobId(jobId);
      localStorage.setItem("selectedJobId", jobId);
      
      // Get jobSeekerId from localStorage
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      if (!jobSeekerId) {
        throw new Error("User not logged in or jobSeekerId not found");
      }
      
      // Request location permission before continuing
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Successfully got location, update it
              const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              
              // Update location first
              await updateLocation(jobId, locationData);
              
              // Now show the QR code scanner popup instead of using mock data
              setShowButton5(true);
              
              // Refresh the job list
              await refreshJobsList(jobSeekerId);
            } catch (error) {
              console.error("Error during Book On process:", error);
              
              // Show QR scanner popup anyway for better UX
              setShowButton5(true);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            
            // Show QR scanner popup even if location access failed
            setShowButton5(true);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser");
        
        // Show QR scanner popup anyway
        setShowButton5(true);
      }
    } catch (error) {
      console.error("Error in confirmBookJob:", error);
      setError(error.message || "Failed to book job. Please try again.");
      setTimeout(() => setError(null), 5000);
      
      // Show QR scanner popup anyway for better UX
      setShowButton5(true);
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

          {/* Error Message with Red Boundary */}
          {error && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center mb-4 border-2 border-red-500">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Job List */}
          <div className="">
            {assignableJobs.length > 0 ? (
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
          jobId={selectedJobId} // Pass the selected job ID
        />
      )}
      
      {showButton6 && (
        <PopupButton6
          onClose={() => {
            setShowButton6(false);
          }}
        />
      )}

      {showAlreadyAssignedPopup && (
        <AlreadyAssignedPopup
          message={errorMessage}
          onClose={() => setShowAlreadyAssignedPopup(false)}
        />
      )}
    </div>
  );
}