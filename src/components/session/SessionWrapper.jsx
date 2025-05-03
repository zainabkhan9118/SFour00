// src/components/common/SessionWrapper.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const SessionWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/login", 
    "/CreateAccount", 
    "/ForgetPassword", 
    "/ResetPassword",
    "/email-verification"
  ];

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    if (sessionData) {
      const { timestamp } = sessionData;
      const currentTime = Date.now();
      const sessionDuration = 3600000; 

      if (currentTime - timestamp > sessionDuration) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("sessionData");
        navigate("/login");
      }
    } else {
      // Check if the current route is a public route
      const isPublicRoute = publicRoutes.some(route => location.pathname === route);
      
      if (!isPublicRoute) {
        navigate("/login");
      }
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default SessionWrapper;
