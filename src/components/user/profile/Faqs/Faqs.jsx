import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";

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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
     <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
   
      <main className="flex-3"> 
      <div className="flex flex-row flex-1">
      <UserSidebar />
    <div className="max-w-3xl ml-6 mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-[10px] overflow-hidden shadow-md"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaMinus /> : <FaPlus />}
            </button>
            {openIndex === index && (
              <div className="p-4 text-blue-900  border-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>

    </main>
    </div></div>
  );
};

export default FAQSection;
