// Simple icon components
import { useNavigate } from "react-router-dom"
import Sidebar from "../SideBar"
import Header from "../Header"

const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  )
  
  const BookmarkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )
  
  // Microsoft logo placeholder
  const MicrosoftLogo = () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="grid grid-cols-2 gap-0.5">
        <div className="w-2 h-2 bg-red-500"></div>
        <div className="w-2 h-2 bg-green-500"></div>
        <div className="w-2 h-2 bg-blue-500"></div>
        <div className="w-2 h-2 bg-yellow-500"></div>
      </div>
    </div>
  )
  
  const WorkApplied = () => {
    const jobs = [
      {
        id: 1,
        title: "Networking Engineer",
        location: "Washington",
        salary: "$120/hr",
        date: "Feb 2, 2023 10:20",
        status: "Active",
        icon: { type: "initials", value: "NE", color: "bg-green-500" },
      },
      {
        id: 2,
        title: "Product Designer",
        location: "Chicago",
        salary: "$92/hr",
        date: "Dec 7, 2022 23:26",
        status: "Active",
        icon: { type: "initials", value: "PD", color: "bg-pink-500" },
      },
      {
        id: 3,
        title: "Junior Graphic Designer",
        location: "Berlin",
        salary: "$120/hr",
        date: "Aug 5, 2023 16:34",
        status: "Active",
        icon: { type: "initials", value: "JG", color: "bg-gray-900" },
      },
      {
        id: 4,
        title: "Visual Designer",
        location: "Mountain View",
        salary: "$127/hr",
        date: "Dec 3, 2022 23:26",
        status: "Active",
        icon: { type: "logo", value: "microsoft" },
      },
      {
        id: 5,
        title: "Marketing Officer",
        location: "United States",
        salary: "$110/hr",
        date: "Dec 6, 2022 21:42",
        status: "Active",
        icon: { type: "initials", value: "MO", color: "bg-blue-400" },
      },
    ]
    const navigate = useNavigate();
  
    return (
        <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <Header />
      <div className="max-w-6xl   p-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <div className="mr-8 border-b-2 border-orange-500 pb-2">
            <span className="font-medium text-orange-500">Applied</span>
          </div>
          <div className="mr-8 pb-2">
            <button className="font-medium text-gray-500" onClick={()=> navigate("/User-MyWorkAssignedPage")}>Assigned</button>
          </div>
          <div className="mr-8 pb-2">
            <span className="font-medium text-gray-500">In Progress</span>
          </div>
          <div className="pb-2">
            <span className="font-medium text-gray-500">Completed</span>
          </div>
        </div>
  
        {/* Job List */}
        <div className="space-y-5 p-8">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center border-b   justify-between">
              <div className="flex items-center">
                {job.icon.type === "initials" ? (
                  <div
                    className={`w-10 h-10 rounded-full ${job.icon.color} flex items-center justify-center text-white text-xs mr-4`}
                  >
                    {job.icon.value}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-4">
                    <MicrosoftLogo />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <div className="text-sm text-gray-500 flex">
                    <span>{job.location}</span>
                    <span className="mx-2">•</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-xs text-gray-500 mr-4">{job.date}</div>
                <div className="flex items-center text-green-500 mr-4">
                  <span className="mr-1">
                    <CheckIcon />
                  </span>
                  <span className="text-xs">{job.status}</span>
                </div>
                <button className="mr-4 text-gray-300">
                  <BookmarkIcon />
                </button>
                <button className="bg-orange-500 text-white text-xs py-2 px-3 rounded-full">Applied</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
    )
  }
  
  export default WorkApplied
  
  