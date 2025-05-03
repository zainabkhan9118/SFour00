import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import SessionWrapper from "./components/session/SessionWrapper.jsx";
import { ProfileCompletionProvider } from "./context/profile/ProfileCompletionContext.jsx";
import { ToastProvider } from "./components/notifications/ToastManager.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <SessionWrapper>
          <ProfileCompletionProvider>
            <ToastProvider>
              <AppRoutes />
              <ToastContainer position="bottom-right" autoClose={5000} />
            </ToastProvider>
          </ProfileCompletionProvider>
        </SessionWrapper>
      </ThemeProvider>
    </Router>
  );
};

export default App;
