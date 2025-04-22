import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import SessionWrapper from "./components/session/SessionWrapper.jsx";

const App = () => {
  return (
    <Router>
      <SessionWrapper>
        <AppRoutes />
        <ToastContainer position="bottom-right" autoClose={5000} />
      </SessionWrapper>
    </Router>
  );
};

export default App;
