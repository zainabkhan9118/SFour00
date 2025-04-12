import React from "react";
import { Routes } from "react-router-dom";
import UserRoutes from "./userRoutes";
import CompanyRoutes from "./companyRoutes";
import CommonRoutes from "./commonRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {CommonRoutes}
      {UserRoutes}
      {CompanyRoutes}
    </Routes>
  );
};

export default AppRoutes;