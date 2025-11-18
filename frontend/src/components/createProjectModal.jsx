import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function CreateProjectModal({ isOpen, onClose }) {
  const { showToast } = useToast();

  const handleCreate = async () => {
    const title = document.getElementById("project-title").value.trim();
    const desc = document.getElementById("project-desc").value.trim();

    if (!title) return showToast("Project title is required", "error");

    try {
      await api.post("/team/create", { TeamName: title, description: desc });
      showToast("Project created successfully!", "success");
      onClose();
      window.location.reload(); // Or better, trigger a parent refresh via prop
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create project", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        <h2 className="modal-title">Create New Project</h2>
        <div className="modal-input-block">
          <label>Project Title</label>
          <input id="project-title" placeholder="Enter project name" />
        </div>
        <div className="modal-input-block">
          <label>Project Description</label>
          <textarea id="project-desc" placeholder="Enter description"></textarea>
        </div>
        <FluidButton className="btn-primary" style={{ width: "100%", marginTop: "8px", padding: "14px" }} onClick={handleCreate}>
          Create Project
        </FluidButton>
      </div>
    </div>
  );
}