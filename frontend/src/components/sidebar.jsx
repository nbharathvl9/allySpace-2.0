import "../styles/sidebar.css";
import { IoClose } from "react-icons/io5";
import { useSidebar } from "../context/sideBarContext.jsx";
import { useProjects } from "../context/projectContext.jsx";
import { useState, useEffect, useRef } from "react";
import CreateProjectModal from "./createProjectModal.jsx";
import YourSubprojectsModal from "./YourSubprojectsModal.jsx";
import YourMemberTeamsModal from "./YourMemberTeamsModal.jsx"; // ⭐ NEW
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const { projects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [subteamModalOpen, setSubteamModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false); // ⭐ NEW

  const navigate = useNavigate();

  // Sidebar reference for click-outside detection
  const sidebarRef = useRef(null);

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

  const openProjectDashboard = (id) => {
    navigate(`/project/${id}`);
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

          {/* MAIN DASHBOARD BUTTON */}
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

          {/* PROJECT HEAD SECTION */}
          <p className="sidebar-title">Project Head</p>
          <div className="sidebar-section">
            <button className="create-btn" onClick={() => setModalOpen(true)}>
              + Create Project
            </button>

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

          {/* SUBPROJECT HEAD SECTION */}
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

          {/* MEMBER SECTION */}
          <p className="sidebar-title">Member</p>
          <div className="sidebar-section">
            <button
              className="sidebar-btn"
              onClick={() => {
                setMemberModalOpen(true);  // ⭐ OPEN MEMBER POPUP
                closeSidebar();
              }}
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
        onClose={() => setMemberModalOpen(false)} // ⭐ CLOSE MEMBER POPUP
      />
    </>
  );
}
