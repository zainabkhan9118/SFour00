// Options.jsx - Component for showing quick option buttons in the chatbot
import React from 'react';

const Options = (props) => {
  const options = [
    {
      text: "Account Issues",
      handler: () => props.actionProvider.handleAccountIssues(),
      id: 1,
    },
    {
      text: "Payment Questions",
      handler: () => props.actionProvider.handlePaymentQuestions(),
      id: 2,
    },
    {
      text: "Job Application Help",
      handler: () => props.actionProvider.handleJobApplicationHelp(),
      id: 3,
    },
    {
      text: "Contact Human Support",
      handler: () => props.actionProvider.handleContactHuman(),
      id: 4,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-sm text-gray-700 transition-colors"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default Options;