import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Apply Success",
      message: "You have applied for a job in Queenify Group as UI Designer",
      time: "10h ago",
      unread: true,
    },
    {
      id: 2,
      title: "Complete your profile",
      message: "Please verify your profile information to continue using this app",
      time: "4 June",
      unread: false,
    },
    {
      id: 3,
      title: "Apply Success",
      message: "You have applied for a job in Queenify Group as UI Designer",
      time: "3 June",
      unread: false,
    },
    {
      id: 4,
      title: "Interview Calls",
      message: "Congratulations! You have interview calls tomorrow. Check schedule here..",
      time: "4m ago",
      unread: false,
    },
  ]);

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false }))
    );
  };

  // Delete all notifications
  const deleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Notification Section */}
        <div className="w-full mx-auto p-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Notifications List */}
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b 
                  ${notif.unread ? "bg-orange-500 text-white" : "bg-white text-black"}
                  hover:bg-orange-500 hover:text-white transition duration-300 cursor-pointer`}
              >
                <div>
                  <h4 className="font-semibold">{notif.title}</h4>
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs opacity-75 mt-1">{notif.time}</p>
                </div>
                {notif.unread && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-sm font-semibold mt-2 sm:mt-0 bg-white text-orange-500 px-3 py-1 rounded-lg hover:bg-orange-700 hover:text-white"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={deleteAll}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Delete All
            </button>
            <button
              onClick={markAllAsRead}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            >
              Mark All As Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
