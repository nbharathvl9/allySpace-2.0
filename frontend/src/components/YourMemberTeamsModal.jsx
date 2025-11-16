import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function YourMemberTeamsModal({ isOpen, onClose }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get("/subteam/member")
        .then(res => setTeams(res.data.subteams))
        .catch(err => console.log(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: "550px" }}>
        <button className="modal-close-btn" onClick={onClose}>
          <IoClose size={26} />
        </button>

        <h2 className="modal-title">Teams You Are a Member Of</h2>

        {teams.length === 0 ? (
          <p style={{ color: "#fff", marginTop: "20px" }}>
            You are not a member of any subteam.
          </p>
        ) : (
          teams.map((st) => (
            <div key={st._id} className="dashboard-card">
              <h3>{st.name}</h3>
              <p>{st.description}</p>
              <p style={{ color: "#60a5fa" }}>
                Team: {st.teamId?.TeamName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
