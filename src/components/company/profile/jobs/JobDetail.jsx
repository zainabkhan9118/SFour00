import React, { useState, useEffect, useContext } from "react";
import LoadingSpinner from "../../../common/LoadingSpinner";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import { FaFacebook, FaTwitter, FaPinterest, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById } from "../../../../api/jobsApi";
import { ThemeContext } from "../../../../context/ThemeContext";

const JobDetail = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useContext(ThemeContext) || { theme: 'light' };
    
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const socialLinks = [
        { name: "Facebook", icon: <FaFacebook />, url: "https://www.facebook.com" },
        { name: "Twitter", icon: <FaTwitter />, url: "https://www.twitter.com" },
        { name: "Pinterest", icon: <FaPinterest />, url: "https://www.pinterest.com" },
    ];

    const handleNavigte = () => {
        navigate(`/view-applicant/${jobId}`);
    }

    // Format time function - handle the startTime and endTime format from API
    const formatTime = (timeString) => {
        if (!timeString) return "";
        return timeString;
    };

    // Format date function for workDate
    const formatWorkDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Fetch job data from backend
    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId) return;
            
            try {
                setLoading(true);
                // Get company ID from localStorage
                const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
                
                // Use the new API function
                const result = await getJobById(jobId, companyId);
                
                if (result.statusCode === 200) {
                    setJob(result.data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                console.error("Failed to fetch job details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    
    // Display loading state
    if (loading) {
        return (
            <div className={`flex flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              
                <div className="flex flex-col flex-1 overflow-x-hidden">
                   
                    <div className="flex justify-center items-center h-full">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    // Display error state
    if (error || !job) {
        return (
            <div className={`flex flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                
                <div className="flex flex-col flex-1 overflow-x-hidden">
                   
                    <div className="flex justify-center items-center h-full">
                        <p className="text-xl text-red-500">Error loading job details. Please try again.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
           

            <div className="flex flex-col flex-1 overflow-x-hidden">
              

                <div className="flex justify-end px-4 lg:px-8">
                    <p className={`mt-4 lg:mt-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                        Find Job / {job.jobDuration || "Job Duration"} / Job Details
                    </p>
                </div>

                <div className="flex flex-col px-4 lg:px-8 space-y-4">
                    <div className={`flex flex-col lg:flex-row p-4 lg:p-6 justify-between rounded-lg w-full shadow-sm ${
                        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
                    }`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 lg:mb-0">
                            <div className="flex-shrink-0">
                                <img src={job.companyId?.companyLogo || insta} alt="Company Logo" className="w-16 h-16 object-cover" />
                            </div>
                            <div>
                                <h2 className={`text-xl lg:text-2xl font-semibold ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-700'
                                }`}>
                                    {job.jobTitle}
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.companyId?.address && (
                                        <span className={`px-3 py-1 rounded-full text-sm flex items-center ${
                                            theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border border-gray-500'
                                        }`}>
                                            <FaMapMarkerAlt className="mr-1" />
                                            {job.companyId.address}
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border border-gray-500'
                                    }`}>
                                        ID: {job._id.substring(0, 6)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left text-sm lg:text-right">
                            <p className={theme === 'dark' ? 'text-gray-300 max-w-[235px]' : 'text-black max-w-[235px]'}>
                                Use this PIN code to confirm your booking and respond to the alert.
                            </p>
                            <div className={`mt-2 flex items-center justify-center w-full sm:w-[235px] h-[48px] px-4 py-2 rounded-lg font-semibold tracking-widest ${
                                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200'
                            }`}>
                                {job.jobPin || "No PIN Code"}
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-lg w-full shadow-sm gap-4 ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                            <span className={`text-xl lg:text-2xl font-semibold whitespace-nowrap ${
                                theme === 'dark' ? 'text-white' : ''
                            }`}>
                                {job.noOfApplicants || 0} Applicants:
                            </span>
                            <button
                                onClick={handleNavigte}
                                className="bg-[#FD7F00] w-full sm:w-auto px-6 py-3 text-white rounded-full font-semibold hover:bg-orange-600 transition"
                            >
                                View Applicants
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="flex items-center space-x-3">
                                <div className="w-14 h-14 bg-orange-200 flex items-center justify-center rounded-full flex-shrink-0">
                                    <img src={salary} className="w-7 h-7" alt="" />
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Salary</p>
                                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>${job.pricePerHour || 0}/hr</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-14 h-14 bg-orange-200 flex items-center justify-center rounded-full flex-shrink-0">
                                    <img src={time} className="w-7 h-7" alt="" />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-semibold text-sm ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>Timings</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                                        <div>
                                            <p className={`text-sm font-medium ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>Work Date</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : ''}`}>{formatWorkDate(job.workDate)}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}>Hours</p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : ''}`}>{formatTime(job.startTime)} - {formatTime(job.endTime)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-6 w-full max-w-[1110px] mx-auto">
                    {/* Job Description */}
                    <h2 className={`text-2xl font-bold mb-4 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Job Description</h2>
                    <p className={theme === 'dark' ? 'text-gray-300 leading-relaxed' : 'text-gray-700 leading-relaxed'}>
                        {job.jobDescription || "No description available for this job."}
                    </p>

                    {/* Checkpoints Section - Added from API data */}
                    {job.checkpoints && job.checkpoints.length > 0 && (
                        <div className="mt-6">
                            <h3 className={`text-xl font-bold mb-3 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Checkpoints</h3>
                            <ul className="space-y-2">
                                {job.checkpoints.map((checkpoint, index) => (
                                    <li key={index} className={`p-3 rounded-md ${
                                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                                    }`}>
                                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{checkpoint.name}</p>
                                        {checkpoint.qrCodeData && (
                                            <p className={`text-sm mt-1 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>QR Code: {checkpoint.qrCodeData}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Alert Duration - Added from API data */}
                    <div className="mt-6">
                        <div className="flex items-center">
                            <h3 className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Alert Duration:</h3>
                            <span className="ml-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                {job.alertDuration || 0} Minutes
                            </span>
                        </div>
                    </div>

                    {/* Select Worker Dropdown */}
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <p className={`whitespace-nowrap font-semibold text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Assign from Saved Workers:
                        </p>
                        <select className={`w-full sm:w-[319px] h-[50px] outline-none p-3 rounded-full ${
                            theme === 'dark' 
                                ? 'bg-gray-700 text-gray-300 border-gray-600' 
                                : 'border text-gray-500 bg-gray-100'
                        }`}>
                            <option>Select Worker</option>
                        </select>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className={`whitespace-nowrap font-semibold text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>Share this job:</span>
                        <div className="flex flex-wrap gap-2">
                            {socialLinks.map((platform, i) => (
                                <a
                                    key={i}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                                        theme === 'dark'
                                            ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
                                            : 'border text-blue-600 bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {platform.icon} {platform.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;