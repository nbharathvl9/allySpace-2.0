import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import AssignTaskModal from "./AssignTaskModal";

export default function SubprojectMembersModal({ subteamId, onClose }) {
  const [members, setMembers] = useState([]);
  const [subteamName, setSubteamName] = useState("");
  const [teamId, setTeamId] = useState(null); // 🔥 NEW: Store teamId
  const [assignModalOpen, setAssignModalOpen] = useState(null); // stores member ID
  const [newMemberName, setNewMemberName] = useState("");

  const fetchMembers = () => {
    api.get(`/subteam/return-subteams/${subteamId}`)
      .then(res => {
        setMembers(res.data.members);
        setSubteamName(res.data.subteamName);
        setTeamId(res.data.teamId); // 🔥 NEW: Get teamId from backend
      })
      .catch(err => console.log(err));
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
        userName: newMemberName
      });
      
      alert("Invite sent successfully!");
      setNewMemberName("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite member");
    }
  };

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 20001 }}>
        <div className="modal-card-large">
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={26} />
          </button>

          <h2 className="modal-title">{subteamName}</h2>

          {/* Add Member Input */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
            <input
              style={{ 
                flex: 1, 
                padding: "12px", 
                borderRadius: "12px", 
                border: "1px solid rgba(255,255,255,0.2)", 
                background: "rgba(255,255,255,0.1)", 
                color: "white",
                outline: "none"
              }}
              placeholder="Enter username to invite"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
            />
            <button
              className="modal-create-btn"
              style={{ width: "auto", marginTop: 0, padding: "0 24px" }}
              onClick={handleAddMember}
            >
              Add Member
            </button>
          </div>

          {members.length === 0 ? (
            <p style={{ color: "#fff", marginTop: "20px" }}>
              No members found.
            </p>
          ) : (
            <div className="member-list">
              {members.map((m) => (
                <div className="member-card" key={m._id}>
                  <h3>{m.userName}</h3>
                  <p>Email: {m.email}</p>

                  <p className="task-title">Task: {m.assignedTask}</p>
                  {m.description && <p style={{ opacity: 0.8 }}>{m.description}</p>}

                  {/* 🔥 NEW: Display Response Message */}
                  {m.responseMessage && (
                    <div style={{ marginTop: "8px", padding: "8px", background: "rgba(96, 165, 250, 0.1)", borderRadius: "8px", borderLeft: "3px solid #60a5fa" }}>
                      <p style={{ fontSize: "13px", color: "#93c5fd" }}>Response:</p>
                      <p style={{ fontSize: "14px" }}>{m.responseMessage}</p>
                    </div>
                  )}

                  <span
                    className={`status-badge ${
                      m.status === "Completed"
                        ? "status-completed"
                        : m.status === "In Progress"
                        ? "status-progress"
                        : "status-pending"
                    }`}
                  >
                    {m.status}
                  </span>

                  {m.deadline && (
                    <p className="deadline">
                      Deadline: {new Date(m.deadline).toLocaleDateString()}
                    </p>
                  )}

                  {/* Assign Task Button */}
                  <button
                    className="modal-create-btn" 
                    style={{ marginTop: "15px", padding: "8px" }}
                    onClick={() => setAssignModalOpen(m._id)}
                  >
                    Assign Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {assignModalOpen && (
        <AssignTaskModal
          assignedTo={assignModalOpen} // Member ID
          teamId={teamId}              // Fetched from backend
          subteamId={subteamId}
          isOpen={true}
          onClose={() => {
            setAssignModalOpen(null);
            fetchMembers(); // Refresh to show new task status
          }}
        />
      )}
    </>
  );
}