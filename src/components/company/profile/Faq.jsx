import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

const faqs = [
  {
    question: "What is S4 App?",
    answer: "S4 is a dedicated platform for the security industry, connecting job seekers with companies hiring for security roles. Whether you're looking to start or advance your career or find qualified candidates, S4 streamlines the entire process.",
  },
  {
    question: "How do I sign up on the S4 App?",
    answer: "Simply download the app, choose whether you're a job seeker or a company, and follow the easy registration process to get started.",
  },
  {
    question: "Is the app only for security jobs?",
    answer: "Yes, S4 focuses specifically on jobs within the security sector, including positions like security guards, supervisors, CCTV operators, and more.",
  },
  {
    question: "How do I update my profile?",
    answer: "Go to the 'Profile' section from the main menu. You can edit your details there...",
  },
  {
    question: "Can company post multiple jobs?",
    answer: "Absolutely. Companies can post as many job listings as they need and manage applications directly through the app dashboard.",
  },
  {
    question: "How can I contact support?",
    answer: "You can contact support via the 'Help & Support' section or email us at support@s4app.com...",
  },
  {
    question: "Can I use S4 App offline?",
    answer: "No it requires internet connection for every feature right now like job posting, applying, profile updates, chatting, reporting and real-time updates",
  },
  {
    question: "How do I change my password?",
    answer: "Navigate to 'Profile' -> 'Reset Password' -> 'Change Password'",
  },
  {
    question: "Devices supported by S4 App?",
    answer: "The S4 App is compatible with both Android and iOS devices. Make sure to check the play store for the latest version.",
  },
  {
    question: "Is there a fee to use the S4 App?",
    answer: "The app is free to download and use for both job seekers and Companies right now. However, some premium features may incur charges in the future.",
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
