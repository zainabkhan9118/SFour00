import React, { useState, useRef, useEffect } from "react";
import CompanySideBar from "./CompanySideBar";
import { FaPaperPlane } from "react-icons/fa";
import userImage from "../../../assets/images/Ellipse 105.png";
import LoadingSpinner from "../../common/LoadingSpinner";

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "This is Auto-Generated Message!", sender: "support" },
    { id: 2, text: "Tap to send message!", sender: "support" },
    { id: 3, text: "Lorem Ipsum Dolor Sit Amet", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  // Track screen size for responsive sidebar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");

    // Simulate API call for sending message
    setTimeout(() => {
      // Add support response
      const supportResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message. Our support team will get back to you shortly.",
        sender: "support",
      };
      setMessages((prevMessages) => [...prevMessages, supportResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Desktop Sidebar - Hidden on Mobile */}
        {!isMobile && (
          <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200">
            <CompanySideBar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Mobile Header with Sidebar - Shown only on Mobile */}
          {isMobile && (
            <div className="md:hidden">
              <CompanySideBar isMobile={true} />
            </div>
          )}

          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
              {/* User Info */}
              <div className="flex items-center p-4 border-b">
                <img
                  src={userImage}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold">Leslie Alexander</h2>
                  <p className="text-gray-500 text-sm">Customer Support</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center ${
                        msg.sender === "user"
                          ? "bg-orange-500 text-white ml-2"
                          : "bg-gray-200 text-gray-700 mr-2"
                      } px-4 py-2 rounded-lg text-sm max-w-[70%]`}
                    >
                      {msg.sender === "support" && (
                        <FaPaperPlane className="mr-2 text-gray-500 text-sm" />
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1 border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 outline-none bg-transparent text-gray-700"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="text-orange-500 text-lg hover:text-orange-600"
                      disabled={isLoading}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSupport;