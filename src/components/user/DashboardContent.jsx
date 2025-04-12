import React from "react";

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
      <p className="text-lg text-gray-600 mt-2">Welcome to your job seeker dashboard.</p>
      
      {/* User-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Applications</h2>
          <p className="text-3xl font-bold text-blue-600">14</p>
          <p className="text-sm text-gray-500">Jobs you've applied to</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Saved Jobs</h2>
          <p className="text-3xl font-bold text-yellow-600">27</p>
          <p className="text-sm text-gray-500">Jobs you've bookmarked</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Profile Views</h2>
          <p className="text-3xl font-bold text-green-600">38</p>
          <p className="text-sm text-gray-500">In the last 30 days</p>
        </div>
      </div>
    </div>
  );
}