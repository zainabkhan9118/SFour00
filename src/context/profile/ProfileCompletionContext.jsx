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
  const checkProfileCompletion = async () => {
    setIsLoading(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setIsProfileComplete(false);
        setProfileData(null);
        setProfileCompletionPercentage(0);
        return false;
      }

      const firebaseId = currentUser.uid;
      const jobSeekerId = localStorage.getItem("jobSeekerId");
      
      if (!jobSeekerId) {
        setIsProfileComplete(false);
        setProfileData(null);
        setProfileCompletionPercentage(0);
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
      return complete;
    } catch (error) {
      console.error("Error checking profile completion:", error);
      setIsProfileComplete(false);
      setProfileData(null);
      setProfileCompletionPercentage(0);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check profile completion on mount and when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkProfileCompletion();
      } else {
        setIsProfileComplete(false);
        setProfileData(null);
        setIsLoading(false);
        setProfileCompletionPercentage(0);
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