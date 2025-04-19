import React, { useState } from "react";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";
import { Send } from "lucide-react";

const ContactSupport = () => {
  const [message, setMessage] = useState("");
  
  // Sample predefined messages
  const messages = [
    { id: 1, text: "This is Auto-Generated Message!", type: "received" },
    { id: 2, text: "Tap to send message!", type: "received" },
    { id: 3, text: "Lorem ipsum Dolor Sit Amet", type: "received" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would add code to actually send the message to your backend
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <main className="flex-3">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="w-[60vw] ml-4 p-6">
              <div className="bg-white rounded-lg p-5 h-[calc(100vh-200px)] flex flex-col">
                {/* Support agent info */}
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl mr-3">
                    LA
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Leslie Alexander</h3>
                    <p className="text-gray-500 text-sm">Customer Support</p>
                  </div>
                </div>
                
                {/* Chat area */}
                <div className="flex-1 overflow-y-auto mb-4 px-2">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-end">
                        <div className="bg-gray-300 text-gray-700 rounded-lg py-2 px-4 max-w-[70%]">
                          {msg.text}
                        </div>
                        <div className="w-3 h-3 transform rotate-45 -ml-1 bg-gray-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Message input */}
                <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-full p-1 pl-4">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    className="flex-1 bg-transparent outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center ml-2"
                  >
                    <Send size={16} color="white" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactSupport;