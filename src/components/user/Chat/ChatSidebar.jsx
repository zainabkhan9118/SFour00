import React, { useState, useEffect, useContext, useRef } from "react";
import { FaSearch, FaTimes, FaCog } from "react-icons/fa";
import useContactSearch from "../../../hooks/useContactSearch";
import { collection, getDocs, query, where, onSnapshot, orderBy, limit, startAfter } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import LoadingSpinner from "../../common/LoadingSpinner";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";

const BASEURL = import.meta.env.VITE_BASE_URL;
const PAGE_SIZE = 5; 

const ChatSidebar = ({ onSelect, selectedContact }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const addedFirebaseIds = useRef(new Set());
  const addedCompanyIds = useRef(new Set());
  const selectedContactId = selectedContact?.firebaseId || "";
  const { theme } = useContext(ThemeContext) || { theme: 'light' };
  const containerRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Check local storage for cached contacts on component mount
  useEffect(() => {
    const cachedContacts = localStorage.getItem('cachedChatContacts');
    if (cachedContacts) {
      try {
        const parsedContacts = JSON.parse(cachedContacts);
        if (Array.isArray(parsedContacts) && parsedContacts.length > 0) {
          setContacts(parsedContacts);
          // Update the tracking sets
          parsedContacts.forEach(contact => {
            addedFirebaseIds.current.add(contact.firebaseId);
            if (contact.id) addedCompanyIds.current.add(contact.id);
          });
          setLoading(false);
          initialLoadDone.current = true;
        }
      } catch (err) {
        console.error("Error parsing cached contacts:", err);
        // If there's an error with the cached data, proceed with fresh load
      }
    }
  }, []);

  // Cache contacts when they update
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('cachedChatContacts', JSON.stringify(contacts));
    }
  }, [contacts]);

  const isCompanyAdded = (firebaseId, companyId) => {
    return addedFirebaseIds.current.has(firebaseId) || 
           (companyId && addedCompanyIds.current.has(companyId)) ||
           contacts.some(c => c.firebaseId === firebaseId || c.id === companyId);
  };

  const fetchNextCompany = async () => {
    if (!hasMore || isFetching) return;
    setIsFetching(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("Please login to view messages");
        setLoading(false);
        return;
      }

      const usersRef = collection(db, "Users");
      let q = query(usersRef, where("role", "==", "Company"), limit(PAGE_SIZE));
      
      if (lastDoc) {
        q = query(usersRef, where("role", "==", "Company"), startAfter(lastDoc), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setHasMore(false);
        setIsFetching(false);
        setLoading(false);
        return;
      }

      // Track the last document for pagination
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Process each company document
      const fetchPromises = querySnapshot.docs.map(async (doc) => {
        // Skip if this is current user
        if (doc.id === currentUser.uid) return null;

        // Skip if already added
        if (addedFirebaseIds.current.has(doc.id)) return null;

        try {
          const response = await axios.get(`${BASEURL}/company`, {
            headers: {
              "firebase-id": doc.id
            }
          });
          
          if (response.data?.data) {
            const detailedCompany = response.data.data;
            const companyId = detailedCompany._id;

            // Check if either firebaseId or companyId is already added
            if (isCompanyAdded(doc.id, companyId)) return null;

            // Add both IDs to Sets before processing
            addedFirebaseIds.current.add(doc.id);
            if (companyId) {
              addedCompanyIds.current.add(companyId);
            }

            const companyData = doc.data();
            return {
              firebaseId: doc.id,
              id: companyId || doc.id,
              name: detailedCompany.companyName || companyData.companyName || "Unknown Company",
              role: "Company",
              avatar: detailedCompany.companyLogo || "https://i.pravatar.cc/150",
              time: "Now",
              isOnline: true,
              address: detailedCompany.address || "",
              bio: detailedCompany.bio || "",
              owner: detailedCompany.owner || "",
              message: detailedCompany.bio ? 
                (detailedCompany.bio.length > 50 ? detailedCompany.bio.substring(0, 47) + "..." : detailedCompany.bio) 
                : "Click to start chatting",
              companyProfile: detailedCompany
            };
          }
          return null;
        } catch (err) {
          console.warn("[ChatSidebar] Could not fetch company details:", {
            companyId: doc.id,
            error: err.message
          });
          return null;
        }
      });

      // Wait for all promises to resolve
      const results = await Promise.all(fetchPromises);
      const newContacts = results.filter(Boolean);

      if (newContacts.length > 0) {
        setContacts(prev => [...prev, ...newContacts]);
        // Only try for more if we got new companies
      } else {
        // If we got no new contacts, we're probably at the end
        console.log("[ChatSidebar] No new contacts found, stopping pagination");
        setHasMore(false);
      }
    } catch (error) {
      console.error("[ChatSidebar] Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  // Reset when component mounts - but only if we didn't restore from cache
  useEffect(() => {
    if (!initialLoadDone.current) {
      const resetAndFetch = () => {
        setLastDoc(null);
        setHasMore(true);
        setContacts([]);
        addedFirebaseIds.current.clear();
        addedCompanyIds.current.clear();
        fetchNextCompany();
      };

      resetAndFetch();
    }
  }, []);

  // Setup scroll listener for infinite loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop <= container.clientHeight * 1.5 &&
        hasMore &&
        !isFetching
      ) {
        fetchNextCompany();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching]);

  const { 
    searchQuery, 
    setSearchQuery, 
    filteredContacts, 
    hasResults, 
    isSearching 
  } = useContactSearch(contacts);

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full transition-colors duration-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-8 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm"
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1"
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      </div>
      
      <ul className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <li className="p-6 text-center text-gray-500 dark:text-gray-400">No companies available</li>
        ) : hasResults ? (
          filteredContacts.map((contact) => (
            <li
              key={contact.firebaseId}
              onClick={() => onSelect(contact)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${
                contact.firebaseId === selectedContactId ? 'bg-gradient-to-r from-orange-500 to-blue-900' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pravatar.cc/100";
                    }}
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium truncate ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {contact.name}
                    </span>
                    <span className={`text-xs ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white/80' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {contact.address && (
                      <span className={`text-xs ${
                        contact.firebaseId === selectedContactId 
                          ? 'text-white/90' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        📍 {contact.address}
                      </span>
                    )}
                    <span className={`text-sm truncate mt-1 ${
                      contact.firebaseId === selectedContactId 
                        ? 'text-white/90' 
                        : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {contact.message || "Click to start chatting"}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-6 text-center text-gray-500 dark:text-gray-400">No matches found</li>
        )}
      </ul>
      {isFetching && (
        <div className="p-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;