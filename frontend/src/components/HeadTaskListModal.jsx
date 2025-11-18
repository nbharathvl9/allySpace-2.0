import { useState } from "react";
import { IoClose, IoSend, IoCheckmarkCircle } from "react-icons/io5";
import FluidButton from "./FluidButton";
import TaskResponseModal from "./TaskResponseModel";

export default function HeadTaskListModal({ isOpen, onClose, tasks, refreshData }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20002 }}>
      <div className="modal-card-scrollable" style={{ maxWidth: "600px" }}>
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        
        <div style={{ marginBottom: "20px" }}>
          <h2 className="modal-title" style={{color: "#fde047"}}>HQ Directives</h2>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Tasks assigned to you by the Main Project Head.
          </p>
        </div>

        {tasks.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", opacity: 0.6, border: "1px dashed #555", borderRadius: "12px" }}>
             <p>No active directives from HQ.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tasks.map((task) => (
              <div key={task.taskId} style={{ 
                 background: "rgba(255, 255, 255, 0.05)", 
                 border: "1px solid rgba(255, 255, 255, 0.1)", 
                 borderRadius: "16px", 
                 padding: "20px" 
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                   <h3 style={{ margin: 0, fontSize: "16px", color: "#fff" }}>{task.assignedTask}</h3>
                   <span style={{ 
                       fontSize: "11px", 
                       padding: "4px 8px", 
                       borderRadius: "12px", 
                       background: task.status === "Completed" ? "rgba(34, 197, 94, 0.2)" : "rgba(234, 179, 8, 0.2)", 
                       color: task.status === "Completed" ? "#4ade80" : "#facc15"
                   }}>
                      {task.status}
                   </span>
                </div>
                
                <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "15px" }}>
                  {task.description || "No description provided."}
                </p>

                {task.deadline && (
                    <div style={{fontSize: "12px", color: "#94a3b8", marginBottom: "15px"}}>
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                )}

                <FluidButton 
                  style={{ 
                    width: "100%", 
                    fontSize: "13px", 
                    padding: "10px",
                    background: "rgba(59, 130, 246, 0.15)",
                    borderColor: "rgba(59, 130, 246, 0.4)",
                    color: "#60a5fa"
                  }}
                  onClick={() => setSelectedTask(task)}
                >
                   <IoSend style={{marginRight: "6px"}} /> Update Status / Respond
                </FluidButton>

                {task.responseMessage && (
                   <div style={{ marginTop: "12px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", borderLeft: "3px solid #60a5fa" }}>
                      <p style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "2px" }}>Your Last Response:</p>
                      <p style={{ fontSize: "13px", color: "#e2e8f0", fontStyle: "italic", margin: 0 }}>"{task.responseMessage}"</p>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nested Response Modal */}
      <TaskResponseModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        taskData={selectedTask}
        refreshData={refreshData}
      />
    </div>
  );
}