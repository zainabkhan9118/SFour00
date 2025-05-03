import { useState, useEffect } from "react";
import HeaderWork from "../HeaderWork";
import PopupModelJobCompleted from '../popupModel/popupModel-Inprogress/PopupModelJobCompleted';
import companyImage from '../../../assets/images/company.png';
import { getCompletedJobs } from '../../../api/jobApplicationApi';
import LazyImage from "../../common/LazyImage";
import LoadingSpinner from "../../common/LoadingSpinner";

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

const UserCompleted = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const jobSeekerId = localStorage.getItem('jobSeekerId');
        if (!jobSeekerId) {
          throw new Error("Unable to fetch your completed jobs. Please try logging out and back in.");
        }

        const response = await getCompletedJobs(jobSeekerId);
        console.log('Completed jobs API response:', response);
        
        // Fix error handling to accommodate the actual response format
        if (response && response.data) {
          const jobsData = response.data;
          console.log('Completed jobs data:', jobsData);
          setCompletedJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching completed jobs:", err);
        setError(err.message || "Failed to load completed jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">

        <div className="flex flex-col flex-1">

          <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
            <HeaderWork />
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen">

        <div className="flex flex-col flex-1">

          <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
            <HeaderWork />
            <div className="text-center py-4 text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      <div className="flex flex-col flex-1">

        <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
          <HeaderWork />
          <div className="">
            {completedJobs.length === 0 ? (
              <div className="text-center py-4">No completed jobs found</div>
            ) : (
              completedJobs.map((application, index) => {
                const job = application.jobId || {};
                return (
                  <div
                    key={application._id || `job-${index}`}
                    className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white mb-4"
                  >
                    <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                      <LazyImage
                        src={job.companyId?.companyLogo || companyImage}
                        alt={job.jobTitle || "Company"}
                        className="w-12 h-12 rounded-full border border-gray-300"
                        fallbackSrc={companyImage}
                        placeholderColor="#f3f4f6"
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
                        <span className="ml-1 text-sm font-medium">Completed</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <BookmarkIcon />
                      </button>
                      <button
                        onClick={() => setShowPopup(true)}
                        className="bg-[#FD7F00] text-white font-semibold w-full sm:w-[110px] h-[40px] text-sm rounded-full"
                      >
                        Completed
                      </button>

                      {showPopup && (
                        <PopupModelJobCompleted onClose={() => setShowPopup(false)} />
                      )}
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

export default UserCompleted
