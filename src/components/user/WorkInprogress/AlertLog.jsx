import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar";
import Header from "../Header";
import LoadingSpinner from "../../common/LoadingSpinner";
import { FaTimes, FaCheck, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useParams } from "react-router-dom";

const AlertLog = () => {
  const { jobId } = useParams();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAlertLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Replace with your actual API endpoint for alert logs
        const response = await fetch(`/api/alerts/job/${jobId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.statusCode === 200 && Array.isArray(result.data)) {
          setAlerts(result.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch alert logs:", err);
        setError(err.message);
        // Fallback to sample data
        setAlerts([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertLogs();
  }, [jobId]);

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Format time function
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      return timeString; // Return as is if format is not a valid date
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Alert Logs</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error && alerts.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow text-center">
                  <p className="text-gray-500 text-lg">No alert logs found</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id || alert._id}
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
                          {formatTime(alert.time || alert.timestamp)} Alerts
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
                          onClick={() => toggleExpand(alert.id || alert._id)}
                        >
                          {expandedId === (alert.id || alert._id) ? (
                            <FaChevronUp size={16} />
                          ) : (
                            <FaChevronDown size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                    {expandedId === (alert.id || alert._id) && (
                      <div className="p-4 border-t">
                        {alert.details && alert.details.length > 0 ? (
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertLog;