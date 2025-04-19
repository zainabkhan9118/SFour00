import React from "react";
import { Route } from "react-router-dom";
import ProfileCompany from "../components/company/profile/ProfileCompany";
import JobPosting from "../components/company/profile/JobPosting";
import RecentJob from "../components/company/profile/jobs/RecentJob";
import JobDetail from "../components/company/profile/jobs/JobDetail";
import ApplicantProfile from "../components/company/profile/ApplicantProfile";
import Chat from "../components/company/chat/chat";
import ViewApplicant from "../components/company/profile/jobs/ViewApplicant";
import AssignedJob from "../components/company/profile/jobs/AssignedJob";
import RotaManagement from "../components/company/profile/RotaManagement";
import ChatSupport from "../components/company/profile/ChatSupport";
import FAQ from "../components/company/profile/Faq";
import AssignedJobDetail from "../components/company/profile/jobs/AssignedJobDetail";
import Inprogess from "../components/company/profile/jobs/inprogress/Inprogess";
import InProgressJobDetail from "../components/company/profile/jobs/inprogress/InProgressJobDetail";
import Completed from "../components/company/profile/jobs/completed/Completed";
import CompletedJobDetail from "../components/company/profile/jobs/completed/CompletedJobDetail";
import Notification from "../components/company/Notification/Notification";
import Qrcode from "../components/common/Qrcode";

import ProblemChat from "../components/company/problems/problemchat";

import AlertLog from "../components/user/WorkInprogress/AlertLog";


const CompanyRoutes = [
  <Route key="company-profile" path="/company-profile" element={<ProfileCompany />} />,
  <Route key="problems-reported" path="/problems-reported" element={<ProblemChat />} />,
  <Route key="job-posting" path="/job-posting" element={<JobPosting />} />,
  <Route key="recents-jobs" path="/recents-jobs" element={<RecentJob />} />,
  <Route key="job-detail" path="/job-detail" element={<JobDetail />} />,
  <Route key="view-applicant" path="/view-applicant" element={<ViewApplicant />} />,
  <Route key="applicant-profile" path="/applicant-profile" element={<ApplicantProfile />} />,
  <Route key="assign-jobDetail" path="/assign-jobDetail" element={<AssignedJobDetail />} />,
  <Route key="chat" path="/chat" element={<Chat />} />,
  <Route key="job-assigned" path="/job-assigned" element={<AssignedJob />} />,
  <Route key="rota-management" path="/rota-management" element={<RotaManagement />} />,
  <Route key="chat-support" path="/chat-support" element={<ChatSupport />} />,
  <Route key="in-progress" path="/in-progress" element={<Inprogess />} />,
  <Route key="inProgress-jobDetail" path="/inProgress-jobDetail" element={<InProgressJobDetail />} />,
  <Route key="completed-job" path="/completed-job" element={<Completed />} />,
  <Route key="completed-jobDetail" path="/completed-jobDetail" element={<CompletedJobDetail />} />,
  <Route key="faq" path="/faq" element={<FAQ />} />,
  <Route key="notification" path="/notification" element={<Notification />} />,
  <Route key="qrcode" path="/qr-code" element={<Qrcode/>} />,
  <Route key="alert-log" path="/alert-log" element={<AlertLog/>} />



];

export default CompanyRoutes;