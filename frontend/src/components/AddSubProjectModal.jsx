import { IoClose } from "react-icons/io5";
import "../styles/createProject.css";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function AddSubprojectModal({ isOpen, onClose, teamId }) {
  const { showToast } = useToast();

  const handleCreate = async () => {
    const title = document.getElementById("sub-title").value.trim();
    const desc = document.getElementById("sub-desc").value.trim();
    const lead = document.getElementById("sub-lead").value.trim();

    if (!title || !lead) return showToast("Title and Subproject head username are required", "error");

    try {
      await api.post("/subteam/invite-subteam-head", {
        teamId,
        name: title,
        description: desc,
        headUserName: lead,
      });
      showToast("Subteam invite sent successfully!", "success");
      onClose();
      window.location.reload();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create subproject", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
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
        <FluidButton className="btn-primary" style={{ width: "100%", marginTop: "8px", padding: "14px" }} onClick={handleCreate}>
          Send Invite
        </FluidButton>
      </div>
    </div>
  );
}