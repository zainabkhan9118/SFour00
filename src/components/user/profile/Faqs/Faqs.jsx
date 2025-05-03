import React, { useState, useEffect, useContext } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import UserSidebar from "../UserSidebar";
import { ThemeContext } from "../../../../context/ThemeContext";

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar - Hidden on Mobile */}
      {!isMobile && (
        <div className="hidden md:block md:w-64 border-r border-gray-200 dark:border-gray-700">
          <UserSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header with Sidebar - Shown only on Mobile */}
        {isMobile && (
          <div className="md:hidden">
            <UserSidebar isMobile={true} />
          </div>
        )}
        
        <div className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-800 rounded-[10px] overflow-hidden shadow-md"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left dark:text-white"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  {openIndex === index ? <FaMinus className="dark:text-gray-300" /> : <FaPlus className="dark:text-gray-300" />}
                </button>
                {openIndex === index && (
                  <div className="p-4 text-blue-900 dark:text-blue-300 border-gray-300 dark:border-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
