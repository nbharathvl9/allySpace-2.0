import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import ProfileModal from "./ProfileModal.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx"; // 🔥 NEW
import { useState } from "react";

export default function Navbar({ onLogout }) {
  const { toggleSidebar } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

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

        {/* Notification Bell */}
        <div className="notif-wrapper">
          <FiBell
            className="nav-icon"
            onClick={() => setNotiOpen(!notiOpen)}
          />

          {notiOpen && (
            <NotificationDropdown close={() => setNotiOpen(false)} />
          )}
        </div>

        {/* Profile Popup */}
        <div className="profile-pic" onClick={() => setProfileOpen(true)} />

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

    </div>
  );
}
