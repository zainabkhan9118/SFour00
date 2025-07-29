import React, { useState, useEffect, useContext } from "react";
import CompanySideBar from "./CompanySideBar";
import { ThemeContext } from "../../../context/ThemeContext";
import { getRotaManagementByCompany } from "../../../api/rotaManagementApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import { FaSearch, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

const FindWorker = () => {
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    date: '',
    startTime: '',
    endTime: '',
    searchQuery: ''
  });
  
  // State for available workers
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // State for selected worker modal
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all workers on component mount
  useEffect(() => {
    const fetchAllWorkers = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem('companyId');
        
        if (!companyId) {
          throw new Error('Company ID not found. Please complete your company profile first.');
        }

        const response = await getRotaManagementByCompany(companyId);
        
        if (response && response.data) {
          // Extract unique workers with their details from the API response
          const workersMap = new Map();
          response.data
            .filter(rota => rota.jobSeeker_id && rota.jobSeeker_id.fullname)
            .forEach(rota => {
              const jobSeeker = rota.jobSeeker_id;
              if (!workersMap.has(jobSeeker.fullname)) {
                workersMap.set(jobSeeker.fullname, {
                  id: jobSeeker._id,
                  name: jobSeeker.fullname,
                  utrNumber: jobSeeker.utrNumber,
                  niNumber: jobSeeker.NINumber,
                  shortBio: jobSeeker.shortBio,
                  profilePic: jobSeeker.profilePic,
                  email: jobSeeker.email,
                  phone: jobSeeker.phone,
                  address: jobSeeker.address,
                  assignedJobs: jobSeeker.assignedJobs || [],
                  totalAssignedJobs: jobSeeker.assignedJobs ? jobSeeker.assignedJobs.length : 0,
                  rotaData: rota
                });
              }
            });
          
          const uniqueWorkers = Array.from(workersMap.values());
          setAllWorkers(uniqueWorkers);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching workers data:', err);
        setError(err.message || 'Failed to fetch workers data');
        setAllWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllWorkers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if a worker is available at the specified date and time
  const isWorkerAvailable = (worker, searchDate, startTime, endTime) => {
    if (!worker.assignedJobs || worker.assignedJobs.length === 0) {
      return true; // Worker has no jobs, so is available
    }

    const searchDateTime = new Date(searchDate);
    const searchStart = new Date(`${searchDate}T${startTime}:00`);
    const searchEnd = new Date(`${searchDate}T${endTime}:00`);

    // Check if worker has any conflicting jobs
    const hasConflict = worker.assignedJobs.some(job => {
      if (!job.workDate) return false;

      const jobDate = new Date(job.workDate);
      
      // Check if the job is on the same date
      if (jobDate.toDateString() !== searchDateTime.toDateString()) {
        return false;
      }

      // If job has specific times, check for overlap
      if (job.startTime && job.endTime) {
        const jobStart = new Date(`${searchDate}T${job.startTime}:00`);
        const jobEnd = new Date(`${searchDate}T${job.endTime}:00`);
        
        // Check for time overlap
        return (searchStart < jobEnd && searchEnd > jobStart);
      }

      // If job doesn't have specific times, assume it conflicts for the whole day
      return true;
    });

    return !hasConflict;
  };

  // Handle search for available workers
  const handleSearch = () => {
    if (!searchParams.date || !searchParams.startTime || !searchParams.endTime) {
      setError('Please fill in all required fields (Date, Start Time, End Time)');
      return;
    }

    if (searchParams.startTime >= searchParams.endTime) {
      setError('End time must be after start time');
      return;
    }

    setError(null);
    setLoading(true);
    setSearched(true);

    try {
      let filteredWorkers = allWorkers.filter(worker => 
        isWorkerAvailable(worker, searchParams.date, searchParams.startTime, searchParams.endTime)
      );

      // Apply search query filter if provided
      if (searchParams.searchQuery.trim()) {
        const query = searchParams.searchQuery.toLowerCase();
        filteredWorkers = filteredWorkers.filter(worker =>
          worker.name.toLowerCase().includes(query) ||
          (worker.shortBio && worker.shortBio.toLowerCase().includes(query)) ||
          (worker.email && worker.email.toLowerCase().includes(query)) ||
          (worker.utrNumber && worker.utrNumber.toLowerCase().includes(query))
        );
      }

      setAvailableWorkers(filteredWorkers);
    } catch (err) {
      setError('Error searching for available workers');
    } finally {
      setLoading(false);
    }
  };

  // Open worker details modal
  const openWorkerModal = (worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  // Close worker details modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWorker(null);
  };

  // Reset search
  const resetSearch = () => {
    setSearchParams({
      date: '',
      startTime: '',
      endTime: '',
      searchQuery: ''
    });
    setAvailableWorkers([]);
    setSearched(false);
    setError(null);
  };

  // Get current date for min date validation
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Worker Details Modal Component
  const WorkerDetailsModal = () => {
    if (!isModalOpen || !selectedWorker) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Worker Details - {selectedWorker.name}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Worker Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                👤 Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedWorker.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bio</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.shortBio || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">UTR Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.utrNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">NI Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.niNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.phone || 'N/A'}
                  </p>
                </div>
                {selectedWorker.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedWorker.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Job History */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                💼 Job History & Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Assigned Jobs</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedWorker.totalAssignedJobs}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Availability Status</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    Available for selected time
                  </span>
                </div>
              </div>
              
              {selectedWorker.assignedJobs && selectedWorker.assignedJobs.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recent Jobs</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedWorker.assignedJobs.slice(0, 3).map((job, index) => (
                      <div key={index} className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        <div className="font-medium">{job.jobTitle || 'Untitled Job'}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {job.workDate ? new Date(job.workDate).toLocaleDateString() : 'Date not specified'}
                          {job.startTime && job.endTime && ` • ${job.startTime} - ${job.endTime}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Context */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">
                📅 Availability for Requested Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(searchParams.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">{searchParams.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">End Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">{searchParams.endTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              onClick={() => {
                // TODO: Implement job assignment functionality
                console.log('Assign job to worker:', selectedWorker.name);
                closeModal();
              }}
            >
              Assign Job
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm">
          <CompanySideBar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <CompanySideBar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          <div className="max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Find Available Workers
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Search for workers available at specific dates and times
                </p>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            {/* Search Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                🔍 Search Parameters
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-orange-500" />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleInputChange}
                    min={getCurrentDate()}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Start Time Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaClock className="inline mr-2 text-orange-500" />
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={searchParams.startTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* End Time Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaClock className="inline mr-2 text-orange-500" />
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={searchParams.endTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Search Query Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaSearch className="inline mr-2 text-orange-500" />
                    Search Worker (Optional)
                  </label>
                  <input
                    type="text"
                    name="searchQuery"
                    value={searchParams.searchQuery}
                    onChange={handleInputChange}
                    placeholder="Name, bio, email, UTR..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <FaSearch className="mr-2" />
                      Search Available Workers
                    </>
                  )}
                </button>
                
                {searched && (
                  <button
                    onClick={resetSearch}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Reset Search
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {searched && !loading && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Results Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Available Workers
                    </h2>
                    <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                      {availableWorkers.length} workers found
                    </span>
                  </div>
                  {searchParams.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Available on {new Date(searchParams.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} from {searchParams.startTime} to {searchParams.endTime}
                    </p>
                  )}
                </div>

                {/* Results Content */}
                <div className="p-6">
                  {availableWorkers.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-500">
                        <FaUser className="mx-auto text-4xl mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Available Workers Found</h3>
                        <p className="text-sm">
                          {allWorkers.length === 0 
                            ? "No workers are registered in your rota system yet."
                            : "All workers have conflicting schedules for the selected time period."
                          }
                        </p>
                        {allWorkers.length > 0 && (
                          <p className="text-xs mt-2">
                            Try searching for a different date or time slot.
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableWorkers.map((worker, index) => (
                        <div
                          key={worker.id || index}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-600"
                          onClick={() => openWorkerModal(worker)}
                        >
                          {/* Worker Info */}
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {worker.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {worker.name}
                              </h3>
                              {worker.shortBio && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {worker.shortBio}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Worker Details */}
                          <div className="mt-4 space-y-2">
                            {worker.email && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FaEnvelope className="mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{worker.email}</span>
                              </div>
                            )}
                            {worker.phone && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FaPhone className="mr-2 text-orange-500 flex-shrink-0" />
                                <span>{worker.phone}</span>
                              </div>
                            )}
                            {worker.utrNumber && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <FaBriefcase className="mr-2 text-orange-500 flex-shrink-0" />
                                <span>UTR: {worker.utrNumber}</span>
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                Total Jobs: {worker.totalAssignedJobs}
                              </span>
                              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                                Available
                              </span>
                            </div>
                          </div>

                          {/* Click indicator */}
                          <div className="mt-3 text-center">
                            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                              Click to view details & assign job →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Initial state - show total workers count */}
            {!searched && !loading && allWorkers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center">
                  <FaUser className="mx-auto text-4xl text-orange-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Ready to Find Available Workers
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have {allWorkers.length} workers registered in your rota system.
                    <br />
                    Use the search form above to find who's available for specific dates and times.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Worker Details Modal */}
      <WorkerDetailsModal />
    </div>
  );
};

export default FindWorker;
