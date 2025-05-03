import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileCompletion } from '../../context/profile/ProfileCompletionContext';

const ProfileRequiredGuard = ({ children, redirectPath = '/User-PersonalDetails', checkBefore }) => {
  const { isProfileComplete, isLoading } = useProfileCompletion();
  const navigate = useNavigate();

  // If there's a function to check before proceeding, run it
  if (checkBefore && typeof checkBefore === 'function') {
    const shouldProceed = checkBefore();
    if (!shouldProceed) {
      return null;
    }
  }
  
  // While checking the profile status, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  // If profile isn't complete, redirect to profile page
  if (!isProfileComplete) {
    React.useEffect(() => {
      navigate(redirectPath);
    }, [navigate, redirectPath]);
    
    return null;
  }
  
  // Profile is complete, render children
  return children;
};

export default ProfileRequiredGuard;