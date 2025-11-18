import "../styles/createProject.css";
import "../styles/roundTable.css"; 
import { IoClose, IoSend, IoRefresh } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import FluidButton from "./FluidButton";
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function MemberTaskModel({ isOpen, onClose, subteam }) {
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const [myTaskData, setMyTaskData] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [responseMsg, setResponseMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const userRes = await api.get("/user/profile");
      const user = userRes.data.user;
      setCurrentUser(user);
      const subRes = await api.get(`/subteam/return-subteams/${subteam._id}`);
      const memberList = subRes.data.members;
      setMembers(memberList);
      const me = memberList.find(m => String(m._id) === String(user._id));
      if (me) {
        setMyTaskData(me);
        setStatus(me.status || "Pending");
        setResponseMsg(me.responseMessage || "");
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (isOpen && subteam) loadData();
  }, [isOpen, subteam]);

  const handleSubmit = async () => {
    if (!myTaskData?.taskId) return showToast("No active task assigned to you.", "error");
    
    setIsSubmitting(true);
    try {
      await api.post("/task/respond", { taskId: myTaskData.taskId, status, message: responseMsg });
      showToast("Mission report updated!", "success");
      await loadData(); 
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send response", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No Deadline";
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 20001 }}>
      <div className="modal-card-scrollable" style={{ maxWidth: "1200px", background: "rgba(5, 10, 20, 0.98)", padding: "0" }}>
        <button className="modal-close-btn" onClick={onClose} style={{zIndex: 50, top: "20px", right: "20px"}}><IoClose size={26} /></button>
        <div style={{ display: "flex", height: "100%", minHeight: "600px" }}>
          <div style={{ flex: 2, position: "relative", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ position: "absolute", top: "25px", left: "30px", zIndex: 10 }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: "24px" }}>{subteam.name}</h2>
              <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>Tactical View • {members.length} Agents Active</p>
            </div>
            <div className="round-table-container" style={{ height: "100%" }}>
              <div className="the-table" style={{ width: "340px", height: "340px" }}>
                <div className="central-hologram">
                  {hoveredMember ? (
                    <div className="fade-in" key={hoveredMember._id}>
                      <div className="holo-avatar-large" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${hoveredMember.userName})` }} />
                      <h3 className="holo-name">@{hoveredMember.userName}</h3>
                      <span className="holo-label">CURRENT OBJECTIVE</span>
                      <p className="holo-task" style={{fontSize: "13px"}}>"{hoveredMember.assignedTask}"</p>
                      <div className="holo-meta">
                        <span className={`holo-status-dot dot-${hoveredMember.status.replace(' ', '.')}`}></span>
                        <span>{hoveredMember.status}</span>
                      </div>
                      {hoveredMember.responseMessage && <div style={{marginTop: "8px", fontSize: "11px", color: "#60a5fa", fontStyle: "italic", padding: "0 10px"}}>"{hoveredMember.responseMessage}"</div>}
                    </div>
                  ) : (
                    <div className="fade-in">
                      <div style={{fontSize:"32px", marginBottom:"10px", opacity: 0.8}}>🛡️</div>
                      <h3 style={{color:"#fff", margin:0, fontSize:"16px"}}>Squad Status</h3>
                      <p style={{color:"#64748b", fontSize:"12px"}}>Hover for intel</p>
                    </div>
                  )}
                </div>
                {members.map((m, index) => {
                  const total = members.length;
                  const radius = 200; 
                  const angle = (360 / total) * index - 90; 
                  const radian = (angle * Math.PI) / 180;
                  const x = radius * Math.cos(radian);
                  const y = radius * Math.sin(radian);
                  const isMe = currentUser && String(m._id) === String(currentUser._id);
                  return (
                    <div key={m._id} className="table-seat" style={{ transform: `translate(${x}px, ${y}px)`, zIndex: isMe ? 30 : 10, cursor: "default" }} onMouseEnter={() => setHoveredMember(m)} onMouseLeave={() => setHoveredMember(null)}>
                      <div className="seat-avatar" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${m.userName})`, borderColor: isMe ? "#4ade80" : undefined, boxShadow: isMe ? "0 0 25px rgba(74, 222, 128, 0.3)" : undefined }} />
                      <div className="seat-tooltip" style={{ color: isMe ? "#4ade80" : "white" }}>{isMe ? "YOU" : `@${m.userName}`}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", padding: "30px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ color: "#f8fafc", fontSize: "18px", fontWeight: "600", margin: 0 }}>Mission Control</h3>
              <button onClick={loadData} title="Refresh Data" style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}><IoRefresh size={20} /></button>
            </div>
            {myTaskData && myTaskData.taskId ? (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "16px", padding: "20px", marginBottom: "25px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#60a5fa", fontWeight: "700" }}>Assigned Objective</span>
                  <h4 style={{ color: "#fff", fontSize: "16px", margin: "8px 0 5px 0" }}>{myTaskData.assignedTask}</h4>
                  <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5", margin: 0 }}>{myTaskData.description || "Execute orders as directed."}</p>
                  <div style={{ marginTop: "12px", fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}><span>🕒 Deadline:</span><span style={{ color: "#e2e8f0" }}>{formatDate(myTaskData.deadline)}</span></div>
                </div>
                <div className="modal-input-block">
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>Mission Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none", cursor: "pointer" }}>
                    <option value="Pending">🔴 Pending</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Completed">🟢 Completed</option>
                  </select>
                </div>
                <div className="modal-input-block" style={{ flexGrow: 1 }}>
                  <label style={{ color: "#94a3b8", fontSize: "13px" }}>SitRep (Situation Report)</label>
                  <textarea placeholder="Enter your progress details..." value={responseMsg} onChange={(e) => setResponseMsg(e.target.value)} style={{ width: "100%", height: "100%", minHeight: "120px", padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", outline: "none", resize: "none", fontFamily: "Inter, sans-serif", fontSize: "14px" }}></textarea>
                </div>
                <FluidButton className="btn-primary" style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }} onClick={handleSubmit}>
                  {isSubmitting ? "Transmitting..." : <><IoSend /> Submit Report</>}
                </FluidButton>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>💤</div>
                <p>No Active Missions</p>
                <span style={{ fontSize: "12px", textAlign: "center" }}>Stand by for orders from your Subteam Head.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}