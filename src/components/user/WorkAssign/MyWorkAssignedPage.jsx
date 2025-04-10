import { useNavigate } from "react-router-dom"
import Sidebar from "../SideBar";
import Header from "../Header";

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
const jobs = [
  { title: "Networking Engineer", location: "Washington", date: "Feb 2, 2019 19:28", status: "Active", icon: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png" },
  { title: "Product Designer", location: "Dhaka", date: "Dec 7, 2019 23:26", status: "Active", icon: "https://cdn-icons-png.flaticon.com/512/2111/2111632.png" },
  { title: "Junior Graphic Designer", location: "Brazil", date: "Feb 2, 2019 19:28", status: "Active", icon: "https://cdn-icons-png.flaticon.com/512/733/733609.png" },
  { title: "Visual Designer", location: "Wisconsin", date: "Dec 7, 2019 23:26", status: "Active", icon: "https://cdn-icons-png.flaticon.com/512/732/732221.png" },
  { title: "Marketing Officer", location: "United States", date: "Dec 4, 2019 21:42", status: "Active", icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png" },
];
export default function MyWorkAssignedPage() {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />
    <div className="max-w-6xl bg-white p-6 rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <div className="mr-8 border-b-2  pb-2">
            <span className="font-medium text-gray-500 ">Applied</span>
          </div>
          <div className="mr-8 pb-2 border-b-2  border-orange-500">
            <button className="font-medium text-orange-500" onClick={()=> navigate("/User-MyWorkAssignedPage")}>Assigned</button>
          </div>
          <div className="mr-8 pb-2">
            <span className="font-medium text-gray-500">In Progress</span>
          </div>
          <div className="pb-2">
            <span className="font-medium text-gray-500">Completed</span>
          </div>
        </div>
  
        {/* Job List */}
        <div className="space-y-5 p-6">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center border-b py-2  justify-between">
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
                <button className="bg-gray-800 text-white px-3 py-1 rounded-full mr-1 hover:bg-gray-700">Decline</button>
                <button className="bg-orange-500 text-white  py-1 px-3 rounded-full">Applied</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      </div>
  );
}
