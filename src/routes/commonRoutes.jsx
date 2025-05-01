import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CommonLayout from "../components/layouts/common/CommonLayout";

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

// Layout wrapper for common pages
const WithCommonLayout = ({ Component }) => (
  <CommonLayout>
    <Component />
  </CommonLayout>
);

const commonRoutes = [
  <Route key="home" path="/" element={<SuspenseWrapper><WithCommonLayout Component={Home} /></SuspenseWrapper>} />,
  <Route key="forget-password" path="/ForgetPassword" element={<SuspenseWrapper><WithCommonLayout Component={ForgetPassword} /></SuspenseWrapper>} />,
  <Route key="reset-password" path="/ResetPassword" element={<SuspenseWrapper><WithCommonLayout Component={ResetPassword} /></SuspenseWrapper>} />,
  <Route key="dashboard" path="/dashboard" element={<SuspenseWrapper><WithCommonLayout Component={Dashboard} /></SuspenseWrapper>} />,
  <Route key="login" path="/login" element={<SuspenseWrapper><WithCommonLayout Component={LoginPage} /></SuspenseWrapper>} />,
  <Route key="create-account" path="/CreateAccount" element={<SuspenseWrapper><WithCommonLayout Component={CreateAccount} /></SuspenseWrapper>} />,
  <Route key="email-verification" path="/email-verification" element={<SuspenseWrapper><WithCommonLayout Component={EmailVerification} /></SuspenseWrapper>} /> 
];

export default commonRoutes;