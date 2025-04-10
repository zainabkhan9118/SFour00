import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { IoIosTimer } from "react-icons/io";
import { Link } from "react-router-dom";

const JobPosting = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    ratePerHour: "",
    jobLocation: "",
    startTime: "",
    endTime: "",
    jobPin: Array(5).fill(""),
    pointName: "",
    alertDuration: "",
    jobDescription: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJobPinChange = (index, value) => {
    setFormData((prevData) => {
      const newJobPin = [...prevData.jobPin];
      newJobPin[index] = value;
      return {
        ...prevData,
        jobPin: newJobPin,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission: you can send formData to your backend or perform other actions
    console.log(formData);
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/3 lg:w-1/4" />

      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <Header/>

        <div className="rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">Post a Job</h1>
          <form className="space-y-3 w-full lg:w-[992px]" onSubmit={handleSubmit}>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
              value={formData.jobTitle}
              onChange={handleChange}
            />
            <input
              type="text"
              name="ratePerHour"
              placeholder="Enter rate per hour"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
              value={formData.ratePerHour}
              onChange={handleChange}
            />
            <input
              type="text"
              name="jobLocation"
              placeholder="Enter job location"
              className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
              value={formData.jobLocation}
              onChange={handleChange}
            />

            <div className="flex flex-col md:flex-row md:space-x-3 mb-3">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  name="startTime"
                  placeholder="Start Time"
                  className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none pr-10"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                <IoIosTimer className="absolute top-[22px]  right-3 transform -translate-y-1/2 text-2xl  text-gray-800" />
              </div>
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  name="endTime"
                  placeholder="End Time"
                  className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none pr-10"
                  value={formData.endTime}
                  onChange={handleChange}
                />
                <IoIosTimer className="absolute top-[22px] right-3 transform -translate-y-1/2 text-2xl text-gray-800" />
              </div>
            </div>

            <div className="flex flex-row justify-between mb-3 ">
              <label className="block mb-4 md:mb-0 text-xl font-bold ">
                Create Job Pin
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-black font-medium">Generate Auto</span>
                <button
                  type="button"
                  onClick={() => setIsToggled(!isToggled)}
                  className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${isToggled ? "bg-[#00263D]" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${isToggled ? "translate-x-7" : ""
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* create job portion */}
            <div className="">
              <div className="flex space-x-2 mb-3">
                {[...Array(5)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="w-[67px] h-[63px] outline-none p-2 border border-gray-400 rounded text-center"
                    value={formData.jobPin[index]}
                    onChange={(e) => handleJobPinChange(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="flex flex-row justify-between mb-3">
                <label className="block mb-4 md:mb-0 text-xl font-bold ">
                  Create Check-in Points
                </label>
                <div className="flex items-center space-x-2 ">
                  <span className="text-black font-medium">Generate Auto</span>
                  <button
                    type="button"
                    onClick={() => setIsToggled(!isToggled)}
                    className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 transition duration-300 ${isToggled ? "bg-[#00263D]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition duration-300 ${isToggled ? "translate-x-7" : ""
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <input
                type="text"
                name="pointName"
                placeholder="Point Name"
                className="w-full h-[50px] bg-[#3950801A] p-4 mb-3 border rounded-full outline-none"
                value={formData.pointName}
                onChange={handleChange}
              />
              <div>
              <button
                type="button"
                className="text-[#171A1F] text-3xl font-semibold mb-4"
              >
                + Add More
              </button>
            </div>
            <select
              name="alertDuration"
              className="w-full h-[50px] bg-[#3950801A] outline-none mb-3 rounded-full px-4"
              value={formData.alertDuration}
              onChange={handleChange}
            >
              <option value="" className="bg-white text-gray-500">Choose alert duration</option>
              <option value="15min" className="bg-white text-gray-500">15 Minutes</option>
              <option value="30min" className="bg-white text-gray-500">30 Minutes</option>
              <option value="1hour" className="bg-white text-gray-500">1 Hour</option>
              <option value="2hours" className="bg-white text-gray-500">2 Hours</option>
            </select>

              </div>
            <textarea
              name="jobDescription"
              placeholder="Enter job description"
              className="w-full h-[150px] bg-[#3950801A] p-4 mb-3 border rounded-md outline-none"
              rows="3"
              value={formData.jobDescription}
              onChange={handleChange}
            ></textarea>
             <Link to='/recents-jobs'>
            <div className="flex justify-end">
             <button
                type="submit"
                className="bg-orange-500 w-full md:w-[305px] h-[56px] rounded-full text-white p-2"
              >
                Post Job →
              </button>
            </div>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPosting;