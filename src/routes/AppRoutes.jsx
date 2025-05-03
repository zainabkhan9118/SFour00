import React, { Suspense, useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import UserRoutes from "./userRoutes";
import CompanyRoutes from "./companyRoutes";
import CommonRoutes from "./commonRoutes";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Preload critical components that users are likely to navigate to
const preloadComponent = (importFn) => {
  importFn().catch(() => {});
};

const AppRoutes = () => {
  const location = useLocation();

  // Preload components based on current route
  useEffect(() => {
    // Preload login and dashboard when on home page
    if (location.pathname === '/') {
      import("../pages/LoginPage");
      import("../pages/Dashboard");
    }
    
    // Preload job listings when on dashboard
    if (location.pathname === '/dashboard') {
      if (localStorage.getItem('userRole') === 'Job Seeker') {
        import("../components/user/JobPage/Job");
      } else {
        import("../components/company/profile/jobs/RecentJob");
      }
    }
    
    // Preload personal details when on user profile
    if (location.pathname === '/User-PersonalDetails') {
      import("../components/user/profile/PersonalDetails/Forms/EditPersonalDetails");
    }
  }, [location.pathname]);

  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner /></div>}>
      <Routes>
        {CommonRoutes}
        {UserRoutes}
        {CompanyRoutes}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;