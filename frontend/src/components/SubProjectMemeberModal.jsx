import "../styles/createProject.css";
import "../styles/roundTable.css"; 
import { IoClose, IoRefresh, IoAddCircle, IoList, IoDocumentText } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext";
import HeadTaskListModal from "./HeadTaskListModal"; // 🔥 Import New Modal
import ViewResponsesModal from "./ViewResponsesModal"; // 🔥 Import Response Viewer

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CustomDatepicker.css"; 

export default function SubprojectMembersModal({ subteamId, onClose }) {
  const [members, setMembers] = useState([]);
  const [subteamName, setSubteamName] = useState("");
  const [teamId, setTeamId] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [hoveredMember, setHoveredMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔥 New State for Head Tasks List
  const [headTasks, setHeadTasks] = useState([]); 
  const [isHeadTaskListOpen, setIsHeadTaskListOpen] = useState(false);
  const [isMyResponsesOpen, setIsMyResponsesOpen] = useState(false); // To view own responses

  const { showToast } = useToast();

  const fetchMembers = () => {
    api.get(`/subteam/return-subteams/${subteamId}`)
      .then((res) => {
        setMembers(res.data.members);
        setSubteamName(res.data.subteamName);
        setTeamId(res.data.teamId);
        
        // 🔥 Store All Head Tasks
        if (res.data.headTasks) {
            setHeadTasks(res.data.headTasks);
        }

        if (selectedMember) {
          const updated = res.data.members.find(m => m._id === selectedMember._id);
          if (updated) setSelectedMember(updated);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (subteamId) fetchMembers();
  }, [subteamId]);

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return showToast("Please enter a username", "error");
    try {
      await api.post("/subteam/invite-member", { subteamId, userName: newMemberName });
      showToast("Invite sent successfully!", "success");
      setNewMemberName("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to invite member", "error");
    }
  };

  const handleAssignTask = async () => {
    if (!selectedMember) return showToast("Select a member first.", "error");
    if (!taskTitle) return showToast("Task title is required.", "error");

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
      showToast("Task assigned successfully!", "success");
      setTaskTitle("");
      setTaskDesc("");
      setTaskDeadline(new Date()); 
      fetchMembers(); 
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to assign task", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeatClick = (member) => {
    setSelectedMember(member);
    setTaskTitle(""); 
    setTaskDesc("");
    setTaskDeadline(new Date());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 20001 }}>
      <div className="modal-card-scrollable" style={{ maxWidth: "1200px", background: "rgba(5, 10, 20, 0.98)", padding: "0" }}>
        <button className="modal-close-btn" onClick={onClose} style={{zIndex: 50, top: "20px", right: "20px"}}>
          <IoClose size={26} />
        </button>
        <div style={{ display: "flex", height: "100%", minHeight: "600px" }}>
          
          {/* LEFT: ROUND TABLE */}
          <div style={{ flex: 2, position: "relative", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", top: "25px", left: "30px", zIndex: 10 }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: "24px" }}>{subteamName}</h2>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>Command Center • {members.length} Agents</p>
            </div>

            {/* 🔥 NEW BUTTONS: VIEW TASKS & VIEW RESPONSES */}
            <div style={{ position: "absolute", top: "25px", right: "20px", zIndex: 40, display: "flex", gap: "10px" }}>
               <FluidButton 
                  onClick={() => setIsHeadTaskListOpen(true)}
                  style={{ 
                     background: "rgba(234, 179, 8, 0.15)", 
                     border: "1px solid rgba(234, 179, 8, 0.4)", 
                     color: "#fde047",
                     fontSize: "12px",
                     padding: "8px 16px"
                  }}
               >
                 <IoList style={{marginRight: "6px"}} /> HQ Directives
               </FluidButton>
               
               <FluidButton 
                  onClick={() => setIsMyResponsesOpen(true)}
                  style={{ 
                     background: "rgba(59, 130, 246, 0.15)", 
                     border: "1px solid rgba(59, 130, 246, 0.4)", 
                     color: "#93c5fd",
                     fontSize: "12px",
                     padding: "8px 16px"
                  }}
               >
                 <IoDocumentText style={{marginRight: "6px"}} /> My Reports
               </FluidButton>
            </div>

            <div style={{ position: "absolute", bottom: "25px", left: "30px", zIndex: 10, display: "flex", gap: "8px" }}>
              <input style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.4)", color: "white", outline: "none", fontSize: "12px", width: "140px" }} placeholder="Add username..." value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
              <FluidButton className="btn-primary" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={handleAddMember}>+ Invite</FluidButton>
            </div>
            <div className="round-table-container" style={{ height: "100%" }}>
              <div className="the-table" style={{ width: "340px", height: "340px" }}>
                <div className="central-hologram">
                  {hoveredMember ? (
                    <div className="fade-in" key={hoveredMember._id}>
                      <div className="holo-avatar-large" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${hoveredMember.userName})` }} />
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
                {members.map((m, index) => {
                  const total = members.length;
                  const radius = 200; const angle = (360 / total) * index - 90; 
                  const radian = (angle * Math.PI) / 180;
                  const x = radius * Math.cos(radian); const y = radius * Math.sin(radian);
                  const isSelected = selectedMember && selectedMember._id === m._id;
                  return (
                    <div key={m._id} className="table-seat" style={{ transform: `translate(${x}px, ${y}px)`, zIndex: isSelected ? 30 : 10 }} onMouseEnter={() => setHoveredMember(m)} onMouseLeave={() => setHoveredMember(null)} onClick={() => handleSeatClick(m)}>
                      <div className="seat-avatar" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userName})`, borderColor: isSelected ? "#60a5fa" : undefined, boxShadow: isSelected ? "0 0 25px rgba(96, 165, 250, 0.5)" : undefined, transform: isSelected ? "scale(1.2)" : undefined }} />
                      <div className="seat-tooltip">@{m.userName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: ASSIGNMENT FORM */}
          <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", padding: "30px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: "600", margin: 0 }}>Task Assignment</h3>
              <button onClick={fetchMembers} title="Refresh Data" style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}><IoRefresh size={20} /></button>
            </div>
            {selectedMember ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "12px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedMember.userName})`, backgroundSize: "cover", backgroundColor: "#1e293b" }} />
                  <div>
                    <div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>@{selectedMember.userName}</div>
                    <div style={{ color: "#94a3b8", fontSize: "11px" }}>{selectedMember.email}</div>
                  </div>
                </div>
                <div className="modal-input-block">
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Objective Title</label>
                  <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="E.g. Fix Navbar Layout" style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }} />
                </div>

                <div className="modal-input-block">
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Deadline</label>
                  <DatePicker 
                    selected={taskDeadline} 
                    onChange={(date) => setTaskDeadline(date)} 
                    dateFormat="MMM d, yyyy"
                    className="custom-datepicker-input"
                    minDate={new Date()}
                    showPopperArrow={false}
                  />
                </div>

                <div className="modal-input-block" style={{ flexGrow: 1 }}>
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Mission Brief</label>
                  <textarea placeholder="Describe the task details..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ width: "100%", height: "100%", minHeight: "100px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none", resize: "none", fontFamily: "Inter, sans-serif", fontSize: "14px" }}></textarea>
                </div>
                <FluidButton className="btn-primary" style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }} onClick={handleAssignTask}>
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
      
      {/* 🔥 HEAD TASK LIST MODAL (View & Respond to HQ) */}
      <HeadTaskListModal 
        isOpen={isHeadTaskListOpen}
        onClose={() => setIsHeadTaskListOpen(false)}
        tasks={headTasks}
        refreshData={fetchMembers}
      />

      {/* 🔥 VIEW ALL RESPONSES (For Subteam Head to see sent history) */}
      <ViewResponsesModal 
         isOpen={isMyResponsesOpen}
         onClose={() => setIsMyResponsesOpen(false)}
         subteamId={subteamId}
      />
    </div>
  );
}