import React, { useContext, useState, useRef, useEffect } from "react";
import insta from "../../../assets/images/insta.svg";
import { ThemeContext } from "../../../context/ThemeContext";
import { useParams, useLocation } from "react-router-dom";
import { submitLogbookReport, getLogbookEntries } from "../../../api/logbookApi";
import { useToast } from "../../../components/notifications/ToastManager";

// Accept jobId via props
const ReportProblem = ({ jobId: propJobId }) => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  // Get jobId from URL params OR from props
  const { jobId: paramJobId } = useParams();
  const location = useLocation();
  
  // Try to get the jobId from different sources
  const [effectiveJobId, setEffectiveJobId] = useState(null);
  
  // Get jobId from different sources (URL params, props, or query string)
  useEffect(() => {
    // First try URL param from React Router
    if (paramJobId) {
      console.log("Using jobId from URL params:", paramJobId);
      setEffectiveJobId(paramJobId);
      return;
    }
    
    // Then try props
    if (propJobId) {
      console.log("Using jobId from props:", propJobId);
      setEffectiveJobId(propJobId);
      return;
    }
    
    // Then try query string in URL
    const queryParams = new URLSearchParams(location.search);
    const queryJobId = queryParams.get('jobId');
    if (queryJobId) {
      console.log("Using jobId from query string:", queryJobId);
      setEffectiveJobId(queryJobId);
      return;
    }
    
    // Finally try to get from localStorage as a last resort
    const storedJobId = localStorage.getItem("currentJobId");
    if (storedJobId) {
      console.log("Using jobId from localStorage:", storedJobId);
      setEffectiveJobId(storedJobId);
      return;
    }

    // If still no jobId, try using a hardcoded value for testing purposes only
    console.log("No jobId found in params, props, query or localStorage. Using fallback for testing.");
    setEffectiveJobId("6474e9bdad4af5b7fae8de3e"); // Fallback for testing only
  }, [paramJobId, propJobId, location]);
  
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [logbookEntries, setLogbookEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Simple toast implementation if useToast is not available
  const toast = useToast?.() || {
    showSuccess: (msg) => alert("Success: " + msg),
    showError: (msg) => alert("Error: " + msg),
    showInfo: (msg) => console.log("Info:", msg)
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch logbook entries when component mounts and after sending a new message
  const fetchLogbookEntries = async () => {
    if (!effectiveJobId) {
      console.error("Cannot fetch logbook entries: No jobId available");
      setStatusMessage({
        text: "Cannot load reports: Job ID is missing",
        type: "error"
      });
      return;
    }
    
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      console.error("Cannot fetch logbook entries: No jobSeekerId in localStorage");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log(`Fetching logbook entries for job: ${effectiveJobId}, jobSeeker: ${jobSeekerId}`);
      
      const response = await getLogbookEntries(effectiveJobId, jobSeekerId);
      
      if (response.data) {
        setLogbookEntries(response.data);
        console.log(`Loaded ${response.data.length} logbook entries`);
      } else {
        setLogbookEntries([]);
      }
    } catch (error) {
      console.error("Error fetching logbook entries:", error);
      // Don't show error to user as this is a background fetch
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logbook entries when effectiveJobId changes
  useEffect(() => {
    if (effectiveJobId) {
      fetchLogbookEntries();
    }
  }, [effectiveJobId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [logbookEntries]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Handle file input click (hidden input)
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      console.log(`Image selected: ${file.name}`);
    }
  };

  // Display status message with appropriate styling
  const showStatusMessage = (message, type = 'info') => {
    setStatusMessage({ text: message, type });
    // Clear message after 5 seconds
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Handle send message
  const handleSendMessage = async () => {
    // Reset status message
    setStatusMessage(null);
    
    if (!message.trim() && !selectedImage) {
      showStatusMessage("Please enter a message or select an image", "error");
      return;
    }

    if (!effectiveJobId) {
      showStatusMessage("Job ID is required. Please access this page from a specific job.", "error");
      toast.showError("Job ID is required. Please access this page from a specific job.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Get jobSeekerId from localStorage
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      
      if (!jobSeekerId) {
        showStatusMessage("User authentication required. Please login again.", "error");
        toast.showError("User authentication required. Please login again.");
        setIsSubmitting(false);
        return;
      }
      
      console.log(`Submitting log entry for job: ${effectiveJobId}, jobSeeker: ${jobSeekerId}`);
      showStatusMessage("Sending report...", "info");

      const reportData = {
        description: message,
        picture: selectedImage
      };

      try {
        const response = await submitLogbookReport(effectiveJobId, jobSeekerId, reportData);
        console.log("Logbook entry response:", response);
        
        // Success! Now fetch updated logbook entries
        await fetchLogbookEntries();
        
        showStatusMessage("Report submitted successfully!", "success");
        
        // Reset the form
        setMessage("");
        setSelectedImage(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error submitting logbook entry:", error);
        
        // Check for specific error about job not being in progress
        if (error.message && error.message.includes("not in progress")) {
          toast.showError("This job must be in progress to submit a report. Please start the job first.");
          showStatusMessage("This job must be in progress to submit a report. Please start the job first.", "error");
        } else {
          toast.showError(error.message || "Failed to submit report. Please try again.");
          showStatusMessage(error.message || "Failed to submit report. Please try again.", "error");
        }
      } 
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.showError(error.message || "Failed to prepare report submission. Please try again.");
      showStatusMessage(error.message || "Failed to prepare report submission. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a single logbook entry
  const renderLogbookEntry = (entry) => {
    return (
      <div key={entry._id || Math.random()} className="flex items-start space-x-2 mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-800 flex items-center justify-center">
            {entry.picture ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
            {entry.picture && (
              <div className="mb-2">
                <img 
                  src={entry.picture} 
                  alt="Report image" 
                  className="rounded-lg max-h-60 w-auto" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=Image+Error'; }}
                />
              </div>
            )}
            {entry.description && <p className="text-gray-700 dark:text-gray-300">{entry.description}</p>}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(entry.createdAt || new Date())}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex flex-col flex-1 relative">

        <div className="flex flex-col h-screen justify-between md:mx-0 p-4 sm:p-6">
          {/* Tabs */}
          <div className="flex mt-7 flex-wrap justify-center md:justify-start">
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r mb-4">
              <img src={insta} alt="Instagram Logo" className="w-16 h-16 rounded-full" />
            </div>
            <div className="flex flex-col text-center md:text-left md:ml-4">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                Senior UX Designer
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start space-x-2 mt-2">
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                  2 Miles Away
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                  New York City
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 text-sm">
                  ID: {effectiveJobId || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info - When you have job ID issues */}
          {!effectiveJobId && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg mb-3">
              <p className="font-bold">Missing Job ID</p>
              <p className="text-sm">This component requires a Job ID which is missing.</p>
              <p className="text-xs mt-1">URL Param: {paramJobId || "none"}, Props: {propJobId || "none"}, From localStorage: {localStorage.getItem("currentJobId") || "none"}</p>
            </div>
          )}

          {/* Chat Section */}
          <div className="flex-1 overflow-y-auto mt-6 mb-4 max-h-[60vh]">
            {/* System messages for guidance */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                You can submit reports for this job. Job must be in progress to submit reports.
              </p>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center my-4">
                <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Display existing logbook entries */}
            {!isLoading && logbookEntries.length > 0 ? (
              <div className="space-y-4">
                {logbookEntries.map(entry => renderLogbookEntry(entry))}
              </div>
            ) : !isLoading && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-4 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p>No reports found for this job.</p>
                <p className="text-sm mt-2">Submit a new report using the form below.</p>
              </div>
            )}
            
            {/* Selected image preview */}
            {selectedImage && (
              <div className="flex items-center space-x-2 justify-end mt-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
                    />
                  </svg>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 text-sm">
                  Image selected: {selectedImage.name}
                </div>
              </div>
            )}
            
            {/* Status message */}
            {statusMessage && (
              <div className="flex items-center space-x-2 justify-end mt-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  statusMessage.type === 'error' ? 'bg-red-200 dark:bg-red-700' :
                  statusMessage.type === 'success' ? 'bg-green-200 dark:bg-green-700' :
                  'bg-blue-200 dark:bg-blue-700'
                }`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className={`w-5 h-5 ${
                      statusMessage.type === 'error' ? 'text-red-500 dark:text-red-300' :
                      statusMessage.type === 'success' ? 'text-green-500 dark:text-green-300' :
                      'text-blue-500 dark:text-blue-300'
                    }`}
                  >
                    {statusMessage.type === 'error' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    ) : statusMessage.type === 'success' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    )}
                  </svg>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm ${
                  statusMessage.type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                  statusMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {statusMessage.text}
                </div>
              </div>
            )}
            
            {/* Reference for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="mt-auto">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full px-4 py-2 border border-orange-300 rounded-full h-[62px] focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-800 dark:border-orange-500 dark:text-gray-200 dark:placeholder-gray-400 pr-12"
                />
                
                {/* Hidden file input */}
                <input 
                  type="file"
                  id="imageUpload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Image upload button inside the input */}
                <button
                  type="button"
                  onClick={handleFileClick}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
                    />
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={handleSendMessage}
                disabled={isSubmitting || !effectiveJobId}
                className={`ml-4 bg-orange-400 text-orange-600 p-3 rounded-full hover:bg-orange-800 transition duration-200 dark:bg-orange-500 dark:text-white ${(isSubmitting || !effectiveJobId) ? 'opacity-50' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-500 dark:text-white [transform:rotate(180deg)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProblem;