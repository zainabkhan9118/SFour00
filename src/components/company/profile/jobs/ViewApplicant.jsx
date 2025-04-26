import React, { useState, useEffect } from "react";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import AssignJobButton from "./popupsButtons/AssignJobButton";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../common/LoadingSpinner";

const ViewApplicant = () => {
    const [showButton, setShowButton] = useState(false);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    // Format date function for workDate
    const formatWorkDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Fetch job data from backend
    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId) return;
            
            try {
                setLoading(true);
                // Using the company jobs endpoint and filtering for the specific job
                const companyId = localStorage.getItem('companyId') || "68076cb1a9cc0fa2f47ab34e";
                const response = await fetch(`/api/jobs/company/${companyId}`);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const result = await response.json();
                
                if (result.statusCode === 200 && Array.isArray(result.data)) {
                    // Find the specific job by ID
                    const foundJob = result.data.find(job => job._id === jobId);
                    if (foundJob) {
                        setJob(foundJob);
                    } else {
                        throw new Error("Job not found");
                    }
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

    const handleViewApplicant = (applicant) => {
        setSelectedApplicant(applicant);
        navigate(`/applicant-profile`, { state: { applicant } });
    };

    const handleAssignJob = (applicant) => {
        setSelectedApplicant(applicant);
        setShowButton(true);
    };
    
    // Display loading state
    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />
                <div className="flex flex-col flex-1 w-full">
                    <Header />
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    // Display error state
    if (error || !job) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />
                <div className="flex flex-col flex-1 w-full">
                    <Header />
                    <div className="flex justify-center items-center h-full">
                        <p className="text-xl text-red-500">Error loading job details. Please try again.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar className="w-full md:w-1/4 h-auto md:h-screen" />

            <div className="flex flex-col flex-1 w-full">
                <Header />
                <div className="flex justify-end px-4 md:px-8">
                    <p className="text-gray-400 mt-4 md:mt-6 text-sm md:text-base">
                        Find Job / {job.jobDuration || "Job Duration"} / Job Applicants
                    </p>
                </div>

                <div className="flex flex-col px-4 md:px-8 space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row p-4 md:p-6 justify-between rounded-lg w-full bg-white shadow-sm">
                        <div className="flex items-center space-x-4 mb-6 md:mb-0">
                            <div className="flex items-center justify-center rounded-full">
                                <img 
                                    src={job.companyId?.companyLogo || insta} 
                                    alt="Company Logo" 
                                    className="w-16 h-16 md:w-20 md:h-20 object-cover" 
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl text-gray-700 font-semibold">{job.jobTitle}</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.companyId?.address && (
                                        <span className="px-3 py-1 border border-gray-500 rounded-full text-sm flex items-center">
                                            <FaMapMarkerAlt className="mr-1" />
                                            {job.companyId.address}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 border border-gray-500 rounded-full text-sm">
                                        ID: {job._id.substring(0, 6)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left text-sm">
                            <p className="text-black w-full md:w-[235px]">
                                Use this PIN code to confirm your booking and respond to the alert.
                            </p>
                            <div className="mt-2 flex items-center justify-center w-full md:w-[235px] h-[48px] bg-gray-300 px-4 py-2 rounded-lg font-semibold tracking-widest">
                                {job.jobPin || "No PIN Code"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg w-full bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                                <img src={salary} className="w-9 h-9" alt="Salary icon" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Salary</p>
                                <p className="font-semibold">${job.pricePerHour || 0}/hr</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 bg-orange-200 flex items-center justify-center rounded-full">
                                <img src={time} className="w-8 h-8" alt="Time icon" />
                            </div>
                            <div>
                                <p className="text-gray-900 font-semibold text-sm">Timings</p>
                                <div className="flex flex-col gap-1 md:gap-3">
                                    <div className="flex flex-col flex-wrap">
                                        <p className="text-sm font-medium text-gray-700">Work Date</p>
                                        <p className="text-[12px]">{formatWorkDate(job.workDate)}</p>
                                    </div>
                                    <div className="flex flex-col flex-wrap">
                                        <p className="text-sm font-medium text-gray-700">Hours</p>
                                        <p className="text-[12px]">{job.startTime} - {job.endTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-3">
                            {job.noOfApplicants || 0} Applicant(s):
                        </h1>
                        <div className="space-y-4">
                            {job.applicantsList && job.applicantsList.length > 0 ? (
                                job.applicantsList.map((applicant) => (
                                    <div 
                                        key={applicant._id} 
                                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
                                            <div className="w-12 h-12 bg-[#023047] rounded-full flex items-center justify-center flex-shrink-0">
                                                {applicant.profilePic ? (
                                                    <img 
                                                        src={applicant.profilePic} 
                                                        alt={applicant.fullname} 
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <CiUser className="text-white text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{applicant.fullname}</p>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <FaMapMarkerAlt className="text-gray-500 mr-1 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {applicant.address && applicant.address.length > 0
                                                            ? applicant.address[0].address
                                                            : "No address provided"}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
                                            <button 
                                                onClick={() => handleViewApplicant(applicant)}
                                                className="bg-[#023047] w-full md:w-[174px] h-[44px] text-white px-4 py-2 rounded-full hover:bg-[#034067] transition-colors"
                                            >
                                                View Applicant
                                            </button>
                                            <button 
                                                onClick={() => handleAssignJob(applicant)}
                                                className="bg-[#FD7F00] w-full md:w-[174px] h-[44px] text-white px-4 py-2 rounded-full hover:bg-[#e67200] transition-colors"
                                            >
                                                Assign Job
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-gray-500">No applicants for this job yet.</p>
                            )}
                        </div>
                    </div>
                </div>
                {showButton && <AssignJobButton onClose={() => setShowButton(false)} applicant={selectedApplicant} job={job} />}
            </div>
        </div>
    );
};

export default ViewApplicant;