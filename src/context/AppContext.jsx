import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [role, setRole] = useState(() => localStorage.getItem("userRole") || null);
  const [profileName, setProfileName] = useState(() => localStorage.getItem("profileName") || " ");
  const [profileDp, setProfileDp] = useState(() => localStorage.getItem("profileDp") || null);
  const [sessionData, setSessionData] = useState(() => JSON.parse(localStorage.getItem("sessionData")) || null);

  const BASEURL = import.meta.env.VITE_BASE_URL;


  // Save `profileName` to localStorage whenever it changes
  useEffect(() => {
    if (profileName) {
      localStorage.setItem("profileName", profileName);
    } else {
      localStorage.removeItem("profileName");
    }
  }, [profileName]);

  // Save `profileDp` to localStorage whenever it changes
  useEffect(() => {
    if (profileDp) {
      localStorage.setItem("profileDp", profileDp);
    } else {
      localStorage.removeItem("profileDp");
    }
  }, [profileDp]);

  // Save `sessionData` to localStorage whenever it changes
  useEffect(() => {
    if (sessionData) {
      localStorage.setItem("sessionData", JSON.stringify(sessionData));
    } else {
      localStorage.removeItem("sessionData");
    }
  }, [sessionData]);

  // Function to handle session data updates
  const updateSessionData = (newSessionData) => {
    setSessionData(newSessionData);

    if (newSessionData) {
      localStorage.setItem("sessionData", JSON.stringify(newSessionData));
    } else {
      localStorage.removeItem("sessionData");
    }
  };

  // Function to clear all session data
  const clearSession = () => {
    setUser(null);
    setRole(null);
    setProfileName(" ");
    setProfileDp(null);
    setSessionData(null);
    localStorage.removeItem("profileName");
    localStorage.removeItem("profileDp");
    localStorage.removeItem("sessionData");
  };

  const value = {
    BASEURL,
    user,
    setUser,
    role,
    setRole,
    profileName,
    setProfileName,
    profileDp,
    setProfileDp,
    sessionData,
    setSessionData: updateSessionData, 
    clearSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;