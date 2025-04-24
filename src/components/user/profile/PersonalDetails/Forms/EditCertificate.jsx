import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import LoadingSpinner from "../../../../common/LoadingSpinner";
import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;

const EditCertificate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [issueDate, setIssueDate] = useState("");
  const [organization, setOrganization] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateId, setCertificateId] = useState(localStorage.getItem("certificateId") || null);
  const [originalValues, setOriginalValues] = useState({
    issueDate: "",
    organizationName: "",
    certificatePicPdf: null
  });

  useEffect(() => {
    const fetchCertificate = async () => {
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      const storedCertId = certificateId;

      if (!jobSeekerId || !storedCertId) {
        // console.log("Debug: Missing jobSeekerId or certificateId");
        return;
      }

      setIsLoading(true);
      try {
        // console.log("Debug: Fetching certificate with ID:", storedCertId);
        const response = await axios.get(`${BASEURL}/certificate/${storedCertId}`, {
          headers: {
            'jobseekerid': jobSeekerId
          }
        });

        // console.log("Debug: GET certificate response:", response.data);

        if (response.data && response.data.data) {
          const certificate = response.data.data;
          const issueDateValue = new Date(certificate.issueDate).toISOString().split('T')[0];
          
          setIssueDate(issueDateValue);
          setOrganization(certificate.organizationName);
          
          setOriginalValues({
            issueDate: issueDateValue,
            organizationName: certificate.organizationName,
            certificatePicPdf: certificate.certificatePicPdf
          });
          
          if (certificate.certificatePicPdf) {
            setSelectedFile({
              name: certificate.certificatePicPdf.split('/').pop(),
              url: certificate.certificatePicPdf,
              isExisting: true
            });
          }
        }
      } catch (error) {
        console.error("Debug: Error fetching certificate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const jobSeekerId = localStorage.getItem("jobSeekerId");
    if (!jobSeekerId) {
      alert("Please ensure you are logged in");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      if (certificateId) {
        // console.log("Debug: Checking changed fields");
        
        if (issueDate !== originalValues.issueDate) {
          // console.log("Debug: Issue date changed");
          formData.append('issueDate', new Date(issueDate).toISOString());
        }
        
        if (organization !== originalValues.organizationName) {
          // console.log("Debug: Organization name changed");
          formData.append('organizationName', organization);
        }
        
        if (selectedFile instanceof File) {
          // console.log("Debug: New file selected");
          formData.append('certificatePicPdf', selectedFile);
        }

        let hasChanges = false;
        for (let pair of formData.entries()) {
          hasChanges = true;
          break;
        }

        if (!hasChanges) {
          navigate("/User-PersonalDetails");
          return;
        }

        // console.log("Debug: Updating certificate with changed fields:", certificateId);
        const response = await axios.patch(
          `${BASEURL}/certificate/${certificateId}`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        // console.log("Debug: Update response:", response.data);
      } else {
        formData.append('issueDate', new Date(issueDate).toISOString());
        formData.append('organizationName', organization);
        if (selectedFile instanceof File) {
          formData.append('certificatePicPdf', selectedFile);
        }

        // console.log("Debug: Creating new certificate");
        const response = await axios.post(
          `${BASEURL}/certificate`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        // console.log("Debug: Creation response:", response.data);

        if (response.data && response.data.data && response.data.data._id) {
          const newCertId = response.data.data._id;
          setCertificateId(newCertId);
          localStorage.setItem("certificateId", newCertId);
          // console.log("Debug: Saved new certificate ID:", newCertId);
        }
      }

      navigate("/User-PersonalDetails");
    } catch (error) {
      // console.error("Debug: Save operation failed:", error);
      alert(error.response?.data?.message || "Failed to save certificate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log("Debug: New file selected:", file.name);
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {isLoading && <LoadingSpinner />}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-3 overflow-auto">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50">
              <div className="flex items-center p-4">
                <button onClick={() => navigate("/User-PersonalDetails")} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">
                    {certificateId ? "Edit Certificate" : "Add Certificate"}
                  </span>
                </button>
              </div>
              
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSave} className="flex flex-col space-y-4 p-4">
                  <div className="relative">
                    <input
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Select Issue Date"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full p-4 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter Organization Name"
                    required
                  />
                  
                  <div 
                    className={`border-2 border-dashed border-orange-300 rounded-lg p-8 bg-orange-50 cursor-pointer flex flex-col items-center justify-center h-40`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('bg-orange-100');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('bg-orange-100');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('bg-orange-100');
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setSelectedFile(e.dataTransfer.files[0]);
                      }
                    }}
                  >
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <div className="text-orange-500 font-medium mb-2">
                          {selectedFile instanceof File ? selectedFile.name : selectedFile.name}
                        </div>
                        <span className="text-sm text-gray-500">
                          Click to change file
                        </span>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="h-8 w-8 text-orange-500 mb-2" />
                        <span className="text-center text-gray-600">
                          Upload Certificate
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                  >
                    <span>{certificateId ? "Update Certificate" : "Save Certificate"}</span>
                    <FiArrowRight className="ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCertificate;