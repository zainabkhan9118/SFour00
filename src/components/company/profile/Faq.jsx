import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

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
                        <FaPlus className="text-gray-700" />
                      )}
                    </button>
                    {openIndex === index && (
                      <div className="px-4 pb-4 text-gray-700">
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
