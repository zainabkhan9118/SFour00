import React from "react";
import { CheckCircle, MapPin } from "lucide-react";
import Sidebar from "../../SideBar";
import Header from "../../Header";
import UserSidebar from "../UserSidebar";

const invoices = [
  {
    id: 1,
    iconColor: "#4CD964",
    iconText: "Up",
    role: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Completed",
  },
  {
    id: 2,
    iconColor: "#FF2D55",
    iconText: "🎨",
    role: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Completed",
  },
  {
    id: 3,
    iconColor: "#000000",
    iconText: "",
    role: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Completed",
    logoType: "apple",
  },
  {
    id: 4,
    iconColor: "#0078D7",
    iconText: "",
    role: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Completed",
    logoType: "microsoft",
  },
  {
    id: 5,
    iconColor: "#1DA1F2",
    iconText: "",
    role: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Completed",
    logoType: "twitter",
  },
];

const InvoiceList = () => {
  // Function to render the appropriate icon
  const renderIcon = (invoice) => {
    if (invoice.logoType === "apple") {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: invoice.iconColor }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#ffffff">
            <path d="M15.7 8.65c0-1.95 1.05-3.35 3.2-3.35-0.8-1.1-2.35-1.85-3.7-1.85-1.5-0.15-3.15 0.9-3.85 0.9-0.75 0-2.15-0.9-3.45-0.9-1.8 0-3.75 1.35-4.6 3.45-1.05 2.7-0.25 6.7 1.5 8.9 1 1.4 2.15 2.95 3.65 2.9 1.45-0.05 2-0.9 3.75-0.9 1.7 0 2.2 0.9 3.7 0.85 1.55-0.05 2.55-1.35 3.45-2.75 0.7-0.95 1.2-2.05 1.5-3.2-2.35-1.05-3.15-3-3.15-5.05zM12.95 2.8c0.8-0.95 1.25-2.25 1.1-3.55-1.25 0.15-2.45 0.85-3.2 1.85-0.7 0.8-1.3 2.05-1.15 3.25 1.35 0.1 2.6-0.6 3.25-1.55z"></path>
          </svg>
        </div>
      );
    } else if (invoice.logoType === "microsoft") {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: invoice.iconColor }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#ffffff">
            <path d="M9.5 0h-9.5v9.5h9.5v-9.5z"></path>
            <path d="M20 0h-9.5v9.5h9.5v-9.5z"></path>
            <path d="M9.5 10.5h-9.5v9.5h9.5v-9.5z"></path>
            <path d="M20 10.5h-9.5v9.5h9.5v-9.5z"></path>
          </svg>
        </div>
      );
    } else if (invoice.logoType === "twitter") {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: invoice.iconColor }}>
          <svg width="20" height="16" viewBox="0 0 20 16" fill="#ffffff">
            <path d="M20 1.9c-0.7 0.3-1.5 0.5-2.4 0.6 0.9-0.5 1.5-1.3 1.8-2.2-0.8 0.5-1.7 0.8-2.6 1-0.7-0.8-1.8-1.3-3-1.3-2.3 0-4.1 1.9-4.1 4.1 0 0.3 0 0.6 0.1 0.9-3.4-0.2-6.4-1.8-8.4-4.3-0.4 0.7-0.6 1.5-0.6 2.3 0 1.4 0.7 2.6 1.8 3.4-0.7-0-1.3-0.2-1.9-0.5-0-0-0-0-0-0 0 2 1.4 3.7 3.3 4-0.3 0.1-0.7 0.1-1 0.1-0.3 0-0.5-0-0.7-0.1 0.5 1.6 2 2.8 3.8 2.9-1.4 1.1-3.1 1.8-5 1.8-0.3 0-0.6-0-0.9-0.1 1.8 1.1 3.9 1.8 6.1 1.8 7.4 0 11.4-6.1 11.4-11.4 0-0.2 0-0.4-0-0.5 0.8-0.6 1.4-1.3 2-2.1z"></path>
          </svg>
        </div>
      );
    } else {
      return (
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full text-white" 
          style={{ backgroundColor: invoice.iconColor }}
        >
          {invoice.iconText}
        </div>
      );
    }
  };

  return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
    
        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <Header />
       
          <main className="flex-3"> 
          <div className="flex flex-row flex-1">
          <UserSidebar />
          <div className="w-[60vw] ml-4 p-6">
            <h1 className="text-2xl font-bold mb-4">All Invoices</h1>
            <div className="bg-white rounded-lg p-5">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-4 items-center border-b last:border-b-0 py-4"
                >
                  <div className="flex items-center space-x-4">
                    {renderIcon(invoice)}
                    <div>
                      <h2 className="font-semibold">{invoice.role}</h2>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {invoice.location} &nbsp; <span className="text-gray-400">{invoice.rate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center">{invoice.date}</div>
                  <div className="text-green-500 flex items-center justify-center">
                    <CheckCircle size={16} className="mr-1" /> {invoice.status}
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      See Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          </main>
        </div>
      </div>
  );
};

export default InvoiceList;
