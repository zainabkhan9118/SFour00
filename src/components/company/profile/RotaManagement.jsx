import React from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import CompanySideBar from "./CompanySideBar";

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="flex h-full">
            <div className="w-64 bg-white border-r">
              <CompanySideBar />
            </div>
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-6xl">
                <h1 className="text-2xl font-bold mb-6">Rota Management</h1>
                
                <div className="flex">
                  {/* Workers Section */}
                  <div className="w-48 mr-4">
                    <div className="flex items-center mb-4">
                      <span className="text-yellow-500 text-sm">👥 Workers</span>
                    </div>
                    <div className="space-y-6">
                      {workers.map((worker, index) => (
                        <div key={index} className="text-sm text-gray-700">
                          {worker}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {["Monday 11 Nov", "Tuesday 12 Nov", "Thursday 13 Nov", "Friday 14 Nov", "Saturday 15 Nov"].map(
                        (day, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    {/* Shifts */}
                    <div className="relative min-h-[400px]">
                      {shifts.map((shift, index) => (
                        <div
                          key={index}
                          className={`absolute bg-white rounded-lg border border-gray-200 p-3 w-44 ${
                            index === 0 ? 'left-0 top-0' : 'left-[400px] top-[100px]'
                          }`}
                        >
                          <p className="font-medium text-orange-500">{shift.time}</p>
                          <p className="text-sm text-gray-600 mt-1">{shift.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RotaManagement;
