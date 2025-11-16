import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import Sidebar from "../components/sidebar.jsx";
import { useProjects } from "../context/projectContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { projects, viewMode, getSubteamsForUser } = useProjects(); // ← hook inside component
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const openProject = (index) => {
    navigate(`/project/${index}`);
  };

  // If you want to show subteams view inside dashboard later:
  // const mySubteams = getSubteamsForUser();

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
            projects.map((project, index) => (
              <div
                key={index}
                className="dashboard-card clickable-card"
                onClick={() => openProject(index)}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <p
                  style={{
                    marginTop: 10,
                    fontSize: "0.85rem",
                    color: "#60a5fa",
                  }}
                >
                  Subprojects: {project.subprojects.length}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
