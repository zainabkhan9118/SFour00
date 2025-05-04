import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../../api/companyApi";
import CompanyProfileCompletionPopup from './CompanyProfileCompletionPopup';

const CompanyProfileCompletionCheck = ({ children }) => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Default to false for new users
  const [isChecking, setIsChecking] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Initialize from local storage to prevent incorrect popup on initial render
  useEffect(() => {
    const storedProfileStatus = localStorage.getItem('companyProfileComplete');
    if (storedProfileStatus) {
      setIsProfileComplete(JSON.parse(storedProfileStatus));
    }
  }, []);

  useEffect(() => {
    const checkProfileCompleteness = async () => {
      setIsChecking(true);
      const auth = getAuth();
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const response = await getCompanyProfile(user.uid);
            if (response && response.data) {
              const data = response.data;
              
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
                
              const profileComplete = mainFieldsComplete && (data.manager ? managerFieldsComplete : true);
              
              // Store completion status in localStorage
              localStorage.setItem('companyProfileComplete', JSON.stringify(profileComplete));
              
              // For newly registered user - show popup if:
              // 1. Profile is incomplete AND
              // 2. We don't have a specific "seen popup" flag set
              const isNewRegistration = !localStorage.getItem('profilePopupShown');
              if (!profileComplete && isNewRegistration) {
                setShowPopup(true);
                // Set a flag that we've shown the popup
                localStorage.setItem('profilePopupShown', 'true');
              }
              
              setIsProfileComplete(profileComplete);
            } else {
              // No profile data - must be new user
              setIsProfileComplete(false);
              localStorage.setItem('companyProfileComplete', JSON.stringify(false));
              
              // For a new user with no profile, always show the popup
              const isNewRegistration = !localStorage.getItem('profilePopupShown');
              if (isNewRegistration) {
                setShowPopup(true);
                localStorage.setItem('profilePopupShown', 'true');
              }
            }
          } catch (error) {
            console.error("Error checking profile completeness:", error);
            setIsProfileComplete(false);
            localStorage.setItem('companyProfileComplete', JSON.stringify(false));
            
            // For error case, assume new user
            const isNewRegistration = !localStorage.getItem('profilePopupShown');
            if (isNewRegistration) {
              setShowPopup(true);
              localStorage.setItem('profilePopupShown', 'true');
            }
          } finally {
            setIsChecking(false);
          }
        } else {
          setIsProfileComplete(false);
          setIsChecking(false);
          localStorage.setItem('companyProfileComplete', JSON.stringify(false));
        }
      });
      
      return () => unsubscribe();
    };
    
    checkProfileCompleteness();
  }, []);

  const handleAction = (e) => {
    if (isChecking) return false;
    
    if (!isProfileComplete) {
      e.preventDefault();
      setShowPopup(true);
      return false;
    }
    
    return true;
  };

  // Clone the child component and add the onClick handler
  return (
    <>
      {React.cloneElement(children, {
        onClick: (e) => {
          // Run the profile check first
          const canProceed = handleAction(e);
          
          // If profile is complete and the child has an onClick, call it
          if (canProceed && children.props.onClick) {
            children.props.onClick(e);
          }
        }
      })}
      
      {showPopup && (
        <CompanyProfileCompletionPopup 
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default CompanyProfileCompletionCheck;