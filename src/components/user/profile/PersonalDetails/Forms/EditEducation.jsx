import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import { getAuth } from "firebase/auth";
import axios from "axios";
import LoadingSpinner from "../../../../common/LoadingSpinner";

const BASEURL = import.meta.env.VITE_BASE_URL;

// Validation schema
const educationSchema = Yup.object().shape({
  educations: Yup.array().of(
    Yup.object().shape({
      degree: Yup.string().required('Degree is required'),
      institution: Yup.string().required('Institution is required'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date().when('currentlyStudying', {
        is: false,
        then: Yup.date().required('End date is required when not currently studying')
      }),
      currentlyStudying: Yup.boolean()
    })
  )
});

const EditEducation = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState({
    educations: [
      { 
        id: null,
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        currentlyStudying: false,
        __v: 0
      }
    ]
  });

  useEffect(() => {
    const fetchEducations = async () => {
      setIsLoading(true);
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      if (!jobSeekerId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASEURL}/education`, {
          headers: {
            'jobseekerid': jobSeekerId,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.data) {
          const educations = response.data.data.map(edu => ({
            id: edu._id,
            degree: edu.degreeName,
            institution: edu.institute,
            startDate: edu.startDate.split('T')[0],
            endDate: edu.endDate ? edu.endDate.split('T')[0] : '',
            currentlyStudying: edu.currentlyEnrolled,
            certificate: edu.certificate,
            __v: edu.__v
          }));

          setInitialFormData({ educations: educations.length > 0 ? educations : initialFormData.educations });
        }
      } catch (error) {
        console.error("Error fetching educations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const handleSubmit = async (values, { setStatus, setSubmitting }) => {
    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");

    if (!jobSeekerId) {
      setStatus({ error: "Authentication required. Please login again." });
      setIsLoading(false);
      return;
    }

    try {
      const newEducations = [];
      const updateEducations = [];

      values.educations.forEach(education => {
        if (!education.degree || !education.institution) {
          return;
        }

        const educationData = {
          degreeName: education.degree,
          institute: education.institution,
          startDate: new Date(education.startDate).toISOString(),
          endDate: education.currentlyStudying ? null : education.endDate ? new Date(education.endDate).toISOString() : null,
          currentlyEnrolled: education.currentlyStudying || false
        };

        if (education.id) {
          updateEducations.push({ ...educationData, _id: education.id });
        } else {
          newEducations.push(educationData);
        }
      });

      // Create new education entries
      if (newEducations.length > 0) {
        await axios.post(
          `${BASEURL}/education`,
          newEducations,
          { 
            headers: {
              'jobseekerId': jobSeekerId,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Update existing education entries
      for (const education of updateEducations) {
        await axios.patch(
          `${BASEURL}/education/${education._id}`,
          {
            degreeName: education.degreeName,
            institute: education.institute,
            startDate: education.startDate,
            endDate: education.endDate,
            currentlyEnrolled: education.currentlyEnrolled
          },
          {
            headers: {
              'jobseekerId': jobSeekerId,
              'id': education._id,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setStatus({ success: "Education details saved successfully!" });
      navigate(-1);
    } catch (error) {
      setStatus({ error: error.response?.data?.message || error.message || "Failed to save education details" });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/User-PersonalDetails");
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      {isLoading && <LoadingSpinner />}
      
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="p-4 flex-1 bg-gray-50 h-[100vh] overflow-auto">
              <div className="flex items-center p-4">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800 flex items-center">
                  <FaArrowLeft className="mr-2" />
                  <span className="font-medium text-black">Education</span>
                </button>
              </div>

              <div className="w-full max-w-2xl">
                <Formik
                  initialValues={initialFormData}
                  validationSchema={educationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, errors, touched, status, setFieldValue }) => (
                    <Form className="flex flex-col space-y-4 p-4">
                      <div className="space-y-4">
                        {values.educations.map((education, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Education {index + 1}</h3>
                              {values.educations.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newEducations = values.educations.filter((_, i) => i !== index);
                                    setFieldValue('educations', newEducations);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Field
                                  name={`educations.${index}.degree`}
                                  type="text"
                                  className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                  placeholder="Degree"
                                />
                                {errors.educations?.[index]?.degree && touched.educations?.[index]?.degree && (
                                  <div className="text-red-500 text-sm mt-1">{errors.educations[index].degree}</div>
                                )}
                              </div>

                              <div>
                                <Field
                                  name={`educations.${index}.institution`}
                                  type="text"
                                  className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                  placeholder="Institution"
                                />
                                {errors.educations?.[index]?.institution && touched.educations?.[index]?.institution && (
                                  <div className="text-red-500 text-sm mt-1">{errors.educations[index].institution}</div>
                                )}
                              </div>

                              <div className="flex flex-col space-y-3">
                                <div className="relative">
                                  <label className="text-sm text-gray-600 mb-1">Start Date</label>
                                  <Field
                                    name={`educations.${index}.startDate`}
                                    type="date"
                                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                  />
                                  {errors.educations?.[index]?.startDate && touched.educations?.[index]?.startDate && (
                                    <div className="text-red-500 text-sm mt-1">{errors.educations[index].startDate}</div>
                                  )}
                                </div>

                                <div className="relative">
                                  <label className="text-sm text-gray-600 mb-1">End Date</label>
                                  <Field
                                    name={`educations.${index}.endDate`}
                                    type="date"
                                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                    disabled={values.educations[index].currentlyStudying}
                                  />
                                  {errors.educations?.[index]?.endDate && touched.educations?.[index]?.endDate && (
                                    <div className="text-red-500 text-sm mt-1">{errors.educations[index].endDate}</div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name={`educations.${index}.currentlyStudying`}
                                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-600">Currently Studying</label>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const newEducation = {
                              id: null,
                              degree: "",
                              institution: "",
                              startDate: "",
                              endDate: "",
                              currentlyStudying: false,
                              __v: 0
                            };
                            setFieldValue('educations', [...values.educations, newEducation]);
                          }}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                        >
                          + Add Another Education
                        </button>
                      </div>

                      {status && status.error && (
                        <div className="text-red-500 text-center p-2 bg-red-50 rounded">{status.error}</div>
                      )}
                      
                      {status && status.success && (
                        <div className="text-green-500 text-center p-2 bg-green-50 rounded">{status.success}</div>
                      )}

                      <button 
                        type="submit"
                        className="w-full bg-orange-500 text-white font-medium p-4 rounded-full hover:bg-orange-600 transition flex items-center justify-center"
                        disabled={isLoading}
                      >
                        <span>{isLoading ? "Loading..." : "Save Edits"}</span>
                        {!isLoading && <FiArrowRight className="ml-2" />}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEducation;