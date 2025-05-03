import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaChevronLeft, FaUser } from "react-icons/fa";
import { getJobById } from "../../../../api/jobsApi";
import LoadingSpinner from "../../../common/LoadingSpinner";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import { ThemeContext } from "../../../../context/ThemeContext";

const JobDetail = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useContext(ThemeContext) || { theme: 'light' };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        return timeString;
    };

    const formatWorkDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId) return;
            
            try {
                setLoading(true);
                const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
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

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
                <div className="flex-1">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <div className="flex-1 flex justify-center items-center">
                <p className="text-red-500 text-xl">Error loading job details. Please try again.</p>
            </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center px-4 md:px-6 py-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                    <FaChevronLeft className="mr-2" /> Back
                </button>
            </div>

            <div className="flex-1 px-4 md:px-6 py-4 space-y-6">
                <div className="flex flex-col md:flex-row p-4 md:p-6 justify-between items-start md:items-center gap-4 md:gap-0 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <img 
                                src={job.companyId?.companyLogo || insta} 
                                alt="Company Logo" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{job.jobTitle}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {job.companyId?.address && (
                                    <span className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm flex items-center text-gray-700 dark:text-gray-300">
                                        <FaMapMarkerAlt className="mr-1" />
                                        {job.companyId.address}
                                    </span>
                                )}
                                <span className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300">
                                    ID: {job._id.substring(0, 6)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-left text-sm flex flex-col justify-start">
                        <p className="text-gray-800 dark:text-gray-200 mb-2 w-full md:w-[235px]">
                            Use this PIN code to confirm your booking and respond to the alert.
                        </p>
                        <div className="flex items-center justify-center w-[235px] h-[48px] bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg font-semibold tracking-widest text-gray-800 dark:text-gray-200">
                            {job.jobPin || "No PIN Code"}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                            <img src={salary} className="w-9 h-9" alt="Salary icon" />
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Salary</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">${job.pricePerHour || 0}/hr</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-orange-200 dark:bg-orange-300/20 flex items-center justify-center rounded-full">
                            <img src={time} className="w-8 h-8" alt="Time icon" />
                        </div>
                        <div>
                            <p className="text-gray-800 dark:text-gray-200 font-semibold text-sm">Timings</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Date</p>
                                    <p className="text-[12px] text-gray-600 dark:text-gray-400">{formatWorkDate(job.workDate)}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hours</p>
                                    <p className="text-[12px] text-gray-600 dark:text-gray-400">{formatTime(job.startTime)} - {formatTime(job.endTime)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 md:p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Job Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.jobDescription || "No description available for this job."}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 md:p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Applicants</h2>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 dark:text-gray-400">{job.noOfApplicants || 0} applicant(s)</span>
                        <button 
                            onClick={() => navigate(`/view-applicant/${job._id}`)} 
                            className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition"
                        >
                            View All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {job.applicantsList && job.applicantsList.length > 0 ? (
                            job.applicantsList.slice(0, 2).map((applicant) => (
                                <div key={applicant._id} className="flex justify-between items-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                            {applicant.profilePic ? (
                                                <img 
                                                    src={applicant.profilePic} 
                                                    alt={applicant.fullname} 
                                                    className="w-10 h-10 rounded-full object-cover" 
                                                />
                                            ) : (
                                                <FaUser className="text-gray-500 dark:text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{applicant.fullname}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {applicant.address && applicant.address.length > 0
                                                    ? applicant.address[0].address
                                                    : "No address provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                            {applicant.status || "Applied"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-6 text-gray-500 dark:text-gray-400">No applicants yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;