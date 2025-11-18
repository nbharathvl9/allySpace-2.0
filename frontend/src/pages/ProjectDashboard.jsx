import { useEffect, useState } from "react";
import "../styles/projectDashBoard.css";
import Navbar from "../components/navBar.jsx";
import Sidebar from "../components/sidebar.jsx";
import { useParams } from "react-router-dom";
import AddSubprojectModal from "../components/AddSubProjectModal.jsx";
import AssignTaskModal from "../components/AssignTaskModal.jsx";
import ManageMembersModal from "../components/ManageMembersModal.jsx";
import ViewResponsesModal from "../components/ViewResponsesModal.jsx";
import api from "../api/axios";
import FluidButton from "../components/FluidButton"; 
// 🔥 Import Toast Hook
import { useToast } from "../context/ToastContext"; 

export default function ProjectDashboard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  // 🔥 Sidebar State (Lifted)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [assignTaskOpen, setAssignTaskOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [viewResponsesOpen, setViewResponsesOpen] = useState(false);
  const [selectedSubteam, setSelectedSubteam] = useState(null);
  
  // 🔥 Destructure toast
  const { showToast } = useToast(); 

  const loadProject = () => {
    api
      .get(`/team/${id}`)
      .then((res) => setProject(res.data.team))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleDeleteSubteam = async (subteamId) => {
    // ⚠️ Consider replacing confirm with a custom modal later
    if (!confirm("Are you sure you want to delete this subteam?")) return;
    try {
      await api.delete(`/subteam/${subteamId}`);
      showToast("Subteam deleted successfully", "success");
      loadProject();
    } catch (err) {
      showToast("Failed to delete subteam", "error");
    }
  };

  const openModal = (setter, subteam) => {
    setSelectedSubteam(subteam);
    setter(true);
  };

  if (!project)
    return <div style={{ color: "white", padding: "40px" }}>Loading...</div>;

  return (
    <div className="project-dashboard-wrapper">
      {/* 🔥 Pass props to Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* 🔥 Pass toggle function to Navbar */}
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="project-dashboard-content">
        <h1 className="pd-title">
          {project.TeamName} <span style={{ color: "#60a5fa" }}>Dashboard</span>
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
                <FluidButton
                  style={{ flex: 1, fontSize: "13px", padding: "10px" }}
                  onClick={() => openModal(setManageMembersOpen, sp)}
                >
                  Manage Members
                </FluidButton>
                <FluidButton
                  style={{ flex: 1, fontSize: "13px", padding: "10px" }}
                  onClick={() => openModal(setAssignTaskOpen, sp)}
                >
                  Assign Task
                </FluidButton>
              </div>

              <FluidButton
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  background: "rgba(96, 165, 250, 0.1)",
                  borderColor: "rgba(96, 165, 250, 0.4)",
                  color: "#93c5fd",
                  fontSize: "13px",
                  padding: "10px",
                }}
                onClick={() => openModal(setViewResponsesOpen, sp)}
              >
                View Responses
              </FluidButton>

              <FluidButton
                className="btn-danger"
                style={{ width: "100%", fontSize: "13px", padding: "10px" }}
                onClick={() => handleDeleteSubteam(sp._id)}
              >
                Delete
              </FluidButton>
            </div>
          ))}

          <div
            className="add-subproject-card"
            onClick={() => setSubModalOpen(true)}
          >
            <div className="add-plus">+</div>
            <p>Add Subproject</p>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AddSubprojectModal
        isOpen={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        teamId={id}
      />

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