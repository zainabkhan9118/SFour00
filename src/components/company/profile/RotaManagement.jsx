import React, { useState, useEffect } from "react";
import CompanySideBar from "./CompanySideBar";
import { ThemeContext } from "../../../context/ThemeContext";
import { useContext } from "react";
import { getRotaManagementByCompany } from "../../../api/rotaManagementApi";
import LoadingSpinner from "../../common/LoadingSpinner";



// Helper function to calculate job duration span in days
const calculateJobDurationDays = (job) => {
  if (!job.jobDuration) return 1; // Default to 1 day if no duration specified
  
  const duration = job.jobDuration.toLowerCase();
  
  // Parse different duration formats
  if (duration.includes('week')) {
    const weeks = parseInt(duration.match(/(\d+)/)?.[1] || '1');
    return weeks * 7;
  } else if (duration.includes('day')) {
    const days = parseInt(duration.match(/(\d+)/)?.[1] || '1');
    return days;
  } else if (duration.includes('month')) {
    const months = parseInt(duration.match(/(\d+)/)?.[1] || '1');
    return months * 30; // Approximate
  } else if (duration.includes('hour')) {
    // If it's hours and less than 24, treat as 1 day
    const hours = parseInt(duration.match(/(\d+)/)?.[1] || '8');
    return hours > 24 ? Math.ceil(hours / 24) : 1;
  }
  
  // Try to parse as a number (assume days)
  const numericDuration = parseInt(duration);
  if (!isNaN(numericDuration)) {
    return numericDuration;
  }
  
  return 1; // Default fallback
};

// Helper function to get all dates for a job based on start date and duration
const getJobDateRange = (startDate, durationDays) => {
  const dates = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < durationDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

// Helper function to check if a date falls within the current week view
const isDateInWeekView = (date, weekDates) => {
  const dateString = date.toDateString();
  return weekDates.some(weekDay => weekDay.fullDate.toDateString() === dateString);
};

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

// Helper function to get worker-specific shifts for selected job
const getWorkerJobShifts = (dailySchedule, selectedWorker, selectedJob) => {
  if (!selectedWorker) return dailySchedule;
  
  const filteredSchedule = {};
  Object.keys(dailySchedule).forEach(day => {
    filteredSchedule[day] = dailySchedule[day].filter(shift => {
      const workerMatch = shift.worker === (typeof selectedWorker === 'string' ? selectedWorker : selectedWorker.name);
      const jobMatch = selectedJob ? shift.jobId === selectedJob._id : true;
      return workerMatch && jobMatch;
    });
  });
  
  return filteredSchedule;
};

// Helper function to get jobs for a specific worker
const getWorkerJobs = (rotaData, workerName) => {
  const jobs = [];
  rotaData.forEach(rota => {
    if (rota.jobSeeker_id && rota.jobSeeker_id.fullname === workerName && rota.jobSeeker_id.assignedJobs) {
      rota.jobSeeker_id.assignedJobs.forEach(job => {
        jobs.push({
          ...job,
          workerDetails: rota.jobSeeker_id
        });
      });
    }
  });
  return jobs;
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
  
  // Selected job state
  const [selectedJob, setSelectedJob] = useState(null);
  const [workerJobs, setWorkerJobs] = useState([]);
  
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Escape key to go back from schedule view
      if (event.key === 'Escape' && selectedJob) {
        setSelectedJob(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedJob]);

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
          
          // Don't automatically select the first worker - let user choose
          // if (uniqueWorkers.length > 0 && !selectedWorker) {
          //   setSelectedWorker(uniqueWorkers[0].name);
          // }
          
          // Update worker jobs when worker changes
          if (selectedWorker) {
            const jobs = getWorkerJobs(response.data, selectedWorker);
            setWorkerJobs(jobs);
            // Don't auto-select job - let user choose
            // if (jobs.length > 0 && !selectedJob) {
            //   setSelectedJob(jobs[0]);
            // }
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
                  const jobDurationDays = calculateJobDurationDays(job);
                  const jobDateRange = getJobDateRange(workDate, jobDurationDays);
                  
                  // Process each date in the job's duration
                  jobDateRange.forEach((currentDate, dayOffset) => {
                    const dayName = getDayNameFromDate(currentDate);
                    
                    // Find the day in our current week
                    const dayIndex = weekDates.findIndex(day => day.dayName === dayName && 
                      day.fullDate.toDateString() === currentDate.toDateString());
                    
                    if (dayIndex !== -1) {
                      const selectedDay = weekDates[dayIndex];
                      
                      
                      let timeDisplay = `${job.startTime } - ${job.endTime }`;
                      
                      
                      if (job.days && job.days.length > 0) {
                       
                        const matchingDay = job.days.find(daySchedule => 
                          daySchedule.day && daySchedule.day.toLowerCase() === dayName.toLowerCase()
                        );
                        
                        if (matchingDay && matchingDay.startTime && matchingDay.endTime) {
                          timeDisplay = `${matchingDay.startTime} - ${matchingDay.endTime}`;
                        }
                      }
                      
                      const shiftData = {
                        id: `${rota._id}-${job._id}-${dayOffset}`,
                        worker: jobSeeker.fullname,
                        workerDetails: jobSeeker,
                        day: selectedDay.fullName,
                        dayName: selectedDay.dayName,
                        time: timeDisplay,
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
                        workDate: job.workDate,
                        currentDate: currentDate.toISOString().split('T')[0],
                        dayOffset: dayOffset,
                        totalDuration: jobDurationDays,
                        isFirstDay: dayOffset === 0,
                        isLastDay: dayOffset === jobDurationDays - 1,
                        durationDisplay: `Day ${dayOffset + 1} of ${jobDurationDays}`
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
                  });
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
  }, [weekDates, selectedWorker]); // Re-fetch when week or worker changes

  // Update worker jobs when selectedWorker changes
  useEffect(() => {
    if (selectedWorker && rotaData.length > 0) {
      const jobs = getWorkerJobs(rotaData, selectedWorker);
      setWorkerJobs(jobs);
      // Don't auto-select first job - let user choose
      // if (jobs.length > 0 && !selectedJob) {
      //   setSelectedJob(jobs[0]);
      // } else if (jobs.length === 0) {
      //   setSelectedJob(null);
      // }
      // Clear selected job when worker changes
      setSelectedJob(null);
    } else {
      setWorkerJobs([]);
      setSelectedJob(null);
    }
  }, [selectedWorker, rotaData]);

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
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Work Date & Schedule</p>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {/* Display work date */}
                   
                    
                    {/* Display days and time slots from backend */}
                    {selectedJobDetails.jobData?.days && selectedJobDetails.jobData.days.length > 0 ? (
                      <div>
                        <strong>Time Schedule:</strong>
                        <div className="mt-1 space-y-1">
                          {selectedJobDetails.jobData.days.map((daySchedule, index) => (
                            <div key={daySchedule._id || index} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm">
                              🕐 <strong>{daySchedule.day}:</strong> {daySchedule.startTime} - {daySchedule.endTime}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Fallback to job-level or shift-level timing */
                      <div>
                        <strong>Time Schedule:</strong>
                        <div className="mt-1">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-sm">
                            🕐 <strong>{selectedJobDetails.dayName}:</strong> {selectedJobDetails.time}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job Duration</p>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedJobDetails.jobData?.jobDuration || 'N/A'}
                    {selectedJobDetails.jobData?.jobDuration && (
                      <div className="mt-1">
                        <span className="text-sm bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 px-2 py-1 rounded">
                          {calculateJobDurationDays(selectedJobDetails.jobData)} day{calculateJobDurationDays(selectedJobDetails.jobData) > 1 ? 's' : ''}
                        </span>
                        {selectedJobDetails.durationDisplay && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Current view: {selectedJobDetails.durationDisplay}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                  {selectedJob && (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-2">
                      → {selectedJob.jobTitle}
                    </span>
                  )}
                </h1>
                {selectedJob && selectedJob.days && selectedJob.days.length > 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Viewing full schedule: {selectedJob.days.length} scheduled day{selectedJob.days.length > 1 ? 's' : ''} for this job
                  </p>
                ) : selectedWorker && !selectedJob ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Select a job to view the full-width schedule for {selectedWorker}
                  </p>
                ) : !selectedWorker ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Select a worker and their job to view the full-width schedule
                  </p>
                ) : null}
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
              <div className="flex flex-col xl:flex-row gap-4">
                {/* Workers Section - Collapsible - Hidden when job is selected */}
                {!selectedJob && (
                  <div className={`transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
                    isWorkersOpen ? 'w-full xl:w-48' : 'w-full xl:w-10'
                  }`}>
                  {/* Workers Header with Toggle */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                    <span className={`text-yellow-500 dark:text-yellow-400 text-sm font-medium transition-opacity duration-300 ${
                      isWorkersOpen ? 'opacity-100' : 'opacity-0 xl:opacity-0'
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
                                onClick={() => {
                                  const newWorker = selectedWorker === workerName || selectedWorker === worker ? null : workerName;
                                  setSelectedWorker(newWorker);
                                  setSelectedJob(null); // Reset selected job when worker changes
                                }}
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
                )}

                {/* Jobs Section - Show when worker is selected but job is not selected */}
                {selectedWorker && !selectedJob && (
                  <div className="w-full xl:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    {/* Jobs Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-green-500 dark:text-green-400 text-sm font-medium">
                        💼 Jobs for {selectedWorker} ({workerJobs.length})
                      </span>
                    </div>
                    
                    {/* Jobs List */}
                    <div className="p-4 max-h-96 overflow-y-auto">
                      {workerJobs.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-500 text-sm">
                            <div className="text-2xl mb-2">💼</div>
                            <div>No jobs assigned yet</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {workerJobs.map((job, index) => (
                            <div 
                              key={job._id || index} 
                              className={`text-sm p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                                selectedJob && selectedJob._id === job._id
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600'
                                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                              }`}
                              onClick={() => setSelectedJob(selectedJob && selectedJob._id === job._id ? null : job)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-xs truncate">{job.jobTitle}</span>
                                {selectedJob && selectedJob._id === job._id && (
                                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              
                              {/* Price per hour */}
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                💰 £{job.pricePerHour || 'N/A'}/hour
                              </div>
                              
                              {/* Work date */}
                              {job.workDate && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  📅 {new Date(job.workDate).toLocaleDateString()}
                                </div>
                              )}
                              
                              {/* Job duration */}
                              {job.jobDuration && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  ⏱️ Duration: {job.jobDuration}
                                  {calculateJobDurationDays(job) > 1 && (
                                    <span className="ml-1 text-purple-600 dark:text-purple-400 font-semibold">
                                      ({calculateJobDurationDays(job)} days)
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Number of days if available */}
                              {job.days && job.days.length > 0 && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  📊 {job.days.length} day{job.days.length > 1 ? 's' : ''} scheduled
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Calendar Grid - 7 Days - Only show when a job is selected */}
                {selectedJob ? (
                  <div className="flex-1">
                    {/* Back Button and Job Info Header */}
                    <div className="mb-4 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedJob(null)}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          title="Press Escape key or click to go back"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to Jobs
                          <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">ESC</span>
                        </button>
                       
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Schedule View
                      </div>
                    </div>
                    
                    {/* Table Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Table Headers - Show Calendar Dates or Job-specific Days */}
                    <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      {/* Show job-specific days if a job is selected, otherwise show week view */}
                      {selectedJob && selectedJob.days && selectedJob.days.length > 0 ? (
                      // Job-specific days view
                      <>
                        {selectedJob.days.slice(0, 7).map((daySchedule, index) => {
                          const isToday = daySchedule.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
                          
                          return (
                            <div key={daySchedule._id || index} className={`p-2 md:p-4 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 ${
                              isToday ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                            }`}>
                              <div className={`text-xs md:text-sm font-semibold ${
                                isToday 
                                  ? 'text-blue-800 dark:text-blue-200' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {daySchedule.day}
                              </div>
                              <div className={`text-xs mt-1 ${
                                isToday 
                                  ? 'text-blue-700 dark:text-blue-300 font-semibold' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {daySchedule.startTime} - {daySchedule.endTime}
                              </div>
                              {selectedJob.workDate && (
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {new Date(selectedJob.workDate).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {/* Fill remaining columns if job has fewer than 7 days */}
                        {Array.from({ length: 7 - Math.min(selectedJob.days.length, 7) }, (_, index) => (
                          <div key={`empty-${index}`} className="p-2 md:p-4 text-center border-r border-gray-200 dark:border-gray-600 last:border-r-0 bg-gray-100 dark:bg-gray-800">
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              No Schedule
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      // Default week view
                      weekDates.map((day, index) => {
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
                      })
                    )}
                  </div>

                    {/* Table Body - Daily Schedules */}
                    <div className="grid grid-cols-7 min-h-[300px] md:min-h-[400px]">
                      {selectedJob && selectedJob.days && selectedJob.days.length > 0 ? (
                        // Job-specific schedule view
                        <>
                          {selectedJob.days.slice(0, 7).map((daySchedule, dayIndex) => (
                            <div key={daySchedule._id || dayIndex} className="border-r border-gray-200 dark:border-gray-600 last:border-r-0 p-1 md:p-2">
                              <div className="space-y-2 md:space-y-3">
                                <div 
                                  onClick={() => openJobDetailsModal({
                                    ...selectedJob,
                                    worker: selectedWorker,
                                    day: daySchedule.day,
                                    dayName: daySchedule.day,
                                    time: `${daySchedule.startTime} - ${daySchedule.endTime}`,
                                    jobTitle: selectedJob.jobTitle,
                                    jobData: selectedJob,
                                    workerDetails: selectedJob.workerDetails,
                                    utrNumber: selectedJob.workerDetails?.utrNumber,
                                    niNumber: selectedJob.workerDetails?.NINumber,
                                    profilePic: selectedJob.workerDetails?.profilePic,
                                    pricePerHour: selectedJob.pricePerHour,
                                    jobDescription: selectedJob.jobDescription,
                                    dayOffset: dayIndex,
                                    totalDuration: selectedJob.days ? selectedJob.days.length : 1,
                                    durationDisplay: `Day ${dayIndex + 1} of ${selectedJob.days ? selectedJob.days.length : 1}`
                                  })}
                                  className="p-2 rounded-lg border bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                                >
                                  <div className="text-center">
                                    {/* Duration indicator for multi-day jobs */}
                                    {selectedJob.days && selectedJob.days.length > 1 && (
                                      <div className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 px-2 py-1 rounded-full mb-2">
                                        Day {dayIndex + 1} of {selectedJob.days.length}
                                        {dayIndex === 0 && ' 🟢'}
                                        {dayIndex === selectedJob.days.length - 1 && ' 🔴'}
                                        {dayIndex > 0 && dayIndex < selectedJob.days.length - 1 && ' 🟡'}
                                      </div>
                                    )}
                                    
                                    {/* Time */}
                                    <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2">
                                      ⏰ {daySchedule.startTime} - {daySchedule.endTime}
                                    </div>
                                    
                                    {/* Job Title */}
                                    <div className="text-xs font-semibold text-green-700 dark:text-green-300 truncate">
                                      {selectedJob.jobTitle}
                                    </div>
                                    
                                    {/* Worker Name */}
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {selectedWorker}
                                    </div>
                                    
                                    {/* Work Date and Duration */}
                                    {selectedJob.workDate && (
                                      <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                        📅 {new Date(selectedJob.workDate).toLocaleDateString()}
                                      </div>
                                    )}
                                    
                                    {selectedJob.jobDuration && (
                                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        📊 {selectedJob.jobDuration}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Fill remaining columns if job has fewer than 7 days */}
                          {Array.from({ length: 7 - Math.min(selectedJob.days.length, 7) }, (_, index) => (
                            <div key={`empty-body-${index}`} className="border-r border-gray-200 dark:border-gray-600 last:border-r-0 p-1 md:p-2">
                              <div className="h-20 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                <div className="text-center">
                                  <div className="text-lg mb-1">🚫</div>
                                  <div className="text-xs">No Schedule</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        // Default week view
                        weekDates.map((day, dayIndex) => {
                          // Get shifts for this day, filtered by selected worker and job
                          const displaySchedule = getWorkerJobShifts(dailySchedule, selectedWorker, selectedJob);
                          const dayShifts = displaySchedule[day.dayName] || [];
                          
                          return (
                            <div key={dayIndex} className="border-r border-gray-200 dark:border-gray-600 last:border-r-0 p-1 md:p-2">
                              {/* Day's Shifts - Stacked Vertically */}
                              <div className="space-y-2 md:space-y-3">
                                {dayShifts.length > 0 ? (
                                  dayShifts.map((shift, shiftIndex) => {
                                    // Determine styling based on job duration
                                    const isMultiDay = shift.totalDuration > 1;
                                    const isFirstDay = shift.isFirstDay;
                                    const isLastDay = shift.isLastDay;
                                    
                                    // Choose colors based on duration and position
                                    let gradientClass = 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border-blue-300 dark:border-blue-600';
                                    let durationBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
                                    
                                    if (isMultiDay) {
                                      if (isFirstDay) {
                                        gradientClass = 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 border-green-300 dark:border-green-600';
                                        durationBadgeClass = 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
                                      } else if (isLastDay) {
                                        gradientClass = 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border-red-300 dark:border-red-600';
                                        durationBadgeClass = 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
                                      } else {
                                        gradientClass = 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 border-yellow-300 dark:border-yellow-600';
                                        durationBadgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
                                      }
                                    }
                                    
                                    return (
                                      <div 
                                        key={shift.id || shiftIndex}
                                        onClick={() => openJobDetailsModal(shift)}
                                        className={`p-2 rounded-lg border hover:shadow-md transition-all cursor-pointer transform hover:scale-105 ${
                                          selectedWorker === shift.worker ? gradientClass : 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
                                        }`}
                                      >
                                        {/* Simplified Content */}
                                        <div className="text-center">
                                          {/* Duration Badge for multi-day jobs */}
                                          {isMultiDay && (
                                            <div className={`text-xs px-2 py-1 rounded-full mb-1 ${durationBadgeClass}`}>
                                              {shift.durationDisplay}
                                              {isFirstDay && ' 🟢'}
                                              {isLastDay && ' 🔴'}
                                              {!isFirstDay && !isLastDay && ' 🟡'}
                                            </div>
                                          )}
                                          
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
                                          
                                          {/* Job Duration Info */}
                                          {isMultiDay && (
                                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                              📊 {shift.jobData.jobDuration}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
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
                        })
                      )}
                    </div>
                  </div>
                </div>
                ) : (
                  <div className="flex-1">
                  </div>
                )}
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
