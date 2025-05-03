import React, { useContext } from "react";
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import CompanyChatbotConfig from './CompanyChatbotConfig';
import CompanyMessageParser from './CompanyMessageParser';
import CompanyActionProvider from './CompanyActionProvider';
import { ThemeContext } from "../../../context/ThemeContext";
import CompanySideBar from "../profile/CompanySideBar";

const ProblemChat = () => {
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  
  // Enhanced custom styling to make the chatbot more attractive
  const chatbotStyles = `
    .react-chatbot-kit-chat-container {
      width: 100%;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      ${theme === 'dark' ? 'border: 1px solid #374151;' : ''}
    }
    
    .react-chatbot-kit-chat-header {
      background-color: #f97316;
      color: white;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      font-weight: 600;
      padding: 16px;
    }
    
    .react-chatbot-kit-chat-bot-message {
      background-color: ${theme === 'dark' ? '#1F2937' : 'white'} !important;
      border: 1px solid ${theme === 'dark' ? '#374151' : '#e2e8f0'};
      color: ${theme === 'dark' ? '#E5E7EB' : '#000000'};
      border-radius: 18px;
      margin-left: 10px;
      padding: 12px 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, ${theme === 'dark' ? '0.2' : '0.05'});
    }
    
    .react-chatbot-kit-chat-bot-message-arrow {
      border-right: 8px solid ${theme === 'dark' ? '#1F2937' : 'white'};
      display: none;
    }
    
    .react-chatbot-kit-chat-btn-send {
      background-color: #f97316;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .react-chatbot-kit-chat-btn-send-icon {
      fill: white;
      width: 18px;
      height: 18px;
    }
    
    .react-chatbot-kit-chat-btn-send:hover {
      background-color: #ea580c;
    }
    
    .react-chatbot-kit-chat-input {
      border-radius: 9999px;
      padding: 12px 20px;
      font-size: 14px;
      border: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
      background-color: ${theme === 'dark' ? '#111827' : 'white'};
      color: ${theme === 'dark' ? '#E5E7EB' : 'inherit'};
    }
    
    .react-chatbot-kit-chat-input:focus {
      border-color: #f97316;
      outline: none;
    }
    
    .react-chatbot-kit-chat-input-container {
      border-top: 1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'};
      padding: 16px;
      background-color: ${theme === 'dark' ? '#1F2937' : '#f9fafb'};
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    
    .react-chatbot-kit-chat-message-container {
      padding: 16px;
      background-color: ${theme === 'dark' ? '#111827' : '#f9fafb'};
      height: calc(100vh - 360px);
      background-image: ${theme === 'dark' 
        ? 'linear-gradient(to right, rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(249, 115, 22, 0.1) 1px, transparent 1px)' 
        : 'linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px)'};
      background-size: 20px 20px;
    }
    
    .react-chatbot-kit-user-chat-message {
      background-color: #f97316;
      color: white;
      border-radius: 18px;
      box-shadow: 0 2px 4px rgba(249, 115, 22, ${theme === 'dark' ? '0.4' : '0.3'});
      padding: 12px 16px;
    }
    
    .react-chatbot-kit-user-chat-message-arrow {
      border-left: 8px solid #f97316;
      display: none;
    }
    
    /* Style the quick option buttons */
    .react-chatbot-kit-chat-bot-message-container .flex {
      margin-top: 8px;
    }
    
    .react-chatbot-kit-chat-bot-message-container .flex button {
      background-color: ${theme === 'dark' ? '#1F2937' : 'white'};
      border: 1px solid #f97316;
      color: #f97316;
      border-radius: 20px;
      padding: 8px 16px;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      transition: all 0.2s;
    }
    
    .react-chatbot-kit-chat-bot-message-container .flex button:hover {
      background-color: #f97316;
      color: white;
    }
  `;

  return (
    <div className={`flex flex-col md:flex-row bg-white dark:bg-gray-900 transition-colors duration-200`}>
      {/* Add the custom styles */}
      <style>{chatbotStyles}</style>

      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <CompanySideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Sidebar - Shown only on Mobile */}
        <div className="md:hidden">
          <CompanySideBar isMobile={true} />
        </div>
        
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Business Support</h2>
            {/* Chatbot Component */}
            <div className="h-[calc(100vh_-_300px)]">
              <Chatbot
                config={CompanyChatbotConfig}
                messageParser={CompanyMessageParser}
                actionProvider={CompanyActionProvider}
                headerText="S4 Business Support"
                placeholderText="Type your message here..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemChat;
