import React, { useState, useContext } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import { FaArrowLeft } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";

const UserChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  console.log("[ChatPage] Current state:", {
    hasSelectedContact: !!selectedContact,
    selectedContactId: selectedContact?.firebaseId,
    showChatSidebar,
    isMobile: window.innerWidth < 768
  });

  // Handle selecting a contact on mobile view
  const handleContactSelect = (contact) => {
    console.log("[ChatPage] Contact selected:", {
      contactId: contact.firebaseId,
      contactName: contact.name,
      previousContactId: selectedContact?.firebaseId
    });
    
    setSelectedContact(contact);
    // On mobile, hide the sidebar after selecting a contact
    if (window.innerWidth < 768) {
      console.log("[ChatPage] Mobile view - hiding chat sidebar");
      setShowChatSidebar(false);
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="flex flex-1 flex-col w-full">
        {/* Mobile header with toggle buttons */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20">
          <h1 className="text-lg font-bold dark:text-white">{showChatSidebar ? "Messages" : selectedContact?.name}</h1>
          {!showChatSidebar && (
            <button 
              onClick={() => {
                console.log("[ChatPage] Showing chat sidebar");
                setShowChatSidebar(true);
              }}
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
                onBackClick={() => {
                  console.log("[ChatPage] Back button clicked - showing chat sidebar");
                  setShowChatSidebar(true);
                }} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a contact to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;