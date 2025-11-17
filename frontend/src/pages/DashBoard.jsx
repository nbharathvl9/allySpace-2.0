import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import Sidebar from "../components/sidebar.jsx";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Matches the route in teamRoute.js: router.get("/head", ...)
        const res = await api.get("/team/head");
        setProjects(res.data.teams);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const openProject = (id) => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <Navbar onLogout={handleLogout} />

      <div className="dashboard-content">

        <h1 className="dashboard-title">
          Welcome to your Dashboard<span style={{ color: "#60a5fa" }}>.</span>
        </h1>

        <p className="dashboard-subtitle">
          Create and manage projects from the sidebar.
        </p>

        {/* TITLE */}
        <h2 className="section-title">Your Projects</h2>

        {/* PROJECT CARDS */}
        <div className="project-card-container">
          {projects.length === 0 ? (
            <p className="no-projects">
              No projects yet. Create one from the sidebar!
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="dashboard-card clickable-card"
                onClick={() => openProject(project._id)}
              >
                {/* Backend uses 'TeamName', not 'title' */}
                <h3>{project.TeamName}</h3>
                <p>{project.description}</p>

                <p
                  style={{
                    marginTop: 10,
                    fontSize: "0.85rem",
                    color: "#60a5fa",
                  }}
                >
                  {/* Backend Subteams is an array of IDs */}
                  Subprojects: {project.Subteams?.length || 0}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}