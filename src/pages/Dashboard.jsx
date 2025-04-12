import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Company components
import CompanySidebar from "../components/company/Sidebar";
import CompanyHeader from "../components/company/Header";
import CompanyDashboardContent from "../components/company/DashboardContent";

// User components
import UserSidebar from "../components/user/SideBar";
import UserProfileHeader from "../components/user/ProfileHeader";
import UserDashboardContent from "../components/user/DashboardContent";

export default function Dashboard() {
  const [userRole, setUserRole] = useState("user"); // Default to user
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard mounted - checking auth");
    
    // Remove authentication check for now, just set loading to false
    setLoading(false);
    
    // Uncomment this when you want to re-enable authentication
    /*
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user");
      
      if (!user) {
        console.log("No authenticated user found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching user role for:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User document found, role:", userData.role || "user");
          setUserRole(userData.role || "user");
        } else {
          console.log("No user document found in Firestore, using default role");
          setUserRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("user");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    });

    return () => unsubscribe();
    */
  }, [navigate]);

  // Add a URL parameter check for role selection
  useEffect(() => {
    // Check URL parameters for role
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    if (roleParam === 'company' || roleParam === 'user') {
      console.log(`Setting role from URL parameter: ${roleParam}`);
      setUserRole(roleParam);
    }
  }, []);

  // Determine which components to render based on user role
  const Sidebar = userRole === "company" ? CompanySidebar : UserSidebar;
  const Header = userRole === "company" ? CompanyHeader : UserProfileHeader;
  const DashboardContent = userRole === "company" ? CompanyDashboardContent : UserDashboardContent;

  // Log which components are being used
  console.log(`Rendering dashboard with role: ${userRole}`);
  console.log(`Using components: ${userRole === "company" ? "Company" : "User"}`);

  // Show better loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Role switcher for testing */}
      <div className="fixed top-2 right-2 z-50 bg-white p-2 rounded shadow-md">
        <p className="text-sm font-semibold mb-1">Current Role: {userRole}</p>
        <button 
          className={`mr-2 px-2 py-1 text-xs rounded ${userRole === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUserRole('user')}
        >
          User
        </button>
        <button 
          className={`px-2 py-1 text-xs rounded ${userRole === 'company' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUserRole('company')}
        >
          Company
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <DashboardContent />
      </div>
    </div>
  );
}