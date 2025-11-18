import { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function AssignTaskModal({ isOpen, onClose, teamId, subteamId, assignedTo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const { showToast } = useToast();

  const handleAssign = async () => {
    if (!title || !assignedTo) return showToast("Title and User are required", "error");
    try {
      await api.post("/task/create", {
        title,
        description: desc,
        deadline,
        teamId,
        subteamId,
        assignedTo,
      });
      showToast("Task assigned successfully!", "success");
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to assign task", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20002 }}>
      <div className="modal-card">
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        <h2 className="modal-title">Assign Task</h2>
        <div className="modal-input-block">
          <label>Task Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
        </div>
        <div className="modal-input-block">
          <label>Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Task details..." />
        </div>
        <div className="modal-input-block">
          <label>Deadline</label>
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <FluidButton className="btn-primary" style={{ width: "100%", marginTop: "8px", padding: "14px" }} onClick={handleAssign}>
          Assign Task
        </FluidButton>
      </div>
    </div>
  );
}