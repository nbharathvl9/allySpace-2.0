import { IoClose } from "react-icons/io5";
import "../styles/createProject.css";
import api from "../api/axios";

export default function AddSubprojectModal({ isOpen, onClose, teamId }) {

  const handleCreate = async () => {
    const title = document.getElementById("sub-title").value.trim();
    const desc = document.getElementById("sub-desc").value.trim();
    const lead = document.getElementById("sub-lead").value.trim();

    if (!title || !lead) {
      return alert("Title and Subproject head username are required");
    }

    try {
      // 🔥 Send invite to subproject head
      const res = await api.post("/subteam/invite-subteam-head", {
        teamId,
        name: title,
        description: desc,
        headUserName: lead
      });

      alert("Subteam request sent!");
      onClose();
      window.location.reload();

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create subproject");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Create Subproject</h2>

        <div className="modal-input-block">
          <label>Subproject Title</label>
          <input id="sub-title" placeholder="Enter subproject name" />
        </div>

        <div className="modal-input-block">
          <label>Description</label>
          <textarea id="sub-desc" placeholder="Enter description"></textarea>
        </div>

        <div className="modal-input-block">
          <label>Subproject Head Username</label>
          <input id="sub-lead" placeholder="Enter username" />
        </div>

        <button className="modal-create-btn" onClick={handleCreate}>
          Send Invite
        </button>

      </div>
    </div>
  );
}
