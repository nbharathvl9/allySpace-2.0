import "../styles/sidebar.css";
import { useSidebar } from "../context/sideBarContext.jsx";
import { useState, useEffect, useRef } from "react";
import CreateProjectModal from "./createProjectModal.jsx";
import YourSubprojectsModal from "./YourSubprojectsModal.jsx";
import YourMemberTeamsModal from "./YourMemberTeamsModal.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiHome, FiPlusSquare, FiUserCheck, FiUsers, FiGrid } from "react-icons/fi";

export default function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { closeSidebar } = useSidebar(); 
  const [teams, setTeams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [subteamModalOpen, setSubteamModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/team/head")
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.log(err));
  }, []);

  const openProjectDashboard = (teamId) => {
    navigate(`/project/${teamId}`);
    handleBtnClick(() => {}); // Close sidebar on nav
  };

  const handleBtnClick = (action) => {
    action();
    closeSidebar();
    setSidebarOpen(false);
  };

  return (
    <>
      {/* 🔥 This invisible div triggers the sidebar when hovered */}
      <div 
        className="sidebar-trigger"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div 
          className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}
        >
          <div className="sidebar-content">

            <div className="sidebar-header">
               <div className="sidebar-logo">
                  <FiGrid size={24} />
               </div>
            </div>

            {/* Dashboard */}
            <div className="sidebar-section">
              <button
                className="sidebar-btn"
                onClick={() => handleBtnClick(() => navigate("/dashboard"))}
              >
                <FiHome size={20} />
                <span className="sidebar-text">Dashboard</span>
              </button>
            </div>

            {/* PROJECT HEAD SECTION */}
            <p className="sidebar-title">
               <span className="sidebar-text">Project Head</span>
            </p>
            <div className="sidebar-section">
              <button 
                className="create-btn" 
                onClick={() => handleBtnClick(() => setModalOpen(true))}
              >
                <FiPlusSquare size={20} />
                <span className="sidebar-text">Create Project</span>
              </button>

              {teams.map((team) => (
                <button
                  key={team._id}
                  className="sidebar-btn"
                  onClick={() => openProjectDashboard(team._id)}
                >
                  <div className="sidebar-project-icon">
                    {team.TeamName.charAt(0)}
                  </div>
                  <span className="sidebar-text">{team.TeamName}</span>
                </button>
              ))}
            </div>

            {/* SUBTEAM HEAD */}
            <p className="sidebar-title">
               <span className="sidebar-text">Subproject Head</span>
            </p>
            <div className="sidebar-section">
              <button
                className="sidebar-btn"
                onClick={() => handleBtnClick(() => setSubteamModalOpen(true))}
              >
                <FiUserCheck size={20} />
                <span className="sidebar-text">Your Subprojects</span>
              </button>
            </div>

            {/* MEMBER */}
            <p className="sidebar-title">
               <span className="sidebar-text">Member</span>
            </p>
            <div className="sidebar-section">
              <button
                className="sidebar-btn"
                onClick={() => handleBtnClick(() => setMemberModalOpen(true))}
              >
                <FiUsers size={20} />
                <span className="sidebar-text">Your Member Teams</span>
              </button>
            </div>

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