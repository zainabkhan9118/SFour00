import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar"; 

const workers = [
  "Jordan Mendez",
  "Alexander Micheal Vague",
  "Guymey Hawkins",
  "Eisther Hawday",
];

const shifts = [
  { day: "Monday 11 Nov", time: "8:30 AM - 4:00 PM", role: "Part Time Warehouse Supervisor" },
  { day: "Thursday 13 Nov", time: "4:30 PM - 9:00 PM", role: "Part Time Warehouse Supervisor" },
];

const RotaManagement = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar takes full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header at the top */}
        <Header />

        {/* Main content container */}
        <div className="flex-1 p-6 bg-gray-100">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Rota Management</h1>
            <div className="grid grid-cols-6 gap-4 border-b pb-3 text-gray-600">
              {["Monday 11 Nov", "Tuesday 12 Nov", "Thursday 13 Nov", "Friday 14 Nov", "Saturday 15 Nov"].map(
                (day, index) => (
                  <div key={index} className="text-sm font-semibold">
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {shifts.map((shift, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-3 rounded-lg w-48 border border-gray-300 text-sm"
                >
                  <p className="font-bold text-orange-600">{shift.time}</p>
                  <p className="text-gray-600">{shift.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotaManagement;
