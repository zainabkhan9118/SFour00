import React from "react";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";
import Header from "../Header";
import Sidebar from "../SideBar";

const CompanyDetails = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />
        <div className=" font-['Roboto',sans-serif] min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-orange-500 rounded-lg p-10 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <button className="text-white text-2xl">
                <i className="fas fa-arrow-left"></i>
              </button>
              <h1 className="text-3xl font-bold mt-2">Highspeed Studios.</h1>
              <p className="text-sm">Medan, Indonesia</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl mr-2">
                <i className="fas fa-star"></i> 4.5
              </span>
              <img
                src="https://storage.googleapis.com/a1aa/image/WvuXReA4vnoi_wzTuM5A3xlQd7io6NUCifNCXhJIpG8.jpg"
                alt="Instagram logo"
                className="rounded-full"
                width="40"
                height="40"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg p-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <i className="fas fa-phone-alt text-orange-500 text-2xl mb-2"></i>
              <p className="text-gray-600">Telephone</p>
              <p className="font-bold">+51 632 445 556</p>
            </div>
            <div>
              <i className="fas fa-envelope text-orange-500 text-2xl mb-2"></i>
              <p className="text-gray-600">Email</p>
              <p className="font-bold">highspeedst@mail.com</p>
            </div>
            <div>
              <i className="fas fa-globe text-orange-500 text-2xl mb-2"></i>
              <p className="text-gray-600">Website</p>
              <p className="font-bold">highspeed.studio</p>
            </div>
            <div className="text-center mt-6">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold">
              21 Available Jobs <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
          </div>
        
        </div>

        {/* About Company */}
        <div className="bg-white rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">About Company</h2>
          <p className="text-gray-600 mb-4">
            Integer aliquet pretium consequat. Donec et sapien id leo accumsan
            pellentesque eget maximus tellus. Duis et est ac leo rhoncus
            tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque
            quis justo sit amet arcu commodo sollicitudin. Integer finibus
            blandit condimentum. Vivamus sit amet ligula ullamcorper, pulvinar
            ante id, tristique erat. Quisque sit amet aliquam urna. Maecenas
            blandit felis id massa sodales finibus. Integer bibendum eu nulla
            eu sollicitudin. Sed lobortis diam tincidunt accumsan faucibus.
            Quisque blandit augue quis turpis auctor, dapibus euismod ante
            ultricies. Ut non felis lacinia turpis feugiat euismod at id magna.
            Sed ut orci arcu. Suspendisse sollicitudin faucibus aliquet.
          </p>
          <p className="text-gray-600">
            Nam dapibus consectetur erat in euismod. Cras urna augue, mollis
            venenatis augue sed, porttitor aliquet nibh. Sed tristique dictum
            elementum. Nulla imperdiet sit amet quam eget lobortis. Etiam in
            neque sit amet orci interdum tincidunt.
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CompanyDetails;
