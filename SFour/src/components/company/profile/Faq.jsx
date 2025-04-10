import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from "../Header";
import Sidebar from "../Sidebar"; 

const faqs = [
  {
    question: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    question: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    answer:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar takes full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header at the top */}
        <Header />
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-lg p-4 shadow-md"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <p className="text-gray-700 font-medium">{faq.question}</p>
              {openIndex === index ? (
                <FaMinus className="text-gray-700" />
              ) : (
                <FaPlus className="text-gray-700" />
              )}
            </div>
            {openIndex === index && (
              <p className="mt-3 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
    </div>
  );
};

export default FAQs;
