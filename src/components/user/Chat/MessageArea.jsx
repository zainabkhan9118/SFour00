import React from "react";
import { FaPhoneAlt, FaPaperclip, FaSmile, FaPaperPlane } from "react-icons/fa";

const MessageArea = ({ selectedContact }) => {
  return (
    <div className="w-full md:w-2/3 h-screen flex flex-col">
      <div className="bg-white p-4 flex justify-between border-b">
        <div className="flex items-center">
          <img src={selectedContact.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h2 className="font-bold">{selectedContact.name}</h2>
            <span className="text-sm text-gray-500">{selectedContact.role}</span>
          </div>
        </div>
        <FaPhoneAlt className="text-orange-400 text-xl" />
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="mb-4 p-3 bg-orange-200 rounded-lg w-max">{selectedContact.message}</div>
      </div>
      <div className="p-4 border-t flex items-center">
        <FaPaperclip className="text-gray-500 mr-3" />
        <input
          type="text"
          placeholder="Write a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <FaSmile className="text-gray-500 mx-3" />
        <FaPaperPlane className="text-orange-400 text-xl cursor-pointer" />
      </div>
    </div>
  );
};

export default MessageArea;
