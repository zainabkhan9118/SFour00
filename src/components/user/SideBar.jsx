import logo from "../../assets/images/logo.png";
import breifcase from "../../assets/images/solar_case-bold-duotone.png";
import profile from "../../assets/images/icons8_user.png";
import chat from "../../assets/images/lets-icons_chat-duotone.png";
import work from "../../assets/images/ic_twotone-work.png";
import notifications from "../../assets/images/icons8_notification.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
const navigate = useNavigate();
  return (
    <div className="min-h-screen w-64 bg-[#121D34] text-gray-400 flex flex-col p-5 border rounded-lg">
      {/* Logo */}
      <div className="flex justify-center mb-10">
         <img src={logo} alt="Logo" className="w-24 mb-4" />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-8 mb-32">
       <Link to={"/user-Job"}>
       <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
        <img src={breifcase} alt="Logo" className="h-6 w-6" />
          <span>Jobs</span>
        </div>
       </Link>

        <Link to={"/User-UserProfile"}>
        <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
        <img src={profile} alt="profile" className="h-6 w-6" />
          <span>Profile</span>
        </div>
        </Link>

        <Link to={"/User-UserChatPage"}>
        <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
        <img src={chat} alt="chat" className="h-7 w-7" />
          <span>Chat</span>
        </div>
        </Link>

        <Link to={"/User-WorkApplied"}>
        <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
        <img src={work} alt="work" className="h-6 w-6" />
          <span>My Work</span>
        </div>
        </Link>

       <Link to={"/User-UserNotification"}>
       <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
        <img src={notifications} alt="work" className="h-6 w-6" />
          <span>Notifications</span>
        </div>
       </Link>
      </nav>

     <Link>
     <div className="flex items-center space-x-3 text-[#395080] hover:text-white ml-8">
         <p className="text-3xl"> →</p>
          <span>Logout</span>
        </div>
     </Link>
    </div>
  );
};

export default Sidebar;
