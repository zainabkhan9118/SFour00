import React, { useState, useRef, useEffect } from "react";
import { FaPhoneAlt, FaPaperPlane, FaEllipsisV, FaArrowLeft } from "react-icons/fa";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";

const BASEURL = import.meta.env.VITE_BASE_URL;

const MessageArea = ({ selectedContact, onBackClick }) => {
  const userAvatar = "https://i.pravatar.cc/100?img=10"; 
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to subscribe to messages from chat_rooms/{roomId}/messages
  useEffect(() => {
    if (!selectedContact?.firebaseId) {
      console.log("[Chat] No selected contact or missing firebaseId", { selectedContact });
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("[Chat] No authenticated user found");
      return;
    }

    console.log("[Chat] Setting up chat room listener:", {
      currentUserId: currentUser.uid,
      currentUserEmail: currentUser.email,
      contactId: selectedContact.firebaseId,
      contactName: selectedContact.name
    });

    try {
      // Create unique chat room ID by sorting user IDs
      const roomParticipants = [currentUser.uid, selectedContact.firebaseId].sort();
      const chatRoomId = roomParticipants.join('_');
      console.log("[Chat] Generated chat room ID:", chatRoomId);

      // Reference to the chat room document
      const chatRoomRef = doc(db, "chat_rooms", chatRoomId);

      // Ensure chat room document exists
      const ensureChatRoom = async () => {
        const chatRoomDoc = await getDoc(chatRoomRef);
        if (!chatRoomDoc.exists()) {
          await setDoc(chatRoomRef, {
            participants: roomParticipants,
            createdAt: serverTimestamp(),
            lastMessage: null,
            lastMessageTime: null
          });
          console.log("[Chat] Created new chat room:", chatRoomId);
        }
      };
      ensureChatRoom();

      // Query the messages subcollection
      const messagesRef = collection(chatRoomRef, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      console.log("[Chat] Set up Firestore query for messages subcollection");

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("[Chat] Received messages snapshot update");
        const newMessages = [];
        snapshot.forEach((doc) => {
          const messageData = doc.data();
          newMessages.push({
            id: doc.id,
            ...messageData,
            sender: messageData.senderID === currentUser.uid ? "user" : "contact"
          });
        });
        
        console.log("[Chat] Processed messages:", {
          totalMessages: snapshot.size,
          chatRoomId
        });
        setMessages(newMessages);
      }, (error) => {
        console.error("[Chat] Error listening to messages:", error);
      });

      return () => {
        console.log("[Chat] Cleaning up listener for chat room:", chatRoomId);
        unsubscribe();
      };
    } catch (error) {
      console.error("[Chat] Error setting up chat room listener:", error);
    }
  }, [selectedContact?.firebaseId]);

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim()) {
      console.log("[Chat] Attempted to send empty message");
      return;
    }
    
    const currentUser = auth.currentUser;
    if (!currentUser || !selectedContact?.firebaseId) {
      console.log("[Chat] Cannot send message - missing user or contact", {
        hasUser: !!currentUser,
        hasContact: !!selectedContact?.firebaseId
      });
      return;
    }

    try {
      console.log("[Chat] Preparing to send message to:", {
        receiverId: selectedContact.firebaseId,
        receiverName: selectedContact.name
      });
      
      // Create unique chat room ID
      const roomParticipants = [currentUser.uid, selectedContact.firebaseId].sort();
      const chatRoomId = roomParticipants.join('_');
      
      const messageData = {
        message: messageInput.trim(),
        senderID: currentUser.uid,
        senderEmail: currentUser.email,
        receiverID: selectedContact.firebaseId,
        timestamp: serverTimestamp()
      };

      console.log("[Chat] Message data prepared:", {
        ...messageData,
        timestamp: "serverTimestamp()" 
      });

      const chatRoomRef = doc(db, "chat_rooms", chatRoomId);
      
      const messagesRef = collection(chatRoomRef, "messages");
      const messageRef = await addDoc(messagesRef, messageData);

      await setDoc(chatRoomRef, {
        lastMessage: messageInput.trim(),
        lastMessageTime: serverTimestamp(),
        lastSenderID: currentUser.uid
      }, { merge: true });

      console.log("[Chat] Message sent successfully:", {
        messageId: messageRef.id,
        chatRoomId
      });

      setMessageInput("");
    } catch (error) {
      console.error("[Chat] Error sending message:", error);
    }
  };

  // Handle keydown events (e.g., Enter to send)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
              alt={selectedContact?.name} 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.pravatar.cc/100";
              }}
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
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div key={message.id} className="mb-4 md:mb-6">
            {message.timestamp && (
              <div className="text-center text-xs text-gray-400 mb-2">
                {message.timestamp.toDate().toLocaleString()}
              </div>
            )}
            <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <img 
                src={message.sender === 'user' ? userAvatar : selectedContact.avatar} 
                alt={message.sender === 'user' ? "You" : selectedContact.name} 
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full mt-1 shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://i.pravatar.cc/100";
                }}
              />
              <div
                className={`p-2 md:p-3 rounded-lg max-w-[75%] ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-xs md:text-sm">{message.message}</p>
                {message.timestamp && (
                  <div className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-orange-100' : 'text-gray-400'}`}>
                    {message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 md:p-4 border-t bg-white">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 md:p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button 
            className={`p-2 md:p-3 rounded-full transition-colors ${
              messageInput.trim() 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
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