import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import ProfileModal from "./ProfileModal.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import FluidButton from "./FluidButton.jsx";

export default function Navbar() {
  const { toggleSidebar } = useSidebar();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false); // Red dot state

  // 🔥 Fetch unread notifications
  const checkUnread = async () => {
    try {
      const res = await api.get("/notifications");
      const unread = res.data.notifications.some((n) => !n.isRead);
      setHasUnread(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    checkUnread();
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 On click → toggle dropdown & mark as read
  const handleNotifClick = async () => {
    if (!notiOpen) {
      setNotiOpen(true);
      setHasUnread(false); // Hide dot instantly

      try {
        await api.put("/notifications/mark-read");
      } catch (err) {
        console.error(err);
      }
    } else {
      setNotiOpen(false);
    }
  };

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
      
      {/* Left */}
      <div className="nav-left">
        <FaBars className="hamburger" onClick={toggleSidebar} />
        <div className="nav-brand">
          ally<span>Space</span>
        </div>
      </div>

      {/* Center */}
      <div className="nav-center">
        <div className="nav-search">
          <FiSearch size={18} />
          <input placeholder="Search projects, tasks..." />
        </div>
      </div>

      {/* Right */}
      <div className="nav-right">

        {/* 🔔 Notification Icon */}
        <div className="notif-wrapper" onClick={handleNotifClick} style={{ cursor: "pointer" }}>
          <FiBell className="nav-icon" />
          {hasUnread && <span className="notif-badge"></span>}
          
          {notiOpen && (
            <NotificationDropdown close={() => setNotiOpen(false)} />
          )}
        </div>

        {/* Profile */}
        <div className="profile-pic" onClick={() => setProfileOpen(true)} />

        {/* Logout */}
        <FluidButton
          onClick={handleLogout}
          style={{ padding: "8px 18px", fontSize: "13px" }}
        >
          Logout
        </FluidButton>
      </div>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

    </div>
  );
}
