import { useState } from "react";
import "../styles/projectDashboard.css";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/sidebar.jsx";

import { useParams } from "react-router-dom";
import { useProjects } from "../context/projectContext.jsx";
import AddSubprojectModal from "../components/AddSubProjectModal.jsx";

export default function ProjectDashboard() {
  const { id } = useParams();
  const { projects } = useProjects();
  const [subModalOpen, setSubModalOpen] = useState(false);

  const project = projects[id];

  if (!project)
    return (
      <div style={{ color: "white", padding: "40px" }}>
        Project not found.
      </div>
    );

  return (
    <div className="project-dashboard-wrapper">

      <Sidebar />
      <Navbar onLogout={() => {
            window.location.href = "/login";  // redirect to login
        }}/>

      <div className="project-dashboard-content">

        <h1 className="pd-title">
          {project.title}
          <span style={{ color: "#60a5fa" }}> Dashboard</span>
        </h1>

        <p className="pd-description">{project.desc}</p>

        <div className="subproject-grid">

          {project.subprojects?.map((sp, idx) => (
            <div className="subproject-card" key={idx}>
              
              <div className="sp-header">
                <h3>{sp.title}</h3>
                <span className="lead-badge">Lead: @{sp.lead}</span>
              </div>

              <p className="sp-desc">{sp.desc}</p>

              <div className="sp-stats">
                <span>Members: {sp.members}</span>
                <span>Tasks: {sp.tasks}</span>
              </div>

              <div className="sp-actions">
                <button className="sp-btn">Manage Members</button>
                <button className="sp-btn">Assign Task</button>
              </div>

              <button className="delete-btn">Delete</button>

            </div>
          ))}

          {/* ADD SUBPROJECT CARD */}
          <div
            className="add-subproject-card"
            onClick={() => setSubModalOpen(true)}
          >
            <div className="add-plus">+</div>
            <p>Add Subproject</p>
          </div>

        </div>
      </div>

      <AddSubprojectModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
      />

    </div>
  );
}
