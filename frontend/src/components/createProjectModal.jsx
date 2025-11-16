import { useProjects } from "../context/projectContext.jsx";
import { useSidebar } from "../context/sideBarContext.jsx";
import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";

export default function CreateProjectModal({ isOpen, onClose }) {
  const { addProject } = useProjects();

  const handleCreate = () => {
    const title = document.getElementById("project-title").value.trim();
    const desc = document.getElementById("project-desc").value.trim();

    if (title === "") return;

    addProject({ title, desc });

    onClose(); // close modal
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
