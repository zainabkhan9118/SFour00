import React from "react";
import { Route } from "react-router-dom";

// User components
//import UserLogin from "../components/user/UserLogin";
// import UserDashboard from "../components/user/UserDashboard";
import Job from "../components/user/JobPage/Job";
import JobDetails from "../components/user/JobPage/JobDetails";
import CompanyDetails from "../components/user/CompanyDetails/CompanyDetails";
import WorkApplied from "../components/user/WorkApplied/WorkApplied";
import MyWorkAssignedPage from "../components/user/WorkAssign/MyWorkAssignedPage";
import UserNotification from "../components/user/Notification/Notification";
import UserProfile from "../components/user/profile/UserProfile";
import UserSidebar from "../components/user/profile/UserSidebar";
import PersonalDetails from "../components/user/profile/PersonalDetails/PersonalDetails";
import FAQSection from "../components/user/profile/Faqs/Faqs";
import InvoiceList from "../components/user/profile/AllInvoices/InvoiceList";
import BankAccountDetails from "../components/user/profile/BankAccountDetails/BankAccountDetails";
import UserChatPage from "../components/user/Chat/UserChatPage";
import UserWorkInprogess from "../components/user/WorkInprogress/UserWorkInprogess";
import ContactSupport from "../components/user/profile/ContactSupport/ContactSupport";

const UserRoutes = [
  // <Route key="user-login" path="/user-login" element={<UserLogin />} />,
  // <Route key="User-Dashboard" path="/User-Dashboard" element={<UserDashboard />} />,
  <Route key="User-Job" path="/User-Job" element={<Job />} />,
  <Route key="User-JobDetails" path="/User-JobDetails" element={<JobDetails />} />,
  <Route key="User-CompanyDetails" path="/User-CompanyDetails" element={<CompanyDetails />} />,
  <Route key="User-WorkApplied" path="/User-WorkApplied" element={<WorkApplied />} />,
  <Route key="User-MyWorkAssignedPage" path="/User-MyWorkAssignedPage" element={<MyWorkAssignedPage />} />,
  <Route key="User-workInprogess" path="/User-workInprogess" element={<UserWorkInprogess />} />,
  <Route key="User-UserNotification" path="/User-UserNotification" element={<UserNotification />} />,
  <Route key="User-UserProfile" path="/User-UserProfile" element={<UserProfile />} />,
  <Route key="User-UserSidebar" path="/User-UserSidebar" element={<UserSidebar />} />,
  <Route key="User-PersonalDetails" path="/User-PersonalDetails" element={<PersonalDetails />} />,
  <Route key="User-FAQSection" path="/User-FAQSection" element={<FAQSection />} />,
  <Route key="User-InvoiceList" path="/User-InvoiceList" element={<InvoiceList />} />,
  <Route key="User-BankDetails" path="/User-BankDetails" element={<BankAccountDetails />} />,
  <Route key="User-UserChatPage" path="/User-UserChatPage" element={<UserChatPage />} />,
  <Route key="User-ContactSupport" path="/User-ContactSupport" element={<ContactSupport />} />
];

export default UserRoutes;