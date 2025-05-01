import React from "react";
import { Route } from "react-router-dom";


import Job from "../components/user/JobPage/Job";
import JobDetails from "../components/user/JobPage/JobDetails";
import CompanyDetails from "../components/user/CompanyDetails/CompanyDetails";
import WorkApplied from "../components/user/WorkApplied/WorkApplied";
import MyWorkAssignedPage from "../components/user/WorkAssign/MyWorkAssignedPage";
import UserNotification from "../components/user/Notification/Notification";
import UserProfile from "../components/user/profile/UserProfile";
import UserSidebar from "../components/user/profile/UserSidebar";
import PersonalDetails from "../components/user/profile/PersonalDetails/PersonalDetails";
import EditPersonalDetails from "../components/user/profile/PersonalDetails/Forms/EditPersonalDetails";
import EditExperience from "../components/user/profile/PersonalDetails/Forms/EditExperience";
import EditEducation from "../components/user/profile/PersonalDetails/Forms/EditEducation";
import EditUTRNumber from "../components/user/profile/PersonalDetails/Forms/EditUTRNumber";
import EditCertificate from "../components/user/profile/PersonalDetails/Forms/EditCertificate";
import EditLicense from "../components/user/profile/PersonalDetails/Forms/EditLicense";
import FAQSection from "../components/user/profile/Faqs/Faqs";
import InvoiceList from "../components/user/profile/AllInvoices/InvoiceList";
import BankAccountDetails from "../components/user/profile/BankAccountDetails/BankAccountDetails";
import UserChatPage from "../components/user/Chat/UserChatPage";
import UserWorkInprogess from "../components/user/WorkInprogress/UserWorkInprogess";

import WorkAssignedBook from "../components/user/WorkedAssignedBook/WorkAssignedBook";
import AppliedjobDetail from "../components/user/WorkApplied/AppliedjobDetail";
import ReportProblem from "../components/user/reportProblem/ReportProblem";
import UserCompleted from "../components/user/completed/UserCompleted";

import ContactSupport from "../components/user/profile/ContactSupport/ContactSupport";


const UserRoutes = [
  <Route key="User-Job" path="/User-Job" element={<Job />} />,
  <Route key="User-JobDetails" path="/User-JobDetails/:id" element={<JobDetails />} />,
  <Route key="User-CompanyDetails" path="/User-CompanyDetails" element={<CompanyDetails />} />,
  <Route key="User-WorkApplied" path="/User-WorkApplied" element={<WorkApplied />} />,
  <Route key="User-MyWorkAssignedPage" path="/User-MyWorkAssignedPage" element={<MyWorkAssignedPage />} />,
  <Route key="User-MyWorkAssignBook" path="/User-MyWorkAssignedBook" element={<WorkAssignedBook/>} />,
  <Route key="User-AppliedAndAssignedDetail" path="/User-AppliedAndAssignedDetail/:id" element={<AppliedjobDetail/>} />,
  <Route key="User-ReportProblem" path="/User-reportProblem" element={<ReportProblem/>} />,
  <Route key="User-WorkCompleted" path="/User-WorkCompleted" element={<UserCompleted/>} />,
  <Route key="User-workInprogess" path="/User-workInprogess" element={<UserWorkInprogess />} />,
  <Route key="User-UserNotification" path="/User-UserNotification" element={<UserNotification />} />,
  // <Route key="User-UserProfile" path="/User-UserProfile" element={<UserProfile />} />,
  <Route key="User-UserSidebar" path="/User-UserSidebar" element={<UserSidebar />} />,
  <Route key="User-PersonalDetails" path="/User-PersonalDetails" element={<PersonalDetails />} />,
  <Route key="edit-personal-details" path="/edit-personal-details" element={<EditPersonalDetails />} />,
  <Route key="edit-experience" path="/edit-experience" element={<EditExperience />} />,
  <Route key="edit-education" path="/edit-education" element={<EditEducation />} />,
  <Route key="edit-utr-number" path="/edit-utr-number" element={<EditUTRNumber />} />,
  <Route key="edit-certificate" path="/edit-certificate" element={<EditCertificate />} />,
  <Route key="edit-license" path="/edit-license" element={<EditLicense />} />,
  <Route key="User-FAQSection" path="/User-FAQSection" element={<FAQSection />} />,
  <Route key="User-InvoiceList" path="/User-InvoiceList" element={<InvoiceList />} />,
  <Route key="User-BankDetails" path="/User-BankDetails" element={<BankAccountDetails />} />,
  <Route key="User-UserChatPage" path="/User-UserChatPage" element={<UserChatPage />} />,
  <Route key="User-ContactSupport" path="/User-ContactSupport" element={<ContactSupport />} />
];

export default UserRoutes;