import React from "react";

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Welcome to your job seeker dashboard.</p>
      
      {/* User-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Applications</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">14</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Jobs you've applied to</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Saved Jobs</h2>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">27</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Jobs you've bookmarked</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Profile Views</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">38</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">In the last 30 days</p>
        </div>
      </div>
    </div>
  );
}