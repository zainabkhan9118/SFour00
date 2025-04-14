import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";

const Qrcode = () => {
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [qrValue, setQrValue] = useState("");

  const handleGenerateQR = () => {
    if (location && companyName) {
      setQrValue(`Location: ${location}, Company: ${companyName}`);
    } else {
      alert("Please enter both location and company name.");
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
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter location"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter company name"
          />
        </div>
        <button
          onClick={handleGenerateQR}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate QR Code
        </button>
      </div>
      {qrValue && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <QRCodeCanvas id="qr-code" value={qrValue} size={200} />
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrint}
              className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Print QR Code
            </button>
            <button
              onClick={handleDownloadPDF}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Qrcode;