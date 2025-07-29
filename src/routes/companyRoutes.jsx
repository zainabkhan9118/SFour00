import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CompanyLayout from "../components/layouts/CompanyLayout";

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
const FindWorker = lazy(() => import("../components/company/profile/FindWorker"));
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
const JobReportLogs = lazy(() => import("../components/company/profile/jobs/reportlogs/JobReportLogs"));

// Suspense wrapper component with spinner
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

// Layout wrapper component
const CompanyLayoutWrapper = ({ component: Component }) => (
  <SuspenseWrapper>
    <CompanyLayout>
      <Component />
    </CompanyLayout>
  </SuspenseWrapper>
);

const CompanyRoutes = [
  <Route key="company-profile" path="/company-profile" element={<CompanyLayoutWrapper component={ProfileCompany} />} />,
  <Route key="map-example" path="/test" element={<CompanyLayoutWrapper component={MapExample} />} />,
  <Route key="edit-company-profile" path="/edit-company-profile" element={<CompanyLayoutWrapper component={EditCompanyForm} />} />,
  <Route key="edit-company-contact" path="/edit-company-contact" element={<CompanyLayoutWrapper component={EditContactForm} />} />,
  <Route key="edit-company-email" path="/edit-company-email" element={<CompanyLayoutWrapper component={EditEmailForm} />} />,
  <Route key="edit-company-manager" path="/edit-company-manager" element={<CompanyLayoutWrapper component={EditManagerForm} />} />,
  <Route key="problems-reported" path="/problems-reported" element={<CompanyLayoutWrapper component={ProblemChat} />} />,
  <Route key="job-posting" path="/job-posting" element={<CompanyLayoutWrapper component={JobPosting} />} />,
  <Route key="recents-jobs" path="/recents-jobs" element={<CompanyLayoutWrapper component={RecentJob} />} />,
  <Route key="job-detail" path="/job-detail/:jobId" element={<CompanyLayoutWrapper component={JobDetail} />} />,
  <Route key="view-applicant" path="/view-applicant/:jobId" element={<CompanyLayoutWrapper component={ViewApplicant} />} />,
  <Route key="applicant-profile" path="/applicant-profile" element={<CompanyLayoutWrapper component={ApplicantProfile} />} />,
  <Route key="assign-jobDetail" path="/assign-jobDetail/:jobId" element={<CompanyLayoutWrapper component={AssignedJobDetail} />} />,
  <Route key="chat" path="/chat" element={<CompanyLayoutWrapper component={Chat} />} />,
  <Route key="job-assigned" path="/job-assigned" element={<CompanyLayoutWrapper component={AssignedJob} />} />,
  <Route key="rota-management" path="/rota-management" element={<CompanyLayoutWrapper component={RotaManagement} />} />,
  <Route key="find-worker" path="/find-worker" element={<CompanyLayoutWrapper component={FindWorker} />} />,
  <Route key="chat-support" path="/chat-support" element={<CompanyLayoutWrapper component={ChatSupport} />} />,
  <Route key="in-progress" path="/in-progress" element={<CompanyLayoutWrapper component={Inprogess} />} />,
  <Route key="inProgress-jobDetail" path="/inProgress-jobDetail/:jobId" element={<CompanyLayoutWrapper component={InProgressJobDetail} />} />,
  <Route key="job-report-logs" path="/job-report-logs/:jobId" element={<CompanyLayoutWrapper component={JobReportLogs} />} />,
  <Route key="completed-job" path="/completed-job" element={<CompanyLayoutWrapper component={Completed} />} />,
  <Route key="completed-jobDetail" path="/completed-jobDetail/:jobId" element={<CompanyLayoutWrapper component={CompletedJobDetail} />} />,
  <Route key="faq" path="/faq" element={<CompanyLayoutWrapper component={FAQ} />} />,
  <Route key="notification" path="/notification" element={<CompanyLayoutWrapper component={Notification} />} />,
  <Route key="qrcode" path="/qr-code" element={<CompanyLayoutWrapper component={Qrcode} />} />,
  <Route key="alert-log" path="/alert-log" element={<CompanyLayoutWrapper component={AlertLog} />} />
];

export default CompanyRoutes;