import { useProjects } from "../context/projectContext.jsx";
import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";

export default function CreateProjectModal({ isOpen, onClose }) {
  const { addProject } = useProjects();

  // 👉 Replace this later with actual logged–in username
  const currentUser = "bharath";

  const handleCreate = () => {
    const title = document.getElementById("project-title").value.trim();
    const desc = document.getElementById("project-desc").value.trim();

    if (title === "") return;

    // 🔥 Project now includes subteamHead property for filtering
    addProject({
      title,
      description: desc,
      subteamHead: currentUser,
    });

    onClose();
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
