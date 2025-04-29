import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import Header from "../Header";
import Sidebar from "../SideBar";
import { FaArrowLeft, FaBars } from "react-icons/fa";

const UserChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  console.log("[ChatPage] Current state:", {
    hasSelectedContact: !!selectedContact,
    selectedContactId: selectedContact?.firebaseId,
    showChatSidebar,
    showSidebar,
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
    <div className="flex h-screen">
      {/* Parent Sidebar - Hidden on mobile by default */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full`}>
        <Sidebar className="w-[170px] h-full bg-[#1e2a47]" />
      </div>

      <div className="flex flex-1 flex-col w-full">
        {/* Standard Header - Visible on desktop */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Mobile header with toggle buttons */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b z-20">
          <button 
            onClick={() => {
              console.log("[ChatPage] Toggling main sidebar");
              setShowSidebar(!showSidebar);
            }} 
            className="text-gray-700 p-1"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-bold">{showChatSidebar ? "Messages" : selectedContact?.name}</h1>
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
              <div className="flex items-center justify-center h-full text-gray-500">
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