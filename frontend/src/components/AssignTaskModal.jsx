import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext";

// 🔥 Date Picker Imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CustomDatepicker.css"; // Import our custom styles

export default function AssignTaskModal({ isOpen, onClose, teamId, subteamId, assignedTo, assigneeName }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  
  // 🔥 Change state to handle Date object (default to today)
  const [deadline, setDeadline] = useState(new Date()); 
  
  const { showToast } = useToast();

  // Clear form when opening
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDesc("");
      setDeadline(new Date()); // Reset to today
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!assignedTo) return showToast("This subproject has no Head to assign tasks to.", "error");
    if (!title) return showToast("Task Title is required", "error");
    
    try {
      await api.post("/task/create", {
        title,
        description: desc,
        deadline, // Axios will automatically convert Date object (including time) to ISO string
        teamId,
        subteamId,
        assignedTo, 
      });
      showToast("Task assigned to Subteam Head!", "success");
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

        <div style={{ marginBottom: "15px", padding: "10px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
          {assigneeName ? (
            <p style={{ fontSize: "13px", color: "#93c5fd", margin: 0 }}>
              Assigning to Lead: <strong>@{assigneeName}</strong>
            </p>
          ) : (
            <p style={{ fontSize: "13px", color: "#fca5a5", margin: 0 }}>
              ⚠️ No Subproject Lead assigned yet.
            </p>
          )}
        </div>

        <div className="modal-input-block">
          <label>Task Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter task title" 
            disabled={!assignedTo} 
          />
        </div>

        <div className="modal-input-block">
          <label>Description</label>
          <textarea 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
            placeholder="Task details..." 
            disabled={!assignedTo}
          />
        </div>

        {/* 🔥 UPDATED: Added Time Selection */}
        <div className="modal-input-block">
          <label>Deadline</label>
          <DatePicker 
            selected={deadline} 
            onChange={(date) => setDeadline(date)} 
            dateFormat="MMM d, yyyy h:mm aa" // Include time format
            className="custom-datepicker-input"
            disabled={!assignedTo}
            minDate={new Date()} // Prevent past dates
            placeholderText="Select a deadline"
            showPopperArrow={false}
            showTimeSelect // Enable time selection
            timeFormat="HH:mm"
            timeIntervals={15}
          />
        </div>

        <FluidButton 
          className="btn-primary" 
          style={{ width: "100%", marginTop: "8px", padding: "14px", opacity: !assignedTo ? 0.5 : 1 }} 
          onClick={handleAssign}
          disabled={!assignedTo}
        >
          Assign Task
        </FluidButton>
      </div>
    </div>
  );
}