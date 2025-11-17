import { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";

// 🔥 UPDATED: Accepts 'assignedTo' which can be any userId
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
        assignedTo // 🔥 Uses the passed ID
      });

      alert("Task assigned successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign task");
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

        <button className="modal-create-btn" onClick={handleAssign}>Assign Task</button>
      </div>
    </div>
  );
}