import React, { useState } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import { FaTimes, FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AlertLog = () => {
  // Sample alert data based on the provided image
  const alerts = [
    {
      id: 1,
      time: "3:45 PM",
      status: "RESPONDED",
      details: [
        "Entered Alert PIN.",
        "Scanned point A QR Code.",
        "Scanned point B QR Code.",
        "Scanned point C QR Code.",
      ],
    },
    {
      id: 2,
      time: "1:45 PM",
      status: "RESPONDED",
      details: [],
    },
    {
      id: 3,
      time: "1:45 PM",
      status: "MISSED",
      details: [],
    },
    {
      id: 4,
      time: "2:45 PM",
      status: "RESPONDED",
      details: [],
    },
    {
      id: 5,
      time: "10:45 PM",
      status: "RESPONDED",
      details: [],
    },
  ];

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Alert Logs</h1>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="border rounded-xl shadow bg-white"
              >
                <div className="flex flex-row items-center justify-between p-4">
                  <div className="flex items-center">
                    <div
                      className={`w-[30px] h-[30px] md:w-[45px] md:h-[45px] flex-wrap rounded-full flex items-center justify-center bg-[#023047]`}
                    >
                      {alert.status === "MISSED" ? (
                        <FaTimes className="text-base md:text-lg text-white" />
                      ) : (
                        <FaCheck className="text-base md:text-lg text-white" />
                      )}
                    </div>
                    <span className="ml-2 font-semibold text-sm text-[#023047]">
                      {alert.time} Alerts
                    </span>
                  </div>
                  <div className="flex items-center">
                    {/* Status Button */}
                    <div className="w-[105px] h-[24px]">
                      <button
                        className={`w-full h-full text-sm font-normal rounded-full ${
                          alert.status === "MISSED"
                            ? "bg-[#FF0101] text-[#023047]"
                            : "bg-[#54D969] text-[#023047]"
                        }`}
                      >
                        {alert.status}
                      </button>
                    </div>

                    {/* Toggle Icon */}
                    <div
                      className="cursor-pointer ml-2"
                      onClick={() => toggleExpand(alert.id)}
                    >
                      {expandedId === alert.id ? (
                        <FaChevronUp size={16} />
                      ) : (
                        <FaChevronDown size={16} />
                      )}
                    </div>
                  </div>
                </div>
                {expandedId === alert.id && (
                  <div className="p-4 border-t">
                    {alert.details.length > 0 ? (
                      alert.details.map((detail, detailIndex) => (
                        <p
                          key={detailIndex}
                          className="text-[16px] text-[#023047]"
                        >
                          {detail}
                        </p>
                      ))
                    ) : (
                      <p className="text-[16px] text-[#023047]">No details available.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertLog;