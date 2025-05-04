import React, { useEffect, useState } from 'react';
import { useProfileCompletion } from '../../../context/profile/ProfileCompletionContext';
import { useToast } from '../../notifications/ToastManager';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionCheck = ({ children }) => {
  const { isProfileComplete, profileCompletionPercentage, checkProfileCompletion } = useProfileCompletion();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  // Recheck profile completion status when component mounts
  useEffect(() => {
    // Use the cached value if available
    if (localStorage.getItem("profileComplete") === "true") {
      return;
    }
    // Otherwise check if needed
    checkProfileCompletion();
  }, []);

  const handleAction = async (e) => {
    // Prevent multiple simultaneous checks
    if (isChecking) return true;
    
    // Skip check if we know we're complete from localStorage
    if (localStorage.getItem("profileComplete") === "true") {
      return true;
    }
    
    // If the context already knows we're complete, don't recheck
    if (isProfileComplete) {
      return true;
    }
    
    // Otherwise, we need to check
    setIsChecking(true);
    e.preventDefault();
    
    try {
      // Recheck profile completion status before proceeding
      const profileComplete = await checkProfileCompletion(true);
      
      if (!profileComplete) {
        showToast({
          type: 'warning',
          title: 'Profile Incomplete',
          message: `Your profile is only ${profileCompletionPercentage}% complete. Please complete your profile before continuing.`,
        });
        
        // Navigate to personal details page to complete profile
        navigate('/User-PersonalDetails');
        return false;
      }
      return true;
    } finally {
      setIsChecking(false);
    }
  };

  // Clone the child component and add the onClick handler
  return React.cloneElement(children, {
    onClick: async (e) => {
      // Run the profile check first
      const canProceed = await handleAction(e);
      
      // If profile is complete and the child has an onClick, call it
      if (canProceed && children.props.onClick) {
        children.props.onClick(e);
      }
    }
  });
};

export default ProfileCompletionCheck;