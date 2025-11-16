import "../styles/createProject.css";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function YourSubprojectsModal({ isOpen, onClose }) {
  const [subteams, setSubteams] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get("/subteam/head")
        .then(res => setSubteams(res.data.subteams))
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

        <h2 className="modal-title">Your Subprojects</h2>

        {subteams.length === 0 ? (
          <p style={{ color: "#fff", marginTop: "20px" }}>
            You are not a subteam head.
          </p>
        ) : (
          subteams.map((st) => (
            <div key={st._id} className="dashboard-card">
              <h3>{st.name}</h3>
              <p>{st.description}</p>
              <p style={{ color: "#60a5fa", marginTop: "10px" }}>
                Team: {st.teamId?.TeamName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
