import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom";
import { getJobDetailsById } from '../../../api/jobApplicationApi';
import { createInvoice } from '../../../api/myWorkApi'; // Import the invoice API
import salary from "../../../assets/images/salary.png";
import { AiOutlineInfoCircle } from "react-icons/ai"; 
import { IoMdArrowBack } from "react-icons/io";
import PopupInprogess from '../popupModel/popupModel-Inprogress/PopupInprogess';
import InvoiceSuccessPopup from '../popupModel/InvoiceSuccessPopup'; // Import the success popup
import ErrorPopup from '../popupModel/ErrorPopup'; // Import the error popup
import PopupButton4 from '../popupModel/PopupButton4'; // Import PopupButton4
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ThemeContext } from '../../../context/ThemeContext';


// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapModal = ({ isOpen, onClose, position, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className={`p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
          <h2 className="text-xl font-semibold">Job Location</h2>
          <button onClick={onClose} className={`${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}>×</button>
        </div>
        <div className="h-[500px] w-full">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[position.lat, position.lng]}>
              <Popup>
                Job Location
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const InProgressJobDetail = () => {
    const [isInProgressOpen, setIsInProgressOpen] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isInvoiceSuccessOpen, setIsInvoiceSuccessOpen] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const { id } = useParams();
    const { theme } = useContext(ThemeContext) || { theme: 'light' };
    const navigate = useNavigate();

    useEffect(() => {
      const fetchJobDetails = async () => {
        try {
          const jobSeekerId = localStorage.getItem("jobSeekerId");
          if (!jobSeekerId) {
            setError('Please login to view job details');
            setLoading(false);
            return;
          }
    
          const details = await getJobDetailsById(jobSeekerId, id);
          
          if (!details) {
            setError('Job not found or no longer available');
            setLoading(false);
            return;
          }
    
          // Enhanced validation
          if (!details.jobTitle || !details.companyId || !details.pricePerHour) {
            console.warn('Incomplete job data:', details);
            setError('Job data is incomplete');
            setLoading(false);
            return;
          }
    
          // Ensure workDate is properly formatted
          if (details.workDate && typeof details.workDate === 'string') {
            details.workDate = new Date(details.workDate);
          }
    
          setJobDetails(details);
        } catch (error) {
          console.error('Error fetching job details:', error);
          setError(error.message || 'Failed to load job details');
        } finally {
          setLoading(false);
        }
      };
    
      if (id) {
        fetchJobDetails();
      }
    }, [id]);

    // Handler for booking off a job (generating an invoice)
    const handleBookJob = async () => {
      try {
        // Check if user is logged in
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        
        if (!jobSeekerId) {
          setErrorPopupMessage("Please login to book off this job");
          setIsErrorPopupOpen(true);
          return;
        }

        if (!jobDetails) {
          setErrorPopupMessage("Job details not available");
          setIsErrorPopupOpen(true);
          return;
        }
        
        setIsLoading(true);
        
        // Calculate hours worked based on job start/end time
        let startTime = jobDetails.startTime || "09:00";
        let endTime = jobDetails.endTime || "17:00";
        
        // Simple time calculation (assuming format like "09:00" and "17:00")
        const calculateHours = (start, end) => {
          if (!start || !end) return 8; // Default to 8 hours if times not available
          
          try {
            const [startHour, startMin] = start.split(':').map(Number);
            const [endHour, endMin] = end.split(':').map(Number);
            
            const startTotalMins = startHour * 60 + startMin;
            const endTotalMins = endHour * 60 + endMin;
            
            // Calculate difference in hours
            const diffMins = endTotalMins - startTotalMins;
            return Math.max(0, diffMins / 60);
          } catch (err) {
            console.error("Error calculating hours:", err);
            return 8; // Default
          }
        };
        
        const hoursWorked = calculateHours(startTime, endTime);
        const totalPrice = (jobDetails.pricePerHour || 5) * hoursWorked;
        
        // Create invoice data object according to API specification
        // Make sure we match exactly the format shown in the API screenshot
        const invoiceData = {
          startTime: startTime || "09:00",
          endTime: endTime || "17:00",
          pricePerHour: parseInt(jobDetails.pricePerHour) || 5,
          workDate: jobDetails.workDate ? new Date(jobDetails.workDate).toISOString().split('T')[0] : "2025-07-26",
          totalHours: parseInt(hoursWorked) || 8,
          totalPrice: parseInt(totalPrice) || 40
        };
        
        console.log("Creating invoice with data:", invoiceData);
        
        // Call the API to generate invoice
        const response = await createInvoice(id, jobSeekerId, invoiceData);
        
        console.log("Invoice creation response:", response);
        
        // Format the date for display
        const formattedDate = jobDetails.workDate ? 
          new Date(jobDetails.workDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'July 26, 2025';
        
        // Set invoice details for the popup
        setInvoiceDetails({
          ...invoiceData,
          formattedDate,
          jobTitle: jobDetails.jobTitle,
          companyName: jobDetails.companyId?.companyName || 'Company'
        });
        
        // Show success popup
        setIsInvoiceSuccessOpen(true);
        
      } catch (error) {
        console.error("Error generating invoice:", error);
        setErrorPopupMessage(error.message || "An error occurred while generating your invoice");
        setIsErrorPopupOpen(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex flex-row min-h-screen">
          
          <div className="flex flex-col flex-1">
            
            <div className="min-h-screen mx-auto py-4 px-5 md:p-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading job details...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-row min-h-screen">
          
          <div className="flex flex-col flex-1">
            
            <div className="min-h-screen mx-auto py-4 px-5 md:p-10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!jobDetails) {
      return (
        <div className="flex flex-row min-h-screen">
          
          <div className="flex flex-col flex-1">
            
            <div className="min-h-screen mx-auto py-4 px-5 md:p-10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600">Job details not found.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
       
        <div className="flex flex-col flex-1">
          
          <div className="min-h-screen py-4 px-5 md:p-10">
          <div className="mb-4">
          <button 
            onClick={() => navigate('/User-workInprogess')} 
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
          >
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
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="font-medium">Back </span>
          </button>
        </div>
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6 text-right`}>
              <span>Find Job</span> / <span>{jobDetails.jobTitle}</span> /{" "}
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Job Details</span>
            </div>

            <div className="mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img 
                      src={jobDetails.companyId?.companyLogo || "src/assets/images/company.png"} 
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h1 className={`text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {jobDetails.jobTitle}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                        {jobDetails.jobDuration}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
                        {jobDetails.companyId?.address || "Location not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-left text-sm">
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-black'}>
                      Use this PIN code to confirm your booking and respond to the alert.
                    </p>
                    <div className={`mt-2 flex items-center justify-center w-full rounded-xl md:w-[235px] h-[48px] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} px-4 py-2 font-semibold tracking-widest`}>
                      {jobDetails.jobPin || "No PIN"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-8 my-8">
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                      <img src={salary} className="w-8 h-8" alt="" />
                    </div>
                    <div>
                      <p className={theme === 'dark' ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Hourly Rate</p>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>${jobDetails.pricePerHour}/hr</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B00"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className={theme === 'dark' ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>Timings</div>
                    <div className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {format(new Date(jobDetails.workDate), 'MMMM dd, yyyy')}
                    </div>
                    <div className={theme === 'dark' ? 'text-xs text-gray-400' : 'text-xs text-gray-500'}>{jobDetails.startTime} - {jobDetails.endTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl md:text-3xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} font-bold mb-4`}>
                Job Description
              </h2>
              <div className={`space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base leading-relaxed`}>
                <p>{jobDetails.jobDescription}</p>
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-4">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Share this job:</span>
                <div className="flex gap-3">
                  <button className="flex items-center gap-1 text-blue-600 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </button>
                  <button className="flex items-center gap-1 text-blue-400 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    Twitter
                  </button>
                  <button className="flex items-center gap-1 text-red-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0a12 12 0 0 0-3.8 23.4c-.1-1.1-.2-2.7 0-3.9.2-1.1 1.4-7 1.4-7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.2.6 2.1 1.7 2.1 2 0 3.6-2.1 3.6-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-5 2.3-5 4.7 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.2 1.1-.3 1.3-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.8-7.2 7.9-7.2 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.7 2.9-.3 1-1 2.3-1.5 3.1 1.1.3 2.3.5 3.5.5 8.3 0 15-6.7 15-15S20.3 0 12 0z"></path>
                    </svg>
                    Pinterest
                  </button>
                </div>
              </div>
              <div className="flex flex-row justify-end mt-10">
                <div className="flex space-x-4">
                  <button 
                    onClick={handleBookJob}
                    className={`w-[200px] h-[50px] bg-[#FD7F00] text-white font-semibold rounded-full hover:bg-orange-600 transition duration-200 ${theme === 'dark' ? 'hover:bg-orange-700' : 'hover:bg-orange-600'}`}
                  >
                    Book Off
                  </button>
                  
                  <button className={`w-[200px] h-[50px] px-6 py-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-[#1F2B44] hover:bg-gray-900'} text-white font-semibold rounded-full transition duration-200`}>
                    Message
                  </button>
                  <button 
                    onClick={() => setIsMapOpen(true)} 
                    disabled={!jobDetails.latitude || !jobDetails.longitude}
                    className={`w-[200px] h-[50px] px-6 py-2 bg-[#FD7F00] text-white font-semibold rounded-full ${theme === 'dark' ? 'hover:bg-orange-700' : 'hover:bg-orange-600'} transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    View Map
                  </button>
                </div>
              </div>

              <div className={`flex justify-end items-center gap-1 text-base ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} cursor-pointer mt-3 mr-3`}>
                <AiOutlineInfoCircle className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'} text-lg`} />{" "}
                <Link to={`/User-reportProblem/${id}`}>Report a Problem</Link>
              </div>
            </div>
          </div>
        </div>

        {isInProgressOpen && (
          <PopupInprogess onClose={() => setIsInProgressOpen(false)} />
        )}
        {isMapOpen && jobDetails && (
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            position={{ lat: jobDetails.latitude, lng: jobDetails.longitude }}
            theme={theme}
          />
        )}
        {isInvoiceSuccessOpen && (
          <InvoiceSuccessPopup 
            onClose={() => setIsInvoiceSuccessOpen(false)} 
            invoiceDetails={invoiceDetails} 
          />
        )}
        {isErrorPopupOpen && (
          <ErrorPopup 
            onClose={() => setIsErrorPopupOpen(false)} 
            message={errorPopupMessage} 
          />
        )}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-white">Processing your booking...</p>
            </div>
          </div>
        )}
      </div>
    );
}

export default InProgressJobDetail
