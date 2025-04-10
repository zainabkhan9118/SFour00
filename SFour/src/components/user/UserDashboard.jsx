import ProfileHeader from "./ProfileHeader";
import Sidebar from "./SideBar";


export default function UserDashboard() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
         <Sidebar className="w-1/4" />

            <div className="flex flex-col flex-1">
                {/* Header */}
            <ProfileHeader/>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-lg text-gray-600 mt-2">Welcome to your dashboard.</p>
                </div>
            </div>
        </div>
    );
}
