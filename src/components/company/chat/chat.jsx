import React, { useState, useContext } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea"; 
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Handle selecting a contact on mobile view
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    if (window.innerWidth < 768) {
      setShowChatSidebar(false);
    }
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
      <div className="flex flex-1 flex-col md:flex-row relative w-full">
        {/* Mobile header with toggle buttons */}
        <div className={`md:hidden flex items-center justify-between p-4 border-b z-20 ${
          theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800'
        }`}>
          <button 
            onClick={() => setShowSidebar(!showSidebar)} 
            className={`p-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-bold">{showChatSidebar ? "Messages" : selectedContact?.name}</h1>
          {!showChatSidebar && (
            <button 
              onClick={() => setShowChatSidebar(true)}
              className="text-orange-500 p-1"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
        </div>

        {/* Chat interface container */}
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Chat Sidebar - Toggle on mobile */}
          <div className={`${showChatSidebar ? 'block' : 'hidden'} md:block z-10 w-full md:w-auto`}>
            <ChatSidebar
              onSelect={handleContactSelect}
              selectedContact={selectedContact}
            />
          </div>

          {/* Main Chat Window - Full width on mobile when sidebar is hidden */}
          <div className={`${showChatSidebar ? 'hidden' : 'block'} md:block flex-1 w-full`}>
            {selectedContact ? (
              <MessageArea 
                selectedContact={selectedContact} 
                onBackClick={() => setShowChatSidebar(true)} 
              />
            ) : (
              <div className={`flex items-center justify-center h-full ${
                theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'text-gray-500'
              }`}>
                Select a job seeker to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;