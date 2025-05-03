import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getCompanyProfile } from "../../../api/companyApi";
import CompanyProfileCompletionPopup from './CompanyProfileCompletionPopup';

const CompanyProfileCompletionCheck = ({ children }) => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

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
              setIsProfileComplete(profileComplete);
            } else {
              setIsProfileComplete(false);
            }
          } catch (error) {
            console.error("Error checking profile completeness:", error);
            setIsProfileComplete(false);
          } finally {
            setIsChecking(false);
          }
        } else {
          setIsProfileComplete(false);
          setIsChecking(false);
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