import "../styles/createProject.css"; // reusing modal styles
import { IoClose } from "react-icons/io5";
import { useProjects } from "../context/projectContext";
import { useParams } from "react-router-dom";

export default function AddSubprojectModal({ isOpen, onClose }) {
  const { addSubproject } = useProjects();
  const { id } = useParams(); // current project ID

  const handleCreate = () => {
    const title = document.getElementById("sub-title").value.trim();
    const desc = document.getElementById("sub-desc").value.trim();
    const lead = document.getElementById("sub-lead").value.trim();

    if (title === "") return;

    addSubproject(id, {
      title,
      desc,
      lead: lead || "unassigned",
      members: 0,
      tasks: 0
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

        <h2 className="modal-title">Add Subproject</h2>

        <div className="modal-input-block">
          <label>Subproject Title</label>
          <input id="sub-title" placeholder="Enter subproject name" />
        </div>

        <div className="modal-input-block">
          <label>Description</label>
          <textarea id="sub-desc" placeholder="Enter description"></textarea>
        </div>

        <div className="modal-input-block">
          <label>Lead Username</label>
          <input id="sub-lead" placeholder="@username" />
        </div>

        <button className="modal-create-btn" onClick={handleCreate}>
          Create Subproject
        </button>

      </div>
    </div>
  );
}
