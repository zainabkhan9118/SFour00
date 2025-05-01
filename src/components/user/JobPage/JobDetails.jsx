import { ArrowRight, X, Upload, Bookmark } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllJobs, fetchJobsByCompany } from "../../../api/jobsApi";
import { applyForJobWithSeekerId, getAppliedJobs } from "../../../api/jobApplicationApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import LazyImage from "../../common/LazyImage";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

export default function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // Handle applying for the job
  const handleApplyForJob = async (e) => {
    e.preventDefault();
    const jobId = id;
    const jobSeekerId = localStorage.getItem("jobSeekerId");
    
    if (!jobSeekerId) {
      toast.error("Please login first to apply for this job");
      return;
    }
    
    setApplying(true);
    setApplyError(null);
    setApplySuccess(false);
    
    try {
      console.log(`Applying for job ${jobId} with jobSeeker ${jobSeekerId}`);
      
      const response = await applyForJobWithSeekerId(jobId, jobSeekerId);
      console.log("API response:", response);

      if (response.statusCode === 201) {
        setApplySuccess(true);
        toast.success("Successfully applied for the job!", { autoClose: 3000 });
        
        try {
          const refreshResponse = await getAppliedJobs(jobSeekerId);
          console.log("Refreshed applied jobs:", refreshResponse);
        } catch (refreshError) {
          console.error("Error refreshing applied jobs:", refreshError);
        }
        
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/User-WorkApplied");
        }, 2000);
      } else if (response.statusCode === 200) {
        setApplyError("You have already applied for this job");
        toast.warning("Already applied for this job.");
      } else {
        throw new Error(response?.message || "Failed to apply for job");
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      setApplyError(error.response?.data?.message || error.message || "Failed to apply for job. Please try again.");
      toast.error(error.response?.data?.message || "Failed to apply for job. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        setLoading(true);
        const allJobsResponse = await fetchAllJobs();
        const allJobs = allJobsResponse?.data || [];
        const jobInfo = allJobs.find(job => job._id === id);

        if (!jobInfo || !jobInfo.companyId || !jobInfo.companyId._id) {
          setError("Job not found");
          setLoading(false);
          return;
        }

        const companyId = jobInfo.companyId._id;
        const response = await fetchJobsByCompany(companyId);
        const companyJobs = response.data || [];
        const jobDetail = companyJobs.find(j => j._id === id);

        if (jobDetail) {
          setJob(jobDetail);
        } else {
          setError("Job not found in company jobs");
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getJobDetails();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    document.getElementById("resumeUpload").click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-sm max-w-md">
            <p className="font-medium text-lg">Error</p>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/User-Job')} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="bg-gray-100 text-gray-700 p-6 rounded-lg shadow-sm max-w-md">
            <p>No job details available</p>
            <button 
              onClick={() => navigate('/User-Job')} 
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Content Container */}
      <div className="container mx-auto py-6 px-4 md:px-8 lg:px-12 max-w-6xl">
        {/* Back to Jobs button */}
        <div className="mb-4">
          <button 
            onClick={() => navigate('/User-Job')} 
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
            <span className="font-medium">Back to Jobs</span>
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8 flex justify-end">
          <span className="hover:text-gray-700 cursor-pointer">Find Job</span> 
          <span className="mx-2">/</span>
          <span className="hover:text-gray-700 cursor-pointer">Categories</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Job Details</span>
        </div>

        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          {/* Header with logo, title, and apply button */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div className="flex gap-5">
              {/* Company logo */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white flex-shrink-0">
                {job.companyId && job.companyId.companyLogo ? (
                  <LazyImage
                    src={job.companyId.companyLogo}
                    alt={`${job.companyId.companyName || 'Company'} logo`}
                    className="w-16 h-16 rounded-full object-cover"
                    fallbackSrc="https://cdn-icons-png.flaticon.com/512/732/732007.png"
                    placeholderColor="#f3f4f6"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                )}
              </div>

              {/* Job title and tags */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.jobTitle || "Senior UX Designer"}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                    {job.noOfApplicants || 0} Applications
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                    {job.companyId?.address || 'Remote'}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                    {job.jobStatus || 'WFH'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
              <div className="flex gap-2 mb-3 w-full md:w-auto">
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Bookmark className="w-5 h-5 text-orange-500" />
                </button>
                <button
                  onClick={(e) => handleApplyForJob(e)}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors flex-grow md:flex-grow-0"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-600">
                Job expires in{" "}
                <span className="text-orange-500 font-medium">
                  {job.workDate ? formatDate(job.workDate) : 'June 30, 2025'}
                </span>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Salary card */}
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M12 8v8"></path>
                  <path d="M16 12H8"></path>
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Salary</div>
                <div className="font-bold text-gray-900">${job.pricePerHour || "35"}/hr</div>
              </div>
            </div>

            {/* Timings card */}
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                <div className="text-sm text-gray-600">Timings</div>
                <div className="font-bold text-gray-900">Fixed date & time</div>
                <div className="text-xs text-gray-500">
                  {job.startTime && job.endTime ? `${job.startTime} - ${job.endTime}` : 'Mon-Fri, 9am-5pm'}
                </div>
              </div>
            </div>
            
            {/* Location card */}
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-bold text-gray-900">{job.companyId?.address || "Remote"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Job Description</h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            {job.jobDescription ? (
              <p>{job.jobDescription}</p>
            ) : (
              <>
                <p>
                  Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus felis. Duis
                  et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo
                  sit amet arcu commodo sollicitudin.
                </p>
                <p>
                  Integer ligula blandit condimentum. Vivamus sit amet ligula ultricorper, pulvinar ante id, tristique
                  erat. Quisque sit amet aliquet urna. Maecenas blandit felis id massa sodales finibus. Integer bibendum
                  eu nulla eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus. Quisque blandit augue quis
                  turpis auctor, egestas auctor ante ultrices. Ut non felis lacinia turpis feugiat euismod at id magna.
                  Sed ut orci arcu. Suspendisse sollicitudin faucibus eleifend.
                </p>
                <p>
                  Nam dapibus consectetur arcu id eget urna augue mollis venenatis augue sed porttitor aliquet nibh. Sed
                  tristique dictum elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in neque sit amet orci
                  interdum tincidunt.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Checkpoints Card (if applicable) */}
        {job.checkpoints && job.checkpoints.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Checkpoints</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {job.checkpoints.map((checkpoint, index) => (
                <li key={index} className="pl-2">
                  <span className="font-medium">{checkpoint.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Share Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-900">Share this job:</span>
            <div className="flex gap-3">
              <button className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Facebook
              </button>
              <button className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
                Twitter
              </button>
              <button className="flex items-center gap-1 text-red-500 text-sm hover:text-red-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-3.8 23.4c-.1-1.1-.2-2.7 0-3.9.2-1.1 1.4-7 1.4-7s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.2.6 2.1 1.7 2.1 2 0 3.6-2.1 3.6-5.1 0-2.7-1.9-4.6-4.6-4.6-3.1 0-5 2.3-5 4.7 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.2 1.1-.3 1.3-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.8-7.2 7.9-7.2 4.2 0 7.4 3 7.4 6.9 0 4.1-2.6 7.5-6.2 7.5-1.2 0-2.4-.6-2.8-1.4 0 0-.6 2.3-.7 2.9-.3 1-1 2.3-1.5 3.1 1.1.3 2.3.5 3.5.5 8.3 0 15-6.7 15-15S20.3 0 12 0z"></path>
                </svg>
                Pinterest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          {/* Modal */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">Apply Job: {job.jobTitle || 'Senior UX Designer'}</h3>
              </div>

              {/* Modal Body */}
              <form className="space-y-5" onSubmit={handleApplyForJob}>
                {/* Resume Upload */}
                <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Upload className="w-5 h-5 text-blue-500" />
                    <span onClick={handleUpload} className="cursor-pointer hover:text-gray-700 transition-colors">
                      Upload Resume
                    </span>
                    <input
                      type="file"
                      id="resumeUpload"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </div>
                  {selectedFile && (
                    <div className="mt-3 text-sm text-green-600 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {selectedFile.name}
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div>
                  <label htmlFor="name1" className="block text-sm font-medium text-gray-700 mb-1">
                    Your First Name
                  </label>
                  <input
                    type="text"
                    id="name1"
                    placeholder="Name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="name2" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Last Name
                  </label>
                  <input
                    type="text"
                    id="name2"
                    placeholder="Name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Job PIN */}
                {job.jobPin && (
                  <div>
                    <label htmlFor="jobPin" className="block text-sm font-medium text-gray-700 mb-1">
                      Job PIN
                    </label>
                    <input
                      type="text"
                      id="jobPin"
                      value={job.jobPin}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You'll need this PIN to confirm your attendance
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
              {applyError && (
                <div className="mt-4 text-sm text-red-600">
                  {applyError}
                </div>
              )}
              {applySuccess && (
                <div className="mt-4 text-sm text-green-600">
                  Successfully applied for the job!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}