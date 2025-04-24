import React from "react";
import StatsDisplay from "./StatsDisplay";
import signinPic from '../../assets/images/signinpic.png';


const JobStatsDisplay = ({ role = "user" }) => {
  const statsData = [
    { value: "1,75,324", label: "Live Jobs" },
    { value: "97,354", label: "Companies" },
    { value: "7,532", label: "New Jobs" }
  ];

  // Different titles based on role and screen size
  // const title = role === "user"
  //   ? "Over 1,75,324 jobs waiting for skilled candidates."
  //   : "Over 1,75,324 candidates waiting for good employers.";

  return (
    <StatsDisplay 
      backgroundImage={signinPic}
      // title={title}
      title="Over 1,75,324 candidates waiting for good employers."
      stats={statsData}
    />
  );
};

export default JobStatsDisplay;