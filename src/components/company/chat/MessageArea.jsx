import React, { useState, useRef, useEffect, useContext } from "react";
import { FaPhoneAlt, FaPaperPlane, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import axios from 'axios';
import { ThemeContext } from "../../../context/ThemeContext";

const BASEURL = import.meta.env.VITE_BASE_URL;

const MessageArea = ({ selectedContact, onBackClick }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to subscribe to messages
  useEffect(() => {
    if (!selectedContact?.firebaseId) {
      console.log("[Chat] No selected contact", { selectedContact });
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("[Chat] No authenticated user");
      return;
    }

    try {
      // Create unique chat room ID
      const roomParticipants = [currentUser.uid, selectedContact.firebaseId].sort();
      const chatRoomId = roomParticipants.join('_');

      // Reference to messages collection
      const messagesRef = collection(db, "chat_rooms", chatRoomId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = [];
        snapshot.forEach((doc) => {
          const messageData = doc.data();
          newMessages.push({
            id: doc.id,
            ...messageData,
            isFromCurrentUser: messageData.senderID === currentUser.uid
          });
        });
        setMessages(newMessages);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("[Chat] Error setting up chat listener:", error);
    }
  }, [selectedContact?.firebaseId]);

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const currentUser = auth.currentUser;
    if (!currentUser || !selectedContact?.firebaseId) {
      console.log("[Chat] Cannot send - missing user/contact", {
        hasUser: !!currentUser,
        hasContact: !!selectedContact
      });
      return;
    }

    try {
      // Create unique chat room ID
      const roomParticipants = [currentUser.uid, selectedContact.firebaseId].sort();
      const chatRoomId = roomParticipants.join('_');
      
      // Prepare message data
      const messageData = {
        message: messageInput.trim(),
        senderID: currentUser.uid,
        senderEmail: currentUser.email,
        receiverID: selectedContact.firebaseId,
        timestamp: serverTimestamp()
      };

      // Add message to messages subcollection
      const chatRoomRef = doc(db, "chat_rooms", chatRoomId);
      const messagesRef = collection(chatRoomRef, "messages");
      await addDoc(messagesRef, messageData);

      // Update chat room with last message info
      await setDoc(chatRoomRef, {
        lastMessage: messageInput.trim(),
        lastMessageTime: serverTimestamp(),
        lastSenderID: currentUser.uid,
        participants: roomParticipants
      }, { merge: true });

      setMessageInput("");
    } catch (error) {
      console.error("[Chat] Error sending message:", error);
    }
  };

  // Handle Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Chat header */}
      <div className={`py-3 px-4 md:px-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-gray-700' : ''}`}>
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <button 
              onClick={onBackClick}
              className={`text-orange-500 p-1 ${theme === 'dark' ? 'text-orange-400' : ''}`}
            >
              <FaArrowLeft />
            </button>
          </div>
          <div className="mr-3 md:mr-4">
            <img 
              src={selectedContact?.avatar || "https://i.pravatar.cc/100?img=1"} 
              alt={selectedContact?.name} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.pravatar.cc/100";
              }}
            />
          </div>
          <div>
            <h2 className={`font-medium text-sm md:text-base ${theme === 'dark' ? 'text-white' : ''}`}>{selectedContact?.name || "Chat"}</h2>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{selectedContact?.role || ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className={`text-gray-400 hover:text-gray-700 hidden md:block ${theme === 'dark' ? 'text-gray-300 hover:text-gray-500' : ''}`}>
            <FaEllipsisV />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className={`flex-1 p-4 md:p-6 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`} ref={messagesContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className="mb-4 md:mb-6">
            {message.timestamp && (
              <div className={`text-center text-xs mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {message.timestamp.toDate().toLocaleString()}
              </div>
            )}
            <div className={`flex items-start ${message.isFromCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`p-2 md:p-3 rounded-lg max-w-[75%] ${
                  message.isFromCurrentUser
                    ? 'bg-orange-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-gray-300'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-xs md:text-sm">{message.message}</p>
                <div className={`text-[10px] mt-1 ${message.isFromCurrentUser ? 'text-orange-100' : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {message.senderEmail}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className={`p-3 md:p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full p-2 md:p-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'
              }`}
            />
          </div>
          <button 
            className={`p-2 md:p-3 rounded-full transition-colors ${
              messageInput.trim() 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-500'
                : 'bg-gray-100 text-gray-400'
            }`}
            onClick={sendMessage}
            disabled={!messageInput.trim()}
          >
            <FaPaperPlane className="text-sm md:text-base" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageArea;