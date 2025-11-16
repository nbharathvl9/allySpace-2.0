import "../styles/sidebar.css";
import { IoClose } from "react-icons/io5";
import { useSidebar } from "../context/sideBarContext.jsx";
import { useProjects } from "../context/projectContext.jsx";
import { useState } from "react";
import CreateProjectModal from "./createProjectModal.jsx";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const { projects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const openProjectDashboard = (id) => {
    navigate(`/project/${id}`);
    closeSidebar(); // optional — closes sidebar when clicking project
  };

  return (
    <>
      <div className={`sidebar-wrapper ${isOpen ? "open" : ""}`}>

        {/* Close Button */}
        <div className="sidebar-header">
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <IoClose size={26} />
          </button>
        </div>

        {/* PROJECT HEAD SECTION */}
        <p className="sidebar-title">Project Head</p>
        <div className="sidebar-section">

          <button className="create-btn" onClick={() => setModalOpen(true)}>
            + Create Project
          </button>

          {/* Render dynamically created projects */}
          {projects.map((project, index) => (
            <button
              key={index}
              className="sidebar-btn"
              onClick={() => openProjectDashboard(index)}
            >
              {project.title}
            </button>
          ))}
        </div>

        {/* SUBPROJECT HEAD */}
        <p className="sidebar-title">Subproject Head</p>
        <div className="sidebar-section">
          <button className="sidebar-btn">Your Subprojects</button>
        </div>

        {/* MEMBER */}
        <p className="sidebar-title">Member</p>
        <div className="sidebar-section">
          <button className="sidebar-btn">Tasks Assigned to You</button>
        </div>

      </div>

      {/* MODAL */}
      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
