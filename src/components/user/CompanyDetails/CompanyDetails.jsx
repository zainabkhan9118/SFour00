import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaGlobe, FaArrowLeft, FaStar, FaArrowRight, FaBars } from "react-icons/fa";
import instaImg from "../../../assets/images/insta.png";

const CompanyDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden">


      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">

        
        {/* Mobile menu toggle - Moved to top-left for better visibility */}
        <button 
          className="md:hidden fixed top-4 left-4 z-40 bg-orange-500 p-2 rounded-lg shadow-lg text-white flex items-center"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
        </button>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        <div className="font-['Roboto',sans-serif] min-h-screen overflow-y-auto pt-12 md:pt-0">
          <div className="max-w-7xl mx-auto p-2 sm:p-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-orange-500 rounded-xl p-4 sm:p-6 text-white relative">
              <div className="flex items-center mb-4 sm:mb-8 justify-between">
                <div className="flex items-center">
                  <button className="bg-white bg-opacity-20 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-4">
                    <FaArrowLeft className="text-white text-sm sm:text-base" />
                  </button>
                  <h2 className="text-lg sm:text-xl">Company Details</h2>
                </div>
                
                {/* Instagram Icon using image from assets */}
                <a href="#" className="rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                  <img src={instaImg} alt="Instagram" className="w-12 h-12 sm:w-14 sm:h-14" />
                </a>
              </div>
              
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start mb-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mr-0 sm:mr-3 mb-2 sm:mb-0">Highspeed Studios.</h1>
                  <div className="flex items-center sm:mt-2">
                    <FaStar className="text-yellow-400 mr-1" size={16} />
                    <span className="font-semibold">4.5</span>
                  </div>
                </div>
                <p className="text-sm">Medan, Indonesia</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center p-3 sm:p-4 sm:border-r">
                  <div className="text-orange-500 mr-3 sm:mr-4">
                    <FaPhone size={18} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Telephone</p>
                    <p className="font-medium text-sm sm:text-base">+51 632 445 556</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 sm:p-4 md:border-r">
                  <div className="text-orange-500 mr-3 sm:mr-4">
                    <FaEnvelope size={18} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Email</p>
                    <p className="font-medium text-sm sm:text-base break-all">highspeedst@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 sm:p-4">
                  <div className="text-orange-500 mr-3 sm:mr-4">
                    <FaGlobe size={18} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm">Website</p>
                    <p className="font-medium text-sm sm:text-base">highspeed.studio</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end p-3 sm:p-4">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium flex items-center">
                  <span>21 Available Jobs</span> <FaArrowRight className="ml-2 text-xs sm:text-base" />
                </button>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-4">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About Company</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
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
              <p className="text-gray-600 text-sm sm:text-base">
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
