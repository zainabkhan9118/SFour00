import React, { useState, useEffect, useContext } from "react";
import { Download, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import UserSidebar from "../UserSidebar";
import LoadingSpinner from "../../../common/LoadingSpinner";
import { ThemeContext } from "../../../../context/ThemeContext";
import { getInvoices, downloadInvoicePDF } from "../../../../api/invoice";
import { format, parseISO } from "date-fns";
import ErrorPopup from "../../popupModel/ErrorPopup";

const InvoiceList = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch invoices data
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        if (!jobSeekerId) {
          throw new Error("User not logged in");
        }

        const response = await getInvoices(jobSeekerId);
        if (response && response.data) {
          setInvoices(response.data);
          setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        } else {
          setInvoices([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message || "Failed to load invoices");
        setShowErrorPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [itemsPerPage]);

  // Calculate total hours between start and end times
  const calculateTotalHours = (startTime, endTime) => {
    try {
      // Parse the time strings in 24-hour format: "HH:MM"
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      
      // Convert to minutes
      const startTotalMinutes = startHour * 60 + startMinute;
      let endTotalMinutes = endHour * 60 + endMinute;
      
      // Handle overnight shifts
      if (endTotalMinutes < startTotalMinutes) {
        endTotalMinutes += 24 * 60;
      }
      
      // Return hours with decimal precision
      return ((endTotalMinutes - startTotalMinutes) / 60).toFixed(2);
    } catch (e) {
      console.error("Error calculating hours:", e);
      return "NaN";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Download invoice as PDF
  const downloadInvoice = async (jobSeekerId, invoiceId) => {
    try {
      setIsLoading(true);
      
      // Use the API function to get the PDF blob
      const pdfBlob = await downloadInvoicePDF(jobSeekerId);
      
      // Create a blob URL for the PDF data
      const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      setError(error.message || "Failed to download invoice");
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render company logo or initials
  const renderInitials = (title) => {
    // Get initial letter from job title or default to 'J'
    const initial = (title || 'J').charAt(0).toUpperCase();
    
    return (
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold bg-orange-500"
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {isLoading && <LoadingSpinner />}

      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          <UserSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <div className="p-4 md:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Invoices</h1>
            
            {invoices.length === 0 && !isLoading ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You haven't completed any jobs yet.
                </p>
              </div>
            ) : (
              /* Invoice List - Matching the provided design */
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                {invoices
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((invoice) => {
                    const hours = calculateTotalHours(invoice.startTime, invoice.endTime);
                    
                    return (
                      <div key={invoice._id} className="flex items-center p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        {/* Left side - Initial and Location */}
                        <div className="flex items-center space-x-4 flex-1">
                          {renderInitials(invoice.jobTitle)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500 dark:text-gray-400">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">Remote</span>
                              <span className="text-gray-500 dark:text-gray-400">${invoice.pricePerHour}/hr</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle - Date and Time */}
                        <div className="hidden md:flex flex-col items-start flex-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{formatDate(invoice.workDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{invoice.startTime} - {invoice.endTime} ({hours} hrs)</span>
                          </div>
                        </div>

                        {/* Status and Amount */}
                        <div className="flex flex-col items-end md:items-center flex-1">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                              Completed
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                              ${Number.isNaN(parseFloat(hours) * invoice.pricePerHour) ? 'NaN' : (parseFloat(hours) * invoice.pricePerHour).toFixed(2)}
                            </span>
                          </div>

                          {/* Download Button */}
                          <button 
                            onClick={() => downloadInvoice(invoice.jobSeekerId, invoice._id)}
                            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          >
                            <Download className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                            Download
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showErrorPopup && (
        <ErrorPopup 
          message={error} 
          onClose={() => setShowErrorPopup(false)} 
        />
      )}
    </div>
  );
};

export default InvoiceList;
