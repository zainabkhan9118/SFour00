import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

const faqs = [
  {
    question: "What is the S4 App?",
    answer:
      "S4 is a dedicated platform for the security industry, connecting job seekers with companies hiring for security roles. Whether you're looking to start or advance your career or find qualified candidates, S4 streamlines the entire process.",
  },
  {
    question: "How do I sign up on the S4 App?",
    answer:       "Simply download the app, choose whether you’re a job seeker or a company, and follow the easy registration process to get started.",

  },
  {
    question: "Is the app only for security jobs?",
    answer:       "Yes, S4 focuses specifically on jobs within the security sector, including positions like security guards, supervisors, CCTV operators, and more.",

  },
  {
    question: "Can companies post multiple job listings?",
    answer:       "Absolutely. Companies can post as many job listings as they need and manage applications directly through the app dashboard.",

  },
  {
    question: "Is S4 available in all cities?",
    answer:       "The app currently supports select cities but is continuously expanding. You’ll be notified as soon as new locations become available.",

  },
  {
    question: "Is there a fee to use the S4 App?",
    answer:    "Job seekers can use the app for free. Companies may be charged based on the number of job posts or premium features they use.",

  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div className="w-64 bg-white border-r">
              <CompanySideBar />
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-[#E5E7EB] rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex justify-between items-center p-4 text-left"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="text-gray-900">{faq.question}</span>
                      {openIndex === index ? (
                        <FaMinus className="text-gray-700" />
                      ) : (
                        <FaPlus className="text-gray-700 " />
                      )}
                    </button>
                    {openIndex === index && (
                      <div className="px-4 pb-4 text-blue-900 ">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQs;
