import React from "react";
import Sidebar from "../SideBar";
import { User } from "lucide-react";
import UserSidebar from "./UserSidebar";
import Header from "../Header";

const UserProfile = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
   
      <main className="flex-  ">
      <div className="flex flex-col flex-1">
      <UserSidebar />
      </div>
       

     
      </main>
    </div>
    </div>
  );
};

export default UserProfile;
