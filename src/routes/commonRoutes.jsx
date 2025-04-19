import React from "react";
import { Route } from "react-router-dom";

// Common/shared components
import Home from "../pages/Home";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import CreateAccount from "../pages/CreateAccount";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard"; 
import EmailVerification from "../pages/EmailVerification"; 
const commonRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="forget-password" path="/ForgetPassword" element={<ForgetPassword />} />,
  <Route key="reset-password" path="/ResetPassword" element={<ResetPassword />} />,
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="create-account" path="/CreateAccount" element={<CreateAccount />} />,
  <Route key="email-verification" path="/email-verification" element={<EmailVerification />} /> 
];

export default commonRoutes;