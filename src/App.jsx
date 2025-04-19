import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Router>
  );
};

export default App;
