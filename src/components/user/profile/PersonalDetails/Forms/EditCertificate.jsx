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
    const storedCertId = localStorage.getItem("certificateId");
    if (storedCertId) {
      const fetchCertificate = async () => {
        const jobSeekerId = localStorage.getItem("jobSeekerId");
        if (!jobSeekerId) return;

        setIsLoading(true);
        try {
          const response = await axios.get(`${BASEURL}/certificate/${storedCertId}`, {
            headers: {
              'jobseekerid': jobSeekerId
            }
          });

          if (response.data && response.data.data) {
            const certificate = response.data.data;
            const issueDateValue = new Date(certificate.issueDate).toISOString().split('T')[0];
            
            setIssueDate(issueDateValue);
            setOrganization(certificate.organizationName);
            setCertificateId(storedCertId);
            
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
          // If certificate not found, clear storage and state
          if (error.response?.status === 404) {
            localStorage.removeItem("certificateId");
            setCertificateId(null);
            console.log("Certificate not found, treating as new certificate creation");
          } else {
            console.error("Error fetching certificate:", error.response?.data?.message || error.message);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchCertificate();
    }
  }, []); 

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
      formData.append('issueDate', new Date(issueDate).toISOString());
      formData.append('organizationName', organization);
      if (selectedFile instanceof File) {
        formData.append('certificatePicPdf', selectedFile);
      }

      let response;
      
      if (certificateId) {
        // Update existing certificate
        response = await axios.patch(
          `${BASEURL}/certificate/${certificateId}`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new certificate
        response = await axios.post(
          `${BASEURL}/certificate`,
          formData,
          {
            headers: {
              'jobseekerid': jobSeekerId,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      console.log("Certificate response:", response.data);

      // Handle the response
      if (response.data) {
        const certificate = response.data.data || response.data;
        const certId = certificate.id || certificate._id || (certificate.certificate && (certificate.certificate.id || certificate.certificate._id));

        if (certId) {
          localStorage.setItem("certificateId", certId);
          setCertificateId(certId);
          console.log("Certificate operation successful:", certId);
          navigate("/User-PersonalDetails");
        } else {
          console.error("Response structure:", response.data);
          throw new Error("Could not find certificate ID in response");
        }
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If certificate not found during update, clear the ID and try creating a new one
        localStorage.removeItem("certificateId");
        setCertificateId(null);
        
        try {
          // Attempt to create a new certificate
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

          if (response.data) {
            const certificate = response.data.data || response.data;
            const certId = certificate.id || certificate._id || (certificate.certificate && (certificate.certificate.id || certificate.certificate._id));

            if (certId) {
              localStorage.setItem("certificateId", certId);
              setCertificateId(certId);
              console.log("New certificate created successfully:", certId);
              navigate("/User-PersonalDetails");
              return;
            }
          }
        } catch (createError) {
          console.error("Failed to create new certificate:", createError);
          throw createError;
        }
      }
      
      console.error("Failed to save certificate:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save certificate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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