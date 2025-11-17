import "../styles/sidebar.css";
import { IoClose } from "react-icons/io5";
import { useSidebar } from "../context/sideBarContext.jsx";
import { useState, useEffect, useRef } from "react";
import CreateProjectModal from "./createProjectModal.jsx";
import YourSubprojectsModal from "./YourSubprojectsModal.jsx";
import YourMemberTeamsModal from "./YourMemberTeamsModal.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();

  const [teams, setTeams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [subteamModalOpen, setSubteamModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Fetch teams
  useEffect(() => {
    api.get("/team/head")
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.log(err));
  }, []);

  const openProjectDashboard = (teamId) => {
    navigate(`/project/${teamId}`);
    closeSidebar();
  };

  // 🔥 FLUID MAGNETIC LOGIC
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    
    // 1. Calculate local cursor position for the Shine
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 2. Calculate distance from center for Magnetic Pull
    // We divide by 5 to dampen the movement (higher number = stiffer button)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pullX = (x - centerX) / 5; 
    const pullY = (y - centerY) / 5;

    // 3. Set CSS Variables
    btn.style.setProperty("--x", `${x}px`);
    btn.style.setProperty("--y", `${y}px`);
    btn.style.setProperty("--pull-x", `${pullX}px`);
    btn.style.setProperty("--pull-y", `${pullY}px`);
    btn.style.setProperty("--scale", "1.05"); // Slightly larger when interacting
  };

  const handleMouseLeave = (e) => {
    const btn = e.currentTarget;
    
    // Snap back to center
    btn.style.setProperty("--pull-x", "0px");
    btn.style.setProperty("--pull-y", "0px");
    btn.style.setProperty("--scale", "1");
    
    // Optional: You can reset --x/--y to center if you want the bubble to recenter, 
    // but leaving it creates a nice "last position" fade out.
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={closeSidebar} 
      />

      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content" ref={sidebarRef}>

          <div className="sidebar-header">
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              <IoClose size={26} />
            </button>
          </div>

          {/* Dashboard */}
          <div className="sidebar-section">
            <button
              className="dashboard-btn fluid-btn"
              onClick={() => { navigate("/dashboard"); closeSidebar(); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              Dashboard Home
            </button>
          </div>

          {/* PROJECT HEAD */}
          <p className="sidebar-title">Project Head</p>
          <div className="sidebar-section">
            <button 
              className="create-btn fluid-btn" 
              onClick={() => setModalOpen(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              + Create Project
            </button>

            {teams.map((team) => (
              <button
                key={team._id}
                className="sidebar-btn fluid-btn"
                onClick={() => openProjectDashboard(team._id)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {team.TeamName}
              </button>
            ))}
          </div>

          {/* SUBTEAM HEAD */}
          <p className="sidebar-title">Subproject Head</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn fluid-btn"
              onClick={() => { setSubteamModalOpen(true); closeSidebar(); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              Your Subprojects
            </button>
          </div>

          {/* MEMBER */}
          <p className="sidebar-title">Member</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn fluid-btn"
              onClick={() => { setMemberModalOpen(true); closeSidebar(); }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              Your Member Teams
            </button>
          </div>

        </div>
      </div>

      {/* MODALS */}
      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <YourSubprojectsModal isOpen={subteamModalOpen} onClose={() => setSubteamModalOpen(false)} />
      <YourMemberTeamsModal isOpen={memberModalOpen} onClose={() => setMemberModalOpen(false)} />
    </>
  );
}