import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SessionExpirePopup from "../user/popupModel/SessionExpirePopup"; // Import your popup component

const SessionWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false); // Track session expiration

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/CreateAccount",
    "/ForgetPassword",
    "/ResetPassword",
    "/email-verification",
  ];

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));
    if (sessionData) {
      const { timestamp } = sessionData;
      const currentTime = Date.now();
      const sessionDuration = 3600000; // 1 hour

      if (currentTime - timestamp > sessionDuration) {
        setSessionExpired(true); // Show the session expiration popup
        localStorage.removeItem("sessionData");
      }
    } else {
      // Check if the current route is a public route
      const isPublicRoute = publicRoutes.some((route) => location.pathname === route);

      if (!isPublicRoute) {
        navigate("/login");
      }
    }
  }, [navigate, location]);

  const handleSessionExpirePopupClose = () => {
    navigate("/login"); // Redirect to login when popup is closed
  };

  return (
    <>
      {sessionExpired ? (
        <SessionExpirePopup onClose={handleSessionExpirePopupClose} />
      ) : (
        children
      )}
    </>
  );
};

export default SessionWrapper;