import { useEffect, useState } from "react";
import "../styles/projectDashboard.css";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import { useParams } from "react-router-dom";
import AddSubprojectModal from "../components/AddSubProjectModal.jsx";
import api from "../api/axios";

export default function ProjectDashboard() {
  const { id } = useParams();  // MongoDB teamId
  const [project, setProject] = useState(null);
  const [subModalOpen, setSubModalOpen] = useState(false);

  useEffect(() => {
    api
      .get(`/team/${id}`)
      .then((res) => {
        setProject(res.data.team);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!project)
    return (
      <div style={{ color: "white", padding: "40px" }}>
        Loading project...
      </div>
    );

  return (
    <div className="project-dashboard-wrapper">
      <Sidebar />
      <Navbar />

      <div className="project-dashboard-content">
        <h1 className="pd-title">
          {project.TeamName}
          <span style={{ color: "#60a5fa" }}> Dashboard</span>
        </h1>

        <p className="pd-description">{project.description}</p>

        <div className="subproject-grid">
          {project.Subteams.map((sp) => (
            <div className="subproject-card" key={sp._id}>
              <div className="sp-header">
                <h3>{sp.name}</h3>
                <span className="lead-badge">
                  Lead: @{sp.headId?.userName || "Unassigned"}
                </span>
              </div>

              <p className="sp-desc">{sp.description}</p>

              <div className="sp-stats">
                <span>Members: {sp.members.length}</span>
                <span>Tasks: {sp.tasks.length}</span>
              </div>

              <div className="sp-actions">
                <button className="sp-btn">Manage Members</button>
                <button className="sp-btn">Assign Task</button>
              </div>

              <button className="delete-btn">Delete</button>
            </div>
          ))}

          {/* Add Subteam */}
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
        teamId={id}
      />
    </div>
  );
}
