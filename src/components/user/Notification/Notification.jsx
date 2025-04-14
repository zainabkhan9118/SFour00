import React, { useState } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import { CiClock1 } from "react-icons/ci";

const UserNotification = () => {
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
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Notification Section */}
        <div className="w-full mx-auto p-4 sm:p-6">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl shadow-sm ${
                    notification.unread ? "bg-[#FD7F00] text-white" : "bg-gray-200"
                  } hover:bg-[#FD7F00] hover:text-white transition duration-300`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h2 className="font-semibold text-xl sm:text-[25px]">{notification.title}</h2>
                    {notification.unread && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm underline mt-2 sm:mt-0"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-sm sm:text-base mt-2">{notification.message}</p>
                  <div className="text-xs sm:text-sm mt-2 opacity-80 flex gap-2">
                    <CiClock1 className="mt-1" />
                    <p>{notification.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notifications available.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button
              onClick={deleteAll}
              className="w-full sm:w-40 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full"
            >
              Delete All
            </button>
            <button
              onClick={markAllAsRead}
              className="w-full sm:w-40 h-12 flex items-center justify-center bg-[#FD7F00] rounded-full text-white"
            >
              Mark All As Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotification;