import "../styles/createProject.css";
import "../styles/roundTable.css"; 
import { IoClose, IoRefresh, IoAddCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import FluidButton from "./FluidButton";

export default function SubprojectMembersModal({ subteamId, onClose }) {
  const [members, setMembers] = useState([]);
  const [subteamName, setSubteamName] = useState("");
  const [teamId, setTeamId] = useState(null);
  
  const [newMemberName, setNewMemberName] = useState("");
  const [hoveredMember, setHoveredMember] = useState(null);
  
  // 🔥 Selection & Form State
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = () => {
    api.get(`/subteam/return-subteams/${subteamId}`)
      .then((res) => {
        setMembers(res.data.members);
        setSubteamName(res.data.subteamName);
        setTeamId(res.data.teamId);
        
        // If a member was selected, refresh their data
        if (selectedMember) {
          const updated = res.data.members.find(m => m._id === selectedMember._id);
          if (updated) setSelectedMember(updated);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (subteamId) {
      fetchMembers();
    }
  }, [subteamId]);

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return alert("Please enter a username");
    try {
      await api.post("/subteam/invite-member", {
        subteamId,
        userName: newMemberName,
      });
      alert("Invite sent successfully!");
      setNewMemberName("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to invite member");
    }
  };

  const handleAssignTask = async () => {
    if (!selectedMember) return alert("Select a member first.");
    if (!taskTitle) return alert("Task title is required.");

    setIsSubmitting(true);
    try {
      await api.post("/task/create", {
        title: taskTitle,
        description: taskDesc,
        deadline: taskDeadline,
        teamId,
        subteamId,
        assignedTo: selectedMember._id,
      });
      alert("Task assigned successfully!");
      setTaskTitle("");
      setTaskDesc("");
      setTaskDeadline("");
      fetchMembers(); // Refresh UI
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeatClick = (member) => {
    setSelectedMember(member);
    // Optional: Pre-fill form if you want to edit (requires update API)
    // For now, we assume new task creation, so we clear or keep empty
    setTaskTitle(""); 
    setTaskDesc("");
    setTaskDeadline("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 20001 }}>
      {/* 🔥 Wide Split-Screen Container */}
      <div className="modal-card-scrollable" style={{ maxWidth: "1200px", background: "rgba(5, 10, 20, 0.98)", padding: "0" }}>
        
        <button className="modal-close-btn" onClick={onClose} style={{zIndex: 50, top: "20px", right: "20px"}}>
          <IoClose size={26} />
        </button>

        <div style={{ display: "flex", height: "100%", minHeight: "600px" }}>
          
          {/* ================= LEFT SIDE: ROUND TABLE ================= */}
          <div style={{ flex: 2, position: "relative", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            
            {/* Header Overlay */}
            <div style={{ position: "absolute", top: "25px", left: "30px", zIndex: 10 }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: "24px" }}>{subteamName}</h2>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
                Command Center • {members.length} Agents
              </p>
            </div>

            {/* Invite Quick Action */}
            <div style={{ position: "absolute", bottom: "25px", left: "30px", zIndex: 10, display: "flex", gap: "8px" }}>
              <input
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.4)",
                  color: "white",
                  outline: "none",
                  fontSize: "12px",
                  width: "140px"
                }}
                placeholder="Add username..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <FluidButton className="btn-primary" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={handleAddMember}>
                + Invite
              </FluidButton>
            </div>

            <div className="round-table-container" style={{ height: "100%" }}>
              <div className="the-table" style={{ width: "340px", height: "340px" }}>
                
                {/* CENTRAL HOLOGRAM */}
                <div className="central-hologram">
                  {hoveredMember ? (
                    <div className="fade-in" key={hoveredMember._id}>
                      <div 
                        className="holo-avatar-large" 
                        style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${hoveredMember.userName})` }}
                      />
                      <h3 className="holo-name">@{hoveredMember.userName}</h3>
                      <span className="holo-label">CURRENT STATUS</span>
                      <p className="holo-task" style={{fontSize: "13px"}}>"{hoveredMember.assignedTask}"</p>
                      
                      <div className="holo-meta">
                        <span className={`holo-status-dot dot-${hoveredMember.status.replace(' ', '.')}`}></span>
                        <span>{hoveredMember.status}</span>
                        <span style={{opacity:0.3}}>|</span>
                        <span>📅 {formatDate(hoveredMember.deadline)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="fade-in">
                      <div style={{fontSize:"32px", marginBottom:"10px", opacity: 0.8}}>🛡️</div>
                      <h3 style={{color:"#fff", margin:0, fontSize:"16px"}}>Subteam Overview</h3>
                      <p style={{color:"#64748b", fontSize:"12px"}}>Click a member to assign tasks.</p>
                    </div>
                  )}
                </div>

                {/* SEATS */}
                {members.map((m, index) => {
                  const total = members.length;
                  const radius = 200;
                  const angle = (360 / total) * index - 90; 
                  const radian = (angle * Math.PI) / 180;
                  const x = radius * Math.cos(radian);
                  const y = radius * Math.sin(radian);
                  const isSelected = selectedMember && selectedMember._id === m._id;

                  return (
                    <div
                      key={m._id}
                      className="table-seat"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        zIndex: isSelected ? 30 : 10
                      }}
                      onMouseEnter={() => setHoveredMember(m)}
                      onMouseLeave={() => setHoveredMember(null)}
                      onClick={() => handleSeatClick(m)}
                    >
                      <div 
                        className="seat-avatar" 
                        style={{ 
                          backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userName})`,
                          borderColor: isSelected ? "#60a5fa" : undefined,
                          boxShadow: isSelected ? "0 0 25px rgba(96, 165, 250, 0.5)" : undefined,
                          transform: isSelected ? "scale(1.2)" : undefined
                        }}
                      />
                      <div className="seat-tooltip">@{m.userName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: ASSIGNMENT FORM ================= */}
          <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", padding: "30px", display: "flex", flexDirection: "column" }}>
            
            <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: "600", margin: 0 }}>Task Assignment</h3>
              <button 
                onClick={fetchMembers} 
                title="Refresh Data"
                style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <IoRefresh size={20} />
              </button>
            </div>

            {selectedMember ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                
                {/* Selected User Info */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(255,255,255,0.05)",
                  padding: "12px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <div 
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember.userName})`,
                      backgroundSize: "cover",
                      backgroundColor: "#1e293b"
                    }} 
                  />
                  <div>
                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>@{selectedMember.userName}</div>
                    <div style={{ color: "#94a3b8", fontSize: "11px" }}>{selectedMember.email}</div>
                  </div>
                  {selectedMember.responseMessage && (
                     <div style={{ marginLeft: "auto", fontSize: "18px", cursor: "help" }} title={`Last Msg: ${selectedMember.responseMessage}`}>📩</div>
                  )}
                </div>

                {/* Task Form */}
                <div className="modal-input-block">
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Objective Title</label>
                  <input 
                    value={taskTitle} 
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="E.g. Fix Navbar Layout"
                    style={{ 
                      width: "100%", padding: "14px", borderRadius: "12px", 
                      background: "rgba(255,255,255,0.05)", color: "white", 
                      border: "1px solid rgba(255,255,255,0.1)", outline: "none"
                    }}
                  />
                </div>

                <div className="modal-input-block">
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Deadline</label>
                  <input 
                    type="date"
                    value={taskDeadline} 
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    style={{ 
                      width: "100%", padding: "14px", borderRadius: "12px", 
                      background: "rgba(255,255,255,0.05)", color: "white", 
                      border: "1px solid rgba(255,255,255,0.1)", outline: "none"
                    }}
                  />
                </div>

                <div className="modal-input-block" style={{ flexGrow: 1 }}>
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Mission Brief</label>
                  <textarea
                    placeholder="Describe the task details..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    style={{ 
                      width: "100%", height: "100%", minHeight: "100px", padding: "16px", borderRadius: "12px", 
                      background: "rgba(255,255,255,0.05)", color: "white", 
                      border: "1px solid rgba(255,255,255,0.1)", outline: "none",
                      resize: "none", fontFamily: "Inter, sans-serif", fontSize: "14px"
                    }}
                  ></textarea>
                </div>

                <FluidButton
                  className="btn-primary"
                  style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}
                  onClick={handleAssignTask}
                >
                  {isSubmitting ? "Assigning..." : <><IoAddCircle size={18} /> Assign Mission</>}
                </FluidButton>

              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>👈</div>
                <p>No Agent Selected</p>
                <span style={{ fontSize: "12px", textAlign: "center" }}>Select a member from the round table to assign a task.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}