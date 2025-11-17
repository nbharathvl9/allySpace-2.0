import { useEffect, useState } from "react";
import "../styles/projectDashboard.css";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import { useParams } from "react-router-dom";
import AddSubprojectModal from "../components/AddSubProjectModal.jsx";
import AssignTaskModal from "../components/AssignTaskModal.jsx";     // 🔥 NEW
import ManageMembersModal from "../components/ManageMembersModal.jsx"; // 🔥 NEW
import ViewResponsesModal from "../components/ViewResponsesModal.jsx"; // 🔥 NEW
import api from "../api/axios";

export default function ProjectDashboard() {
  const { id } = useParams();  
  const [project, setProject] = useState(null);
  
  // Modals State
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [viewResponsesOpen, setViewResponsesOpen] = useState(false);

  // Selected Subteam Data for Modals
  const [selectedSubteam, setSelectedSubteam] = useState(null);

  const loadProject = () => {
    api.get(`/team/${id}`)
      .then((res) => setProject(res.data.team))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleDeleteSubteam = async (subteamId) => {
    if (!confirm("Are you sure you want to delete this subteam?")) return;
    try {
      await api.delete(`/subteam/${subteamId}`);
      loadProject(); // Refresh UI
    } catch (err) {
      alert("Failed to delete subteam");
    }
  };

  // Helper to open modals with specific subteam data
  const openModal = (setter, subteam) => {
    setSelectedSubteam(subteam);
    setter(true);
  };

  if (!project) return <div style={{ color: "white", padding: "40px" }}>Loading...</div>;

  return (
    <div className="project-dashboard-wrapper">
      <Sidebar />
      <Navbar />

      <div className="project-dashboard-content">
        <h1 className="pd-title">{project.TeamName} <span style={{ color: "#60a5fa" }}>Dashboard</span></h1>
        <p className="pd-description">{project.description}</p>

        <div className="subproject-grid">
          {project.Subteams.map((sp) => (
            <div className="subproject-card" key={sp._id}>
              <div className="sp-header">
                <h3>{sp.name}</h3>
                <span className="lead-badge">Lead: @{sp.headId?.userName || "Unassigned"}</span>
              </div>
              <p className="sp-desc">{sp.description}</p>

              <div className="sp-stats">
                <span>Members: {sp.members.length}</span>
                <span>Tasks: {sp.tasks.length}</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="sp-actions">
                <button className="sp-btn" onClick={() => openModal(setManageMembersOpen, sp)}>
                  Manage Members
                </button>
                <button className="sp-btn" onClick={() => openModal(setAssignTaskOpen, sp)}>
                  Assign Task
                </button>
              </div>

              {/* 🔥 NEW: Receive Response Button */}
              <button 
                className="sp-btn" 
                style={{ width: "100%", marginBottom: "10px", background: "rgba(96, 165, 250, 0.2)", borderColor: "#60a5fa" }}
                onClick={() => openModal(setViewResponsesOpen, sp)}
              >
                View Responses
              </button>

              <button className="delete-btn" onClick={() => handleDeleteSubteam(sp._id)}>
                Delete
              </button>
            </div>
          ))}

          <div className="add-subproject-card" onClick={() => setSubModalOpen(true)}>
            <div className="add-plus">+</div>
            <p>Add Subproject</p>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AddSubprojectModal isOpen={subModalOpen} onClose={() => setSubModalOpen(false)} teamId={id} />

      {selectedSubteam && (
        <>
          <AssignTaskModal 
            isOpen={assignTaskOpen} 
            onClose={() => setAssignTaskOpen(false)}
            teamId={id}
            subteamId={selectedSubteam._id}
            headId={selectedSubteam.headId?._id} 
          />

          <ManageMembersModal
            isOpen={manageMembersOpen}
            onClose={() => setManageMembersOpen(false)}
            subteamId={selectedSubteam._id}
          />

          <ViewResponsesModal
            isOpen={viewResponsesOpen}
            onClose={() => setViewResponsesOpen(false)}
            subteamId={selectedSubteam._id}
          />
        </>
      )}
    </div>
  );
}