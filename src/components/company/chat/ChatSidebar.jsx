import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes, FaCog } from "react-icons/fa";
import useContactSearch from "../../../hooks/useContactSearch";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import LoadingSpinner from "../../common/LoadingSpinner";
import axios from 'axios';
import { ThemeContext } from "../../../context/ThemeContext";

const ChatSidebar = ({ onSelect, selectedContact }) => {
  const selectedContactId = selectedContact?.firebaseId || "";
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext) || { theme: 'light' };

  useEffect(() => {
    const fetchUsers = async () => {
      setError(null);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("[ChatSidebar] No authenticated user found");
          setError("Please login to view messages");
          setLoading(false);
          return;
        }

        // Verify current user is a Company
        const userDoc = await getDocs(query(collection(db, "Users"), where("role", "==", "Company")));
        const companyDoc = userDoc.docs.find(doc => doc.id === currentUser.uid);
        if (!companyDoc) {
          setError("Chat is only available for companies");
          setLoading(false);
          return;
        }

        console.log("[ChatSidebar] Fetching job seeker contacts");
        
        // Query users collection for Job Seekers only
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("role", "==", "Job Seeker"));
        const querySnapshot = await getDocs(q);
        console.log("[ChatSidebar] Found job seekers:", querySnapshot.size);

        const users = [];
        const validatedUsers = new Set();

        // First pass: Get all valid users from custom DB
        for (const doc of querySnapshot.docs) {
          if (doc.id === currentUser.uid) continue;

          try {
            const response = await axios.get(`/api/job-seeker`, {
              headers: {
                "firebase-id": doc.id
              }
            });
            
            if (response.data?.data?._id) {
              validatedUsers.add(doc.id);
            }
          } catch (err) {
            console.warn("[ChatSidebar] User not found in custom DB:", doc.id);
          }
        }

        // Second pass: Create contact objects only for validated users
        for (const doc of querySnapshot.docs) {
          if (!validatedUsers.has(doc.id)) continue;

          const userData = doc.data();
          try {
            const response = await axios.get(`/api/job-seeker`, {
              headers: {
                "firebase-id": doc.id
              }
            });
            
            const seekerData = response.data?.data;
            if (seekerData) {
              const contactData = {
                firebaseId: doc.id,
                id: seekerData._id,
                name: seekerData.fullname || userData.email || "Unknown User",
                role: "Job Seeker",
                message: seekerData.bio || "Click to start chatting",
                avatar: seekerData.profilePic || "https://i.pravatar.cc/100",
                time: "Now",
                isOnline: true,
                seekerProfile: seekerData
              };
              users.push(contactData);
            }
          } catch (err) {
            console.warn("[ChatSidebar] Error fetching job seeker details:", {
              seekerId: doc.id,
              error: err.message
            });
          }
        }

        console.log("[ChatSidebar] Final validated contacts:", {
          count: users.length,
          contacts: users.map(u => ({ id: u.id, name: u.name }))
        });
        setContacts(users);
      } catch (error) {
        console.error("[ChatSidebar] Error fetching users:", error);
        setError("Failed to load job seekers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const { 
    searchQuery, 
    setSearchQuery, 
    filteredContacts, 
    hasResults, 
    isSearching 
  } = useContactSearch(contacts);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`w-full md:w-[320px] border-r flex flex-col h-[calc(100vh-64px)] md:h-screen ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
    }`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>Messages</h2>
            {contacts.length > 0 && (
              <span className="text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full">
                {contacts.length}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <FaCog className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'} cursor-pointer`} />
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search job seekers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-2 pl-8 rounded-md text-sm ${
              theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-gray-100'
            }`}
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs p-1 ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>
      
      <ul className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <li className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No verified job seekers available</li>
        ) : hasResults ? (
          filteredContacts.map((contact) => (
            <li
              key={contact.firebaseId}
              className={`border-b ${
                theme === 'dark' ? 'border-gray-700' : ''
              } ${
                contact.firebaseId === selectedContactId 
                  ? 'bg-gradient-to-r from-orange-500 to-blue-900' 
                  : theme === 'dark' 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
              } cursor-pointer`}
              onClick={() => onSelect(contact)}
            >
              <div className="flex items-center p-4">
                <div className="relative">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pravatar.cc/100";
                    }}
                  />
                  {contact.isOnline && (
                    <div className={`absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full ${
                      theme === 'dark' ? 'border-2 border-gray-800' : 'border-2 border-white'
                    }`}></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className={`font-medium ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white' 
                        : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {contact.name}
                    </span>
                    <span className={`text-xs ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white' 
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white' 
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {contact.role}
                    </span>
                    <span className={`text-sm truncate mt-1 ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white' 
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {contact.message}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No matches found</li>
        )}
      </ul>
    </div>
  );
};

export default ChatSidebar;