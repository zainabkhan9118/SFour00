import React from "react";
import { FaSearch } from "react-icons/fa";

const ChatSidebar = ({ contacts, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 bg-gray-100 p-4 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Messages</h2>
        <span className="text-sm bg-orange-400 text-white px-2 py-1 rounded-full">2 New</span>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-8 border rounded-lg"
        />
        <FaSearch className="absolute left-2 top-3 text-gray-400" />
      </div>
      <ul>
        {contacts.map((contact, index) => (
          <li
            key={index}
            className={`flex items-center p-3 rounded-lg cursor-pointer ${contact.active ? "bg-gray-300" : "hover:bg-gray-200"}`}
            onClick={() => onSelect(contact)}
          >
            <img src={contact.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex flex-col">
              <span className="font-bold">{contact.name}</span>
              <span className="text-sm text-gray-500">{contact.message}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatSidebar;
