import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
// Import auth directly instead of trying to import a default export
import { auth as firebaseAuth } from '../../config/firebaseConfig';

// Create the context
const ProfileCompletionContext = createContext({
  isProfileComplete: false,
  isLoading: true,
  profileData: null,
  profileCompletionPercentage: 0,
  checkProfileCompletion: () => {},
});

// Custom hook to use the profile completion context
export const useProfileCompletion = () => useContext(ProfileCompletionContext);

// Provider component
export const ProfileCompletionProvider = ({ children }) => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0);
  const [lastChecked, setLastChecked] = useState(0);
  // Use the imported auth instance directly
  const auth = firebaseAuth;

  // Calculate profile completion percentage
  const calculateCompletionPercentage = (profile) => {
    if (!profile) return 0;
    
    let totalFields = 5; // Basic profile, Address, Experience, Education, UTR
    let completedFields = 0;
    
    // Basic profile info
    if (profile.fullname && profile.shortBio) {
      completedFields += 1;
    }
    
    // Address
    if (profile.address && profile.address.length > 0) {
      completedFields += 1;
    }
    
    // Experience
    if (profile.experiences && profile.experiences.length > 0) {
      completedFields += 1;
    }
    
    // Education
    if (profile.educationRecords && profile.educationRecords.length > 0) {
      completedFields += 1;
    }
    
    // UTR Number
    if (profile.utrNumber) {
      completedFields += 1;
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };

  // Function to check if a profile is considered complete
  const isComplete = (profile) => {
    if (!profile) return false;
    
    // Basic profile info must be present
    if (!profile.fullname || !profile.shortBio) return false;
    
    // Must have at least one address
    if (!profile.address || profile.address.length === 0) return false;
    
    // Must have at least one experience entry
    if (!profile.experiences || profile.experiences.length === 0) return false;
    
    // Must have at least one education entry
    if (!profile.educationRecords || profile.educationRecords.length === 0) return false;
    
    return true;
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
    const cachedComplete = localStorage.getItem("profileComplete") === "true";
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
        setProfileCompletionPercentage(0);
        localStorage.removeItem("profileComplete");
        return false;
      }

      const firebaseId = currentUser.uid;
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      
      if (!jobSeekerId) {
        setIsProfileComplete(false);
        setProfileData(null);
        setProfileCompletionPercentage(0);
        localStorage.removeItem("profileComplete");
        return false;
      }
      
      // Fetch profile data
      const BASEURL = import.meta.env.VITE_BASE_URL || '';
      const response = await axios.get(`${BASEURL}/job-seeker`, {
        headers: {
          "firebase-id": firebaseId,
        },
      });
      
      const profile = response.data?.data;
      setProfileData(profile);
      
      // Calculate completion percentage
      const percentage = calculateCompletionPercentage(profile);
      setProfileCompletionPercentage(percentage);
      
      // Check if profile is complete
      const complete = isComplete(profile);
      setIsProfileComplete(complete);
      
      // Store in localStorage to avoid unnecessary checks
      localStorage.setItem("profileComplete", complete ? "true" : "false");
      
      return complete;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      // Only update state if we weren't already complete, to avoid flickering
      if (!cachedComplete) {
        setIsProfileComplete(false);
        setProfileData(null);
        setProfileCompletionPercentage(0);
      }
      return cachedComplete;
    } finally {
      setIsLoading(false);
    }
  };

  // Check profile completion on mount and when auth state changes
  useEffect(() => {
    // Check if we've already determined the profile is complete
    const cachedComplete = localStorage.getItem("profileComplete") === "true";
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
        setProfileCompletionPercentage(0);
        localStorage.removeItem("profileComplete");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileCompletionContext.Provider
      value={{
        isProfileComplete,
        isLoading,
        profileData,
        profileCompletionPercentage,
        checkProfileCompletion,
      }}
    >
      {children}
    </ProfileCompletionContext.Provider>
  );
};