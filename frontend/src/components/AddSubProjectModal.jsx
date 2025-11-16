import { IoClose } from "react-icons/io5";
import "../styles/createProject.css";
import { useProjects } from "../context/projectContext.jsx";
import { useParams } from "react-router-dom";

export default function AddSubprojectModal({ isOpen, onClose }) {
  const { addSubproject } = useProjects();
  const { id } = useParams(); // project index

  const handleCreate = () => {
    const title = document.getElementById("sub-title").value.trim();
    const desc = document.getElementById("sub-desc").value.trim();
    const lead = document.getElementById("sub-lead").value.trim();
    const membersInput = document.getElementById("sub-members").value.trim();

    if (!title) return;

    // Convert comma-separated members → array
    const members =
      membersInput.length > 0
        ? membersInput.split(",").map((m) => m.trim())
        : [];

    // Final Subproject structure
    const newSubproject = {
      title,
      desc,
      lead: lead || "Not Assigned",
      members,
      tasks: 0,
    };

    addSubproject(Number(id), newSubproject);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* CLOSE BUTTON */}
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Create Subproject</h2>

        {/* TITLE INPUT */}
        <div className="modal-input-block">
          <label>Subproject Title</label>
          <input id="sub-title" placeholder="Enter subproject name" />
        </div>

        {/* DESCRIPTION INPUT */}
        <div className="modal-input-block">
          <label>Description</label>
          <textarea id="sub-desc" placeholder="Enter description"></textarea>
        </div>

        {/* SUBPROJECT HEAD */}
        <div className="modal-input-block">
          <label>Subproject Head</label>
          <input
            id="sub-lead"
            placeholder="Enter username of the subproject head"
          />
        </div>

        {/* MEMBERS INPUT */}
        <div className="modal-input-block">
          <label>Members (comma separated)</label>
          <input
            id="sub-members"
            placeholder="eg: bharath, gudda, john"
          />
        </div>

        {/* CREATE BTN */}
        <button className="modal-create-btn" onClick={handleCreate}>
          Create Subproject
        </button>

      </div>
    </div>
  );
}
