import React from "react";
import { FaSearch, FaTimes, FaCog } from "react-icons/fa";
import useContactSearch from "../../../hooks/useContactSearch";

const ChatSidebar = ({ contacts, onSelect, selectedContact }) => {
  // Add a null check for selectedContact to prevent the error
  const selectedContactName = selectedContact?.name || "";
  
  // Use the custom search hook
  const { 
    searchQuery, 
    setSearchQuery, 
    filteredContacts, 
    hasResults, 
    isSearching 
  } = useContactSearch(contacts);

  return (
    <div className="w-full md:w-[320px] bg-white border-r flex flex-col h-[calc(100vh-64px)] md:h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Messages</h2>
            <span className="text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full">2 New</span>
          </div>
          <div className="flex items-center">
            <FaCog className="text-gray-400 hover:text-gray-700 cursor-pointer" />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 bg-gray-100 rounded-md text-sm"
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 p-1"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>
      
      <ul className="flex-1 overflow-y-auto">
        {hasResults ? (
          filteredContacts.map((contact, index) => (
            <li
              key={index}
              className={`border-b ${contact.name === selectedContactName ? 'bg-gradient-to-r from-orange-500 to-blue-900' : 'hover:bg-gray-100'} cursor-pointer`}
              onClick={() => onSelect(contact)}
            >
              <div className="flex items-center p-4">
                <div className="relative">
                  <img src={contact.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3" />
                  {/* Only show online indicator for the first contact when not searching */}
                  {index === 0 && !isSearching && (
                    <div className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0"> {/* Add min-width to prevent flex items from overflowing */}
                  <div className="flex justify-between">
                    <span className={`font-medium ${contact.name === selectedContactName ? 'text-white' : 'text-gray-800'}`}>
                      {contact.name}
                    </span>
                    <span className={`text-xs ${contact.name === selectedContactName ? 'text-white' : 'text-gray-500'}`}>
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs ${contact.name === selectedContactName ? 'text-white' : 'text-gray-500'}`}>
                      {contact.role}
                    </span>
                    <span className={`text-sm truncate mt-1 ${contact.name === selectedContactName ? 'text-white' : 'text-gray-600'}`}>
                      {contact.message}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-6 text-center text-gray-500">No matches found</li>
        )}
      </ul>
    </div>
  );
};

export default ChatSidebar;