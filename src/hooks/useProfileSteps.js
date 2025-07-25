import { useState, useEffect } from 'react';

/**
 * Custom hook to manage profile completion steps and their status
 * @returns {Object} The profile steps data and utility functions
 */
export const useProfileSteps = () => {
  // Define the default profile steps
  const defaultSteps = [
    { id: 1, name: "Personal", path: "/edit-personal-details", completed: false },
    { id: 2, name: "Education", path: "/edit-education", completed: false },
    { id: 3, name: "Experience", path: "/edit-experience", completed: false },
    { id: 4, name: "Certificate", path: "/edit-certificate", completed: false },
    { id: 5, name: "License", path: "/edit-license", completed: false },
    { id: 6, name: "UTR", path: "/edit-utr-number", completed: false },
    { id: 7, name: "NIN", path: "/edit-nin-number", completed: false }
  ];

  const [profileSteps, setProfileSteps] = useState(defaultSteps);
  
  /**
   * Function to check localStorage and update the steps status
   * This is exported so it can be called explicitly when needed (e.g., after login)
   */
  const refreshStepsStatus = () => {
    const updatedSteps = [...defaultSteps];
    
    // Get userId - needed to determine if we're logged in
    const userId = localStorage.getItem("userId") || localStorage.getItem("currentUserId");
    
    // Global completion flag - this is our fallback
    const profileComplete = localStorage.getItem("profileComplete") === "true";
    
    // Check Personal Details - multiple ways to determine completion
    const hasPersonal = localStorage.getItem("personalDetails") === "completed" || 
                        localStorage.getItem("personalDetailsCompleted") === "true";
    if (hasPersonal) {
      updatedSteps[0].completed = true;
    }
    
    // Check Education - look for any education data or completion flag
    const hasEducation = localStorage.getItem("hasEducation") === "true" || 
                         localStorage.getItem("educationCompleted") === "true";
    if (hasEducation) {
      updatedSteps[1].completed = true;
    }
    
    // Check Experience - look for any experience data or completion flag
    const hasExperience = localStorage.getItem("hasExperience") === "true" || 
                          localStorage.getItem("experienceCompleted") === "true";
    if (hasExperience) {
      updatedSteps[2].completed = true;
    }
    
    // Check Certificate - look for ID or flag
    const certificateId = localStorage.getItem("certificateId");
    const hasCertificate = (certificateId && certificateId !== "null") || 
                           localStorage.getItem("certificateCompleted") === "true";
    if (hasCertificate) updatedSteps[3].completed = true;
    
    // Check License - look for ID or flag
    const licenseId = localStorage.getItem("licenseId");
    const hasLicense = (licenseId && licenseId !== "null") || 
                       localStorage.getItem("licenseCompleted") === "true";
    if (hasLicense) updatedSteps[4].completed = true;
    
    // Check UTR Number - look for any value or completion flag
    const utrNumber = localStorage.getItem("utrNumber");
    const hasUtr = (utrNumber && utrNumber !== "null") || 
                   localStorage.getItem("utrCompleted") === "true";
    if (hasUtr) updatedSteps[5].completed = true;
    
    // Check NIN Number - look for any value or completion flag
    const ninNumber = localStorage.getItem("ninNumber");
    const hasNin = (ninNumber && ninNumber !== "null") || 
                   localStorage.getItem("ninCompleted") === "true";
    if (hasNin) updatedSteps[6].completed = true;
    
    // Set active state based on current path
    const currentPath = window.location.pathname;
    updatedSteps.forEach(step => {
      step.active = step.path === currentPath;
    });
    
    setProfileSteps(updatedSteps);
    return updatedSteps;
  };

  // Update steps status based on local storage and current path
  useEffect(() => {
    // Initial refresh
    refreshStepsStatus();
    
    // Add listener for route changes
    window.addEventListener('popstate', refreshStepsStatus);
    
    // Create a more specific storage event listener
    const handleStorageChange = (e) => {
      // Listen for any login-related or profile completion related changes
      if (e.key && (
          e.key.includes('Id') || 
          e.key.includes('profile') || 
          e.key.includes('personal') ||
          e.key.includes('education') ||
          e.key.includes('experience') ||
          e.key.includes('certificate') ||
          e.key.includes('license') ||
          e.key.includes('utr') ||
          e.key.includes('nin')
        )) {
        console.log("Storage changed:", e.key, "- refreshing steps");
        refreshStepsStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for login every second for the first 5 seconds after component mount
    // This helps with login detection when localStorage isn't triggering events
    const loginCheckInterval = setInterval(() => {
      const isLoggedIn = localStorage.getItem('userId') || localStorage.getItem('currentUserId');
      if (isLoggedIn) {
        refreshStepsStatus();
      }
    }, 1000);
    
    // Clear interval after 5 seconds
    setTimeout(() => {
      clearInterval(loginCheckInterval);
    }, 5000);
    
    return () => {
      window.removeEventListener('popstate', refreshStepsStatus);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(loginCheckInterval);
    };
  }, []);

  /**
   * Update the completion status of a specific step
   * @param {number} stepId - The ID of the step to update
   * @param {boolean} completed - The new completion status
   */
  const updateStepStatus = (stepId, completed) => {
    setProfileSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, completed } : step
      )
    );
  };

  /**
   * Get the next incomplete step in the sequence
   * @returns {Object|null} The next incomplete step or null if all steps are complete
   */
  const getNextIncompleteStep = () => {
    const nextStep = profileSteps.find(step => !step.completed);
    return nextStep || null;
  };

  /**
   * Get the next step after the current one regardless of completion status
   * @param {number|string} currentStep - The ID or name of the current step
   * @returns {Object|null} The next step or null if there is no next step
   */
  const getNextStep = (currentStep) => {
    // Find by ID or name
    const currentIndex = typeof currentStep === 'number' 
      ? profileSteps.findIndex(step => step.id === currentStep)
      : profileSteps.findIndex(step => step.name === currentStep);
      
    if (currentIndex === -1 || currentIndex === profileSteps.length - 1) {
      return null;
    }
    return profileSteps[currentIndex + 1];
  };
  
  /**
   * Mark a specific step as complete and update localStorage
   * @param {string} stepName - The name of the step to mark as complete
   */
  const markStepComplete = (stepName) => {
    const stepIndex = profileSteps.findIndex(step => step.name === stepName);
    if (stepIndex === -1) return;
    
    const step = profileSteps[stepIndex];
    
    // Update localStorage based on step name
    switch(stepName) {
      case 'Personal':
        localStorage.setItem("personalDetails", "completed");
        localStorage.setItem("personalDetailsCompleted", "true");
        break;
      case 'Education':
        localStorage.setItem("hasEducation", "true");
        localStorage.setItem("educationCompleted", "true");
        break;
      case 'Experience':
        localStorage.setItem("hasExperience", "true");
        localStorage.setItem("experienceCompleted", "true");
        break;
      case 'Certificate':
        // This is handled by the form saving logic
        localStorage.setItem("certificateCompleted", "true");
        break;
      case 'License':
        // This is handled by the form saving logic
        localStorage.setItem("licenseCompleted", "true");
        break;
      case 'UTR':
        // Make sure we have a value to indicate completion
        if (!localStorage.getItem("utrNumber")) {
          localStorage.setItem("utrNumber", "completed");
        }
        localStorage.setItem("utrCompleted", "true");
        break;
      case 'NIN':
        // Make sure we have a value to indicate completion
        if (!localStorage.getItem("ninNumber")) {
          localStorage.setItem("ninNumber", "completed");
        }
        localStorage.setItem("ninCompleted", "true");
        break;
    }
    
    // Also set the global profile status flag
    localStorage.setItem("profileComplete", "true");
    
    // Update the step in state
    updateStepStatus(step.id, true);
  };

  return { 
    profileSteps, 
    updateStepStatus, 
    getNextIncompleteStep, 
    getNextStep, 
    markStepComplete,
    refreshStepsStatus  // Export this so it can be called after login
  };
};

export default useProfileSteps;
