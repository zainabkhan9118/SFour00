import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import Header from "../Header";
import Sidebar from "../SideBar";
import { FaArrowLeft, FaBars } from "react-icons/fa";

const UserChatPage = () => {
  const [contacts, setContacts] = useState([
    { name: "Marvin McKinney", role: "Human Resources", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=3", time: "12h" },
    { name: "Jacob Jones", role: "Marketing Coordinator", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=2", time: "16h" },
    { name: "Leslie Alexander", role: "Web Designer", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=1", time: "24h" },
    { name: "Eleanor Pena", role: "Developer", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=5", time: "Aug 17" },
    { name: "Kathryn Murphy", role: "Project Manager", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=4", time: "8m" },
    { name: "Wade Warren", role: "Web Design", message: "Lorem ipsum dolor sit amet", avatar: "https://i.pravatar.cc/100?img=6", time: "8m" },
  ]);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Handle selecting a contact on mobile view
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    // On mobile, hide the sidebar after selecting a contact
    if (window.innerWidth < 768) {
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
            onClick={() => setShowSidebar(!showSidebar)} 
            className="text-gray-700 p-1"
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
              contacts={contacts}
              onSelect={handleContactSelect}
              selectedContact={selectedContact}
            />
          </div>

          {/* Main Chat Window - Full width on mobile when sidebar is hidden */}
          <div className={`${showChatSidebar ? 'hidden' : 'block'} md:block flex-1 w-full`}>
            <MessageArea 
              selectedContact={selectedContact} 
              onBackClick={() => setShowChatSidebar(true)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;