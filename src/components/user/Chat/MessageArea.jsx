import React, { useState, useRef, useEffect } from "react";
import { FaPhoneAlt, FaPaperclip, FaSmile, FaPaperPlane, FaEllipsisV, FaPlay, FaImage, FaTimes, FaArrowLeft } from "react-icons/fa";
import EmojiPicker from "./EmojiPicker";
import FileAttachment from "./FileAttachment";

const MessageArea = ({ selectedContact, onBackClick }) => {
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
  const messagesContainerRef = useRef(null);

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

  // Effect to scroll to bottom on mount and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to close emoji picker and file attachment when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEmojiPickerOpen && !event.target.closest('.emoji-picker-container')) {
        setIsEmojiPickerOpen(false);
      }
      if (isFileAttachmentOpen && !event.target.closest('.file-attachment-container')) {
        setIsFileAttachmentOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEmojiPickerOpen, isFileAttachmentOpen]);

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
    
    // Auto-reply from contact after 1 second (for demo purposes)
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        sender: "contact",
        text: "Thanks for your message! I'll get back to you soon.",
        time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000);
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
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen bg-white">
      {/* Chat header */}
      <div className="py-3 px-4 md:px-6 border-b flex justify-between items-center">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <button 
              onClick={onBackClick}
              className="text-orange-500 p-1"
            >
              <FaArrowLeft />
            </button>
          </div>
          <div className="mr-3 md:mr-4">
            <img 
              src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
              alt="avatar" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
            />
          </div>
          <div>
            <h2 className="font-medium text-sm md:text-base">{selectedContact?.name || "Chat"}</h2>
            <span className="text-xs text-gray-500">{selectedContact?.role || ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-orange-500 hover:bg-orange-50 p-1 md:p-2 rounded-full">
            <FaPhoneAlt className="text-sm md:text-base" />
          </button>
          <button className="text-gray-400 hover:text-gray-700 hidden md:block">
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div key={message.id} className="mb-4 md:mb-6">
            {message.time && (
              <div className="text-center text-xs text-gray-400 mb-2">{message.time}</div>
            )}
            {message.isAudio ? (
              <div className="flex items-start">
                <img 
                  src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
                  alt="Contact" 
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full mr-2 mt-1 shrink-0" 
                />
                <div className="flex items-center bg-orange-100 rounded-full px-3 py-1 md:px-4 md:py-2 max-w-[80%]">
                  <div className="bg-orange-500 text-white p-1 md:p-2 rounded-full mr-2">
                    <FaPhoneAlt className="text-[10px] md:text-xs" />
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500 flex items-center justify-center">
                      <FaPlay className="text-white text-[8px] md:text-xs" />
                    </div>
                    <div className="flex gap-1 items-center">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-orange-500 w-1 h-2 md:h-3 rounded-full"></div>
                      ))}
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500">01:32</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <img 
                  src={message.sender === 'user' ? userAvatar : (selectedContact?.avatar || "https://i.pravatar.cc/100?img=1")} 
                  alt={message.sender === 'user' ? "You" : "Contact"} 
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full mt-1 shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}
                />
                <div
                  className={`p-2 md:p-3 rounded-lg max-w-[75%] ${
                    message.sender === 'user'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-orange-100 text-gray-800'
                  }`}
                >
                  {message.text && <p className="text-xs md:text-sm">{message.text}</p>}
                  
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 md:gap-2">
                      {message.files.map((file, fileIdx) => (
                        file.type.startsWith('image/') ? (
                          <img 
                            key={fileIdx}
                            src={file.url} 
                            alt={file.name} 
                            className="max-h-20 md:max-h-32 rounded-md border border-gray-300"
                          />
                        ) : (
                          <div 
                            key={fileIdx} 
                            className="flex items-center gap-1 text-[10px] md:text-xs bg-gray-100 py-1 px-2 rounded"
                          >
                            <FaImage className="text-blue-500" />
                            <span className="truncate max-w-[80px] md:max-w-[120px]">{file.name}</span>
                            <span className="text-gray-400 text-[8px] md:text-xs">
                              ({Math.round(file.size / 1024)}KB)
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 md:p-4 border-t">
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex gap-1 md:gap-2 flex-wrap">
            {attachedFiles.map((file, index) => (
              <div 
                key={index} 
                className="bg-gray-100 text-[10px] md:text-xs py-1 px-2 rounded-full flex items-center gap-1"
              >
                <FaImage className="text-blue-500" />
                <span className="truncate max-w-[60px] md:max-w-[80px]">{file.name}</span>
                <button 
                  onClick={() => {
                    const newFiles = [...attachedFiles];
                    newFiles.splice(index, 1);
                    setAttachedFiles(newFiles);
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimes size={8} className="md:text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 md:p-3 bg-gray-100 rounded-full text-sm"
            />
            <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-3">
              <div className="relative emoji-picker-container">
                <button 
                  className={`text-gray-400 hover:text-gray-600 ${isEmojiPickerOpen ? 'text-orange-500' : ''}`}
                  onClick={toggleEmojiPicker}
                >
                  <FaSmile className="text-sm md:text-base" />
                </button>
                <EmojiPicker 
                  isOpen={isEmojiPickerOpen}
                  onClose={() => setIsEmojiPickerOpen(false)}
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
              <div className="relative file-attachment-container">
                <button 
                  className={`text-gray-400 hover:text-gray-700 ${isFileAttachmentOpen ? 'text-orange-500' : ''}`}
                  onClick={toggleFileAttachment}
                >
                  <FaPaperclip className="text-sm md:text-base" />
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
            className="bg-orange-500 text-white p-2 md:p-3 rounded-full"
            onClick={sendMessage}
          >
            <FaPaperPlane className="text-sm md:text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;