// import Sidebar from "./Sidebar";

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 bg-gray-100 p-8">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//         <p className="text-lg text-gray-600 mt-2">Welcome to your dashboard.</p>
//       </div>
//     </div>
//   );
// }
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Dashboard() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar className="w-1/4" />

            <div className="flex flex-col flex-1">
                {/* Header */}
                <Header />

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-lg text-gray-600 mt-2">Welcome to your dashboard.</p>
                </div>
            </div>
        </div>
    );
}
