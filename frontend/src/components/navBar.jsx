import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import ProfileModal from "./ProfileModal.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import { useState } from "react";
import api from "../api/axios";
import FluidButton from "./FluidButton"; // 🔥 Import

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
      window.location.href = "/login";
    }
  };

  return (
    <div className="dashboard-navbar">
      <div className="nav-left">
        <FaBars className="hamburger" onClick={toggleSidebar} />
        <div className="nav-brand">ally<span>Space</span></div>
      </div>

      <div className="nav-center">
        <div className="nav-search">
          <FiSearch size={18} />
          <input placeholder="Search projects, tasks..." />
        </div>
      </div>

      <div className="nav-right">
        <div className="notif-wrapper">
          <FiBell className="nav-icon" onClick={() => setNotiOpen(!notiOpen)} />
          {notiOpen && <NotificationDropdown close={() => setNotiOpen(false)} />}
        </div>

        <div className="profile-pic" onClick={() => setProfileOpen(true)} />

        {/* 🔥 FLUID LOGOUT BUTTON */}
        <FluidButton
          onClick={handleLogout}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          Logout
        </FluidButton>
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}