import React from "react";
import { CheckCircle, MapPin } from "lucide-react";
import Sidebar from "../SideBar";
import Header from "../Header";
import UserSidebar from "../profile/UserSidebar";

const invoices = [
  {
    id: 1,
    icon: "Up",
    role: "Networking Engineer",
    location: "Washington",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Completed",
  },
  {
    id: 2,
    icon: "🎨",
    role: "Product Designer",
    location: "Dhaka",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Completed",
  },
  {
    id: 3,
    icon: "🌎",
    role: "Junior Graphic Designer",
    location: "Brazil",
    rate: "$12/hr",
    date: "Feb 2, 2019 19:28",
    status: "Completed",
  },
  {
    id: 4,
    icon: "🎭",
    role: "Visual Designer",
    location: "Wisconsin",
    rate: "$12/hr",
    date: "Dec 7, 2019 23:26",
    status: "Completed",
  },
  {
    id: 5,
    icon: "🐦",
    role: "Marketing Officer",
    location: "United States",
    rate: "$12/hr",
    date: "Dec 4, 2019 21:42",
    status: "Completed",
  },
];

const InvoiceList = () => {
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
    <div className="w-[60vw] ml-4  p-6">
      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>
      <div className="bg-white rounded-lg   p-5">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between border-b last:border-b-0 py-3"
          >
            <div className="flex items-center space-x-5">
              <span className="text-lg bg-gray-200 rounded-full p-2">{invoice.icon}</span>
              <div>
                <h2 className="font-semibold">{invoice.role}</h2>
                <div className="text-sm text-gray-500 flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {invoice.location} &nbsp; {invoice.rate}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{invoice.date}</div>
            <div className="text-green-500 flex items-center">
              <CheckCircle size={16} className="mr-1" /> {invoice.status}
            </div>
            <button className="bg-orange-500  text-white px-4 py-2 rounded-3xl">
              See Invoice
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>

    </main>
    </div></div>
  );
};

export default InvoiceList;
