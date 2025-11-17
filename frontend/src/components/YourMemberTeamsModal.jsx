import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import MemberTaskModal from "./MemberTaskModel"; // 🔥 Import

export default function YourMemberTeamsModal({ isOpen, onClose }) {
  const [teams, setTeams] = useState([]);
  const [selectedSubteam, setSelectedSubteam] = useState(null);

  useEffect(() => {
    if (isOpen) {
      api.get("/subteam/member")
        .then(res => setTeams(res.data.subteams))
        .catch(err => console.log(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-card" style={{ maxWidth: "550px" }}>
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={26} />
          </button>

          <h2 className="modal-title">Teams You Are a Member Of</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
            Click on a team to view your assigned tasks.
          </p>

          {teams.length === 0 ? (
            <p style={{ color: "#fff", marginTop: "20px" }}>
              You are not a member of any subteam.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {teams.map((st) => (
                <div 
                  key={st._id} 
                  className="dashboard-card clickable" 
                  onClick={() => setSelectedSubteam(st)} // 🔥 Open Task Modal
                  style={{ cursor: "pointer" }}
                >
                  <h3>{st.name}</h3>
                  <p>{st.description}</p>
                  <p style={{ color: "#60a5fa", marginTop: "8px", fontSize: "13px" }}>
                    Team: {st.teamId?.TeamName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Render Task Modal on top */}
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