import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar"; 

import { FaPaperPlane } from "react-icons/fa";

const ChatComponent = () => {
  const messages = [
    "This is Auto-Generated Message!",
    "Tap to send message!",
    "Lorem Ipsum Dolor Sit Amet",
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar takes full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header at the top */}
        <Header />
    <div className="flex flex-col h-screen p-6 bg-white">
      {/* User Info */}
      <div className="flex items-center mb-6">
        <img
          src="https://via.placeholder.com/40" // Replace with actual image URL
          alt="User"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-semibold">Leslie Alexander</h2>
          <p className="text-gray-500 text-sm">Customer Support</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col flex-1 justify-end space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-center">
            <FaPaperPlane className="text-gray-500 text-sm mr-2" />
            <p className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">
              {msg}
            </p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-md">
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 outline-none bg-transparent text-gray-700"
        />
        <button className="text-orange-500 text-lg">
          <FaPaperPlane />
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default ChatComponent;
