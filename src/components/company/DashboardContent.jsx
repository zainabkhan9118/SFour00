import React from "react";

export default function DashboardContent() {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-8 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Company Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Welcome to your company dashboard.</p>
      
      {/* Company-specific dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Job Postings</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Active job listings</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Applications</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">156</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Total applicants</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Interviews</h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">12</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">Scheduled this week</p>
        </div>
      </div>
    </div>
  );
}