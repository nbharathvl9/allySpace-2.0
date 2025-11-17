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

  // Fetch teams where user is HEAD
  useEffect(() => {
    api.get("/team/head")
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.log(err));
  }, []);

  const openProjectDashboard = (teamId) => {
    navigate(`/project/${teamId}`);
    closeSidebar();
  };

  // 🔥 FLUID EFFECT LOGIC
  // Calculates mouse position relative to the button and sets CSS variables
  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    btn.style.setProperty("--x", `${x}px`);
    btn.style.setProperty("--y", `${y}px`);
  };

  return (
    <>
      {/* Overlay for closing */}
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={closeSidebar} 
      />

      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content" ref={sidebarRef}>

          {/* Close Button */}
          <div className="sidebar-header">
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              <IoClose size={26} />
            </button>
          </div>

          {/* Dashboard */}
          <div className="sidebar-section">
            <button
              className="dashboard-btn fluid-btn"
              onClick={() => {
                navigate("/dashboard");
                closeSidebar();
              }}
              onMouseMove={handleMouseMove} // 🔥 Attach Handler
            >
              Dashboard Home
            </button>
          </div>

          {/* PROJECT HEAD SECTION */}
          <p className="sidebar-title">Project Head</p>
          <div className="sidebar-section">
            <button 
              className="create-btn fluid-btn" 
              onClick={() => setModalOpen(true)}
              onMouseMove={handleMouseMove} // 🔥 Attach Handler
            >
              + Create Project
            </button>

            {teams.map((team) => (
              <button
                key={team._id}
                className="sidebar-btn fluid-btn"
                onClick={() => openProjectDashboard(team._id)}
                onMouseMove={handleMouseMove} // 🔥 Attach Handler
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
              onClick={() => {
                setSubteamModalOpen(true);
                closeSidebar();
              }}
              onMouseMove={handleMouseMove} // 🔥 Attach Handler
            >
              Your Subprojects
            </button>
          </div>

          {/* MEMBER */}
          <p className="sidebar-title">Member</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn fluid-btn"
              onClick={() => {
                setMemberModalOpen(true);
                closeSidebar();
              }}
              onMouseMove={handleMouseMove} // 🔥 Attach Handler
            >
              Your Member Teams
            </button>
          </div>

        </div>
      </div>

      {/* MODALS */}
      <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <YourSubprojectsModal
        isOpen={subteamModalOpen}
        onClose={() => setSubteamModalOpen(false)}
      />

      <YourMemberTeamsModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
      />
    </>
  );
}