import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";   // IMPORTANT

export default function CreateProjectModal({ isOpen, onClose }) {

  const handleCreate = async () => {
    const title = document.getElementById("project-title").value.trim();
    const desc = document.getElementById("project-desc").value.trim();

    if (!title) return alert("Project title is required");

    try {
      // 🔥 CALL BACKEND
      const res = await api.post("/team/create", {
        TeamName: title,
        description: desc,
      });

      alert("Project created!");

      onClose();

      // Refresh so sidebar loads new project
      window.location.reload();

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Create New Project</h2>

        <div className="modal-input-block">
          <label>Project Title</label>
          <input id="project-title" placeholder="Enter project name" />
        </div>

        <div className="modal-input-block">
          <label>Project Description</label>
          <textarea id="project-desc" placeholder="Enter description"></textarea>
        </div>

        <button className="modal-create-btn" onClick={handleCreate}>
          Create Project
        </button>

      </div>
    </div>
  );
}
