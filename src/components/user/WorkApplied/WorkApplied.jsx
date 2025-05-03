import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';
import HeaderWork from "../HeaderWork";
import { getAppliedJobs } from "../../../api/jobApplicationApi";
import { AppContext } from "../../../context/AppContext";
import { ThemeContext } from "../../../context/ThemeContext";
import LazyImage from "../../common/LazyImage";
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

const formatLocation = (job) => {
  if (job.companyId?.address) {
    return job.companyId.address;
  }
  if (job.latitude && job.longitude) {
    // Return a more readable format or fetch reverse geocoding if needed
    return `${job.latitude.toFixed(2)}, ${job.longitude.toFixed(2)}`;
  }
  return "Location not specified";
};

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const LocationMap = ({ job }) => {
  if (!job?.latitude || !job?.longitude) return null;
  
  return (
    <div className="w-full h-[200px] rounded-lg overflow-hidden mt-2">
      <MapContainer 
        center={[job.latitude, job.longitude]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[job.latitude, job.longitude]}>
          <Popup>
            {job.jobTitle}<br/>
            {formatLocation(job)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

LocationMap.propTypes = {
  job: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    jobTitle: PropTypes.string
  }).isRequired
};

const WorkApplied = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { BASEURL } = useContext(AppContext);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
          throw new Error("Unable to fetch your applied jobs. Please try logging out and back in.");
        }

        console.log('Fetching applied jobs for jobSeekerId:', jobSeekerId);
        
        // Force fresh data by clearing the cache before getting applied jobs
        // This is handled by our enhanced applyForJob function when applying for jobs,
        // but we also do it here to ensure fresh data when directly navigating to this page
        try {
          // Import and use clearCache from apiCache
          const { clearCache } = await import('../../../services/apiCache');
          clearCache(`applied-jobs-${jobSeekerId}`);
        } catch (cacheError) {
          console.error('Error clearing cache:', cacheError);
          // Continue even if cache clearing fails
        }
        
        // Get jobs with "applied" status
        const response = await getAppliedJobs(jobSeekerId);
        console.log('API Response:', response);

        // Check if the response has the correct structure
        if (response && response.data) {
          const jobsData = response.data;
          console.log('Jobs data:', jobsData);
          setAppliedJobs(Array.isArray(jobsData) ? jobsData : []);
        } else {
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        setError(err.message || "Failed to load applied jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [BASEURL]);

  const handleNavigate = (jobId) => {
    navigate(`/User-AppliedAndAssignedDetail/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
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
      <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col flex-1">
          <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
            <HeaderWork />
            <div className="text-center text-red-500 py-4">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col flex-1">
        <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
          <HeaderWork />
          <div className="">
            {appliedJobs.length === 0 ? (
              <div className="text-center py-4 text-gray-700 dark:text-gray-300">No applied jobs found</div>
            ) : (
              appliedJobs.map((application, index) => {
                const job = application.jobId || {};
                return (
                  <div key={application._id || `job-${index}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 mb-4">
                      <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                        <div className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <LazyImage
                            src={job.companyId?.companyLogo || companyImage}
                            alt={job.jobTitle || "Company"}
                            className="w-full h-full object-cover"
                            fallbackSrc={companyImage}
                            placeholderColor="#f3f4f6"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200">{job.jobTitle || "No Title Available"}</h3>
                          <div 
                            className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-wrap cursor-pointer hover:text-orange-500 dark:hover:text-orange-400"
                            onClick={() => setSelectedJob(selectedJob === job._id ? null : job._id)}
                          >
                            <span>{formatLocation(job)}</span>
                            <span className="mx-2 hidden sm:inline">•</span>
                            <span>£{job.pricePerHour || "Rate not specified"} per hour</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-col lg:flex-row items-start md:items-center justify-between col-span-1 sm:col-span-1 md:col-span-1 space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="text-sm font-medium text-gray-400 dark:text-gray-500">
                          {job.workDate ? new Date(job.workDate).toLocaleDateString() : "Date not available"}
                        </div>
                        <div className="flex items-center text-green-500">
                          <CheckIcon />
                          <span className="ml-1 text-sm font-medium">
                            {application.status || "Applied"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <BookmarkIcon />
                        </button>
                        <button
                          onClick={() => handleNavigate(job._id)}
                          className="bg-orange-500 font-semibold text-white w-full sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-orange-400"
                        >
                          Applied
                        </button>
                      </div>
                    </div>
                    {selectedJob === job._id && <LocationMap job={job} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkApplied;