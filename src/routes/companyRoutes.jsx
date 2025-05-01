import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy load all components
const ProfileCompany = lazy(() => import("../components/company/profile/ProfileCompany"));
const JobPosting = lazy(() => import("../components/company/profile/JobPosting"));
const RecentJob = lazy(() => import("../components/company/profile/jobs/RecentJob"));
const JobDetail = lazy(() => import("../components/company/profile/jobs/JobDetail"));
const ApplicantProfile = lazy(() => import("../components/company/profile/ApplicantProfile"));
const Chat = lazy(() => import("../components/company/chat/chat"));
const ViewApplicant = lazy(() => import("../components/company/profile/jobs/ViewApplicant"));
const AssignedJob = lazy(() => import("../components/company/profile/jobs/AssignedJob"));
const RotaManagement = lazy(() => import("../components/company/profile/RotaManagement"));
const ChatSupport = lazy(() => import("../components/company/profile/ChatSupport"));
const FAQ = lazy(() => import("../components/company/profile/Faq"));
const AssignedJobDetail = lazy(() => import("../components/company/profile/jobs/AssignedJobDetail"));
const Inprogess = lazy(() => import("../components/company/profile/jobs/inprogress/Inprogess"));
const InProgressJobDetail = lazy(() => import("../components/company/profile/jobs/inprogress/InProgressJobDetail"));
const Completed = lazy(() => import("../components/company/profile/jobs/completed/Completed"));
const CompletedJobDetail = lazy(() => import("../components/company/profile/jobs/completed/CompletedJobDetail"));
const Notification = lazy(() => import("../components/company/Notification/Notification"));
const Qrcode = lazy(() => import("../components/common/Qrcode"));
const ProblemChat = lazy(() => import("../components/company/problems/problemchat"));
const AlertLog = lazy(() => import("../components/user/WorkInprogress/AlertLog"));
const EditCompanyForm = lazy(() => import("../components/company/profile/EditCompanyForm"));
const EditContactForm = lazy(() => import("../components/company/profile/EditContactForm"));
const EditEmailForm = lazy(() => import("../components/company/profile/EditEmailForm"));
const EditManagerForm = lazy(() => import("../components/company/profile/EditManagerForm"));
const MapExample = lazy(() => import("../components/company/profile/test"));

// Suspense wrapper component with spinner
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

const CompanyRoutes = [
  <Route key="company-profile" path="/company-profile" element={<SuspenseWrapper><ProfileCompany /></SuspenseWrapper>} />,
  <Route key="map-example" path="/test" element={<SuspenseWrapper><MapExample /></SuspenseWrapper>} />,
  <Route key="edit-company-profile" path="/edit-company-profile" element={<SuspenseWrapper><EditCompanyForm /></SuspenseWrapper>} />,
  <Route key="edit-company-contact" path="/edit-company-contact" element={<SuspenseWrapper><EditContactForm /></SuspenseWrapper>} />,
  <Route key="edit-company-email" path="/edit-company-email" element={<SuspenseWrapper><EditEmailForm /></SuspenseWrapper>} />,
  <Route key="edit-company-manager" path="/edit-company-manager" element={<SuspenseWrapper><EditManagerForm /></SuspenseWrapper>} />,
  <Route key="problems-reported" path="/problems-reported" element={<SuspenseWrapper><ProblemChat /></SuspenseWrapper>} />,
  <Route key="job-posting" path="/job-posting" element={<SuspenseWrapper><JobPosting /></SuspenseWrapper>} />,
  <Route key="recents-jobs" path="/recents-jobs" element={<SuspenseWrapper><RecentJob /></SuspenseWrapper>} />,
  <Route key="job-detail" path="/job-detail/:jobId" element={<SuspenseWrapper><JobDetail /></SuspenseWrapper>} />,
  <Route key="view-applicant" path="/view-applicant/:jobId" element={<SuspenseWrapper><ViewApplicant /></SuspenseWrapper>} />,
  <Route key="applicant-profile" path="/applicant-profile" element={<SuspenseWrapper><ApplicantProfile /></SuspenseWrapper>} />,
  <Route key="assign-jobDetail" path="/assign-jobDetail/:jobId" element={<SuspenseWrapper><AssignedJobDetail /></SuspenseWrapper>} />,
  <Route key="chat" path="/chat" element={<SuspenseWrapper><Chat /></SuspenseWrapper>} />,
  <Route key="job-assigned" path="/job-assigned" element={<SuspenseWrapper><AssignedJob /></SuspenseWrapper>} />,
  <Route key="rota-management" path="/rota-management" element={<SuspenseWrapper><RotaManagement /></SuspenseWrapper>} />,
  <Route key="chat-support" path="/chat-support" element={<SuspenseWrapper><ChatSupport /></SuspenseWrapper>} />,
  <Route key="in-progress" path="/in-progress" element={<SuspenseWrapper><Inprogess /></SuspenseWrapper>} />,
  <Route key="inProgress-jobDetail" path="/inProgress-jobDetail/:jobId" element={<SuspenseWrapper><InProgressJobDetail /></SuspenseWrapper>} />,
  <Route key="completed-job" path="/completed-job" element={<SuspenseWrapper><Completed /></SuspenseWrapper>} />,
  <Route key="completed-jobDetail" path="/completed-jobDetail/:jobId" element={<SuspenseWrapper><CompletedJobDetail /></SuspenseWrapper>} />,
  <Route key="faq" path="/faq" element={<SuspenseWrapper><FAQ /></SuspenseWrapper>} />,
  <Route key="notification" path="/notification" element={<SuspenseWrapper><Notification /></SuspenseWrapper>} />,
  <Route key="qrcode" path="/qr-code" element={<SuspenseWrapper><Qrcode/></SuspenseWrapper>} />,
  <Route key="alert-log" path="/alert-log" element={<SuspenseWrapper><AlertLog/></SuspenseWrapper>} />
];

export default CompanyRoutes;