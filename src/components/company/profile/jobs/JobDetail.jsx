import React from "react";
import Sidebar from "../../Sidebar";
import Header from "../../Header";
import insta from "../../../../assets/images/insta.png";
import salary from "../../../../assets/images/salary.png";
import time from "../../../../assets/images/time.png";
import { FaFacebook, FaTwitter, FaPinterest } from "react-icons/fa";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JobDetail = () => {
    const socialLinks = [
        { name: "Facebook", icon: <FaFacebook />, url: "https://www.facebook.com" },
        { name: "Twitter", icon: <FaTwitter />, url: "https://www.twitter.com" },
        { name: "Pinterest", icon: <FaPinterest />, url: "https://www.pinterest.com" },
    ];
    const navigate = useNavigate();

    const handleNavigte = () => {
        navigate("/view-applicant")
    }

    //for gettig data from backend ..
    useEffect(() => {
       
    }, []);


    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
            <Sidebar className="lg:block lg:w-1/4" />

            <div className="flex flex-col flex-1 overflow-x-hidden">
                <Header />

                <div className="flex justify-end px-4 lg:px-8">
                    <p className="text-gray-400 mt-4 lg:mt-6 text-sm">
                        Find Job / Graphics & Design / Job Details
                    </p>
                </div>

                <div className="flex flex-col px-4 lg:px-8 space-y-4">
                    <div className="flex flex-col lg:flex-row p-4 lg:p-6 justify-between rounded-lg w-full bg-white shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 lg:mb-0">
                            <div className="flex-shrink-0">
                                <img src={insta} alt="Instagram" className="w-16 h-16" />
                            </div>
                            <div>
                                <h2 className="text-xl lg:text-2xl text-gray-700 font-semibold">
                                    Senior UX Designer
                                </h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["2 Miles Away", "New York City", "ID: 7878"].map(
                                        (item, i) => (
                                            <span key={i} className="px-3 py-1 border border-gray-500 rounded-full text-sm">
                                                {item}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-left text-sm lg:text-right">
                            <p className="text-black max-w-[235px]">
                                Use this PIN code to confirm your booking and respond to the alert.
                            </p>
                            <div className="mt-2 flex items-center justify-center w-full sm:w-[235px] h-[48px] bg-gray-200 px-4 py-2 rounded-lg font-semibold tracking-widest">
                                8 1 1 4 4 6
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-lg w-full bg-white shadow-sm gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                            <span className="text-xl lg:text-2xl font-semibold whitespace-nowrap">05 Applicants:</span>
                            <button
                                onClick={() => handleNavigte()}
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
                                    <p className="text-gray-600 text-sm">Salary</p>
                                    <p className="font-semibold">$15/hr</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-14 h-14 bg-orange-200 flex items-center justify-center rounded-full flex-shrink-0">
                                    <img src={time} className="w-7 h-7" alt="" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-semibold text-sm">Timings</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Start date & Time</p>
                                            <p className="text-xs">5 NOV 2024 9:00AM</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">End date & Time:</p>
                                            <p className="text-xs">5 NOV 2024 9:00AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-6 w-full max-w-[1110px] mx-auto">
                    {/* Job Description */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Integer aliquet pretium consequat. Donec et sapien id leo accumsan
                        pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt
                        vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo
                        sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum.
                        Vivamus sit amet ligula ullamcorper, pulvinar ante id, tristique erat.
                        Quisque sit amet aliquam urna. Maecenas blandit felis id massa sodales
                        finibus. Integer bibendum eu nulla eu sollicitudin.
                    </p>
                    <p className="text-gray-700 leading-relaxed mt-4">
                        Nam dapibus consectetur erat in euismod. Cras urna augue, mollis
                        venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum
                        elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque
                        sit amet orci interdum tincidunt.
                    </p>

                    {/* Select Worker Dropdown */}
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <p className="whitespace-nowrap font-semibold text-lg text-gray-900">
                            Assign from Saved Workers:
                        </p>
                        <select className="w-full sm:w-[319px] h-[50px] outline-none p-3 border rounded-full text-gray-500 bg-gray-100">
                            <option>Select Worker</option>
                        </select>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="whitespace-nowrap font-semibold text-lg text-gray-800">Share this job:</span>
                        <div className="flex flex-wrap gap-2">
                            {socialLinks.map((platform, i) => (
                                <a
                                    key={i}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 border rounded-full text-blue-600 text-sm font-medium bg-gray-100 hover:bg-gray-200 transition"
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