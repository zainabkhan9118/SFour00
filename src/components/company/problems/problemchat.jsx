import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import Header from "../Header";
import Sidebar from "../Sidebar"; 
import { FaArrowLeft, FaBars } from "react-icons/fa";

const ProblemChat = () => {
  const [contacts, setContacts] = useState([
    { 
      name: "Marvin McKinney", 
      role: "Technical Support",
      message: "Lorem ipsum dolor sit amet", 
      avatar: "https://i.pravatar.cc/100?img=3",
      time: "12h",
      problemStatus: "Open",
      problemId: "PRB-001"
    },
    { 
      name: "Jacob Jones", 
      role: "IT Specialist",
      message: "Lorem ipsum dolor sit amet", 
      avatar: "https://i.pravatar.cc/100?img=2",
      time: "16h",
      problemStatus: "In Progress",
      problemId: "PRB-002"
    },
    // ...more problem contacts
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [showChatSidebar, setShowChatSidebar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    if (window.innerWidth < 768) {
      setShowChatSidebar(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block fixed md:relative z-30 h-full`}>
        <Sidebar className="w-[170px] h-full bg-[#1e2a47]" />
      </div>

      <div className="flex flex-1 flex-col md:flex-row relative w-full">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b z-20">
          <button 
            onClick={() => setShowSidebar(!showSidebar)} 
            className="text-gray-700 p-1"
          >
            <FaBars size={20} />
          </button>
          <h1 className="text-lg font-bold">
            {showChatSidebar ? "Problem Reports" : `${selectedContact?.problemId} - ${selectedContact?.name}`}
          </h1>
          {!showChatSidebar && (
            <button 
              onClick={() => setShowChatSidebar(true)}
              className="text-orange-500 p-1"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-1 w-full overflow-hidden">
          <div className={`${showChatSidebar ? 'block' : 'hidden'} md:block z-10 w-full md:w-auto`}>
            <ChatSidebar
              contacts={contacts}
              onSelect={handleContactSelect}
              selectedContact={selectedContact}
              showProblemStatus={true}
            />
          </div>

          <div className={`${showChatSidebar ? 'hidden' : 'block'} md:block flex-1 w-full`}>
            <MessageArea 
              selectedContact={selectedContact} 
              onBackClick={() => setShowChatSidebar(true)}
              isProblemChat={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemChat;
