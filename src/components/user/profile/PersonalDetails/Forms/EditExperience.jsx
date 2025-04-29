import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from "../../../Header";
import Sidebar from "../../../SideBar";
import UserSidebar from "../../UserSidebar";
import axios from "axios";
import LoadingSpinner from "../../../../common/LoadingSpinner";

const BASEURL = import.meta.env.VITE_BASE_URL;

// Validation schema
const ExperienceSchema = Yup.object().shape({
  experiences: Yup.array().of(
    Yup.object().shape({
      position: Yup.string().required('Position is required'),
      companyName: Yup.string().required('Company name is required'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date().when('currentlyWorking', {
        is: false,
        then: Yup.date().required('End date is required').min(Yup.ref('startDate'), 'End date must be after start date'),
      }),
      currentlyWorking: Yup.boolean(),
      experienceCertificate: Yup.mixed().required('Experience certificate is required'),
    })
  ),
});

const EditExperience = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    experiences: [
      {
        id: 1,
        position: "",
        companyName: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        experienceCertificate: null,
        _id: null,
      },
    ],
  });

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      const jobSeekerId = localStorage.getItem("jobSeekerId");

      if (!jobSeekerId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASEURL}/experience`, {
          headers: {
            jobseekerId: jobSeekerId,
          },
        });

        if (response.data && response.data.data) {
          const experiences = response.data.data.map((exp) => ({
            id: exp._id,
            _id: exp._id,
            position: exp.position,
            companyName: exp.companyName,
            startDate: exp.startDate.split("T")[0],
            endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
            currentlyWorking: exp.currentlyWorking,
            experienceCertificate: exp.experienceCertificate,
          }));

          setInitialValues({ experiences: experiences.length > 0 ? experiences : initialValues.experiences });
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    const jobSeekerId = localStorage.getItem("jobSeekerId");

    if (!jobSeekerId) {
      setFieldError('submit', 'Please ensure you are logged in and try again');
      setSubmitting(false);
      setIsLoading(false);
      return;
    }

    try {
      const successfulExperiences = [];

      for (const experience of values.experiences) {
        try {
          const dataToSend = {
            position: experience.position,
            companyName: experience.companyName,
            startDate: new Date(experience.startDate).toISOString(),
            currentlyWorking: experience.currentlyWorking,
            ...(experience.currentlyWorking
              ? {}
              : {
                  endDate: experience.endDate
                    ? new Date(experience.endDate).toISOString()
                    : null,
                }),
          };

          const formDataToSend = new FormData();
          Object.keys(dataToSend).forEach((key) => {
            if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
              formDataToSend.append(key, dataToSend[key]);
            }
          });

          if (experience.experienceCertificate instanceof File) {
            formDataToSend.append("experienceCertificate", experience.experienceCertificate);
          }

          let response;

          if (experience._id) {
            response = await axios.patch(`${BASEURL}/experience/${experience._id}`, formDataToSend, {
              headers: {
                jobseekerId: jobSeekerId,
              },
            });
          } else {
            response = await axios.post(`${BASEURL}/experience`, formDataToSend, {
              headers: {
                jobseekerId: jobSeekerId,
              },
            });
          }

          successfulExperiences.push(response.data);
        } catch (expError) {
          console.error("Error saving individual experience:", expError);
          setFieldError(`experiences[${values.experiences.indexOf(experience)}]`, 'Failed to save this experience');
        }
      }

      if (successfulExperiences.length > 0) {
        navigate("/User-PersonalDetails");
      }
    } catch (error) {
      console.error("Error in save operation:", error);
      setFieldError('submit', 'Failed to save experiences. Please try again.');
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
                  <span className="font-medium text-black">Experience</span>
                </button>
              </div>

              <div className="w-full max-w-2xl">
                <Formik
                  initialValues={initialValues}
                  validationSchema={ExperienceSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, setFieldValue, errors, touched }) => (
                    <Form className="flex flex-col space-y-4 p-4">
                      {errors.submit && (
                        <div className="text-red-500 text-sm">{errors.submit}</div>
                      )}
                      <div className="space-y-4">
                        {values.experiences.map((experience, index) => (
                          <div key={experience.id} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">Experience {index + 1}</h3>
                              {values.experiences.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newExperiences = values.experiences.filter((_, i) => i !== index);
                                    setFieldValue('experiences', newExperiences);
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
                                  name={`experiences.${index}.position`}
                                  type="text"
                                  className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                  placeholder="Position"
                                />
                                <ErrorMessage
                                  name={`experiences.${index}.position`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div>
                                <Field
                                  name={`experiences.${index}.companyName`}
                                  type="text"
                                  className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                  placeholder="Company Name"
                                />
                                <ErrorMessage
                                  name={`experiences.${index}.companyName`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              <div className="flex flex-col space-y-3">
                                <div className="relative">
                                  <label className="text-sm text-gray-600 mb-1">Start Date</label>
                                  <Field
                                    name={`experiences.${index}.startDate`}
                                    type="date"
                                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                  />
                                  <ErrorMessage
                                    name={`experiences.${index}.startDate`}
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>

                                <div className="relative">
                                  <label className="text-sm text-gray-600 mb-1">End Date</label>
                                  <Field
                                    name={`experiences.${index}.endDate`}
                                    type="date"
                                    className="w-full p-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none pr-10"
                                    disabled={values.experiences[index].currentlyWorking}
                                  />
                                  <ErrorMessage
                                    name={`experiences.${index}.endDate`}
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name={`experiences.${index}.currentlyWorking`}
                                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 text-sm text-gray-600">Currently Working</label>
                              </div>

                              <div className="relative">
                                <label className="text-sm text-gray-600 mb-1">Experience Certificate</label>
                                <div
                                  className="border border-dashed border-orange-300 rounded-lg p-4 bg-orange-50 cursor-pointer"
                                  onClick={() => document.getElementById(`certificate-${index}`).click()}
                                >
                                  <div className="flex items-center">
                                    <svg
                                      className="w-5 h-5 text-orange-500 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    <span className="text-sm text-gray-700">
                                      {values.experiences[index].experienceCertificate instanceof File
                                        ? values.experiences[index].experienceCertificate.name
                                        : values.experiences[index].experienceCertificate
                                        ? values.experiences[index].experienceCertificate.split("/").pop()
                                        : "Upload Experience Certificate"}
                                    </span>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id={`certificate-${index}`}
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    setFieldValue(`experiences.${index}.experienceCertificate`, file || null);
                                  }}
                                />
                                <ErrorMessage
                                  name={`experiences.${index}.experienceCertificate`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const newId = Math.max(...values.experiences.map((exp) => exp.id)) + 1;
                            setFieldValue('experiences', [
                              ...values.experiences,
                              {
                                id: newId,
                                position: "",
                                companyName: "",
                                startDate: "",
                                endDate: "",
                                currentlyWorking: false,
                                experienceCertificate: null,
                                _id: null,
                              }
                            ]);
                          }}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-500 transition"
                        >
                          + Add Another Experience
                        </button>
                      </div>

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

export default EditExperience;