import React, { useState, useRef } from "react";
import { FaPhoneAlt, FaPaperclip, FaSmile, FaPaperPlane, FaEllipsisV, FaPlay, FaImage, FaTimes } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";
import FileAttachment from "./FileAttachment";

const MessageArea = ({ selectedContact }) => {
  const userAvatar = "https://i.pravatar.cc/100?img=10"; 
  const [messageInput, setMessageInput] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFileAttachmentOpen, setIsFileAttachmentOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "contact",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor nulla leo tempus ut enim. Tellus odio eu et lobortum suspendisse. Fuerat ut eu vehicula dolor id mollitia mi augue ligula porttitor est.",
      time: "August 21"
    },
    {
      id: 2,
      sender: "user",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor nulla leo tempus ut enim. Tellus odio eu et lobortum suspendisse.",
      time: "5:50 pm"
    },
    {
      id: 3,
      sender: "contact",
      text: "",
      isAudio: true,
      time: "August 22"
    }
  ]);
  const messagesEndRef = useRef(null);

  // Handle inserting emoji into message input
  const handleEmojiSelect = (emoji) => {
    setMessageInput(prev => prev + emoji);
  };

  // Handle file attachment
  const handleFileSelect = (files) => {
    setAttachedFiles(files);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message
  const sendMessage = () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
    
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: messageInput,
      time: timeStr,
      files: attachedFiles.length > 0 ? attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      })) : undefined
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
    setAttachedFiles([]);
    setTimeout(scrollToBottom, 100);
  };

  // Handle keydown events (e.g., Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
    if (isFileAttachmentOpen) setIsFileAttachmentOpen(false);
  };

  // Toggle file attachment
  const toggleFileAttachment = () => {
    setIsFileAttachmentOpen(!isFileAttachmentOpen);
    if (isEmojiPickerOpen) setIsEmojiPickerOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Chat header */}
      <div className="py-3 px-6 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4">
            <img 
              src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
              alt="avatar" 
              className="w-10 h-10 rounded-full" 
            />
          </div>
          <div>
            <h2 className="font-medium">{selectedContact?.name || "Chat"}</h2>
            <span className="text-xs text-gray-500">{selectedContact?.role || ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-orange-500 hover:bg-orange-50 p-2 rounded-full">
            <FaPhoneAlt />
          </button>
          <button className="text-gray-400 hover:text-gray-700">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {messages.map((message, index) => (
          <div key={message.id} className="mb-6">
            {message.time && (
              <div className="text-center text-xs text-gray-400 mb-2">{message.time}</div>
            )}
            {message.isAudio ? (
              <div className="flex items-start">
                {message.sender === 'contact' && (
                  <img 
                    src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
                    alt="Contact" 
                    className="w-8 h-8 rounded-full mr-2 mt-1" 
                  />
                )}
                <div className="flex items-center bg-orange-100 rounded-full px-4 py-2 max-w-[80%]">
                  <div className="bg-orange-500 text-white p-2 rounded-full mr-2">
                    <FaPhoneAlt className="text-xs" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <FaPlay className="text-white text-xs" />
                    </div>
                    <div className="flex gap-1 items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-orange-500 w-1 h-3 rounded-full"></div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">01:32</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'contact' && (
                  <img 
                    src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
                    alt="Contact" 
                    className="w-8 h-8 rounded-full mr-2 mt-1" 
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                      message.sender === 'user'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-orange-100 text-gray-800'
                    }`}
                  >
                    {message.text && <p className="text-sm">{message.text}</p>}
                    
                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.files.map((file, fileIdx) => (
                          file.type.startsWith('image/') ? (
                            <img 
                              key={fileIdx}
                              src={file.url} 
                              alt={file.name} 
                              className="max-h-32 rounded-md border border-gray-300"
                            />
                          ) : (
                            <div 
                              key={fileIdx} 
                              className="flex items-center gap-1 text-xs bg-gray-100 py-1 px-2 rounded"
                            >
                              <FaImage className="text-blue-500" />
                              <span className="truncate max-w-[120px]">{file.name}</span>
                              <span className="text-gray-400 text-xs">
                                ({Math.round(file.size / 1024)}KB)
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <img 
                    src={userAvatar} 
                    alt="You" 
                    className="w-8 h-8 rounded-full ml-2 mt-1" 
                  />
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex gap-2 flex-wrap">
            {attachedFiles.map((file, index) => (
              <div 
                key={index} 
                className="bg-gray-100 text-xs py-1 px-2 rounded-full flex items-center gap-1"
              >
                <FaImage className="text-blue-500" />
                <span className="truncate max-w-[80px]">{file.name}</span>
                <button 
                  onClick={() => {
                    const newFiles = [...attachedFiles];
                    newFiles.splice(index, 1);
                    setAttachedFiles(newFiles);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-3 bg-gray-100 rounded-full"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <div className="relative">
                <button 
                  className={`text-gray-400 hover:text-gray-600 ${isEmojiPickerOpen ? 'text-orange-500' : ''}`}
                  onClick={toggleEmojiPicker}
                >
                  <FaSmile />
                </button>
                <EmojiPicker 
                  isOpen={isEmojiPickerOpen}
                  onClose={() => setIsEmojiPickerOpen(false)}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
              <div className="relative">
                <button 
                  className={`text-gray-400 hover:text-gray-700 ${isFileAttachmentOpen ? 'text-orange-500' : ''}`}
                  onClick={toggleFileAttachment}
                >
                  <FaPaperclip />
                </button>
                <FileAttachment
                  isOpen={isFileAttachmentOpen}
                  onClose={() => setIsFileAttachmentOpen(false)}
                  onFileSelect={handleFileSelect}
                />
              </div>
            </div>
          </div>
          <button 
            className="bg-orange-500 text-white p-3 rounded-full"
            onClick={sendMessage}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;