import React, { useState, useEffect } from "react";
import CompanySideBar from "./CompanySideBar";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { getRotaManagementByCompany } from "../../../api/rotaManagementApi";
import LoadingSpinner from "../../common/LoadingSpinner";

// No fallback data - we'll only show real data from API

// Helper function to generate week dates based on week offset
const getWeekDates = (weekOffset = 0) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1 + (weekOffset * 7)); // Get Monday of target week
  
  const weekDates = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  for (let i = 0; i < 7; i++) { // Monday to Sunday
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push({
      fullName: `${dayNames[i]} ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`,
      dayName: dayNames[i],
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: new Date(date), // Create new date object to avoid reference issues
      dateString: date.toISOString().split('T')[0] // YYYY-MM-DD format for comparison
    });
  }
  
  return weekDates;
};

// Helper function to get the day name from a date
const getDayNameFromDate = (date) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[new Date(date).getDay()];
};

// Helper function to generate current week dates (for backward compatibility)
const getCurrentWeekDates = () => {
  return getWeekDates(0);
};

// Helper function to get worker-specific shifts
const getWorkerShifts = (dailySchedule, selectedWorker) => {
  if (!selectedWorker) return dailySchedule;
  
  const filteredSchedule = {};
  Object.keys(dailySchedule).forEach(day => {
    filteredSchedule[day] = dailySchedule[day].filter(shift => 
      shift.worker === (typeof selectedWorker === 'string' ? selectedWorker : selectedWorker.name)
    );
  });
  
  return filteredSchedule;
};

const RotaManagement = () => {
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // State for API data
  const [rotaData, setRotaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Extracted workers and shifts from API data
  const [workers, setWorkers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [dailySchedule, setDailySchedule] = useState({});
  
  // Workers panel toggle state
  const [isWorkersOpen, setIsWorkersOpen] = useState(true);
  
  // Selected worker state
  const [selectedWorker, setSelectedWorker] = useState(null);
  
  // Week navigation state
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  
  // Dynamic week dates
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  
  // Modal state for job details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  // Update week dates when week offset changes
  useEffect(() => {
    setWeekDates(getWeekDates(currentWeekOffset));
  }, [currentWeekOffset]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation functions
  const navigateWeek = (direction) => {
    setCurrentWeekOffset(prev => prev + direction);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    // Don't reset selectedWorker - keep the first worker selected
  };

  const getWeekTitle = () => {
    if (currentWeekOffset === 0) return 'This Week';
    if (currentWeekOffset === 1) return 'Next Week';
    if (currentWeekOffset === -1) return 'Last Week';
    if (currentWeekOffset > 1) return `${currentWeekOffset} Weeks Ahead`;
    return `${Math.abs(currentWeekOffset)} Weeks Ago`;
  };

  // Fetch rota management data
  useEffect(() => {
    const fetchRotaData = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem('companyId');
        
        if (!companyId) {
          throw new Error('Company ID not found. Please complete your company profile first.');
        }

        const response = await getRotaManagementByCompany(companyId);
        
        if (response && response.data) {
          setRotaData(response.data);
          console.log('Fetched rota data:', response.data);
          
          // Extract unique workers with their details from the API response
          const workersMap = new Map();
          response.data
            .filter(rota => rota.jobSeeker_id && rota.jobSeeker_id.fullname)
            .forEach(rota => {
              const jobSeeker = rota.jobSeeker_id;
              if (!workersMap.has(jobSeeker.fullname)) {
                workersMap.set(jobSeeker.fullname, {
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
                  weeklyShifts: 0
                });
              }
            });
          
          const uniqueWorkers = Array.from(workersMap.values());
          console.log('Extracted workers with details:', uniqueWorkers);
          
          // Always set workers from API data - no fallback
          setWorkers(uniqueWorkers);
          
          // Automatically select the first worker if workers exist and no worker is currently selected
          if (uniqueWorkers.length > 0 && !selectedWorker) {
            setSelectedWorker(uniqueWorkers[0].name);
          }
          
          // Create dynamic shifts based on API data
          const dynamicShifts = [];
          const dailyScheduleData = {};
          
          // Initialize daily schedule for all 7 days
          weekDates.forEach(day => {
            dailyScheduleData[day.dayName] = [];
          });
          
          // Process each rota record and their assigned jobs
          response.data.forEach((rota) => {
            if (rota.jobSeeker_id && rota.jobSeeker_id.fullname && rota.jobSeeker_id.assignedJobs) {
              const jobSeeker = rota.jobSeeker_id;
              
              // Process each assigned job
              jobSeeker.assignedJobs.forEach((job) => {
                if (job.workDate) {
                  const workDate = new Date(job.workDate);
                  const dayName = getDayNameFromDate(workDate);
                  
                  // Find the day in our current week
                  const dayIndex = weekDates.findIndex(day => day.dayName === dayName);
                  
                  if (dayIndex !== -1) {
                    const selectedDay = weekDates[dayIndex];
                    
                    const shiftData = {
                      id: `${rota._id}-${job._id}`,
                      worker: jobSeeker.fullname,
                      workerDetails: jobSeeker,
                      day: selectedDay.fullName,
                      dayName: selectedDay.dayName,
                      time: `${job.startTime || '09:00'} - ${job.endTime || '17:00'}`,
                      jobTitle: job.jobTitle,
                      role: job.jobTitle || jobSeeker.shortBio || 'Worker',
                      company: rota.company_id || 'Current Company',
                      jobId: job._id,
                      jobData: job,
                      rotaData: rota,
                      utrNumber: jobSeeker.utrNumber,
                      niNumber: jobSeeker.NINumber,
                      profilePic: jobSeeker.profilePic,
                      pricePerHour: job.pricePerHour,
                      jobDescription: job.jobDescription,
                      assignedJobs: jobSeeker.assignedJobs || [],
                      totalAssignedJobs: jobSeeker.assignedJobs ? jobSeeker.assignedJobs.length : 0,
                      workDate: job.workDate
                    };

                    // Add to daily schedule
                    dailyScheduleData[selectedDay.dayName].push(shiftData);
                    
                    // Add to shifts array
                    dynamicShifts.push(shiftData);
                    
                    // Update worker's weekly shift count
                    const workerInMap = workersMap.get(jobSeeker.fullname);
                    if (workerInMap) {
                      workerInMap.weeklyShifts += 1;
                    }
                  }
                }
              });
            }
          });
          
          setDailySchedule(dailyScheduleData);
          
          // Set shifts from API data only
          setShifts(dynamicShifts);
        } else {
          // No data from API - set empty arrays
          setWorkers([]);
          setShifts([]);
          setDailySchedule({});
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching rota data:', err);
        setError(err.message || 'Failed to fetch rota management data');
        // Set empty arrays on error - no fallback dummy data
        setWorkers([]);
        setShifts([]);
        setDailySchedule({});
      } finally {
        setLoading(false);
      }
    };

    fetchRotaData();
  }, [weekDates]); // Re-fetch when week changes

  // Function to open modal with job details
  const openJobDetailsModal = (shift) => {
    setSelectedJobDetails(shift);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobDetails(null);
  };

  // Modal component for job details
  const JobDetailsModal = () => {
    if (!isModalOpen || !selectedJobDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Job Details - {selectedJobDetails.worker}
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
                👤 Worker Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedJobDetails.worker}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bio</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.workerDetails?.shortBio || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">UTR Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.utrNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">NI Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.niNumber || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Job Information */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                💼 Current Job Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job Title</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.jobData?.jobTitle || selectedJobDetails.role}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price per Hour</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    £{selectedJobDetails.pricePerHour || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Work Date & Time</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.day} - {selectedJobDetails.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job Duration</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.jobData?.jobDuration || 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job Description</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.jobDescription || 'No description available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Location & Checkpoints */}
            {selectedJobDetails.jobData && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
                  📍 Location & Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Latitude</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedJobDetails.jobData.latitude || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Longitude</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedJobDetails.jobData.longitude || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedJobDetails.jobData.alertDuration || 'N/A'} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Job Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedJobDetails.jobData.jobStatus === 'open' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {selectedJobDetails.jobData.jobStatus || 'N/A'}
                    </span>
                  </div>
                  {selectedJobDetails.jobData.checkpoints && selectedJobDetails.jobData.checkpoints.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Checkpoints</p>
                      <div className="space-y-1">
                        {selectedJobDetails.jobData.checkpoints.map((checkpoint, index) => (
                          <div key={index} className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                            📍 {checkpoint.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
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
                  Rota Management
                  {selectedWorker && (
                    <span className="text-lg font-medium text-blue-600 dark:text-blue-400 ml-2">
                      - {typeof selectedWorker === 'string' ? selectedWorker : selectedWorker.name}
                    </span>
                  )}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2 sm:mt-0">
                {/* Week Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateWeek(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Previous Week"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {getWeekTitle()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {weekDates[0]?.fullDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {weekDates[6]?.fullDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigateWeek(1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Next Week"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {currentWeekOffset !== 0 && (
                    <button
                      onClick={goToCurrentWeek}
                      className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      Current Week
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setCurrentWeekOffset(0); // Reset to current week
                      setSelectedWorker(workers.length > 0 ? workers[0].name : null);
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            
            
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Workers Section - Collapsible */}
                <div className={`transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
                  isWorkersOpen ? 'w-full lg:w-48' : 'w-full lg:w-10'
                }`}>
                  {/* Workers Header with Toggle */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                    <span className={`text-yellow-500 dark:text-yellow-400 text-sm font-medium transition-opacity duration-300 ${
                      isWorkersOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'
                    }`}>
                      👥 Workers ({workers.length})
                    </span>
                    <button
                      onClick={() => setIsWorkersOpen(!isWorkersOpen)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title={isWorkersOpen ? "Collapse workers panel" : "Expand workers panel"}
                    >
                      <svg 
                        className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${
                          isWorkersOpen ? 'rotate-180' : 'rotate-0'
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Collapsible Workers List */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isWorkersOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-4">
                      {workers.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-500 text-sm">
                            <div className="text-2xl mb-2">👥</div>
                            <div>No job seekers added to rota yet</div>
                            <div className="text-xs mt-1">Add workers to see them here</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {workers.map((worker, index) => {
                            const workerName = typeof worker === 'string' ? worker : worker.name;
                            const workerData = typeof worker === 'object' ? worker : { name: worker };
                            const weeklyShiftCount = Object.values(dailySchedule).flat().filter(shift => shift.worker === workerName).length;
                            
                            return (
                              <div 
                                key={index} 
                                className={`text-sm p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                  selectedWorker === workerName || selectedWorker === worker
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-2 border-blue-300 dark:border-blue-600'
                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                                onClick={() => setSelectedWorker(selectedWorker === workerName || selectedWorker === worker ? null : workerName)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-xs truncate">{workerName}</span>
                                  {(selectedWorker === workerName || selectedWorker === worker) && (
                                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                
                                {/* Worker Bio */}
                                {workerData.shortBio && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                                    💼 {workerData.shortBio}
                                  </div>
                                )}
                                
                                {/* UTR Number */}
                                {workerData.utrNumber && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    🆔 UTR: {workerData.utrNumber}
                                  </div>
                                )}
                                
                                {/* Contact Info */}
                                {workerData.email && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">
                                    📧 {workerData.email}
                                  </div>
                                )}
                                
                                {workerData.phone && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    📞 {workerData.phone}
                                  </div>
                                )}
                                
                                {/* Stats */}
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                  <div className="text-xs">
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      {weeklyShiftCount} shifts
                                    </span>
                                    <span className="text-gray-500 mx-1">•</span>
                                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                                      {workerData.totalAssignedJobs || 0} total jobs
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Show API data count */}
                      {rotaData.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Total rota records: {rotaData.length}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Collapsed State - Show icon and count */}
                  {!isWorkersOpen && (
                    <div className="p-4 flex flex-col items-center justify-center">
                      <div className="text-yellow-500 dark:text-yellow-400 text-lg mb-1">👥</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{workers.length}</div>
                    </div>
                  )}
                </div>

                {/* Calendar Grid - 7 Days */}
                <div className="flex-1">
                  {/* Table Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Table Headers - Show Calendar Dates */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      {weekDates.map((day, index) => {
                        const today = new Date();
                        const isToday = day.fullDate.toDateString() === today.toDateString();
                        
                        return (
                          <div key={index} className={`p-2 md:p-4 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 ${
                            isToday ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                          }`}>
                            <div className={`text-xs md:text-sm font-semibold ${
                              isToday 
                                ? 'text-blue-800 dark:text-blue-200' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {day.dayName}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isToday 
                                ? 'text-blue-700 dark:text-blue-300 font-semibold' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {day.date} {day.month}
                            </div>
                            {isToday && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-1">
                                TODAY
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Table Body - Daily Schedules */}
                    <div className="grid grid-cols-7 min-h-[300px] md:min-h-[400px]">
                      {weekDates.map((day, dayIndex) => {
                        // Get shifts for this day, filtered by selected worker if any
                        const displaySchedule = getWorkerShifts(dailySchedule, selectedWorker);
                        const dayShifts = displaySchedule[day.dayName] || [];
                        
                        return (
                          <div key={dayIndex} className="border-r border-gray-200 dark:border-gray-600 last:border-r-0 p-1 md:p-2">
                            {/* Day's Shifts - Stacked Vertically */}
                            <div className="space-y-2 md:space-y-3">
                              {dayShifts.length > 0 ? (
                                dayShifts.map((shift, shiftIndex) => (
                                  <div 
                                    key={shift.id || shiftIndex}
                                    onClick={() => openJobDetailsModal(shift)}
                                    className={`p-2 rounded-lg border hover:shadow-md transition-all cursor-pointer transform hover:scale-105 ${
                                      selectedWorker === shift.worker
                                        ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border-blue-300 dark:border-blue-600'
                                        : 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
                                    }`}
                                  >
                                    {/* Simplified Content */}
                                    <div className="text-center">
                                      {/* Time */}
                                      <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">
                                        ⏰ {shift.time}
                                      </div>
                                      
                                      {/* Job Title */}
                                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 truncate">
                                        {shift.jobTitle || shift.role}
                                      </div>
                                      
                                      {/* Worker Name */}
                                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        {shift.worker}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="h-20 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                  <div className="text-center">
                                    <div className="text-lg mb-1">📅</div>
                                    <div className="text-xs">
                                      {selectedWorker ? `No shifts` : 'No shifts'}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Job Details Modal */}
      <JobDetailsModal />
    </div>
  );
};

export default RotaManagement;
