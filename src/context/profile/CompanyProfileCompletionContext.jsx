import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { getCompanyProfile } from '../../api/companyApi';

// Create the context
const CompanyProfileCompletionContext = createContext({
  isProfileComplete: false,
  isLoading: true,
  profileData: null,
  checkProfileCompletion: () => {},
});

// Custom hook to use the company profile completion context
export const useCompanyProfileCompletion = () => useContext(CompanyProfileCompletionContext);

// Provider component
export const CompanyProfileCompletionProvider = ({ children }) => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [lastChecked, setLastChecked] = useState(0);

  // Function to check if a company profile is considered complete
  const isComplete = (data) => {
    if (!data) return false;
    
    // Check required fields
    const requiredFields = [
      'companyName',
      'companyContact',
      'companyEmail',
      'address',
      'bio',
      'manager'
    ];
    
    const managerFields = data.manager ? ['managerName', 'managerEmail', 'managerPhone'] : [];
    
    // Check if required fields exist and are not empty
    const mainFieldsComplete = requiredFields.every(field => {
      if (field === 'manager') {
        return data.manager ? true : false;
      }
      return data[field] && data[field].trim() !== '';
    });
    
    // Check if manager information is complete if manager object exists
    const managerFieldsComplete = data.manager ? 
      managerFields.every(field => data.manager[field] && data.manager[field].trim() !== '') : 
      false;
      
    return mainFieldsComplete && (data.manager ? managerFieldsComplete : true);
  };

  // Function to check profile completion
  const checkProfileCompletion = async (forceCheck = false) => {
    // If we already checked recently and the profile is complete, just return true
    // unless forceCheck is true
    const now = Date.now();
    if (!forceCheck && isProfileComplete && now - lastChecked < 60000) {
      return true;
    }
    
    setLastChecked(now);
    
    // If we're already known to be complete from localStorage, use that
    // while we check in the background
    const cachedComplete = localStorage.getItem("companyProfileComplete") === "true";
    if (!forceCheck && cachedComplete) {
      setIsProfileComplete(true);
      // Still check in the background to update other state
      setIsLoading(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsProfileComplete(false);
        setProfileData(null);
        localStorage.removeItem("companyProfileComplete");
        return false;
      }

      // Fetch profile data
      const response = await getCompanyProfile(currentUser.uid);
      
      if (response && response.data) {
        const data = response.data;
        setProfileData(data);
        
        // Check if profile is complete
        const complete = isComplete(data);
        setIsProfileComplete(complete);
        
        // Store in localStorage to avoid unnecessary checks
        localStorage.setItem("companyProfileComplete", complete ? "true" : "false");
        
        return complete;
      } else {
        setIsProfileComplete(false);
        setProfileData(null);
        localStorage.removeItem("companyProfileComplete");
        return false;
      }
    } catch (error) {
      console.error("Error checking company profile completion:", error);
      // Only update state if we weren't already complete, to avoid flickering
      if (!cachedComplete) {
        setIsProfileComplete(false);
        setProfileData(null);
      }
      return cachedComplete;
    } finally {
      setIsLoading(false);
    }
  };

  // Check profile completion on mount and when auth state changes
  useEffect(() => {
    // Check if we've already determined the profile is complete
    const cachedComplete = localStorage.getItem("companyProfileComplete") === "true";
    if (cachedComplete) {
      setIsProfileComplete(true);
      setIsLoading(false);
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkProfileCompletion();
      } else {
        setIsProfileComplete(false);
        setProfileData(null);
        setIsLoading(false);
        localStorage.removeItem("companyProfileComplete");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CompanyProfileCompletionContext.Provider
      value={{
        isProfileComplete,
        isLoading,
        profileData,
        checkProfileCompletion,
      }}
    >
      {children}
    </CompanyProfileCompletionContext.Provider>
  );
};