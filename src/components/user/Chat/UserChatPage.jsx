import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import Header from "../Header";
import Sidebar from "../SideBar";

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

  return (
    <div className="flex h-screen">
      {/* Parent Sidebar */}
      <Sidebar className="w-[170px] bg-[#1e2a47]" />

      <div className="flex flex-1">
        {/* Chat interface container */}
        <div className="flex flex-1">
          {/* Chat Sidebar */}
          <ChatSidebar
            contacts={contacts}
            onSelect={setSelectedContact}
            selectedContact={selectedContact}
          />

          {/* Main Chat Window */}
          <MessageArea selectedContact={selectedContact} />
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;