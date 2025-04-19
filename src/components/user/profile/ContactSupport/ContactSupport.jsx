import React, { useState } from "react";
import Header from "../../Header";
import Sidebar from "../../SideBar";
import UserSidebar from "../UserSidebar";

const ContactSupport = () => {
  const [message, setMessage] = useState("");
  
  const messages = [
    { id: 1, text: "This is Auto-Generated Message!", type: "received" },
    { id: 2, text: "Tap to send message!", type: "received" },
    { id: 3, text: "Lorem Ipsum Dolor Sit Amet", type: "received" },
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <main className="flex-1">
          <div className="flex flex-row flex-1">
            <UserSidebar />
            <div className="w-full ml-3 mx-auto p-6">
              <div className="bg-white rounded-lg p-6">
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

                {/* Chat Section */}
                <div className="flex flex-col h-[calc(100vh-300px)]">
                  <div className="flex-grow"></div>
                  
                  {/* Auto-Generated Messages */}
                  <div className="flex flex-col space-y-4 items-end mb-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-center space-x-2 justify-end">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500 [transform:rotate(120deg)]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                            />
                          </svg>
                        </div>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg text-gray-600 text-sm">
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="flex items-center mt-2">
                    <input
                      type="text"
                      placeholder="Write a message..."
                      className="flex-1 px-4 py-2 border border-orange-300 rounded-full h-[62px] focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="ml-4 bg-orange-400 text-orange-600 p-3 rounded-full hover:bg-orange-800 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-500 [transform:rotate(180deg)]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l19.5-9-7.875 9L21.75 21l-19.5-9z"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactSupport;