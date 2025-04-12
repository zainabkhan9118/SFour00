import React from "react";

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">Company Dashboard</h1>
      <p className="text-lg text-gray-600 mt-2">Welcome to your company dashboard.</p>
      
      {/* Company-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Job Postings</h2>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-500">Active job listings</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Applications</h2>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm text-gray-500">Total applicants</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Interviews</h2>
          <p className="text-3xl font-bold text-purple-600">12</p>
          <p className="text-sm text-gray-500">Scheduled this week</p>
        </div>
      </div>
    </div>
  );
}