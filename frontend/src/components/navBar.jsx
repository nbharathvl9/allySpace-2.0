import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import ProfileModal from "./ProfileModal.jsx";
import { useState } from "react";
export default function Navbar({ onLogout }) {
      const { toggleSidebar } = useSidebar();
      const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="dashboard-navbar">

      {/* Left */}
         <div className="nav-left">
        <FaBars className="hamburger" onClick={toggleSidebar} />
      </div>

      {/* Center */}
      <div className="nav-center">
        <div className="nav-search">
          <FiSearch size={20} />
          <input placeholder="Search..." />
        </div>
      </div>

      {/* Right */}
      <div className="nav-right">
        <FiBell className="nav-icon" />
       <div
            className="profile-pic"
            onClick={() => setProfileOpen(true)}
          />
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
      <ProfileModal 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

    </div>
  );
}
