import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import MemberTaskModal from "./MemberTaskModel";
import { FiGrid, FiLayers } from "react-icons/fi"; // Icons for visual flair

export default function YourMemberTeamsModal({ isOpen, onClose }) {
  const [teams, setTeams] = useState([]);
  const [selectedSubteam, setSelectedSubteam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get("/subteam/member")
        .then(res => setTeams(res.data.subteams))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        {/* 🔥 CHANGED: Using new scrollable wider card class */}
        <div className="modal-card-scrollable">
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={26} />
          </button>

          <div style={{ marginBottom: "10px" }}>
            <h2 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FiGrid size={24} color="#60a5fa" />
              Your Teams
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Select a team below to view your assigned tasks and updates.
            </p>
          </div>

          {loading ? (
            <p style={{ color: "#fff", padding: "20px" }}>Loading teams...</p>
          ) : teams.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: "16px",
              marginTop: "20px"
            }}>
              <FiLayers size={40} color="#475569" />
              <p style={{ color: "#cbd5e1", marginTop: "15px" }}>
                You are not a member of any subteam yet.
              </p>
            </div>
          ) : (
            /* 🔥 CHANGED: Using CSS Grid layout */
            <div className="teams-grid">
              {teams.map((st) => (
                <div 
                  key={st._id} 
                  className="team-card-item" // 🔥 New card class
                  onClick={() => setSelectedSubteam(st)}
                >
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                     <h3>{st.name}</h3>
                  </div>
                  
                  <p>{st.description || "No description available."}</p>
                  
                  <div className="team-tag">
                    Project: {st.teamId?.TeamName || "Unknown"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedSubteam && (
        <MemberTaskModal
          isOpen={!!selectedSubteam}
          onClose={() => setSelectedSubteam(null)}
          subteam={selectedSubteam}
        />
      )}
    </>
  );
}