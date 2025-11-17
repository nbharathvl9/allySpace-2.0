import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";
import SubprojectMembersModal from "./SubProjectMemeberModal.jsx";
import { FiLayout, FiLayers } from "react-icons/fi"; // Icons

export default function YourSubprojectsModal({ isOpen, onClose }) {
  const [subteams, setSubteams] = useState([]);
  const [selectedSubteamId, setSelectedSubteamId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get("/subteam/head")
        .then(res => setSubteams(res.data.subteams))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" style={{ zIndex: 20000 }}>
        {/* 🔥 Use the Wide Scrollable Container */}
        <div className="modal-card-scrollable">
          
          <button className="modal-close-btn" onClick={onClose}>
            <IoClose size={26} />
          </button>

          <div style={{ marginBottom: "10px" }}>
            <h2 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FiLayout size={24} color="#60a5fa" />
              Your Subprojects
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Manage the subteams you are leading. Click to view details.
            </p>
          </div>

          {loading ? (
            <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>
          ) : subteams.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "50px", 
              background: "rgba(255,255,255,0.03)", 
              borderRadius: "16px",
              marginTop: "20px"
            }}>
              <FiLayers size={40} color="#475569" />
              <p style={{ color: "#cbd5e1", marginTop: "15px" }}>
                You are not leading any subteams yet.
              </p>
            </div>
          ) : (
            /* 🔥 GRID LAYOUT */
            <div className="teams-grid">
              {subteams.map((st) => (
                <div
                  key={st._id}
                  className="team-card-item"
                  onClick={() => setSelectedSubteamId(st._id)}
                >
                  <h3>{st.name}</h3>
                  <p>{st.description || "No description provided."}</p>
                  
                  <div className="team-tag">
                    Parent: {st.teamId?.TeamName || "Unknown"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nested Modal (Members/Tasks) */}
      {selectedSubteamId && (
        <SubprojectMembersModal
          subteamId={selectedSubteamId}
          onClose={() => setSelectedSubteamId(null)}
        />
      )}
    </>
  );
}