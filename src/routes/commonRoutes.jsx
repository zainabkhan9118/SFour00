import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy load all common components
const Home = lazy(() => import("../pages/Home"));
const ForgetPassword = lazy(() => import("../pages/ForgetPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const CreateAccount = lazy(() => import("../pages/CreateAccount"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const EmailVerification = lazy(() => import("../pages/EmailVerification"));

// Suspense wrapper component with spinner
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

const commonRoutes = [
  <Route key="home" path="/" element={<SuspenseWrapper><Home /></SuspenseWrapper>} />,
  <Route key="forget-password" path="/ForgetPassword" element={<SuspenseWrapper><ForgetPassword /></SuspenseWrapper>} />,
  <Route key="reset-password" path="/ResetPassword" element={<SuspenseWrapper><ResetPassword /></SuspenseWrapper>} />,
  <Route key="dashboard" path="/dashboard" element={<SuspenseWrapper><Dashboard /></SuspenseWrapper>} />,
  <Route key="login" path="/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />,
  <Route key="create-account" path="/CreateAccount" element={<SuspenseWrapper><CreateAccount /></SuspenseWrapper>} />,
  <Route key="email-verification" path="/email-verification" element={<SuspenseWrapper><EmailVerification /></SuspenseWrapper>} /> 
];

export default commonRoutes;