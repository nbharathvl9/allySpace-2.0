import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton";

export default function MemberTaskModal({ isOpen, onClose, subteam }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [status, setStatus] = useState("Pending");
  const [responseMsg, setResponseMsg] = useState("");

  useEffect(() => {
    if (isOpen && subteam) {
      setLoading(true);
      // Fetch all assigned tasks and find the one for this subteam
      api.get("/task/assigned")
        .then((res) => {
          const foundTask = res.data.tasks.find(
            (t) => t.subteamId?._id === subteam._id || t.subteamId === subteam._id
          );
          
          if (foundTask) {
            setTask(foundTask);
            setStatus(foundTask.status);
            setResponseMsg(foundTask.responseMessage || "");
          } else {
            setTask(null);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, subteam]);

  const handleSubmit = async () => {
    if (!task) return;
    try {
      await api.post("/task/respond", {
        taskId: task._id,
        status,
        message: responseMsg,
      });
      alert("Response sent successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20002 }}>
      <div className="modal-card-large" style={{ maxWidth: "600px" }}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">{subteam.name} <span style={{fontSize:'16px', opacity:0.7}}>Task View</span></h2>

        {loading ? (
          <p style={{ color: "#cbd5e1" }}>Loading task...</p>
        ) : !task ? (
          <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
            <p>No active task assigned to you in this subteam.</p>
          </div>
        ) : (
          <div className="task-detail-view">
            
            {/* Task Info Card */}
            <div style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "25px",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <h3 style={{ color: "#60a5fa", marginBottom: "8px", fontSize: "20px" }}>{task.title}</h3>
              <p style={{ color: "#cbd5e1", marginBottom: "15px", lineHeight: "1.6" }}>{task.description}</p>
              
              <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#94a3b8" }}>
                <span>📅 Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "None"}</span>
                <span>👤 Assigned By: @{task.assignedBy?.userName}</span>
              </div>
            </div>

            {/* Response Section */}
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

            <div className="modal-input-block">
              <label>Your Response / Update</label>
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

          </div>
        )}
      </div>
    </div>
  );
}