import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering contacts based on search query
 * @param {Array} contacts - Array of contact objects
 * @returns {Object} - Search state and filtered contacts
 */
const useContactSearch = (contacts) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.role.toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredContacts,
    hasResults: filteredContacts.length > 0,
    isSearching: searchQuery.trim().length > 0
  };
};

export default useContactSearch;