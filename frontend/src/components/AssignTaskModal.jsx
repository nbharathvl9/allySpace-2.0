import { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton"; // 🔥 Import

export default function AssignTaskModal({ isOpen, onClose, teamId, subteamId, assignedTo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleAssign = async () => {
    if (!title || !assignedTo) return alert("Title and User are required");
    try {
      await api.post("/task/create", {
        title,
        description: desc,
        deadline,
        teamId,
        subteamId,
        assignedTo,
      });
      alert("Task assigned successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20002 }}>
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>
        <h2 className="modal-title">Assign Task</h2>

        <div className="modal-input-block">
          <label>Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        </div>

        <div className="modal-input-block">
          <label>Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Task details..."
          />
        </div>

        <div className="modal-input-block">
          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* 🔥 Fluid Button */}
        <FluidButton
          className="btn-primary"
          style={{ width: "100%", marginTop: "8px", padding: "14px" }}
          onClick={handleAssign}
        >
          Assign Task
        </FluidButton>
      </div>
    </div>
  );
}