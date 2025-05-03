import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import UserLayout from "../components/layouts/UserLayout";

// Lazy load all components
const Job = lazy(() => import("../components/user/JobPage/Job"));
const JobDetails = lazy(() => import("../components/user/JobPage/JobDetails"));
const CompanyDetails = lazy(() => import("../components/user/CompanyDetails/CompanyDetails"));
const WorkApplied = lazy(() => import("../components/user/WorkApplied/WorkApplied"));
const MyWorkAssignedPage = lazy(() => import("../components/user/WorkAssign/MyWorkAssignedPage"));
const UserNotification = lazy(() => import("../components/user/Notification/Notification"));
const UserSidebar = lazy(() => import("../components/user/profile/UserSidebar"));
const PersonalDetails = lazy(() => import("../components/user/profile/PersonalDetails/PersonalDetails"));
const EditPersonalDetails = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditPersonalDetails"));
const EditExperience = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditExperience"));
const EditEducation = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditEducation"));
const EditUTRNumber = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditUTRNumber"));
const EditCertificate = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditCertificate"));
const EditLicense = lazy(() => import("../components/user/profile/PersonalDetails/Forms/EditLicense"));
const FAQSection = lazy(() => import("../components/user/profile/Faqs/Faqs"));
const InvoiceList = lazy(() => import("../components/user/profile/AllInvoices/InvoiceList"));
const BankAccountDetails = lazy(() => import("../components/user/profile/BankAccountDetails/BankAccountDetails"));
const UserChatPage = lazy(() => import("../components/user/Chat/UserChatPage"));
const UserWorkInprogess = lazy(() => import("../components/user/WorkInprogress/UserWorkInprogess"));
const WorkAssignedBook = lazy(() => import("../components/user/WorkedAssignedBook/WorkAssignedBook"));
const AppliedjobDetail = lazy(() => import("../components/user/WorkApplied/AppliedjobDetail"));
const ReportProblem = lazy(() => import("../components/user/reportProblem/ReportProblem"));
const UserCompleted = lazy(() => import("../components/user/completed/UserCompleted"));
const ContactSupport = lazy(() => import("../components/user/profile/ContactSupport/ContactSupport"));

// Suspense wrapper component with spinner
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

// Layout wrapper for user pages
const WithUserLayout = ({ Component }) => (
  <UserLayout>
    <Component />
  </UserLayout>
);

const UserRoutes = [
  <Route key="User-Job" path="/User-Job" element={<SuspenseWrapper><WithUserLayout Component={Job} /></SuspenseWrapper>} />,
  <Route key="User-JobDetails" path="/User-JobDetails/:id" element={<SuspenseWrapper><WithUserLayout Component={JobDetails} /></SuspenseWrapper>} />,
  <Route key="User-CompanyDetails" path="/User-CompanyDetails" element={<SuspenseWrapper><WithUserLayout Component={CompanyDetails} /></SuspenseWrapper>} />,
  <Route key="User-WorkApplied" path="/User-WorkApplied" element={<SuspenseWrapper><WithUserLayout Component={WorkApplied} /></SuspenseWrapper>} />,
  <Route key="User-MyWorkAssignedPage" path="/User-MyWorkAssignedPage" element={<SuspenseWrapper><WithUserLayout Component={MyWorkAssignedPage} /></SuspenseWrapper>} />,
  <Route key="User-MyWorkAssignBook" path="/User-MyWorkAssignedBook" element={<SuspenseWrapper><WithUserLayout Component={WorkAssignedBook} /></SuspenseWrapper>} />,
  <Route key="User-AppliedAndAssignedDetail" path="/User-AppliedAndAssignedDetail/:id" element={<SuspenseWrapper><WithUserLayout Component={AppliedjobDetail} /></SuspenseWrapper>} />,
  <Route key="User-ReportProblem" path="/User-reportProblem" element={<SuspenseWrapper><WithUserLayout Component={ReportProblem} /></SuspenseWrapper>} />,
  <Route key="User-WorkCompleted" path="/User-WorkCompleted" element={<SuspenseWrapper><WithUserLayout Component={UserCompleted} /></SuspenseWrapper>} />,
  <Route key="User-workInprogess" path="/User-workInprogess" element={<SuspenseWrapper><WithUserLayout Component={UserWorkInprogess} /></SuspenseWrapper>} />,
  <Route key="User-UserNotification" path="/User-UserNotification" element={<SuspenseWrapper><WithUserLayout Component={UserNotification} /></SuspenseWrapper>} />,
  <Route key="User-UserSidebar" path="/User-UserSidebar" element={<SuspenseWrapper><WithUserLayout Component={UserSidebar} /></SuspenseWrapper>} />,
  <Route key="User-PersonalDetails" path="/User-PersonalDetails" element={<SuspenseWrapper><WithUserLayout Component={PersonalDetails} /></SuspenseWrapper>} />,
  <Route key="edit-personal-details" path="/edit-personal-details" element={<SuspenseWrapper><WithUserLayout Component={EditPersonalDetails} /></SuspenseWrapper>} />,
  <Route key="edit-experience" path="/edit-experience" element={<SuspenseWrapper><WithUserLayout Component={EditExperience} /></SuspenseWrapper>} />,
  <Route key="edit-education" path="/edit-education" element={<SuspenseWrapper><WithUserLayout Component={EditEducation} /></SuspenseWrapper>} />,
  <Route key="edit-utr-number" path="/edit-utr-number" element={<SuspenseWrapper><WithUserLayout Component={EditUTRNumber} /></SuspenseWrapper>} />,
  <Route key="edit-certificate" path="/edit-certificate" element={<SuspenseWrapper><WithUserLayout Component={EditCertificate} /></SuspenseWrapper>} />,
  <Route key="edit-license" path="/edit-license" element={<SuspenseWrapper><WithUserLayout Component={EditLicense} /></SuspenseWrapper>} />,
  <Route key="User-FAQSection" path="/User-FAQSection" element={<SuspenseWrapper><WithUserLayout Component={FAQSection} /></SuspenseWrapper>} />,
  <Route key="User-InvoiceList" path="/User-InvoiceList" element={<SuspenseWrapper><WithUserLayout Component={InvoiceList} /></SuspenseWrapper>} />,
  <Route key="User-BankDetails" path="/User-BankDetails" element={<SuspenseWrapper><WithUserLayout Component={BankAccountDetails} /></SuspenseWrapper>} />,
  <Route key="User-UserChatPage" path="/User-UserChatPage" element={<SuspenseWrapper><WithUserLayout Component={UserChatPage} /></SuspenseWrapper>} />,
  <Route key="User-ContactSupport" path="/User-ContactSupport" element={<SuspenseWrapper><WithUserLayout Component={ContactSupport} /></SuspenseWrapper>} />
];

export default UserRoutes;