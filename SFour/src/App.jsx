import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserLogin from "./components/user/UserLogin";
import CompanyLogin from "./components/company/CompanyLogin";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Dashboard from "./components/company/Dashboard";
import ProfileCompany from "./components/company/profile/ProfileCompany";
import JobPosting from "./components/company/profile/JobPosting";
import RecentJob from "./components/company/profile/jobs/RecentJob";
import JobDetail from "./components/company/profile/jobs/JobDetail";
import ApplicantProfile from "./components/company/profile/ApplicantProfile";
import Chat from "./components/company/chat/chat";
import ViewApplicant from "./components/company/profile/jobs/ViewApplicant";
import AssignedJob from "./components/company/profile/jobs/AssignedJob";
import RotaManagement from "./components/company/profile/RotaManagement";
import ChatSupport from "./components/company/profile/ChatSupport";
import UserDashboard from "./components/user/UserDashboard";
import Job from "./components/user/JobPage/Job";
import JobDetails from "./components/user/JobPage/JobDetails";
import CompanyDetails from "./components/user/CompanyDetails/CompanyDetails";
import WorkApplied from "./components/user/WorkApplied/WorkApplied";
import MyWorkAssignedPage from "./components/user/WorkAssign/MyWorkAssignedPage";
import UserNotification from "./components/user/Notification/Notification";
import UserProfile from "./components/user/profile/UserProfile";
import UserSidebar from "./components/user/profile/UserSidebar";
import PersonalDetails from "./components/user/profile/PersonalDetails/PersonalDetails";
import FAQSection from "./components/user/Faqs/Faqs";
import InvoiceList from "./components/user/AllInvoices/InvoiceList";
import BankAccountDetails from "./components/user/BankAccountDetails/BankAccountDetails";

import UserChatPage from "./components/user/Chat/UserChatPage";

import FAQ from "./components/company/profile/Faq";
import AssignedJobDetail from "./components/company/profile/jobs/AssignedJobDetail";
import Inprogess from "./components/company/profile/jobs/inprogress/Inprogess";
import InProgressJobDetail from "./components/company/profile/jobs/inprogress/InProgressJobDetail";
import Completed from "./components/company/profile/jobs/completed/Completed";
import CompletedJobDetail from "./components/company/profile/jobs/completed/CompletedJobDetail";
import Notification from "./components/company/Notification/Notification";
import UserWorkInprogess from "./components/user/WorkInprogress/UserWorkInprogess";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/CreateAccount" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company-profile" element={<ProfileCompany />} />
        <Route path="/job-posting" element={<JobPosting/>} />
        <Route path="/recents-jobs" element={<RecentJob/>} />
        <Route path="/job-detail" element={<JobDetail/>} />
        <Route path="/view-applicant" element={<ViewApplicant/>} />
        <Route path="/applicant-profile" element={<ApplicantProfile/>} />
        <Route path="/assign-jobDetail" element={<AssignedJobDetail/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/job-assigned" element={<AssignedJob/>} />
        <Route path="/rota-management" element={<RotaManagement/>} />
        <Route path="/chat-support" element={<ChatSupport/>} />

        {/* user */}
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/User-Dashboard" element={<UserDashboard />} />
        <Route path="/User-Job" element={<Job/>} />
        <Route path="/User-JobDetails" element={<JobDetails/>} />
        <Route path="/User-CompanyDetails" element={<CompanyDetails/>} />
        <Route path="/User-WorkApplied" element={<WorkApplied/>} />
        <Route path="/User-MyWorkAssignedPage" element={<MyWorkAssignedPage/>} />
        <Route path="/User-workInprogess" element={<UserWorkInprogess/>} />

        <Route path="/User-UserNotification" element={<UserNotification/>} />
        <Route path="/User-UserProfile" element={<UserProfile/>} />
        <Route path="/User-UserSidebar" element={<UserSidebar/>} />
        <Route path="/User-PersonalDetails" element={<PersonalDetails/>} />
        <Route path="/User-FAQSection" element={<FAQSection/>} />
        <Route path="/User-InvoiceList" element={<InvoiceList/>} />
        <Route path="/User-BankDetails" element={<BankAccountDetails/>} />
        <Route path="/User-UserChatPage" element={<UserChatPage/>} />





        <Route path="/in-progress" element={<Inprogess/>} />
        <Route path="/inProgress-jobDetail" element={<InProgressJobDetail/>} />
        <Route path="/completed-job" element={<Completed/>} />
        <Route path="/completed-jobDetail" element={<CompletedJobDetail/>} />
        <Route path="/faq" element={<FAQ/>} />
        { <Route path="/notification" element={<Notification/>} /> }

      </Routes>
    </Router>
  );
};

export default App;