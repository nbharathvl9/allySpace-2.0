import { FaBars } from "react-icons/fa";
import { FiSearch, FiBell } from "react-icons/fi";
import "../styles/dashboard.css";
import ProfileModal from "./ProfileModal.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function Navbar({ toggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast(); // 🔥 Hook

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const res = await api.get("/notifications");
        const unread = res.data.notifications.some((n) => !n.isRead);
        setHasUnread(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    checkUnread();
    const interval = setInterval(checkUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        try {
          const res = await api.get(`/team/search?query=${query}`);
          setResults(res.data.teams);
          setShowSearch(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setResults([]);
        setShowSearch(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const requestJoin = async (teamId, subteamId) => {
    try {
      await api.post("/subteam/request-join", { teamId, subteamId });
      showToast("Request sent to Team Head", "success"); // 🔥 Toast
      setShowSearch(false);
      setQuery("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send request", "error");
    }
  };

  const handleNotifClick = async () => {
    if (!notiOpen) {
      setNotiOpen(true);
      setHasUnread(false);
      try {
        await api.put("/notifications/mark-read");
      } catch (err) { console.error(err); }
    } else {
      setNotiOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/login");
      showToast("Logged out successfully", "info");
    } catch (err) {
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-navbar">
      <div className="nav-left">
        <FaBars className="hamburger" onClick={toggleSidebar} />
        <div className="nav-brand">ally<span>Space</span></div>
      </div>

      <div className="nav-center">
        <div className="nav-search" style={{ position: "relative" }}>
          <FiSearch size={18} />
          <input 
            placeholder="Search main projects..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)} 
            onFocus={() => query && setShowSearch(true)}
            autoComplete="off"
          />
          {showSearch && results.length > 0 && (
            <div className="search-results">
              {results.map((team) => (
                <div key={team._id} className="search-result-item">
                  <h4>{team.TeamName}</h4>
                  <div className="subteam-list">
                    {team.Subteams.length === 0 ? (
                      <span style={{fontSize: "12px", color: "#64748b"}}>No subteams</span>
                    ) : (
                      team.Subteams.map((st) => (
                        <div key={st._id} className="subteam-item">
                          <span>{st.name}</span>
                          <FluidButton 
                            className="btn-primary"
                            style={{ padding: "4px 10px", fontSize: "11px", height: "auto" }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                requestJoin(team._id, st._id);
                            }}
                          >
                            Request Join
                          </FluidButton>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        <div className="notif-wrapper">
          <div style={{ position: "relative", cursor: "pointer", display: "flex" }} onClick={handleNotifClick}>
            <FiBell className="nav-icon" />
            {hasUnread && <span className="notif-badge"></span>} 
          </div>
          {notiOpen && <NotificationDropdown close={() => setNotiOpen(false)} />}
        </div>
        <div className="profile-pic" onClick={() => setProfileOpen(true)} />
        <FluidButton onClick={handleLogout} style={{ padding: "8px 18px", fontSize: "13px" }}>Logout</FluidButton>
      </div>
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}