import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaCog } from "react-icons/fa";
import useContactSearch from "../../../hooks/useContactSearch";
import { collection, getDocs, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../../../config/firebaseConfig";
import LoadingSpinner from "../../common/LoadingSpinner";
import axios from "axios";

const BASEURL = import.meta.env.VITE_BASE_URL;

const ChatSidebar = ({ onSelect, selectedContact }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedContactId = selectedContact?.firebaseId || "";

  useEffect(() => {
    const fetchCompanies = async () => {
      setError(null);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("[ChatSidebar] No authenticated user");
          setError("Please login to view messages");
          setLoading(false);
          return;
        }

        // console.log("[ChatSidebar] Starting to fetch companies");

        // Query Users collection for companies
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("role", "==", "Company"));
        const querySnapshot = await getDocs(q);

        // console.log("[ChatSidebar] Found companies in Firebase:", querySnapshot.size);

        const companies = [];

        for (const doc of querySnapshot.docs) {
          if (doc.id === currentUser.uid) {
            console.log("[ChatSidebar] Skipping current user:", doc.id);
            continue;
          }

          const companyData = doc.data();
          // console.log("[ChatSidebar] Processing company:", { id: doc.id, ...companyData });
          
          // Create basic contact data
          const basicContactData = {
            firebaseId: doc.id,
            id: doc.id,
            name: companyData.companyName || "Unknown Company",
            role: "Company",
            message: "Click to start chatting",
            avatar: "https://i.pravatar.cc/100", // Default avatar
            time: "Now",
            isOnline: true
          };

          try {
            // Fetch complete company details from backend
            console.log("[ChatSidebar] Fetching detailed company profile for:", doc.id);
            const response = await axios.get(`${BASEURL}/company`, {
              headers: {
                "firebase-id": doc.id
              }
            });
            
            // Add validation for response data
            if (!response.data || !response.data.data) {
              console.warn("[ChatSidebar] Invalid company profile response:", response.data);
              throw new Error("Invalid company profile data");
            }

            const detailedCompany = response.data.data;
            console.log("[ChatSidebar] Received company profile:", {
              id: detailedCompany?._id,
              name: detailedCompany?.companyName,
              hasLogo: !!detailedCompany?.companyLogo
            });

            if (detailedCompany && detailedCompany._id) {
              // Update contact data with company details
              basicContactData.name = detailedCompany.companyName || basicContactData.name;
              basicContactData.avatar = detailedCompany.companyLogo || basicContactData.avatar;
              basicContactData.id = detailedCompany._id;
              basicContactData.address = detailedCompany.address || "";
              basicContactData.bio = detailedCompany.bio || "";
              basicContactData.owner = detailedCompany.owner || "";
              basicContactData.message = detailedCompany.bio ? 
                (detailedCompany.bio.length > 50 ? detailedCompany.bio.substring(0, 47) + "..." : detailedCompany.bio) 
                : "Click to start chatting";
              basicContactData.companyProfile = detailedCompany;
            } else {
              console.warn("[ChatSidebar] Missing required company data:", detailedCompany);
            }
          } catch (err) {
            console.warn("[ChatSidebar] Could not fetch company details:", {
              companyId: doc.id,
              error: err.message
            });
          }

          companies.push(basicContactData);
        }

        console.log("[ChatSidebar] Final contacts list:", {
          count: companies.length,
          contacts: companies.map(c => ({
            id: c.id,
            name: c.name,
            hasProfile: !!c.companyProfile
          }))
        });
        
        setContacts(companies);
      } catch (error) {
        console.error("[ChatSidebar] Error fetching companies:", error);
        setError("Failed to load companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
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
        {contacts.length === 0 ? (
          <li className="p-6 text-center text-gray-500">No companies available</li>
        ) : hasResults ? (
          filteredContacts.map((contact) => (
            <li
              key={contact.firebaseId}
              onClick={() => onSelect(contact)}
              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
                contact.firebaseId === selectedContactId ? 'bg-gradient-to-r from-orange-500 to-blue-900' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pravatar.cc/100";
                    }}
                  />
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium truncate ${contact.firebaseId === selectedContactId ? 'text-white' : 'text-gray-900'}`}>
                      {contact.name}
                    </span>
                    <span className={`text-xs ${contact.firebaseId === selectedContactId ? 'text-white/80' : 'text-gray-500'}`}>
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {contact.address && (
                      <span className={`text-xs ${contact.firebaseId === selectedContactId ? 'text-white/90' : 'text-gray-500'}`}>
                        📍 {contact.address}
                      </span>
                    )}
                    <span className={`text-sm truncate mt-1 ${contact.firebaseId === selectedContactId ? 'text-white/90' : 'text-gray-600'}`}>
                      {contact.message || "Click to start chatting"}
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