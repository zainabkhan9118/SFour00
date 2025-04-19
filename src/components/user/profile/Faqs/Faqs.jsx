import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";

const faqs = [
  {
    question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    answer:       "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

  },
  {
    question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    answer:       "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

  },
  {
    question: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    answer:       "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

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
              <div className="p-4 text-blue-500  border-gray-300">
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
