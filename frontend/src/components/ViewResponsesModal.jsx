import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";

export default function ViewResponsesModal({ isOpen, onClose, subteamId }) {
  const [memberTasks, setMemberTasks] = useState([]);
  const [headTasks, setHeadTasks] = useState([]); // 🔥 Now an Array

  useEffect(() => {
    if (isOpen) {
      api.get(`/subteam/return-subteams/${subteamId}`)
        .then(res => {
           // 1. Member Tasks
           setMemberTasks(res.data.members.map(m => ({
               userName: m.userName,
               task: m.assignedTask,
               status: m.status,
               response: m.responseMessage || "No response yet"
           })).filter(t => t.task !== "No task assigned"));

           // 2. 🔥 Head Tasks List
           if (res.data.headTasks && res.data.headTasks.length > 0) {
             setHeadTasks(res.data.headTasks.map(t => ({
               userName: t.userName,
               task: t.assignedTask,
               status: t.status,
               response: t.responseMessage || "No response yet"
             })));
           } else {
             setHeadTasks([]);
           }
        })
        .catch(err => console.error(err));
    }
  }, [isOpen, subteamId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card-large">
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        <h2 className="modal-title">Mission Reports</h2>
        
        {/* 🔥 DISPLAY LIST OF HEAD REPORTS */}
        <h3 style={{fontSize: "16px", color: "#fde047", marginBottom: "15px", borderBottom: "1px solid rgba(253, 224, 71, 0.2)", paddingBottom: "8px"}}>
           Subteam Lead Reports (To HQ)
        </h3>

        {headTasks.length > 0 ? (
          <div style={{ marginBottom: "30px", display: "grid", gap: "15px" }}>
             {headTasks.map((headTask, idx) => (
                <div key={idx} style={{
                    background: "rgba(234, 179, 8, 0.1)", 
                    border: "1px solid rgba(234, 179, 8, 0.3)", 
                    borderRadius: "16px", 
                    padding: "16px"
                }}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
                       <h3 style={{margin:0, color: "#fde047", fontSize: "15px"}}>{headTask.task}</h3>
                       <span style={{fontSize:"12px", color: "#cbd5e1"}}>@{headTask.userName}</span>
                    </div>

                    <div style={{padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "10px"}}>
                       <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px", borderBottom:"1px solid rgba(255,255,255,0.1)", paddingBottom:"6px"}}>
                         <span>Status: <span style={{color: headTask.status === "Completed" ? "#4ade80" : "#facc15"}}>{headTask.status}</span></span>
                       </div>
                       <p style={{margin:0, fontSize:"14px", lineHeight:"1.5", color: "#e2e8f0"}}>"{headTask.response}"</p>
                    </div>
                </div>
             ))}
          </div>
        ) : (
          <p style={{color: "#94a3b8", fontStyle: "italic", marginBottom: "30px"}}>No active tasks from HQ.</p>
        )}

        <h3 style={{fontSize: "16px", color: "#94a3b8", marginBottom: "15px", borderBottom: "1px solid rgba(148, 163, 184, 0.2)", paddingBottom: "8px"}}>
            Member Reports (Internal)
        </h3>

        <div className="member-list">
          {memberTasks.length === 0 ? <p style={{color:"#ccc"}}>No active member tasks found.</p> : memberTasks.map((t, i) => (
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