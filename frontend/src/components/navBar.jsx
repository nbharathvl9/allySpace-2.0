import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import ProfileModal from "./ProfileModal.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import { useState } from "react";
import api from "../api/axios"; // 🔥 Import API directly

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  // 🔥 Self-contained Logout Logic
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback redirect even if API fails
      window.location.href = "/login";
    }
  };

  return (
    <div className="dashboard-navbar">

      {/* Left: Sidebar Toggle + Brand */}
      <div className="nav-left">
        <FaBars className="hamburger" onClick={toggleSidebar} />
        <div className="nav-brand">ally<span>Space</span></div>
      </div>

      {/* Center: Search Bar */}
      <div className="nav-center">
        <div className="nav-search">
          <FiSearch size={18} />
          <input placeholder="Search projects, tasks..." />
        </div>
      </div>

      {/* Right: Actions */}
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

        <button className="logout-btn" onClick={handleLogout}>
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