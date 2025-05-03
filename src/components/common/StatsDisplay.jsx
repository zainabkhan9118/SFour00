import React from "react";

const StatsDisplay = ({ backgroundImage, title, stats }) => {
  return (
    <div className="w-full md:w-1/2 relative flex items-center justify-center">
      {/* Background image container - full height on desktop, fixed height on mobile */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-10"></div>
      
      {/* Content container */}
      <div className="w-full h-full z-20 flex flex-col justify-center items-center p-6">
        {/* Title text */}
        <h2 className="text-white text-center text-lg sm:text-xl md:text-2xl font-semibold mb-6 max-w-md">
          {title}
        </h2>
        
        {/* Stats grid - shows as a row on larger screens, or stacked on mobile */}
        <div className="flex flex-row justify-center w-full">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4 mx-2">
              <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {stat.value}
              </p>
              <p className="text-white text-xs sm:text-sm mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;