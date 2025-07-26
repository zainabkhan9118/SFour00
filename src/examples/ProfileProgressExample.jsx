import React from 'react';
import ProgressTracker from '../../components/common/ProgressTracker';
import useProfileSteps from '../../hooks/useProfileSteps';

/**
 * Example component showing how to use the ProgressTracker component
 * in any part of the application
 */
const ProfileProgressExample = () => {
  // Get profile steps data from our custom hook
  const { profileSteps } = useProfileSteps();
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Profile Progress</h2>
      <div className="bg-white rounded-lg shadow-md p-4">
        <ProgressTracker steps={profileSteps} />
        
        <div className="mt-6">
          <p className="text-gray-700">
            Complete all steps to finalize your profile. Click on any step to continue from there.
          </p>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressExample;
