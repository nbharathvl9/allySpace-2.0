import { useEffect, useState } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import api from "../api/axios";
import "../styles/createProject.css";
import FluidButton from "./FluidButton"; 
import { useToast } from "../context/ToastContext"; // 🔥 Import

export default function ManageMembersModal({ isOpen, onClose, subteamId }) {
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const { showToast } = useToast();

  const loadMembers = async () => {
    try {
      const res = await api.get(`/subteam/return-subteams/${subteamId}`);
      setMembers(res.data.members);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (isOpen) loadMembers();
  }, [isOpen, subteamId]);

  const handleInvite = async () => {
    if (!newMemberName) return showToast("Enter a username first", "error");
    try {
      await api.post("/subteam/invite-member", { subteamId, userName: newMemberName });
      showToast("Invite sent!", "success");
      setNewMemberName("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to invite", "error");
    }
  };

  const handleRemove = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.post("/subteam/remove-member", { subteamId, memberId });
      showToast("Member removed successfully", "success");
      loadMembers(); 
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card-large" style={{ maxWidth: "600px" }}>
        <button className="modal-close-btn" onClick={onClose}><IoClose size={26} /></button>
        <h2 className="modal-title">Manage Members</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input className="modal-input-block" style={{ flex: 1, margin: 0, background: "rgba(0,0,0,0.2)" }} placeholder="Enter username to invite" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
          <FluidButton className="btn-primary" style={{ width: "auto", marginTop: 0 }} onClick={handleInvite}>
            Invite
          </FluidButton>
        </div>

        <div className="member-list">
          {members.map((m) => (
            <div className="member-card" key={m._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0 }}>{m.userName}</h4>
                <p style={{ fontSize: "12px", opacity: 0.7 }}>{m.email}</p>
              </div>
              <IoTrash size={20} color="#ef4444" style={{ cursor: "pointer" }} onClick={() => handleRemove(m._id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}