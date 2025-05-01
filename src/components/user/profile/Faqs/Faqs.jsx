import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";

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

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
     <div className="flex h-screen overflow-hidden">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col h-screen  flex-1 overflow-hidden">
      {/* Header */}
      <Header />
   
      <main className="flex-3"> 
      <div className="flex flex-row flex-1">
      <UserSidebar />
    <div className="w-full mx-auto p-6 h-screen overflow-auto">
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
