import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import Sidebar from "../company/Sidebar";
import Header from "../company/Header";

const Qrcode = () => {
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pointName, setPointName] = useState(""); // New state for Point Name
  const [qrValue, setQrValue] = useState("");
  const [isGenerated, setIsGenerated] = useState(false); // State to toggle input visibility

  const handleGenerateQR = () => {
    if (location && companyName && pointName) {
      setQrValue(
        `Location: ${location}, Company: ${companyName}, Point: ${pointName}`
      );
      setIsGenerated(true); // Hide input fields after generating QR code
    } else {
      alert("Please enter location, company name, and point name.");
    }
  };

  const handlePrint = () => {
    const qrCanvas = document.getElementById("qr-code");
    const dataUrl = qrCanvas.toDataURL();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`<img src="${dataUrl}" alt="QR Code"/>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    const qrCanvas = document.getElementById("qr-code");
    const dataUrl = qrCanvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.text("QR Code", 10, 10);
    pdf.addImage(dataUrl, "PNG", 15, 40, 180, 180);
    pdf.save("QRCode.pdf");
  };

  return (
    <div className="flex flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-full md:w-1/4" />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>

          {/* Input Fields */}
          {!isGenerated && (
            <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-xl">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-base mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orange-300"
                  placeholder="Enter location"
                />
              </div>
              <div className="mb-4">
                <label className="block  text-gray-700 font-semibold text-base mb-2">
                  Point Name
                </label>
                <input
                  type="text"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orange-300"
                  placeholder="Enter point name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-base mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-orange-300"
                  placeholder="Enter company name"
                />
              </div>
              <div className="flex justify-center items-center ">
                <button
                  onClick={handleGenerateQR}
                  className="w-[240px] h-[40px] p-2 bg-[#FD7F00] text-white justify-center rounded-full hover:bg-orange-600"
                >
                  Generate QR Code
                </button>
              </div>
            </div>
          )}

          {/* QR Code and Action Buttons */}
          {qrValue && (
            <div className="mt-6 bg-white p-4 rounded-xl w-72 h-60 shadow-md flex flex-col items-center">
            <QRCodeCanvas id="qr-code" value={qrValue} size={200} />
            <div className="flex justify-between mt-10  gap-2">
              <button
                onClick={handlePrint}
                className="bg-[#1F2B44] text-white rounded-full hover:bg-[#1F2B44] w-[150px] h-[40px]"
              >
                Print QR Code
              </button>
              <button
                onClick={handleDownloadPDF}
                className="p-2 bg-[#FD7F00] text-white rounded-full hover:bg-orange-600 w-[150px] h-[40px]"
              >
                Download as PDF
              </button>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Qrcode;
