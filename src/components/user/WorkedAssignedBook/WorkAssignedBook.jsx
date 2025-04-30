import React from 'react'
import { useState, useEffect, useContext } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import HeaderWork from "../HeaderWork";
import PopupButton4 from '../popupModel/PopupButton4';
import PopupButton5 from '../popupModel/PopupButton5';
import PopupButton6 from '../popupModel/PopupButton6';
import PopupButton1 from '../popupModel/PopupButton1';
import PopupButton2 from '../popupModel/PopupButton2';
import PopupButton3 from '../popupModel/PopupButton3';

import { AppContext } from "../../../context/AppContext";
import LoadingSpinner from "../../common/LoadingSpinner";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const WorkAssignedBook = () => {
    const [showButton1, setShowButton1] = useState(false);
    const [showButton2, setShowButton2] = useState(false);
    const [showButton3, setShowButton3] = useState(false);
    const [showButton4, setShowButton4] = useState(false);
    const [showButton5, setShowButton5] = useState(false);
    const [showButton6, setShowButton6] = useState(false);
    const [assignedJobs, setAssignedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const { BASEURL } = useContext(AppContext);

    // const fetchAllJobs = async () => {
    //     try {
    //         setLoading(true);
    //         let jobSeekerId = localStorage.getItem("jobSeekerId");
            
    //         if (!jobSeekerId) {
    //             const auth = getAuth();
    //             const currentUser = auth.currentUser;
    //             if (currentUser) {
    //                 const firebaseId = currentUser.uid;
    //                 try {
    //                     const userResponse = await axios.get(`${BASEURL}/job-seeker`, {
    //                         headers: {
    //                             "firebase-id": firebaseId,
    //                         },
    //                     });
    //                     if (userResponse.data?.data?._id) {
    //                         jobSeekerId = userResponse.data.data._id;
    //                         localStorage.setItem("jobSeekerId", jobSeekerId);
    //                     }
    //                 } catch (err) {
    //                     console.error("Error fetching user data:", err);
    //                     throw new Error("Unable to fetch user data. Please try logging in again.");
    //                 }
    //             }
    //         }

    //         if (!jobSeekerId) {
    //             throw new Error("Unable to fetch jobs. Please try logging out and back in.");
    //         }

    //         // Instead of making two separate API calls, let's fetch ALL jobs in one call
    //         // and then filter them client-side to ensure we get everything
    //         console.log('Fetching ALL jobs for jobSeekerId:', jobSeekerId);
    //         const response = await axios.get(`${BASEURL}/apply/${jobSeekerId}`);
    //         console.log('All jobs response:', response);
            
    //         const allJobs = response?.data?.data || [];
    //         console.log('Total jobs found:', allJobs.length);
            
    //         // Now filter client-side to get both job types we want to display
    //         const assignedJobs = allJobs.filter(job => job.status === "assigned");
    //         console.log('Jobs with status "assigned" (for Book On):', assignedJobs);
            
    //         const assignableJobs = allJobs.filter(job => job.isAssignable === true);
    //         console.log('Jobs with isAssignable=true (for Accept/Decline):', assignableJobs);

    //         // Combine both types while avoiding duplicates (by ID)
    //         const seenIds = new Set();
    //         const combinedJobs = [];
            
    //         // Add all assignable jobs first (with Accept/Decline buttons)
    //         assignableJobs.forEach(job => {
    //             combinedJobs.push(job);
    //             seenIds.add(job._id);
    //         });
            
    //         // Then add assigned jobs (with Book On button) if not already included
    //         assignedJobs.forEach(job => {
    //             if (!seenIds.has(job._id)) {
    //                 combinedJobs.push(job);
    //             }
    //         });
            
    //         console.log('Combined jobs to display:', combinedJobs);
    //         setAssignedJobs(combinedJobs);
    //         setLoading(false);
    //     } catch (err) {
    //         console.error("Error fetching jobs:", err);
    //         setError(err.message || "Failed to load jobs. Please try again later.");
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchAllJobs();
    // }, [BASEURL]);

    const handleBookJob = async (applicationId) => {
        console.log("Booking job with application ID:", applicationId);
        try {
            setSelectedApplicationId(applicationId);
            setShowButton4(true);
        } catch (error) {
            console.error("Error selecting job to book:", error);
        }
    };

    const confirmBookJob = async () => {
        if (!selectedApplicationId) return;
        
        try {
            setLoading(true);
            const response = await assignJobToApplicant(selectedApplicationId);
            console.log("Job booking response:", response);
            
            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                toast?.success?.("Job booked successfully") || 
                    console.log("Job booked successfully");
                
                // Refresh the jobs list
                await fetchAllJobs();
                setShowButton5(true);
            } else {
                throw new Error(response?.message || "Failed to book job");
            }
        } catch (error) {
            console.error("Error booking job:", error);
            toast?.error?.(error.message || "Failed to book job") || 
                console.error("Failed to book job:", error.message);
            setShowButton4(false);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (applicationId) => {
        console.log("Accepting job application with ID:", applicationId);
        try {
            setLoading(true);
            setSelectedApplicationId(applicationId);
            
            // Call the API function to assign the job to the applicant
            const response = await assignJobToApplicant(applicationId);
            console.log("Job assignment response:", response);
            
            // If successfully assigned, show the success popup sequence
            if (response && (response.statusCode === 200 || response.statusCode === 201)) {
                toast?.success?.("Job accepted successfully") || 
                    console.log("Job accepted successfully");
                    
                setShowButton1(true);
                // Refresh the jobs list
                await fetchAllJobs();
            } else {
                throw new Error(response?.message || "Failed to accept job");
            }
        } catch (error) {
            console.error("Error accepting job:", error);
            toast?.error?.(error.message || "Failed to accept job") || 
                console.error("Failed to accept job:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = (jobId) => {
        console.log("Declining job:", jobId);
        // Add logic to decline the job
        toast?.info?.("Job declined") || 
            console.log("Job declined");
    };

    // Close button handlers
    const handlePopup1Close = (confirmed) => {
        if (confirmed) {
            setShowButton1(false);
            setShowButton2(true);
        } else {
            setShowButton1(false);
        }
    };

    const handlePopup2Close = (confirmed) => {
        if (confirmed) {
            setShowButton2(false);
            setShowButton3(true);
        } else {
            setShowButton2(false);
        }
    };

    const handlePopup3Close = () => {
        setShowButton3(false);
    };

    const handlePopup4Close = (confirmed) => {
        if (confirmed) {
            confirmBookJob();
        } else {
            setShowButton4(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex items-center justify-center h-screen">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <Header />
                <div className="max-w-6xl mx-auto md:mx-0 p-4 sm:p-6">
                    {/* Tabs */}
                    <HeaderWork />

                    {/* Job List */}
                    <div className="">
                        {error ? (
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : assignedJobs.length > 0 ? (
                            assignedJobs.map((application) => {
                                const job = application.jobId || {};
                                const showAcceptDecline = application.isAssignable === true;
                                const showBookOn = application.status === "assigned";
                                
                                return (
                                    <div
                                        key={application._id}
                                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center p-4 rounded-lg shadow-sm bg-white mb-4"
                                    >
                                        {/* Job Icon and Details */}
                                        <div className="flex items-center col-span-1 sm:col-span-2 md:col-span-2 space-x-4">
                                            <img
                                                src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/2111/2111646.png"}
                                                alt={job.jobTitle || "Company"}
                                                className="w-12 h-12 rounded-full border border-gray-300"
                                                onError={(e) => {
                                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/2111/2111646.png";
                                                }}
                                            />
                                            <div>
                                                <h3 className="font-medium text-lg">{job.jobTitle || "No Title Available"}</h3>
                                                <div className="text-sm text-gray-500 flex items-center flex-wrap">
                                                    <span>{job.jobLocation || "Location not specified"}</span>
                                                    <span className="mx-2 hidden sm:inline">•</span>
                                                    <span>£{job.pricePerHour || "Rate not specified"} per hour</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Date and Status */}
                                        <div className="flex flex-col sm:flex-col lg:flex-row items-start md:items-center justify-between col-span-1 sm:col-span-1 md:col-span-1 space-y-2 sm:space-y-0 sm:space-x-6">
                                            <div className="text-sm font-medium text-gray-400">
                                                {job.workDate ? new Date(job.workDate).toLocaleDateString() : "Date not available"}
                                            </div>
                                            <div className="flex items-center font-medium text-xs text-green-500">
                                                <CheckIcon />
                                                <span className="ml-1 text-sm">{application.status || "Assigned"}</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <BookmarkIcon />
                                            </button>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 sm:gap-2 col-span-1 md:col-span-1">
                                            {showAcceptDecline ? (
                                                <>
                                                    <button
                                                        onClick={() => handleDecline(application._id)}
                                                        className="bg-gray-800 text-white font-semibold w-full sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-gray-700"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => handleAccept(application._id)}
                                                        className="bg-orange-500 text-white font-semibold w-full sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-orange-400"
                                                    >
                                                        Accept
                                                    </button>
                                                </>
                                            ) : showBookOn ? (
                                                <button
                                                    onClick={() => handleBookJob(application._id)}
                                                    className="bg-orange-500 text-white w-full sm:w-[110px] h-[40px] text-sm rounded-full hover:bg-orange-400"
                                                >
                                                    Book On
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <p className="text-gray-500">No assigned jobs found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Accept job popups */}
            {showButton1 && (
                <PopupButton1
                    onClose={() => handlePopup1Close(true)}
                    onClose1={() => handlePopup1Close(false)}
                />
            )}

            {showButton2 && (
                <PopupButton2
                    onClose={() => handlePopup2Close(true)}
                    onClose2={() => handlePopup2Close(false)}
                />
            )}
            
            {showButton3 && (
                <PopupButton3 onClose={() => handlePopup3Close()} />
            )}

            {/* Book On popups */}
            {showButton4 && (
                <PopupButton4
                    onClose={() => handlePopup4Close(true)}
                    onClose4={() => handlePopup4Close(false)}
                />
            )}

            {showButton5 && (
                <PopupButton5
                    onClose={() => {
                        setShowButton5(false);
                        setShowButton6(true);
                    }}
                    onClose5={() => {
                        setShowButton5(false);
                    }}
                />
            )}
            
            {showButton6 && (
                <PopupButton6
                    onClose={() => {
                        setShowButton6(false);
                    }}
                />
            )}
        </div>
    );
};

export default WorkAssignedBook;
