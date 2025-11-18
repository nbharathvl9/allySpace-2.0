import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton";

export default function TaskResponseModal({ isOpen, onClose, taskData, refreshData }) {
  const [status, setStatus] = useState(taskData?.status || "Pending");
  const [responseMsg, setResponseMsg] = useState(taskData?.responseMessage || "");

  // Sync state when taskData changes
  useEffect(() => {
    if (taskData) {
      setStatus(taskData.status);
      setResponseMsg(taskData.responseMessage || "");
    }
  }, [taskData]);

  const handleSubmit = async () => {
    if (!taskData?.taskId) return alert("No task ID found");
    
    try {
      await api.post("/task/respond", {
        taskId: taskData.taskId,
        status,
        message: responseMsg,
      });

      alert("Response sent successfully!");
      
      if (refreshData) {
        refreshData(); // Reload parent data
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20005 }}>
      <div className="modal-card" style={{ width: "500px", background: "rgba(15, 23, 42, 0.98)" }}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">My Mission Report</h2>

        {/* Task Details Card */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <h3 style={{ color: "#60a5fa", marginBottom: "6px", fontSize: "16px" }}>
            {taskData?.assignedTask || "No Task Assigned"}
          </h3>
          <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>
            {taskData?.description || "No description provided."}
          </p>
        </div>

        {taskData?.taskId ? (
          <>
            {/* Status Input */}
            <div className="modal-input-block">
              <label>Update Status</label>
              <select 
                className="modal-select" 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px", background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.2)", outline:"none" }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Message Input */}
            <div className="modal-input-block">
              <label>Response Message</label>
              <textarea
                placeholder="Type your progress update here..."
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
                rows="4"
              ></textarea>
            </div>

            <FluidButton
              className="btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={handleSubmit}
            >
              Send Update
            </FluidButton>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
            You have not been assigned a task yet.
          </p>
        )}
      </div>
    </div>
  );
}