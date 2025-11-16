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
  const [projects, setProjects] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [subteamModalOpen, setSubteamModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // Fetch Teams where user is HEAD
  useEffect(() => {
    api.get("/team/head")
      .then((res) => setProjects(res.data.teams))
      .catch((err) => console.log(err));
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Navigate to project dashboard
  const openProjectDashboard = (teamId) => {
    navigate(`/project/${teamId}`);
    closeSidebar();
  };

  return (
    <>
      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content" ref={sidebarRef}>

          {/* Close Button */}
          <div className="sidebar-header">
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              <IoClose size={26} />
            </button>
          </div>

          {/* Dashboard Home */}
          <div className="sidebar-section">
            <button
              className="dashboard-btn"
              style={{ marginBottom: "10px" }}
              onClick={() => {
                navigate("/dashboard");
                closeSidebar();
              }}
            >
              Dashboard Home
            </button>
          </div>

          {/* Project Head */}
          <p className="sidebar-title">Project Head</p>
          <div className="sidebar-section">
            <button className="create-btn" onClick={() => setModalOpen(true)}>
              + Create Project
            </button>

            {projects.map((project) => (
              <button
                key={project._id}
                className="sidebar-btn"
                onClick={() => openProjectDashboard(project._id)}
              >
                {project.TeamName}
              </button>
            ))}
          </div>

          {/* Subproject Head */}
          <p className="sidebar-title">Subproject Head</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn"
              onClick={() => {
                setSubteamModalOpen(true);
                closeSidebar();
              }}
            >
              Your Subprojects
            </button>
          </div>

          {/* Member */}
          <p className="sidebar-title">Member</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn"
              onClick={() => {
                setMemberModalOpen(true);
                closeSidebar();
              }}
            >
              Your Member Teams
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
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
