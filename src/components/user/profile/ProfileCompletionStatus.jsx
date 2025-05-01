import React from 'react';
import { useProfileCompletion } from '../../../context/profile/ProfileCompletionContext';
import { Link } from 'react-router-dom';

const ProfileCompletionStatus = () => {
  const { profileData, isProfileComplete, isLoading } = useProfileCompletion();
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate completion percentage based on required fields
  const calculateCompletion = () => {
    if (!profileData) return 0;
    
    let totalFields = 5; // Total required sections
    let completedFields = 0;
    
    // Check basic info
    if (profileData.fullname && profileData.shortBio) {
      completedFields++;
    }
    
    // Check address
    if (profileData.address && profileData.address.length > 0 && 
        profileData.address.some(addr => addr.address && addr.duration)) {
      completedFields++;
    }
    
    // Check UTR
    if (profileData.utrNumber) {
      completedFields++;
    }
    
    // Check experience
    if (profileData.experience && profileData.experience.length > 0) {
      completedFields++;
    }
    
    // Check education
    if (profileData.education && profileData.education.length > 0) {
      completedFields++;
    }
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  
  // Define the sections and their completion status
  const sections = [
    {
      name: 'Personal Details',
      isComplete: profileData?.fullname && profileData?.shortBio,
      path: '/User-PersonalDetails'
    },
    {
      name: 'Address History',
      isComplete: profileData?.address && profileData?.address.length > 0 && 
                  profileData?.address.some(addr => addr.address && addr.duration),
      path: '/User-PersonalDetails/address'
    },
    {
      name: 'UTR Information',
      isComplete: profileData?.utrNumber,
      path: '/User-PersonalDetails/utr'
    },
    {
      name: 'Work Experience',
      isComplete: profileData?.experience && profileData?.experience.length > 0,
      path: '/User-PersonalDetails/experience'
    },
    {
      name: 'Education',
      isComplete: profileData?.education && profileData?.education.length > 0,
      path: '/User-PersonalDetails/education'
    }
  ];
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
        <div className="mt-2 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                completionPercentage === 100 ? 'bg-green-500' : 'bg-orange-500'
              }`} 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="ml-4 text-sm font-medium">{completionPercentage}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                section.isComplete ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'
              }`}>
                {section.isComplete ? (
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`ml-2 text-sm ${section.isComplete ? 'text-gray-900' : 'text-gray-500'}`}>
                {section.name}
              </span>
            </div>
            
            {!section.isComplete && (
              <Link 
                to={section.path}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium"
              >
                Complete
              </Link>
            )}
          </div>
        ))}
      </div>
      
      {isProfileComplete ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Your profile is complete! You can now apply for jobs and use all features.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please complete your profile to unlock all features and increase your chances of being hired.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionStatus;