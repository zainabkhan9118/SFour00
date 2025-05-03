import React from 'react';
import { useProfileCompletion } from '../../../context/profile/ProfileCompletionContext';
import { useToast } from '../../notifications/ToastManager';
import { useNavigate } from 'react-router-dom';

const ProfileCompletionCheck = ({ children }) => {
  const { isProfileComplete, profileCompletionPercentage } = useProfileCompletion();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAction = (e) => {
    if (!isProfileComplete) {
      e.preventDefault();
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
  };

  // Clone the child component and add the onClick handler
  return React.cloneElement(children, {
    onClick: (e) => {
      // Run the profile check first
      const canProceed = handleAction(e);
      
      // If profile is complete and the child has an onClick, call it
      if (canProceed && children.props.onClick) {
        children.props.onClick(e);
      }
    }
  });
};

export default ProfileCompletionCheck;