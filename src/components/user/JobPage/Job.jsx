import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Search, MapPin, Home, User, Briefcase, MessageSquare, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAllJobs } from "../../../api/jobsApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import LazyImage from "../../common/LazyImage";
import { ThemeContext } from "../../../context/ThemeContext";
import { AppContext } from "../../../context/AppContext";


const Job = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
    const { profileName } = useContext(AppContext);
  
  
  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchAllJobs(currentPage, jobsPerPage);
        
        if (response && response.statusCode === 200) {
          setJobs(response.data);
          // Check if there are more jobs after current batch
          setHasNextPage(response.hasMore);
          console.log('Current page:', currentPage, 'Jobs:', response.data.length);
        } else {
          setError("No jobs data found");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, [currentPage, jobsPerPage]);
  
  const toggleBookmark = (id) => {
    setJobs(jobs.map(job => 
      job._id === id ? {...job, bookMarked: !job.bookMarked} : job
    ));
  };
  
  // Remove client-side pagination calculations
  const filteredJobs = jobs;

  // Change page
  const paginate = async (pageNumber) => {
    if (pageNumber >= 1) { // Remove upper limit check since we use hasNextPage
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    console.log("Searching for:", searchTerm, "in", locationTerm);
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle jobs per page selection
  const handleJobsPerPageChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    setJobsPerPage(selectedValue);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="flex-1 py-2 px-3 md:px-5 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-orange-500 p-4 md:p-6 text-white rounded-xl">
            <h1 className="text-xl md:text-2xl mt-4 md:mt-8">Hello {` `}
               {profileName || 'User'}, Good Day 👋</h1>
            <h2 className="text-2xl md:text-3xl font-bold mt-1">Search & Land on your dream job</h2>

            {/* Search Bar - Responsive layout */}
            <div className="mt-4 md:mt-8 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Search Job"
                  className="w-full p-3 rounded-[50px] border focus:ring focus:ring-yellow-400 text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 rounded-[50px] border focus:ring focus:ring-yellow-400 text-black dark:bg-gray-800 dark:text-white dark:border-gray-600 pl-10"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button 
                className="w-full md:w-auto bg-yellow-500 rounded-[50px] text-white px-6 py-3 font-semibold shadow-md hover:bg-yellow-600 transition-colors"
                onClick={handleSearch}
              >
                SEARCH JOB
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl md:text-[32px] font-semibold dark:text-white">Recommendation</h3>
              <a href="#" className="text-orange-500 text-sm md:text-base font-semibold hover:underline">
                See all
              </a>
            </div>

            {/* Jobs Per Page Selection */}
            <div className="mb-4 flex items-center space-x-4">
              <label htmlFor="jobsPerPage" className="text-gray-700 dark:text-gray-300">Show:</label>
              <select
                id="jobsPerPage"
                value={jobsPerPage}
                onChange={handleJobsPerPageChange}
                className="p-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p>{error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-lg shadow-sm transition-colors duration-200">
                  {filteredJobs.map((job) => (
                    <div 
                      key={job._id} 
                      className="flex flex-col md:flex-row md:items-center p-3 md:p-4 border-b dark:border-gray-700 last:border-none space-y-3 md:space-y-0"
                    >
                      {/* Job Info - 30% width on desktop */}
                      <div className="flex items-center space-x-3 md:space-x-4 md:w-[30%]">
                        <LazyImage 
                          src={(job.companyId && job.companyId.companyLogo) || "https://cdn-icons-png.flaticon.com/512/732/732007.png"} 
                          alt={job.jobTitle} 
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full border dark:border-gray-600 object-cover"
                          fallbackSrc="https://cdn-icons-png.flaticon.com/512/732/732007.png"
                          placeholderColor="#f3f4f6"
                        />
                        <div>
                          <h4 className="font-semibold dark:text-white">{job.jobTitle}</h4>
                          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            {(job.companyId && job.companyId.address) || 'Remote'} • ${job.pricePerHour}/hr
                          </p>
                        </div>
                      </div>
                      
                      {/* Date - 15% width on desktop */}
                      <div className="hidden md:block md:w-[15%]">
                        <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                          {formatDate(job.createdAt)}
                        </p>
                      </div>
                      
                      {/* Status and Bookmark - 25% width on desktop */}
                      <div className="flex items-center md:w-[25%] justify-between md:justify-around">
                        <span className={`text-xs md:text-sm font-medium ${
                          job.jobStatus === 'open' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          ✔ {job.jobStatus.charAt(0).toUpperCase() + job.jobStatus.slice(1)}
                        </span>
                        <button 
                          onClick={() => toggleBookmark(job._id)}
                          className="focus:outline-none"
                          aria-label={job.bookMarked ? "Remove bookmark" : "Add bookmark"}
                        >
                          <Bookmark 
                            className={`w-4 h-4 md:w-5 md:h-5 ${job.bookMarked ? 'fill-orange-500 text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}
                          />
                        </button>
                      </div>
                      
                      {/* View Details Button - 30% width on desktop */}
                      <div className="md:w-[30%] flex justify-end">
                        <button 
                          onClick={() => navigate(`/user-JobDetails/${job._id}`)} 
                          onMouseEnter={() => setHoveredButton(job._id)}
                          onMouseLeave={() => setHoveredButton(null)}
                          className={`w-full md:w-auto ${
                            hoveredButton === job._id 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                          } px-4 py-2 md:px-6 md:py-3 rounded-[50px] text-sm md:text-base shadow-sm transition-colors duration-200 hover:bg-orange-500 hover:text-white hover:border-orange-500`}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {jobs.length > 0 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    {currentPage > 1 && (
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    
                    <span className="px-4 py-2">
                      Page <span className="inline-flex justify-center w-8 h-8 text-white bg-orange-500">{currentPage}</span>
                    </span>

                    {hasNextPage && (
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Job;