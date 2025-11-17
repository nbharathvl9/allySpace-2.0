import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";

export default function ViewResponsesModal({ isOpen, onClose, subteamId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // We fetch subteam info which includes members and their tasks via logic
      // But for seeing responses specifically from the HEAD, we might need to fetch tasks directly
      // Let's try fetching subteam details or just tasks filtered by subteam
      // Since you don't have a specific route for "get tasks by subteam", 
      // we will use the existing /return-subteams/:id logic or we create a new specific one.
      // For now, let's reuse return-subteams but focus on the tasks logic or just fetch 'assigned' tasks if you are the head.
      
      // Actually, better approach: Fetch tasks for this subteam directly if possible.
      // Since we don't have that route, let's use /subteam/return-subteams/:id logic client side or modify backend.
      // Assuming you modify backend or use existing:
      
      api.get(`/subteam/return-subteams/${subteamId}`)
        .then(res => {
           // The endpoint returns members with tasks. 
           // However, the Team Head assigns tasks to the Subteam Head.
           // We need to find the task assigned to the Subteam Head specifically.
           setTasks(res.data.members.map(m => ({
               userName: m.userName,
               task: m.assignedTask,
               status: m.status,
               response: m.responseMessage || "No response yet" // You might need to ensure backend sends this
           })).filter(t => t.task !== "No task assigned"));
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, subteamId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card-large">
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        <h2 className="modal-title">Task Responses</h2>
        
        <div className="member-list">
          {tasks.length === 0 ? <p style={{color:"#ccc"}}>No active tasks found.</p> : tasks.map((t, i) => (
            <div key={i} className="member-card">
              <h3 style={{color: "#60a5fa"}}>{t.task}</h3>
              <p><strong>Assigned To:</strong> {t.userName}</p>
              <div style={{marginTop: "10px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px"}}>
                <p style={{fontSize: "13px", color: "#aaa"}}>Status: {t.status}</p>
                <p style={{marginTop: "5px"}}><strong>Response:</strong> {t.response}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}