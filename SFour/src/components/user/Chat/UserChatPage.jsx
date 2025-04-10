import React, { useState } from "react";

import ChatSidebar from "./ChatSidebar";
import MessageArea from "./MessageArea";
import Header from "../Header";
import Sidebar from "../SideBar";

const UserChatPage = () => {
  const [contacts, setContacts] = useState([
    { name: "Leslie Alexander", role: "Web Designer", message: "Hello there!", avatar: "https://i.pravatar.cc/100?img=1", active: true },
    { name: "Jacob Jones", role: "Marketing Coordinator", message: "How are you?", avatar: "https://i.pravatar.cc/100?img=2" },
  ]);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  return (
    <div className="flex flex-row h-screen">
      {/* Parent Sidebar */}
      <Sidebar className="w-full md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Parent Header */}
        <Header />

        <div className="flex flex-row p-6 bg-[#FFFFFF]">
          {/* Chat Sidebar */}
          <ChatSidebar contacts={contacts} onSelect={setSelectedContact} />

          {/* Main Chat Window */}
          <MessageArea selectedContact={selectedContact} />
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
