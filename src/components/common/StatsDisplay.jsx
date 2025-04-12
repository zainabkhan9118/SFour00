import React from "react";

const StatsDisplay = ({ backgroundImage, title, stats }) => {
  return (
    <div 
      className="flex w-full md:w-1/2 justify-center items-center bg-cover bg-center p-4 sm:p-6 min-h-[200px] sm:min-h-[300px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-white text-center px-4 sm:px-6 md:px-9 w-full max-w-md">
        <h2 className="text-base sm:text-lg md:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 px-2">
          {title}
        </h2>
        <div className="flex flex-wrap justify-center gap-y-3 gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 mt-3 sm:mt-4 md:mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-2 flex-shrink-0">
              <p className="text-base sm:text-lg md:text-2xl font-bold leading-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm md:text-sm leading-tight mt-1">
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