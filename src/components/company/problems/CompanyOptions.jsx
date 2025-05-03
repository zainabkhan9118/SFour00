// CompanyOptions.jsx - Quick reply options for company support chatbot
import React from 'react';

const CompanyOptions = (props) => {
  const options = [
    {
      text: "Recruitment Help",
      handler: () => props.actionProvider.handleRecruitmentIssues(),
      id: 1,
    },
    {
      text: "Subscription Plans",
      handler: () => props.actionProvider.handleSubscriptionQuestions(),
      id: 2,
    },
    {
      text: "Job Posting",
      handler: () => props.actionProvider.handleJobPostingHelp(),
      id: 3,
    },
    {
      text: "Account Issues",
      handler: () => props.actionProvider.handleAccountIssues(),
      id: 4,
    },
    {
      text: "Speak to Human",
      handler: () => props.actionProvider.handleContactHuman(),
      id: 5,
    },
  ];

  return (
    <div className="flex flex-wrap mt-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="bg-white dark:bg-gray-700 border border-orange-500 text-orange-500 rounded-full py-2 px-4 mr-2 mb-2 text-sm hover:bg-orange-500 hover:text-white transition-colors duration-200"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default CompanyOptions;